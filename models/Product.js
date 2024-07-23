const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    itemCode: {
        type: String,
        required: true,
    },
    retailPrice: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    wholesalePrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', ProductSchema);
