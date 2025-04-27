import { getProducts, createProduct } from '../js/api';

test('create and fetch products', async () => {
    const product = { name: "Test", price: 10.0, available: true };
    await createProduct(product);
    const products = await getProducts();
    expect(products.some(p => p.name === "Test")).toBe(true);
});
