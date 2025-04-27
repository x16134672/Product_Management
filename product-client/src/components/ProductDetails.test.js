import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ProductDetails from './ProductDetails';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('ProductDetails', () => {
  const mockProduct = {
    id: 1,
    name: 'Laptop',
    price: 999.99,
    available: true,
    description: 'A high-end laptop',
  };

  beforeEach(() => {
    axios.get.mockReset();
    jest.clearAllMocks();
  });

  it('renders loading state', async () => {
    axios.get.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: mockProduct }), 100))
    );

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <ProductDetails />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders product details', async () => {
    axios.get.mockResolvedValue({ data: mockProduct });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <ProductDetails />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('Price: €999.99')).toBeInTheDocument();
      expect(screen.getByText('Available: Yes')).toBeInTheDocument();
      expect(screen.getByText('A high-end laptop')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Back to List')).toBeInTheDocument();
    });
  });

  it('handles fetch error', async () => {
    axios.get.mockRejectedValue(new Error('Fetch error'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <ProductDetails />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
      expect(console.error).toHaveBeenCalledWith('Error fetching product:', expect.any(Error));
    });
  });

  it('renders nothing when product is null after loading', async () => {
    axios.get.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: null }), 100))
    );

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <ProductDetails />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
    });
  });

  it('updates when id changes', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockProduct })
      .mockResolvedValueOnce({
        data: { ...mockProduct, id: 2, name: 'Mouse', price: 29.99, available: false },
      });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<ProductDetails />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/products/2']}>
          <Routes>
            <Route path="/products/:id" element={<ProductDetails />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Mouse')).toBeInTheDocument();
      expect(screen.getByText('Price: €29.99')).toBeInTheDocument();
      expect(screen.getByText('Available: No')).toBeInTheDocument();
    });
  });

  it('navigates to edit page', async () => {
    jest.setTimeout(10000); // Increase timeout for this test
    axios.get.mockResolvedValue({ data: mockProduct });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/products/:id/edit" element={<div>Edit Page</div>} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
    }, { timeout: 1000 });

    await act(async () => {
      await userEvent.click(screen.getByText('Edit'));
    });

    await waitFor(() => {
      expect(screen.getByText('Edit Page')).toBeInTheDocument();
    }, { timeout: 1000 });
  }, 10000); // Set timeout at test level
});