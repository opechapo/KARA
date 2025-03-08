const User = require('./models/User');
const generateToken = require('../utils/generateToken');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const authController = {
  register: async (req, res) => {
    const { email, password, name, role, phoneNumber } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ error: 'User already exists' });

      // Validate Nigerian phone number format (e.g., +2348012345678)
      if (!phoneNumber.match(/^\+234[0-9]{10}$/)) {
        return res.status(400).json({ error: 'Invalid Nigerian phone number format. Use +234 followed by 10 digits.' });
      }

      user = await User.create({ email, password, name, role, phoneNumber });
      const token = generateToken(user._id);

      // Send verification code
      await authController.sendVerificationCode(user);

      res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      if (!user.isPhoneVerified) {
        await authController.sendVerificationCode(user);
        return res.status(403).json({ error: 'Phone number not verified. Verification code sent.' });
      }
      const token = generateToken(user._id);
      res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  sendVerificationCode: async (userOrReq) => {
    try {
      let user, res;
      if (userOrReq instanceof User) {
        user = userOrReq; // Called from register/login
      } else {
        user = await User.findById(userOrReq.user.id); // Called from endpoint
        res = userOrReq;
      }

      if (!user.phoneNumber) {
        throw new Error('Phone number not provided');
      }

      // Generate 6-digit code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.verificationCode = verificationCode;
      user.verificationCodeExpires = expires;
      await user.save();

      // Send SMS via Twilio
      await client.messages.create({
        body: `Your marketplace verification code is: ${verificationCode}. Expires in 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: user.phoneNumber, // Must be in +234XXXXXXXXXX format
      });

      if (res) res.status(200).json({ message: 'Verification code sent' });
    } catch (error) {
      if (userOrReq instanceof User) throw error;
      userOrReq.status(500).json({ error: `Failed to send verification code: ${error.message}` });
    }
  },

  verifyPhoneNumber: async (req, res) => {
    const { code } = req.body;
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      if (!user.verificationCode || user.verificationCodeExpires < Date.now()) {
        return res.status(400).json({ error: 'Verification code expired or invalid' });
      }

      if (user.verificationCode !== code) {
        return res.status(400).json({ error: 'Invalid verification code' });
      }

      user.isPhoneVerified = true;
      user.verificationCode = undefined;
      user.verificationCodeExpires = undefined;
      await user.save();

      res.json({ message: 'Phone number verified successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = authController;