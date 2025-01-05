const express = require('express');
const menuController = require('../controllers/menuController');

const router = express.Router();

router.post('/create', menuController.createMenu);
router.get('/', menuController.getMenu);

module.exports = router;
