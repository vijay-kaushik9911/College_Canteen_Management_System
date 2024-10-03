const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for items in the cart
const CartItemSchema = new Schema({
    item: { 
        type: String, 
        ref: 'Item', // Reference to the Item model
        required: true
    },
    quantity: { 
        type: Number, 
        required: true,
        min: 0
    }
});

// Define the schema for the cart
const CartSchema = new Schema({
    user: {
        type: String, 
        ref: 'User',
        required: true
    },
    items: [CartItemSchema]
});

// Create and export the Cart model
module.exports = mongoose.model('Cart', CartSchema);
