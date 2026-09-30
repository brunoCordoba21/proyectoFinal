const express = require('express');
const router = express.Router();
const { login, obtenerUsuarios } = require('../controllers/usuario.controller');

router.post('/login', login);
router.get('/', obtenerUsuarios);

module.exports = router;