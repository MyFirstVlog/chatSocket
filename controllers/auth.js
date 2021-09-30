const { response } = require('express')
const bcryptjs = require('bcryptjs')
const User = require('../models/user')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')

const login = async (req, res = response) => {

    const { correo, password } = req.body

    try {

        //Verificar si el email existe
        const usuario = await User.findOne({ correo })
        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario/Password no son correctos"
            })
        }
        //verificar si user es activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "Usuario/Password no son correctos -estado = false"
            })
        }

        //verificar la contarsela
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: "Usuario/Password no son correctos - contraseña = incorrecta"
            })
        }
        //generar el jwt
        const token = await generarJWT(usuario.id) // como en generar tengo el return ya puede poner aqui el await. originalmente jsonwebtoken no tranaja devolveiendo una promesa
        // en su implementacion se la generamos
        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'hable con el admin'
        })
    }

}
const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body
    try {
        const { name, email } = await googleVerify(id_token)

        //verificar si email existe en base de datos
        //console.log(name,email)
        const correo = email
        let usuario = await User.findOne({ correo })
        //console.log({usuario})

        if (!usuario) {
            //console.log('entre a la creacion')
            const data = {
                nombre: name, correo: email, password: ':)', google: true
            }
            //console.log({data})
            usuario = new User(data)
            await usuario.save()
            //console.log({usuario})
        }

        //si el usuario en db estra en estado false, entonces bloquea sign in

        if (!usuario.estado) {
            return res.status(401).json({
                msg: "User Blocked"
            })
        }

        //Generar el jwt

        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(500).json({
            msg: "error on signing with google"
        })
    }
}

const renovarToken = async(req,res = response) => {
    // si estoy aqui es porque en validacion del jwt, se puso como propiedad el usuario validado

    const {usuario } = req

    //generar el jwt
    const token = await generarJWT(usuario.id)

    res.json({
        usuario,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}