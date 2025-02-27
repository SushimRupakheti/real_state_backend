const request = require('supertest');
const express = require('express');
const { 
  sellProperty, 
  buyProperty, 
  getAllOnSaleProperties, 
  getPropertyBySeller, 
  deleteProperty, 
  updateProperty 
} = require('../controllers/propertyController');
const Property = require('../model/Property');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Create a simple Express app and mount routes for testing.
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// For file upload simulation using multer's memory storage.
const upload = multer({ storage: multer.memoryStorage() });
app.post('/sell', upload.single('propertyImage'), sellProperty);
app.put('/buy/:id', buyProperty);
app.get('/unsold', getAllOnSaleProperties);
app.get('/seller/:sellerId', getPropertyBySeller);
app.delete('/delete/:id', deleteProperty);
app.put('/update/:id', upload.single('propertyImage'), updateProperty);

// Mock Cloudinary for testing
jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload_stream: jest.fn().mockImplementation((options, callback) => {
        callback(null, { secure_url: 'https://fake-cloudinary.com/sample.jpg' });
      }),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' })
    }
  }
}));

// Mock the Property model
jest.mock('../model/Property', () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
}));

describe('Property Controller Tests', () => {
  let propertyId = 'test-property-id';
  const sellerId = 'test-seller-id';

  test('Should successfully sell a property', async () => {
    Property.create.mockResolvedValue({});
    
    const response = await request(app)
      .post('/sell')
      .field('sellerId', sellerId)
      .field('ownerName', 'John Doe')
      .field('propertyLocation', 'Kathmandu')
      .field('propertyType', 'House')
      .field('propertyTitle', 'Beautiful Home')
      .field('phoneNumber', '9800000000')
      .field('price', '50000')
      .attach('propertyImage', Buffer.from('testimage'), { filename: 'test.jpg' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Property listed successfully');
  });

  test('Should fail to sell property when required fields are missing', async () => {
    // Send empty strings for required fields to simulate missing data.
    const response = await request(app)
      .post('/sell')
      .field('sellerId', '')          // Missing sellerId
      .field('ownerName', '')         // Missing ownerName
      .field('propertyLocation', '')  // Missing propertyLocation
      .field('propertyType', '')      // Missing propertyType
      .field('propertyTitle', '')     // Missing propertyTitle
      .field('phoneNumber', '')       // Missing phoneNumber
      .field('price', '')             // Missing price
      .attach('propertyImage', Buffer.from('testimage'), { filename: 'test.jpg' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields');
  });

  test('Should buy a property successfully', async () => {
    Property.findOne.mockResolvedValue({ save: jest.fn() });

    const response = await request(app).put('/buy/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Property bought successfully');
  });

  test('Should return 404 when buying a non-existent property', async () => {
    Property.findOne.mockResolvedValue(null);

    const response = await request(app).put('/buy/1');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Property not found');
  });

  test('Should return all on-sale properties', async () => {
    Property.findAll.mockResolvedValue([{ id: 1, status: 'onSale' }]);

    const response = await request(app).get('/unsold');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Should return properties by seller ID', async () => {
    Property.findAll.mockResolvedValue([{ id: 1, sellerId: sellerId }]);

    const response = await request(app).get(`/seller/${sellerId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('property');
  });

  test('Should delete a property successfully', async () => {
    Property.findOne.mockResolvedValue({
      destroy: jest.fn(),
      propertyImage: 'https://res.cloudinary.com/fake/image/upload/v123456789/sample.jpg'
    });

    const response = await request(app).delete('/delete/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Property deleted successfully');
  });

  test('Should return 404 when deleting a non-existent property', async () => {
    Property.findOne.mockResolvedValue(null);

    const response = await request(app).delete('/delete/1');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Property not found');
  });

  test('Should update property successfully', async () => {
    Property.findOne.mockResolvedValue({
      save: jest.fn(),
      propertyImage: 'https://res.cloudinary.com/fake/image/upload/v123456789/sample.jpg'
    });

    const response = await request(app)
      .put('/update/1')
      .field('propertyTitle', 'Updated Title')
      .attach('propertyImage', Buffer.from('testimage'), { filename: 'test.jpg' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Property updated successfully');
  });

  test('Should return 404 when updating a non-existent property', async () => {
    Property.findOne.mockResolvedValue(null);

    const response = await request(app).put('/update/1');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Property not found');
  });
});
