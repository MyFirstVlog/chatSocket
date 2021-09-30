const{Schema, model} = require('mongoose')

const   CategoriaSchema = Schema({
    nombre:{
        type:String,
        required: [true, "El nombre es obligatorio"],
        unique : true
    }, 
    estado : {
        type : Boolean,
        default : true,
        required : true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
})

CategoriaSchema.methods.toJSON = function(){ // debe ser una fn normal, porque usarenmos el this, que solo se enfoca en el scope interno, una funcion de 
    const {__v, estado, _id, ...usuario} = this.toObject() 
    usuario.cid = _id
    return usuario                                //usa el this de afuera
}

module.exports = model("Categoria",CategoriaSchema) 