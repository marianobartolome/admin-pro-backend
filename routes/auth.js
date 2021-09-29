/*
    Ruta: /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { login, googlesignIn } = require('../controllers/auth');

const { validarCampos} = require('../middlewares/validar-campos')

const router = Router();

router.post('/', 
    [
        check('email','El email es obligatorio').isEmail(),
        check('password','El password es obligatorio').not().isEmpty(),
        validarCampos 
    ],
    login
);

router.post('/google', 
    [
        check('token','El token de Google es obligatorio').not().isEmpty(),
        validarCampos 
    ],
    googlesignIn
)



module.exports = router;