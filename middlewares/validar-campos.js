const { validationResult } = require('express-validator')
const {response, request} = require('express')

const validarCampos = (req = request,res = response, next) => {
    const errors = validationResult(req) // se hace de esta manera porque el middleware de routes almacena los datos y luego los printea
    if(!errors.isEmpty()){
        return res.status(400).json(errors)
    }

    next() // este tercer argumento explica que si no cayo en error arriba pues pase al siguiente middleware
}

module.exports = {
    validarCampos,
}