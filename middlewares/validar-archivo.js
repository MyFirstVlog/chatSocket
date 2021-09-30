const { response } = require("express");


const existeArchivo = (req,res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json('No hay archivos que subir');
        
    }
    next()
}

module.exports = {
    existeArchivo
}