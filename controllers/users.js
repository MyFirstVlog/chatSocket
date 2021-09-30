const {response, request} = require('express') // esto es para poder tener los metodos del res, sin esto no aparecen 
const bcryptjs = require('bcryptjs')
const User = require('../models/user') // U mayuscula para crear instancias del modelo es estandar




const usuariosGET = async(req = request, res = response) => { 
    //const {nombre,apellido,edad} = req.query
    const {limite = 5, desde = 0} = req.query
    //console.log([{limite}, {desde}])
    
    /*const usuarios = await User.find({estado : true}) // dentro recibe condiciones tipo objetos 
    .skip(Number(desde))
    .limit(Number(limite))

    const total = await User.countDocuments({estado : true})*/

    //es importante mencionar que para evistar que los dos await ralenticen mi codigo y como un await no depende de la realizacion del otro 
    //entonces uso promise.all

    const [total, usuarios] = await Promise.all([ // la rta es una coleccion de las dos promesas
        User.countDocuments({estado : true}),
        User.find({estado : true}) // dentro recibe condiciones tipo objetos 
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json(
        {
           total,
           usuarios
        }
    )
}

const usuariosPOST = async(req, res = response) => { 

    const {nombre,correo,password,role} = req.body 
    const usuario = new User({nombre,correo,password,role})
    //hash de la contraseña 
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password,salt)
    //Guargar en db
    await usuario.save()

    res.json(
        {
            msg: 'post API - controller',
            usuario
        }
    )
}

const usuariosPUT = async (req, res = response) => { 

    const idURL = req.params.id
    const {__id,password, google, correo, ...resto} = req.body

    //TODO validar en db
    if(password){
        //hash de la contraseña 
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync(password,salt)
    }

    const usuario = await User.findByIdAndUpdate(idURL, resto)

    res.json(
        {
            msg: 'put API - controller',
            usuario
        }
    )
}

const usuariosDELETE = async(req, res = response) => { 
    const {id} = req.params

    const uid = req.uid
    const usuarioReq= req.usuario

    console.log(usuarioReq)
    //fisicamente lo borramos
    //const usuario = await User.findByIdAndDelete(id)

    const usuario = await User.findByIdAndUpdate(uid, {estado:false})


    res.json({usuario,usuarioReq})
}
const usuariosPATCH = (req, res = response) => { 
    res.json(
        {
            msg: 'patch API - controller'
        }
    )
}

module.exports= {
    usuariosGET,
    usuariosPATCH,
    usuariosDELETE,
    usuariosPOST,
    usuariosPUT
}