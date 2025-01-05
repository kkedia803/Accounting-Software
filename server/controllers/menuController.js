const Menu = require('../models/Menu');

const createMenu = async (req, res) => {
    try {
        const { categories } = req.body;

        const menu = new Menu({
            // make useId to be userId in testing otherwise make it default user.Id
            userId: req.user.Id,
            categories,
        });

        await menu.save();
        res.status(201).json({ message: 'Menu created successfully', menu });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating menu', error });
        console.log(error);
    }
}

const getMenu = async (req, res) => {
    try {
        const menu = await Menu.findOne({ userId: req.user.id });
        if (!menu) return res.status(404).json({ message: 'Menu not found' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching menu', error });
    }
}

module.exports = { createMenu, getMenu };