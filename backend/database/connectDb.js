const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        mongoose.connection.on('connected', ()=> console.log("Database Connected Successfully "))
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "Chat_App"
        });
    } catch (error) {
        console.log(`Database error: ${error}`)
        process.exit(1)
    }
}

module.exports = connectDb