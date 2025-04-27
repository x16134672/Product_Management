import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import ProductList from './ProductList';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('ProductList', () => {
  const mockProducts = [
    { id: 1, name: 'Laptop', price: 999.99, available: true },
    { id: 2, name: 'Mouse', price: 29.99, available: false },
  ];

  beforeEach(() => {
    axios.get.mockReset();
    axios.delete.mockReset();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders product list', async () => {
    axios.get.mockResolvedValue({ data: mockProducts });

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductList />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('Mouse')).toBeInTheDocument();
    });
  });

  it('filters available products', async () => {
    axios.get.mockResolvedValue({ data: mockProducts });

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductList />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.selectOptions(screen.getByRole('combobox'), 'available');
    });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.queryByText('Mouse')).not.toBeInTheDocument();
    });
  });

  it('filters unavailable products', async () => {
    axios.get.mockResolvedValue({ data: mockProducts });

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductList />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Mouse')).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.selectOptions(screen.getByRole('combobox'), 'unavailable');
    });

    await waitFor(() => {
      expect(screen.getByText('Mouse')).toBeInTheDocument();
      expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
    });
  });

  it('deletes a product when confirm is true', async () => {
    axios.get.mockResolvedValue({ data: mockProducts });
    axios.delete.mockResolvedValue({});
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductList />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getAllByText('Delete').length).toBeGreaterThan(0);
    }, { timeout: 1000 });

    await act(async () => {
      const deleteButton = screen.getAllByText('Delete')[0];
      await userEvent.click(deleteButton);
      // Wait for axios.delete to be called
      await waitFor(() => expect(axios.delete).toHaveBeenCalledWith('http://localhost:3001/products/1'), { timeout: 1000 });
    });

    await waitFor(() => {
      expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
      expect(screen.getByText('Mouse')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('cancels delete when confirm is false', async () => {
    axios.get.mockResolvedValue({ data: mockProducts });
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductList />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getAllByText('Delete').length).toBeGreaterThan(0);
    });

    await act(async () => {
      await userEvent.click(screen.getAllByText('Delete')[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('Mouse')).toBeInTheDocument();
    });
  });

  it('handles fetch error', async () => {
    axios.get.mockRejectedValue(new Error('Fetch error'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductList />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
      expect(console.error).toHaveBeenCalledWith('Fetch error:', expect.any(Error));
    });
  });

  it('handles delete error', async () => {
    axios.get.mockResolvedValue({ data: mockProducts });
    axios.delete.mockRejectedValue(new Error('Delete error'));
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductList />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getAllByText('Delete').length).toBeGreaterThan(0);
    });

    await act(async () => {
      await userEvent.click(screen.getAllByText('Delete')[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(console.error).toHaveBeenCalledWith('Delete error:', expect.any(Error));
    });
  });
});