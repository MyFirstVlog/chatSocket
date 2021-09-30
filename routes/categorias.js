const {Router} = require('express')
const {check} = require('express-validator')
const { crearCategoria, categoriasGET, categoriasGetID, updateCategoria, deleteCategoria } = require('../controllers/categorias')
const { existeCategoria } = require('../helpers/category-validator')
const { validarJWT, validarCampos, tieneRole } = require('../middlewares')

const router = Router()

//Obtener todas las categorias - publico 
router.get('/', categoriasGET)
//Obtener una categoria por id - publico // validacion personaliozada con el id 
router.get('/:id',[
    check('id', 'No es un mongo ID').isMongoId(),
    check('id').custom((id) => existeCategoria(id)),
    validarCampos
], categoriasGetID)
//Crear una categoria - privado con cualquier rol, osea token valido -POST
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    validarCampos
] , crearCategoria
)
//Actuqalizar registro con id --> id de mongo --> cualquiera con tokrn valido
router.put('/:id',[
    validarJWT,
    check('id', 'No es un mongo ID').isMongoId(),
    check('id').custom((id) => existeCategoria(id)),
    validarCampos
], updateCategoria)

//Borrar una categoria-. solo si es admin, cambio el estado 
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un mongo ID').isMongoId(),
    check('id').custom((id) => existeCategoria(id))], deleteCategoria)


module.exports = router