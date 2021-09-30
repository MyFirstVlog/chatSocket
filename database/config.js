const mongoose = require('mongoose')
require('colors')
const dbConnection = async()=>{ // es una fn asincrona
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("DataBase is online".bgYellow)
    } catch (error) {
        console.log(error)
        throw new Error('Error deploying database')
    }

}

module.exports = {
    dbConnection,
}