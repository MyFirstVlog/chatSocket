const path = require('path')
const { v4: uuidv4 } = require('uuid');


const subirArchivo = (files, extensionesValidas = ['jpg', 'jpeg', 'png', 'gif'], carpetaLocal = '') => { // el files --> req.files
    return new Promise((resolve,reject) => {

        const {archivo} = files

        const nombreCortado = archivo.name.split('.')
        const extension = nombreCortado[nombreCortado.length - 1]

        //Validar la extension

        if(!extensionesValidas.includes(extension)){
            return reject('La extension usada no es valida')
        }

        const nombreTemp = uuidv4() + '.' + extension; 
        
        const uploadPath = path.join(__dirname , '../uploads/',carpetaLocal , nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err)
            }

            resolve(nombreTemp)
        });
    })
}

module.exports = {
    subirArchivo
}