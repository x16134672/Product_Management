const API = 'http://localhost:3001/products';

async function getProducts() {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    const products = await res.json();
    return products.map(product => ({
        ...product,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
    }));
}

async function getProduct(id) {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch product ${id}: ${res.status}`);
    const product = await res.json();
    return {
        ...product,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
    };
}

async function createProduct(data) {
    const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Failed to create product: ${res.status}`);
    const product = await res.json();
    return {
        ...product,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
    };
}

async function updateProduct(id, data) {
    const res = await fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `Failed to update product ${id}: ${res.status}`);
    }
    const product = await res.json();
    return {
        ...product,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
    };
}

async function deleteProduct(id) {
    // Skip confirm in test environment
    if (window.__TEST_ENV__ || confirm('Are you sure you want to delete this product?')) {
        const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            // Suppress 404 errors during cleanup
            if (res.status === 404) return;
            throw new Error(`Failed to delete product ${id}: ${res.status}`);
        }
    }
}