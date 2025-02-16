
const express = require('express')

const router = express.Router();

const rentalPropertyController = require('../controllers/rentalPropertyController');
const upload = require('../config/multerConfig');



router.post('/rentout', upload.single('RpropertyImage'), rentalPropertyController.rentOUtProperty);
router.put('/rent/:Rid', rentalPropertyController.rentProperty);
router.get('/unsold', rentalPropertyController.getAllrentalProperties);
router.get('/seller/:sellerId', rentalPropertyController.getrentalPropertyBySeller);

module.exports = router;

