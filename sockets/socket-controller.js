const { Socket } = require("socket.io")
const { comprobarJWT } = require("../helpers")
const { ChatMensajes } = require("../models")


const chatMensajes = new ChatMensajes() // solo se ejecuta y de ahi en adelante es la misma instancioa
//io todo el servidor de sockets, inclusive la persona quie se acaba de conectar

const socketController = async (socket = new Socket, io) => { // se dispara con el socket
    //console.log('cliente conectado: ' + socket.id)

    //validar persona autenticada

    const userValidado = await comprobarJWT(socket.handshake.headers['x-token'])

    

    if(!userValidado){
        return socket.disconnect()
    }
    
    //Agregar usuario conectado a lista de usuarios activps
    chatMensajes.conectarUsuario(userValidado)

    //emite para todo el mundo la liosta de usuarios activos
    io.emit('usuarios-activos',chatMensajes.usuariosArr)

    //lIMPIAR cUANDO ALGUIEN sE DESCONECTA
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(userValidado.id)
        io.emit('usuarios-activos',chatMensajes.usuariosArr)
    })

   // console.log('Se conecto: ' , userValidado.nombre )
}

module.exports = {
    socketController
}