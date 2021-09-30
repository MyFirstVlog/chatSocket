const { response } = require("express")
const { Categoria, Producto } = require("../models")


const crearProducto = async( req, res = response) => {
    const productoBody= req.body


    const categoria = await Categoria.findById(productoBody.categoria)

    if(!categoria){
        return res.status(404),json({
            msg : "No se encuentra la categoria ingresada"
        })
    }

    productoBody.usuario = req.uid

    const producto = new Producto(productoBody)

    await producto.save()

    res.status(201).json({
        producto
    })
}
const  productosGET = async(req, res = response) =>{
    const {limite = 5, desde = 0} = req.query
    const [ total, productos] = await Promise.all([
    Producto.countDocuments({estado:true}),
    Producto.find({estado : true})
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre')
    .skip(Number(desde))
    .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    })
}

const productosGetID = async(req, res = response) => {
    const {id} = req.params

    const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre')

    res.status(200).json({
        producto
    })
}

const updateCategoria = async(req, res = response) => { 
    const idURL = req.params.id
    const productoUpdate = req.body

    productoUpdate.usuario = req.uid

    const producto = await Producto.findByIdAndUpdate(idURL, productoUpdate)

    res.json({
        msg : "Producto Actualizado",
        productoUpdate
    })
}

const deleteProducto = async(req, res = response) => {
    const pid = req.params.id
    const producto = await Producto.findByIdAndUpdate(pid, {estado : false})
    
    console.log(pid)
    res.json({
        msg: 'Producto eliminado',
        producto,
        pid
    })
}
module.exports = {
    crearProducto,
    productosGET,
    productosGetID,
    updateCategoria,
    deleteProducto
}