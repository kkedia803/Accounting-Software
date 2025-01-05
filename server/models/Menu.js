const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    halfAvailable: { type: Boolean, default: false },
    halfPrice: { type: Number }
});

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    items: [itemSchema]
});

const menuSchema = new mongoose.Schema({
    // required to be false when use otherwise make it default true
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categories: [categorySchema]
});

module.exports = mongoose.model('Menu', menuSchema);