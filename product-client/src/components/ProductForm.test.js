const { act } = require('react');
const { render, screen, waitFor } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
const { MemoryRouter } = require('react-router-dom');
const axios = require('axios');
require('@testing-library/jest-dom');

// Import ProductForm and log to debug
const ProductForm = require('./ProductForm').default;
console.log('Imported ProductForm:', ProductForm);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('axios');

describe('ProductForm', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('react-router-dom').useParams.mockReturnValue({});
    jest.clearAllMocks();
    axios.get.mockReset();
    axios.post.mockReset();
    axios.patch.mockReset();
  });

  it('submits new product with valid data including description', async () => {
    axios.post.mockResolvedValue({});

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductForm />
        </MemoryRouter>
      );
    });

    await userEvent.type(screen.getByTestId('name-input'), 'Laptop');
    await userEvent.type(screen.getByTestId('description-input'), 'A high-end laptop');
    await userEvent.type(screen.getByTestId('price-input'), '999.99');
    await userEvent.click(screen.getByTestId('available-checkbox'));
    await userEvent.click(screen.getByTestId('save-button'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/products', {
        product: {
          name: 'Laptop',
          description: 'A high-end laptop',
          price: 999.99,
          available: true,
        },
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('submits new product with empty description', async () => {
    axios.post.mockResolvedValue({});

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductForm />
        </MemoryRouter>
      );
    });

    await userEvent.type(screen.getByTestId('name-input'), 'Laptop');
    await userEvent.type(screen.getByTestId('price-input'), '999.99');
    await userEvent.click(screen.getByTestId('save-button'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/products', {
        product: {
          name: 'Laptop',
          description: '',
          price: 999.99,
          available: false,
        },
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('submits updated product in edit mode', async () => {
    require('react-router-dom').useParams.mockReturnValue({ id: '1' });
    axios.get.mockResolvedValue({
      data: { id: 1, name: 'Laptop', price: 999.99, available: true, description: 'A high-end laptop' },
    });
    axios.patch.mockResolvedValue({});

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductForm />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue('Laptop');
    });

    await userEvent.clear(screen.getByTestId('name-input')); // Clear existing value
    await userEvent.type(screen.getByTestId('name-input'), 'Updated Laptop');
    await userEvent.click(screen.getByTestId('save-button'));

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith('http://localhost:3001/products/1', {
        product: {
          id: 1,
          name: 'Updated Laptop',
          description: 'A high-end laptop',
          price: 999.99,
          available: true,
        },
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows validation errors', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ProductForm />
        </MemoryRouter>
      );
    });

    await userEvent.click(screen.getByTestId('save-button'));

    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');
      expect(screen.getByTestId('price-error')).toHaveTextContent('Price is required');
    });
  });

  it('handles submission error with server errors', async () => {
    axios.post.mockRejectedValue({ response: { data: { errors: 'Invalid data' } } });

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductForm />
        </MemoryRouter>
      );
    });

    await userEvent.type(screen.getByTestId('name-input'), 'Laptop');
    await userEvent.type(screen.getByTestId('price-input'), '999.99');
    await userEvent.click(screen.getByTestId('save-button'));

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid data');
    });
  });

  it('handles submission error without server errors', async () => {
    axios.post.mockRejectedValue(new Error('Network error'));

    await act(async () => {
      render(
        <MemoryRouter>
          <ProductForm />
        </MemoryRouter>
      );
    });

    await userEvent.type(screen.getByTestId('name-input'), 'Laptop');
    await userEvent.type(screen.getByTestId('price-input'), '999.99');
    await userEvent.click(screen.getByTestId('save-button'));

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Submission failed');
    });
  });

  it('cancels form and navigates back', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ProductForm />
        </MemoryRouter>
      );
    });

    await userEvent.click(screen.getByTestId('cancel-button'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  // Add after other tests in the describe block
it('navigates back on fetch error in edit mode', async () => {
    require('react-router-dom').useParams.mockReturnValue({ id: '1' });
    axios.get.mockRejectedValue(new Error('Not found'));
  
    await act(async () => {
      render(
        <MemoryRouter>
          <ProductForm />
        </MemoryRouter>
      );
    });
  
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  
});