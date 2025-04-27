import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', description: '', price: '', available: false });
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3001/products/${id}`)
        .then(response => setFormData(response.data))
        .catch(() => navigate('/'));
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.price) newErrors.price = 'Price is required';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const payload = {
          product: {
            ...formData,
            price: parseFloat(formData.price), // Convert price to number
          },
        };
        if (id) {
          await axios.patch(`http://localhost:3001/products/${id}`, payload);
        } else {
          await axios.post('http://localhost:3001/products', payload);
        }
        navigate('/');
      } catch (error) {
        setSubmissionError(error.response?.data?.errors || 'Submission failed');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-100 relative overflow-hidden" data-testid="product-form-card">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">{id ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              id="name"
              data-testid="name-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            {errors.name && <span data-testid="name-error" className="text-red-600 text-sm mt-1">{errors.name}</span>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              data-testid="description-input"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-y"
              rows="4"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              id="price"
              data-testid="price-input"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            {errors.price && <span data-testid="price-error" className="text-red-600 text-sm mt-1">{errors.price}</span>}
          </div>
          <div>
            <label className="flex items-center">
              <input
                data-testid="available-checkbox"
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-400"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Available</span>
            </label>
          </div>
          {submissionError && <div data-testid="error-message" className="text-red-600 text-sm">{submissionError}</div>}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              data-testid="save-button"
              type="submit"
              className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-medium py-2 px-5 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Save product"
            >
              Save
            </button>
            <button
              data-testid="cancel-button"
              type="button"
              onClick={() => navigate('/')}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-2 px-5 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Cancel and return to product list"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;