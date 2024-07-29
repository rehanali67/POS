import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Product from '../models/Product.js';

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dbl7t5r3a',
    api_key: '768326357315211',
    api_secret: '2RMEO6HB79heMtJy5d5uqC84Ma8' // Ensure your API secret is stored securely
});

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Temporary storage before uploading to Cloudinary
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new product
const addProduct = async (req, res) => {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file); // Check if file is being processed

    const { name, itemCode, retailPrice, category, wholesalePrice, quantity, description } = req.body;
    const image = req.file;

    if (!name || !itemCode || !retailPrice || !category || !wholesalePrice || !quantity || !description || !image) {
        return res.status(400).json({ success: false, message: 'Please fill all fields and upload an image.' });
    }

    let uploadedImageUrl;
    try {
        const result = await cloudinary.uploader.upload(image.path, {
            folder: 'uploads'
        });
        uploadedImageUrl = result.secure_url;
        fs.unlinkSync(image.path);
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Image upload failed.', error: error.message });
    }

    const product = new Product({
        name,
        itemCode,
        retailPrice,
        category,
        wholesalePrice,
        quantity,
        description,
        image: uploadedImageUrl
    });

    try {
        await product.save();
        res.status(201).json({ success: true, product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// Update a product
const editProduct = async (req, res) => {
    const productId = req.params.id;
    const updates = req.body;
    
    try {
        const product = await Product.findByIdAndUpdate(productId, updates, { new: true });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

export default {
    upload,
    getProducts,
    addProduct,
    deleteProduct,
    editProduct 
};


