
const express = require('express')

const router = express.Router();

const propertyController = require('../controllers/propertyController')
const upload = require('../config/multerConfig');

router.post('/sell', upload.single('propertyImage'), propertyController.sellProperty);
router.put('/buy/:id', propertyController.buyProperty);
router.get('/unsold', propertyController.getAllOnSaleProperties);
router.get('/seller/:sellerId', propertyController.getPropertyBySeller);
router.delete('/delete/:id', propertyController.deleteProperty);
router.put('/update/:id', upload.single('propertyImage'), propertyController.updateProperty);

module.exports = router;