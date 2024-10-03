const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const itemSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    name: String,
    price: Number,
    image: String,
});

module.exports = mongoose.model('Item', itemSchema);