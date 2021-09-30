let url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://rest-server-aem.herokuapp.com/api/auth/'


let usuario = null
let socket = null

const textUid = document.querySelector('#textUid')
const textMsg = document.querySelector('#textMsg')
const ulUsuarios = document.querySelector('#ulUsuarios')
const ulMensajes = document.querySelector('#ulMensajes')
const btnSalir = document.querySelector('#btnSalir')


const validarJWT = async () => {

    const token = localStorage.getItem('token') || ''

    if (token.length <= 10) {
        window.location = 'index.html' // redireccion
        throw new Error('No hay token en el servidor ')
    }

    const res = await fetch(url, {
        headers: { 'x-token': token }
    })
    const { usuario: userDB, token: tokenDB } = await res.json() // renombro las variables con ese :
    //renovamos la vida del jwt

    localStorage.setItem('token', tokenDB)
    usuario = userDB
    document.title = usuario.nombre

    await conectarSocket()

}

const conectarSocket = () => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    }) // envio el jwt al server para poder verificar ya futuro habilitar el chat

    socket.on('connect', ()=>{
        console.log('Sockets Online')
    })

    socket.on('disconnect', ()=>{
        console.log('Sockets OffLine')
    })

    //lo que emiteremos al servidor

    socket.on('recibir-mensajes', (payload) => {
       dibujarMensajes(payload)
    })
    socket.on('usuarios-activos', (payload) => {
        dibujarUsers(payload)
    })
    socket.on('mensaje-privado', (payload) => {
        console.log('privado: ', payload) 
    })
 
}

const dibujarUsers = (usuarios = [])=> {
    let html = ''
    usuarios.forEach(({nombre,uid}) => {
        html += `
            <li>
                <p>
                    <h5 class="text-success">${nombre}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                    </h5>
                </p>
            </li>
        `
    })
    ulUsuarios.innerHTML = html
}

textMsg.addEventListener('keyup', ({keyCode}) => {
    
    const mensaje = textMsg.value
    const uid = textUid.value
    if(keyCode !== 13){return}
    if(mensaje.length === 0 ) { return}

    socket.emit('enviar-mensaje', {mensaje, uid})

    textMsg.value = ' '
})

const dibujarMensajes = (mensajes = [])=> {
    let html = ''
    mensajes.forEach(({mensaje,nombre}) => {
        html += `
            <li>
                <p>
                    <span class="text-primary">${nombre}</span>
                    <span>${mensaje}</span>
                    </h5>
                </p>
            </li>
        `
    })
    ulMensajes.innerHTML = html
}

const main = async () => {


    await validarJWT()
}


main()
//const socket = io() // cliente es el que esta escuchando o emitiendo

