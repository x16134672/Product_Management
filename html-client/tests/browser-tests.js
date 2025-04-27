describe('Product API - Integration Tests', function() {
    this.timeout(10000); // Increase timeout for slow APIs

    let createdProductId = null;

    beforeEach(async function() {
        // Set test environment flag
        window.__TEST_ENV__ = true;
        window.confirm = () => true;
        // Create a product for each test
        const product = { name: "TestProduct", price: 20.0, available: true };
        const response = await createProduct(product);
        createdProductId = response.id;
    });

    afterEach(async function() {
        window.__TEST_ENV__ = false;
        window.confirm = () => true;
        if (createdProductId) {
            try {
                await deleteProduct(createdProductId);
            } catch (error) {
                console.error(`Cleanup failed for product ${createdProductId}:`, error.message);
            }
            createdProductId = null;
        }
    });

    before(async function() {
        window.__TEST_ENV__ = true;
        try {
            const products = await getProducts();
            await Promise.all(products.map(product => deleteProduct(product.id)));
        } catch (error) {
            console.error('Failed to clear products:', error.message);
        }
        window.__TEST_ENV__ = false;
    });

    it('should create a new product', async function() {
        const product = { name: "TestProduct", price: 20.0, available: true };
        const response = await createProduct(product);

        expect(response).to.have.property('id');
        expect(response.name).to.equal("TestProduct");
        expect(Number(response.price)).to.equal(20.0);
        expect(response.available).to.equal(true);
        createdProductId = response.id;
    });

    it('should fetch all products and find the created product', async function() {
        expect(createdProductId).to.not.be.null;
        let products;
        for (let i = 0; i < 3; i++) {
            products = await getProducts();
            if (products.find(p => p.id === createdProductId)) break;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const found = products.find(p => p.id === createdProductId);
        expect(found).to.not.be.undefined;
        expect(found.name).to.equal("TestProduct");
        expect(found.price).to.equal(20.0);
        expect(found.available).to.equal(true);
    });

    it('should update the created product', async function() {
        expect(createdProductId).to.not.be.null;
        const updatedProduct = { name: "UpdatedProduct", price: 25.0, available: false };
        let response;
        try {
            response = await updateProduct(createdProductId, updatedProduct);
        } catch (error) {
            console.error('Update Error:', error.message);
            throw error;
        }

        expect(response).to.have.property('id');
        expect(response.name).to.equal("UpdatedProduct");
        expect(response.price).to.equal(25.0);
        expect(response.available).to.equal(false);
    });

    it('should delete the created product', async function() {
        expect(createdProductId).to.not.be.null;
        await deleteProduct(createdProductId);
        const products = await getProducts();
        const found = products.find(p => p.id === createdProductId);
        expect(found).to.be.undefined;
    });
});