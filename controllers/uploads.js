const { response } = require("express");
const  path =require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL) // con esto se autentica en cloudinary

const { subirArchivo } = require("../helpers");
const { existeArchivo } = require("../middlewares");
const {User, Producto} = require('../models')

const pathNotFound = path.join(__dirname , '../assets/no-image.jpg')

const cargarArchivo = async(req,res = response) => {

    try {
        
        const nombre = await subirArchivo(req.files, undefined , 'imgs') // pónemos el undefined puesto que por oganizacion debe haber un segundo lugar obligatoriio
        res.json({
            nombre
        })

    } catch (error) {
        res.status(400).json({
            msg : error
        })
    }

}

const actualizarImagen = async(req, res = response) => {

    const {coleccion, id} = req.params

    let modelo

    switch (coleccion) {
        case 'users':
            modelo = await User.findById(id)
            if(!modelo){
                res.status(400).json({
                    msg: 'No existe un usuario con el id: ' + id 
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if(!modelo){
                res.status(400).json({
                    msg: 'No existe un producto con el id: ' + id 
                })
            }
            break;
    
        default:
                return res.status(500).json('Olvide revisar esta condición')
        
    }

    //Limpiar imagnes previas

    if(modelo.img){
        //borrar imagen del servidor 
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen)
        }

    }
   
        const nombre = await subirArchivo(req.files, undefined , coleccion) 
        modelo.img = nombre
    
        await modelo.save()
    
        res.json({
            modelo
        })
        

        res.status(400).json({
            msg : 'no estas subiendo archivo'
        })
    
}

const mostrarImagen = async(req,res = response) => {

    const {coleccion, id} = req.params

    let modelo

    switch (coleccion) {
        case 'users':
            modelo = await User.findById(id)
            if(!modelo){
                res.status(400).json({
                    msg: 'No existe un usuario con el id: ' + id 
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if(!modelo){
                res.status(400).json({
                    msg: 'No existe un producto con el id: ' + id 
                })
            }
            break;
    
        default:
                return res.status(500).json('Olvide revisar esta condición')
        
    }

    //Limpiar imagnes previas

    if(modelo.img){
        //borrar imagen del servidor 
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if(fs.existsSync(pathImagen)){
           return res.sendFile(pathImagen)
        }
    }

    return res.sendFile(pathNotFound)
}


const actualizarImagenCloudinary = async(req, res = response) => {

    const {coleccion, id} = req.params

    let modelo

    switch (coleccion) {
        case 'users':
            modelo = await User.findById(id)
            if(!modelo){
                res.status(400).json({
                    msg: 'No existe un usuario con el id: ' + id 
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if(!modelo){
                res.status(400).json({
                    msg: 'No existe un producto con el id: ' + id 
                })
            }
            break;
    
        default:
                return res.status(500).json('Olvide revisar esta condición')
        
    }

    //Limpiar imagnes previas

    if(modelo.img){
        const nombreArr = modelo.img.split('/')
        const nombre = nombreArr[nombreArr.length - 1 ]
        const [public_id] = nombre.split('.')
        cloudinary.uploader.destroy(public_id)

    }

    const {tempFilePath} = req.files.archivo
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath) // regresa una promesa, aqui es donde se almacena la imagen
    
    // cloudinary.uploader.upload()
   
    //     const nombre = await subirArchivo(req.files, undefined , coleccion) 
         modelo.img = secure_url
    
         await modelo.save()
    
        res.json({
            modelo
         })
        

    //     res.status(400).json({
    //         msg : 'no estas subiendo archivo'
    //     })
    
}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}