import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  axios
    .get(`/products/${id}`)
    .then((response) => {
      console.log('API response:', response.data); // Debug log (remove after debugging)
      const productData = response.data;
      // Convert price to number if it's a string
      if (productData.price && typeof productData.price === 'string') {
        productData.price = parseFloat(productData.price);
      }
      setProduct(productData);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching product:', error);
      setError('Failed to load product details');
      setLoading(false);
    });
}, [id]);


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-gray-600 text-lg font-medium" data-testid="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-red-600 text-lg font-medium" data-testid="error">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-gray-500 text-lg font-medium" data-testid="no-product">No product found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-100 relative overflow-hidden" data-testid="product-details-card">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 truncate" data-testid="product-name">{product.name}</h2>
        <p className="text-lg text-gray-700 mb-3" data-testid="product-price">
          Price: €
          {typeof product.price === 'number' && !isNaN(product.price)
            ? product.price.toFixed(2)
            : 'N/A'}
        </p>
        <p className="text-lg text-gray-700 mb-3" data-testid="product-availability">
          Available: {product.available ? 'Yes' : 'No'}
        </p>
        <p className="text-lg text-gray-700 mb-6" data-testid="product-description">
          {product.description || 'No description'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Link
            to={`/products/${id}/edit`}
            className="bg-green-100 text-green-700 hover:bg-green-200 font-medium py-2 px-5 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            data-testid="edit-button"
            aria-label={`Edit ${product.name}`}
          >
            Edit
          </Link>
          <Link
            to="/"
            className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-medium py-2 px-5 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            data-testid="back-button"
            aria-label="Back to product list"
          >
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
