import express from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

// Route to get all products
router.get('/', productController.getProducts);

// Route to add a new product
router.post('/', productController.upload.single('image'), productController.addProduct);

router.delete('/:id', productController.deleteProduct);

router.put('/:id', productController.editProduct); 
export default router;
