import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios
      .get('http://localhost:3001/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setProducts([]);
      });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/products/${id}`);
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    if (filter === 'all') return true;
    return filter === 'available' ? product.available : !product.available;
  });

  // Helper function to format price
  const formatPrice = (price) => {
    const numPrice = Number(price);
    return isNaN(numPrice) ? 'N/A' : `€${numPrice.toFixed(2)}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Product Catalog</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/products/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
              data-testid="add-product-link"
              aria-label="Add a new product"
            >
              Add Product
            </Link>
            <select
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
              className="border border-gray-200 rounded-lg py-2.5 px-4 text-gray-700 font-medium bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300 w-full sm:w-48"
              data-testid="filter-select"
              aria-label="Filter products by availability"
            >
              <option value="all">All Products</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200"
                data-testid={`product-card-${product.id}`}
              >
                <div className="flex flex-col h-full">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate">{product.name}</h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description || 'No description available'}</p>
                  <p className="text-indigo-600 font-bold text-lg mb-3">{formatPrice(product.price)}</p>
                  <p className="text-gray-600 mb-4 flex-grow">
                    {product.available ? (
                      <span className="text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full text-xs">Available</span>
                    ) : (
                      <span className="text-red-600 font-medium bg-red-100 px-2 py-1 rounded-full text-xs">Unavailable</span>
                    )}
                  </p>
                  <div className="flex justify-end gap-2 mt-auto">
                    <Link
                      to={`/products/${product.id}`}
                      className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      data-testid={`view-button-${product.id}`}
                      aria-label={`View details for ${product.name}`}
                    >
                      View
                    </Link>
                    <Link
                      to={`/products/${product.id}/edit`}
                      className="bg-green-100 text-green-700 hover:bg-green-200 font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                      data-testid={`edit-button-${product.id}`}
                      aria-label={`Edit ${product.name}`}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-100 text-red-700 hover:bg-red-200 font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                      data-testid={`delete-button-${product.id}`}
                      aria-label={`Delete ${product.name}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl font-medium mb-4">No products available</p>
            <Link
              to="/products/new"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg transition-all duration-300"
              data-testid="create-first-product-link"
            >
              Create Your First Product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
