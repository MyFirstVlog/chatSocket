const {Schema, model} = require('mongoose')
const  userSchema = Schema ({
    nombre:{
        type : String,
        required : [true, 'El nombre es obligatorio']
    }, 
    correo:{
        type : String,
        required : [true, 'El corres es obligatorio'],
        unique : true
    },
    password:{
        type : String,
        required : [true, 'La contraseña es obligatorio']
    },
    img: {
        type : String
    },
    role:{
        type : String,
        default: 'USER_ROLE',
        required : true,
        emun : ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado:{
        type : Boolean,
        default : true,
    },
    google:{
        type : Boolean,
        default : false
    }

})
//los metodos aqui pueden servir para sobreescribir metodos por defectos como el findOne, o crear personalizados dependiendo las exigencias

userSchema.methods.toJSON = function(){ // debe ser una fn normal, porque usarenmos el this, que solo se enfoca en el scope interno, una funcion de 
      const {__v, password, _id, ...usuario} = this.toObject() 
      usuario.uid = _id
      return usuario                                //usa el this de afuera
}

module.exports = model('User',userSchema)