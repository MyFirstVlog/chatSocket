const{Schema, model} = require('mongoose')

const   productoSchema = Schema({
    nombre:{
        type:String,
        required: [true, "El nombre es obligatorio"],
        unique : true
    }, 
    estado : {
        type : Boolean,
        default : true,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    precio :{
        type:Number,
        default:0
    },
    categoria : { 
        type: Schema.Types.ObjectId,
        ref : 'Categoria',
        required : true
    },
    descripcion : {type: String},
    disponible : {type : Boolean , default : true},
    img : {type : String}
})

productoSchema.methods.toJSON = function(){ // debe ser una fn normal, porque usarenmos el this, que solo se enfoca en el scope interno, una funcion de 
    const {__v, estado, _id, ...usuario} = this.toObject() 
    usuario.pid = _id
    return usuario                                //usa el this de afuera
}

module.exports = model("Producto",productoSchema) 