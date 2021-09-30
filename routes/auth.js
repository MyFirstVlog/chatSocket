const {Router} = require('express')
const {check} = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { login, googleSignIn, renovarToken } = require('../controllers/auth')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router()

router.post('/login',[
    check('correo', 'el correo es oblogatorio').isEmail(),
    check('password', 'la contraseña es obligatoria').not().isEmpty(),
    validarCampos
] , login)

router.post('/google',[
    check('id_token', 'id Token de google es necesario').not().isEmpty(),
    validarCampos
] , googleSignIn)

router.get('/', validarJWT, renovarToken ) // si es correcto hago la funcion siguiente
module.exports = router