
const express = require('express')

const router = express.Router();

const rentalPropertyController = require('../controllers/rentalPropertyController');
const upload = require('../config/multerConfig');



router.post('/rentout', upload.single('propertyImage'), rentalPropertyController.rentOUtProperty);
router.put('/rent/:Rid', rentalPropertyController.rentProperty);
router.get('/unsold', rentalPropertyController.getAllrentalProperties);
router.get('/seller/:sellerId', rentalPropertyController.getrentalPropertyBySeller);
router.delete('/delete/:id', rentalPropertyController.deleteRentalProperty);
router.put('/update/:id', upload.single('propertyImage'), rentalPropertyController.updateRentalProperty);

module.exports = router;
