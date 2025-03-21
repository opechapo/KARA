import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';
import { FaArrowLeft } from 'react-icons/fa';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    shortDescription: '',
    store: '',
    category: '',
    collection: '',
    description: '',
    amount: '',
    price: '',
    paymentToken: '',
    generalImage: null,
    escrowSystem: '',
    vendorDeposit: '',
    customerDeposit: '',
  });
  const [stores, setStores] = useState([]);
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState('');

  // Fetch stores and collections
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/stores', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token || ''}` },
          credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch stores');
        setStores(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchCollections = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/collections', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token || ''}` },
          credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch collections');
        setCollections(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStores();
    fetchCollections();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setProductData({ ...productData, generalImage: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('shortDescription', productData.shortDescription);
    formData.append('store', productData.store);
    formData.append('category', productData.category);
    formData.append('collection', productData.collection);
    formData.append('description', productData.description);
    formData.append('amount', productData.amount);
    formData.append('price', productData.price);
    formData.append('paymentToken', productData.paymentToken);
    formData.append('generalImage', productData.generalImage);
    formData.append('escrowSystem', productData.escrowSystem);
    if (productData.escrowSystem === 'Deposit') {
      formData.append('vendorDeposit', productData.vendorDeposit);
      formData.append('customerDeposit', productData.customerDeposit);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token || ''}` },
        credentials: 'include',
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create product');
      }
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <Header />

      {/* Spacer */}
      <div className="h-20"></div>

      {/* Back Button in Outer Div */}
      <div className="absolute top-28 left-6">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center text-purple-900 hover:text-purple-700 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 max-w-6xl mx-auto bg-gray-50 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create a Product</h1>
        {error && <div className="text-red-500 mb-8">{error}</div>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              placeholder="Enter name of your Product"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="shortDescription"
              value={productData.shortDescription}
              onChange={handleChange}
              placeholder="Enter short description"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">
              Store <span className="text-red-500">*</span>
            </label>
            <select
              name="store"
              value={productData.store}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select your store</option>
              {stores.map((store) => (
                <option key={store._id} value={store._id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Smart Phones & Tabs">Smart Phones & Tabs</option>
              <option value="Homes & Gardens">Homes & Gardens</option>
              <option value="Fashion">Fashion</option>
              <option value="Vehicles">Vehicles</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">
              Adding a category will help make your item discoverable on Kara.
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">
              Collection <span className="text-red-500">*</span>
            </label>
            <select
              name="collection"
              value={productData.collection}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select store collection</option>
              {collections.map((collection) => (
                <option key={collection._id} value={collection._id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              rows="6"
              placeholder="The description will be included on the product's detail page."
            />
            <p className="text-sm text-gray-500 mt-2">
              Markdown syntax is supported.
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={productData.amount}
              onChange={handleChange}
              placeholder="Enter product amount"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              placeholder="Enter product price"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">
              Payment Token <span className="text-red-500">*</span>
            </label>
            <select
              name="paymentToken"
              value={productData.paymentToken}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select a token</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="USDT">Tether (USDT)</option>
              <option value="BNB">Binance Coin (BNB)</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">
              This token can be used to buy and sell your product.
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">
              General Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="generalImage"
              onChange={handleFileChange}
              className="w-full p-3 border rounded-md"
              accept="image/*"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              File types supported: JPG, PNG, GIF, SVG. Max size: 100 MB.
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">
              Escrow System <span className="text-red-500">*</span>
            </label>
            <select
              name="escrowSystem"
              value={productData.escrowSystem}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select escrow system</option>
              <option value="Deposit">Deposit (Recommended for inexpensive products)</option>
              <option value="Guarantor">Guarantor (Recommended for expensive products)</option>
            </select>
          </div>

          {productData.escrowSystem === 'Deposit' && (
            <>
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-3">
                  Vendor Deposit <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="vendorDeposit"
                  value={productData.vendorDeposit}
                  onChange={handleChange}
                  placeholder="Enter vendor deposit"
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-3">
                  Customer Deposit <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="customerDeposit"
                  value={productData.customerDeposit}
                  onChange={handleChange}
                  placeholder="Enter customer deposit"
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="bg-purple-900 text-white px-6 py-4 rounded-md hover:bg-purple-800 transition-colors w-full text-lg"
          >
            Create Product
          </button>
        </form>
      </div>

      {/* Spacer */}
      <div className="h-20"></div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default CreateProduct;