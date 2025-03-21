import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';
import { FaArrowLeft } from 'react-icons/fa';

const CreateCollection = () => {
  const navigate = useNavigate();
  const [collectionData, setCollectionData] = useState({
    name: '',
    shortDescription: '',
    store: '',
    category: '',
    description: '',
    generalImage: null,
  });
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching stores with token:', token);
        const response = await fetch('http://localhost:3000/stores', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token || ''}` },
          credentials: 'include',
        });
        const data = await response.json();
        console.log('Response status:', response.status, 'Data:', data);
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch stores');
        }
        setStores(data);
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError(err.message);
      }
    };
    fetchStores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCollectionData({ ...collectionData, [name]: value });
  };

  const handleFileChange = (e) => {
    setCollectionData({ ...collectionData, generalImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', collectionData.name);
    formData.append('shortDescription', collectionData.shortDescription);
    formData.append('store', collectionData.store);
    formData.append('category', collectionData.category);
    formData.append('description', collectionData.description);
    formData.append('generalImage', collectionData.generalImage);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/collections', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token || ''}` },
        credentials: 'include',
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create collection');
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
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 max-w-6xl mx-auto bg-gray-50 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create a Collection</h1>
        {error && <div className="text-red-500 mb-8">{error}</div>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={collectionData.name}
              onChange={handleChange}
              placeholder="e.g., Summer Tech Gadgets"
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
              value={collectionData.shortDescription}
              onChange={handleChange}
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
              value={collectionData.store}
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
              Category (Optional)
            </label>
            <select
              name="category"
              value={collectionData.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
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
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={collectionData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
              rows="6"
            />
            <p className="text-sm text-gray-500 mt-2">
              The description will be included on the collection's detail page. Markdown syntax is supported.
            </p>
          </div>
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">
              General Image
            </label>
            <input
              type="file"
              name="generalImage"
              onChange={handleFileChange}
              className="w-full p-3 border rounded-md"
              accept="image/*"
            />
            <p className="text-sm text-gray-500 mt-2">
              File types supported: JPG, PNG, GIF, SVG. Max size: 100 MB.
            </p>
          </div>
          <button
            type="submit"
            className="bg-purple-900 text-white px-6 py-4 rounded-md hover:bg-purple-800 transition-colors w-full text-lg"
          >
            Create Collection
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

export default CreateCollection;