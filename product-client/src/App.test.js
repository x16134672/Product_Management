import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { AppRoutes } from './App';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('App', () => {
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

  it('renders the app', async () => {
    axios.get.mockResolvedValue({ data: [] });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <AppRoutes />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Add Product')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveValue('all');
    });
  });

  it('navigates from list to details', async () => {
    axios.get.mockImplementation((url) => {
      if (url === 'http://localhost:3001/products') {
        return Promise.resolve({ data: [mockProduct] });
      }
      if (url === 'http://localhost:3001/products/1') {
        return Promise.resolve({ data: mockProduct });
      }
      return Promise.reject(new Error('Not found'));
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <AppRoutes />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('View')).toBeInTheDocument();
    }, { timeout: 1000 });

    await act(async () => {
      await userEvent.click(screen.getByText('View'));
    });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('Price: €999.99')).toBeInTheDocument();
      expect(screen.getByText('Available: Yes')).toBeInTheDocument();
    }, { timeout: 2000 });
  }, 10000);
});