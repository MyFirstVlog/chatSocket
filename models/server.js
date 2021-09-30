const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')
const fileUpload = require('express-fileupload')
const { socketController } = require('../sockets/socket-controller')
class Server {

    constructor(){
        //initial config of server default parameters
        this.app = express()
        this.port = process.env.PORT
        this.server = require('http').createServer(this.app)
        this.io = require('socket.io')(this.server)

    
        this.path = {
            auth : '/api/auth',
            buscar : '/api/buscar', 
            categorias : '/api/categorias',
            users : '/api/users',
            productos : '/api/productos',
            uploads : '/api/uploads'
        }

        //Conectar a base de datos
        this.dbConnection()
        //Middlewares funcion que siempre se ejecuta cuando levantemos el servidor
        this.middlewares()
        //Rutas de mi app
        this.routes()


        //Sockets

        this.sockets()
    }

    middlewares(){ //Middlewares funcion que siempre se ejecuta cuando levantemos el servidor
        
        //Lectura y parseo del body
        this.app.use(express.json())

        //cors
        this.app.use(cors())
        
        //Directorio publico
        this.app.use(express.static('public'))

        //manejar el file upload

        //el create parent path se encarga de crear la carpeta si en el momento de mv el archivo esta no exista
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true
        }));

    }

    routes(){
        this.app.use(this.path.auth, require('../routes/auth'))
        this.app.use(this.path.buscar, require('../routes/buscar'))
        this.app.use(this.path.categorias, require('../routes/categorias'))
        this.app.use(this.path.productos, require('../routes/productos'))
        this.app.use(this.path.users, require('../routes/user'))
        this.app.use(this.path.uploads, require('../routes/uploads'))
    }

    listen(){
        this.server.listen(this.port, () => { //express no tiene nada de sockets, entonces es importante poner a escuchar al server configurado
            console.log(`App listening at http://localhost:${this.port}`)
          })
    }

    sockets(){
        //config ir a la documentacion del paquete https://socket.io/docs/v4/index.html
        this.io.on("connection", (socket) => socketController(socket, this.io))

    }

    async dbConnection() {
        await dbConnection()
    }
}

module.exports = Server