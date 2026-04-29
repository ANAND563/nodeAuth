const express = require('express');
const router = express.Router();

const productController = require('../controller/ProductController');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadProductImage } = require('../middleware/upload');
const { productValidation } = require('../middleware/validator');

router.use(authMiddleware); // Protect all product routes

router.post('/', uploadProductImage.single('image'), productValidation, productController.addProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', uploadProductImage.single('image'), productValidation, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;

