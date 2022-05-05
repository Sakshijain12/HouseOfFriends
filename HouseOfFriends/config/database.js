const mongoose = require("mongoose")

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopolgy: true,
    }).then((data) => {
        console.log(`mongodb connected with server:,${data.connection.host}`)
    }).catch((err) => {
        console.log(err)
    })
    
}

module.exports = connectDatabase