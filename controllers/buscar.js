const { response } = require("express");
const {ObjectId} = require('mongoose').Types
const {User, Categoria, Producto} = require('../models')


const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
]

const buscarUsuarios = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino)
    if(esMongoID){
        const usuario = await User.findById(termino)
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regexp = new RegExp(termino, 'i') // insensible a las minusculas

    const usuarios = await User.find({ // se puede usar count para contar las coincidencias
        $or : [{nombre : regexp}, {correo : regexp}], 
        $and : [{estado : true}]
    })

    res.json({
        results : usuarios
    })
}   

const buscarCategoria = async( termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino)
    if(esMongoID){
        const categoria = await Categoria.findById(termino)
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regexp = new RegExp(termino, 'i') // insensible a las minusculas

    const categorias = await Categoria.find({nombre:regexp , estado : true})

    res.json({
        results:[
            categorias
        ]
    })
}

const Busacarproductos = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino)
    if(esMongoID){
    
        const producto = await Producto.findById(termino).populate('categoria', 'nombre')
        return res.json({
            results: (producto) ? [producto] : []
        })
    }
    const regexp = new RegExp(termino, 'i') // insensible a las minusculas

    const productos = await Producto.find({nombre:regexp , estado : true}).populate('categoria', 'nombre')

    res.json({
        results:[
            productos
        ]
    })
}

const buscar = ( req, res = response) => {

    const {coleccion, termino} = req.params

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg : `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case'usuarios':
            buscarUsuarios(termino,res)
        break
        case'categoria':
            buscarCategoria(termino, res)
        break
        case'productos':
            Busacarproductos(termino, res)
        break

        default:
            res.status(500).json({
                msg : 'olvide hacer esta busqueda'
            })
    }
    
 
}
module.exports = {
    buscar
}