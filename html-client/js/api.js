const API = 'http://localhost:3001/products';

async function getProducts() {
    const res = await fetch(API);
    return res.json();
}

async function getProduct(id) {
    const res = await fetch(`${API}/${id}`);
    return res.json();
}

async function createProduct(data) {
    await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

async function updateProduct(id, data) {
    await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        await fetch(`${API}/${id}`, { method: 'DELETE' });
        location.reload();
    }
}
