const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Use the upload middleware and addProduct function from productController
router.post('/api/products', productController.upload, productController.addProduct);

module.exports = router;
