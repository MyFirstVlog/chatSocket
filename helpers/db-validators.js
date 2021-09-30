const { Producto } = require('../models')
const Role = require('../models/role')
const User = require('../models/user')

const esRoleValido = async(rol='') => {
    const existeRol = await Role.findOne({rol})
    if(!existeRol){
        throw new Error(`El rol: ${rol} no esta definido en la base de datos`)
    }
}

const emailExiste = async (correo = '') =>{
    const busquedaEmail = await User.findOne({correo})
    if(busquedaEmail){
        throw new Error('El correo ya esta registrado en la base de datos')
    }
    
}
const existeUsuarioPorID = async (id = '') =>{
    const busquedaUsuario = await User.findById(id)
    if(!busquedaUsuario){
        throw new Error('El usuario que deseas actualizar no se encuentra en la base de datos')
    }
    
}
const existeProducto = async( id = '') => {

    const usuario = await Producto.findById(id)

    if(!usuario){
        throw new Error('El producto que trata de buscar no esta en la dB')
    }
}

/**
 * validar coleccionwes perimitidas
 */

const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {
    
    const incluida = colecciones.includes(coleccion)
    if(!incluida){
        throw new Error('coleccion no permitida, las pemritidas son: ' + colecciones )
    }

    //como es un custom validator donde la funcion recibe argumentos debemos enviar un true en return, en los de arriba se hacia implicitamente
    //deberiamos ponerle true en todas
    return true
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorID,
    existeProducto,
    coleccionesPermitidas
}