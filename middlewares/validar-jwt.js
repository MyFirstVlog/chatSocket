const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
//normalmente va en los dheader en los jwt
const validarJWT = async(req = request, res = response , next) => {
    const token = req.header('x-token')

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }
    try {
        
        const {uid} = jwt.verify(token, process.env.SECRETORORIVATEKEY)
        const usuario = await User.findById(uid)

        if(!usuario){
            return res.status(401).json({
                msg:'Token no valido - usuario no existe en dB'
            })
        }

        if(!usuario.estado){
            return res.status(401).json({
                msg:'Token no valido - usuario con estado false'
            })
        }
        req.uid = uid //genero props para poderla sacar mas adelante

        req.usuario = usuario

        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg : 'Token no valido'
        })
    }
    
}


module.exports = {
    validarJWT
}