const { response, json } = require("express");
const { Categoria, User } = require("../models");
const categoria = require("../models/categoria");



//Obtener categorias - pagiando - total cantidad - objeto populate mongoose al imprirmir (ultimo usuario que ha modifcado este registro)
const categoriasGET = async(req, res = response) => {
    const {limite = 5, desde = 0} = req.query

    
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments({estado : true}),
        Categoria.find({estado : true})
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
        
    ])

    /*categorias.map(async(cat) => {
        const usuarioIndv = await User.findById(cat.usuario)
        console.log(usuarioIndv)
        cat.usuario = usuarioIndv
        return cat
    })
*/

    res.json({
        total,
        categorias
    })
}

//Obtener categoria - populate { objeto de la categoria}
const categoriasGetID = async(req,res = response) => {
    const idCategoria = req.params.id
    const categoria = await Categoria.findById(idCategoria).populate('usuario', 'nombre')
    const {nombre,usuario} = categoria
    res.status(201).json({
        nombre,usuario
    })
}

const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase()

    console.log(nombre)
    const categoriaDB  = await Categoria.findOne({nombre})
    if(categoriaDB){
        return res.status(400).json({
            msg : 'La categoria ya existe'
        })
    }

    //generar la data a guardar

    const data = { 
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data)

    //Gyardar db

    await categoria.save()

    res.status(201).json({
        categoria
    })
}

//Actualizar categoria, nombre

const updateCategoria = async(req,res = response) => {
    const idURL = req.params.id
    const {nombre,estado} = req.body
    const resto = {
        nombre : nombre.toUpperCase(),
        estado,
        usuario : req.uid
    }
    const categoria = await Categoria.findByIdAndUpdate(idURL, resto )

    res.json({
        msg : "Categoria Actualizado" ,
        resto
    })
}
const deleteCategoria = async(req, res = response) => {
    const uid = req.params.id
    const usuarioReq = req.usuario

    const categoria = await Categoria.findByIdAndUpdate(uid, {estado : false})

    res.json({
        msg : 'Categoria Eliminada',
        categoria
    })
}
//Borrar categoria, cambiar el estado 
module.exports = {
    crearCategoria,
    categoriasGET,
    categoriasGetID,
    updateCategoria,
    deleteCategoria
}