const { request, response } = require("express")



const adminRole = (req=request,res =response, next) => {

    if(!req.usuario){
        return res.status(500).json({
            msg : "Se quiere verificar el role sin verficar el token primero"
        })
    }
    const {role, nombre} =  req.usuario

    if(role !== 'ADMIN_ROLE'){
        res.status(401).json({
            msg : 'El usuario no es admin'
        })
    }

    next()
}

const tieneRole = (...roles) => {
    return (req=request,res =response, next) => {
        if(!req.usuario){
            return res.status(500).json({
                msg : "Se quiere verificar el role sin verficar el token primero"
            })
        }
        if(!roles.includes(req.usuario.role)){
            return res.status(401).json({
                msg : `El usuario no esta autorizado ,este debe ser ${roles}`
            })
        }
        next()
    }
}

module.exports = {
    adminRole, tieneRole
}