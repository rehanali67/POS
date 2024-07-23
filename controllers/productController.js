const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

// Define the upload path relative to the public directory
const uploadPath = path.join(__dirname, '../public/uploads');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Export the upload middleware for use in routes
exports.upload = upload.single('image');

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new product
exports.addProduct = async (req, res) => {
    console.log('Request body:', req.body); // Log request body
    console.log('Uploaded file:', req.file); // Log uploaded file

    const { name, itemCode, retailPrice, category, wholesalePrice, quantity, description } = req.body;
    const image = req.file;

    // Check if all fields and image are provided
    if (!name || !itemCode || !retailPrice || !category || !wholesalePrice || !quantity || !description || !image) {
        return res.status(400).json({ success: false, message: 'Please fill all fields and upload an image.' });
    }

    // Create a new product with the image path
    const product = new Product({
        name,
        itemCode,
        retailPrice,
        category,
        wholesalePrice,
        quantity,
        description,
        image: '/uploads/' + path.basename(image.path) // Store relative path
    });

    try {
        await product.save();
        res.status(201).json({ success: true, product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
