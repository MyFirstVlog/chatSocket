const {Router} = require('express')
const {check} = require('express-validator')
const { updateCategoria, deleteProducto } = require('../controllers/productos')
const { crearProducto, productosGET, productosGetID } = require('../controllers/productos')
const { existeCategoria } = require('../helpers/category-validator')
const { existeProducto } = require('../helpers/db-validators')
const { validarJWT, validarCampos, tieneRole } = require('../middlewares')

const router = Router()

router.get('/', productosGET),

router.get('/:id',[
    check('id', 'No es un mongo ID').isMongoId(),
    check('id').custom((id) => existeProducto(id)),
    validarCampos
], productosGetID)

router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('categoria', 'No es un id de categoria valido de mongo').isMongoId(),
    check('categoria').custom((categoria) => existeCategoria(categoria)),
    validarCampos
] , crearProducto
)

router.put('/:id',[
    validarJWT,
    check('id', 'No es un mongo ID').isMongoId(),
    check('id').custom((id) => existeProducto(id)),
    check('categoria', 'No es un id de categoria valido de mongo').isMongoId(),
    validarCampos
], updateCategoria)

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un mongo ID').isMongoId(),
    check('id').custom((id) => existeProducto(id))], deleteProducto)



module.exports = router