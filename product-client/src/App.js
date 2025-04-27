import { Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList.js';
import ProductDetails from './components/ProductDetails.js';
import ProductForm from './components/ProductForm.js';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<ProductList />} />
    <Route path="/products/new" element={<ProductForm />} />
    <Route path="/products/:id" element={<ProductDetails />} />
    <Route path="/products/:id/edit" element={<ProductForm />} />
  </Routes>
);

const App = { AppRoutes };
export default App;