const request = require('supertest');
const express = require('express');
const propertyRoutes = require('../routes/propertyRoute');
const propertyController = require('../controllers/propertyController');
const db = require('../database/db'); // Import database connection

jest.mock('../controllers/propertyController');

const app = express();
app.use(express.json());
app.use('/property', propertyRoutes);

describe('Property Routes', () => {
    test('POST /property/sell should call sellProperty controller', async () => {
        propertyController.sellProperty.mockImplementation((req, res) => res.status(201).json({ message: 'Property listed for sale' }));

        const response = await request(app)
            .post('/property/sell')
            .attach('propertyImage', Buffer.from('dummy_image'), 'property.jpg');

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Property listed for sale');
        expect(propertyController.sellProperty).toHaveBeenCalled();
    });

    test('PUT /property/buy/:id should call buyProperty controller', async () => {
        propertyController.buyProperty.mockImplementation((req, res) => res.status(200).json({ message: 'Property purchased' }));

        const response = await request(app).put('/property/buy/1');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Property purchased');
        expect(propertyController.buyProperty).toHaveBeenCalled();
    });

    test('GET /property/unsold should call getAllOnSaleProperties controller', async () => {
        propertyController.getAllOnSaleProperties.mockImplementation((req, res) => res.status(200).json([]));

        const response = await request(app).get('/property/unsold');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(propertyController.getAllOnSaleProperties).toHaveBeenCalled();
    });

    test('GET /property/seller/:sellerId should call getPropertyBySeller controller', async () => {
        propertyController.getPropertyBySeller.mockImplementation((req, res) => res.status(200).json([]));

        const response = await request(app).get('/property/seller/123');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(propertyController.getPropertyBySeller).toHaveBeenCalled();
    });

    test('DELETE /property/delete/:id should call deleteProperty controller', async () => {
        propertyController.deleteProperty.mockImplementation((req, res) => res.status(200).json({ message: 'Property deleted' }));

        const response = await request(app).delete('/property/delete/1');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Property deleted');
        expect(propertyController.deleteProperty).toHaveBeenCalled();
    });

    test('PUT /property/update/:id should call updateProperty controller', async () => {
        propertyController.updateProperty.mockImplementation((req, res) => res.status(200).json({ message: 'Property updated' }));

        const response = await request(app)
            .put('/property/update/1')
            .attach('propertyImage', Buffer.from('dummy_image'), 'property.jpg');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Property updated');
        expect(propertyController.updateProperty).toHaveBeenCalled();
    });
});

// Close DB connection after all tests
afterAll(async () => {
    await db.sequelize.close();
});
