const { response } = require("express")
const {Categoria } = require("../models")


const existeCategoria = async( id = '') => {
    console.log('esta es la id que llega', id)
    const usuario = await Categoria.findById(id)

    if(!usuario){
        throw new Error('La categoria que trata de buscar no esta en la dB')
    }
}


module.exports =  {
    existeCategoria
}