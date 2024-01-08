const mongoose = require("mongoose");
require("dotenv").config();

const dbConnection = async() => {
    try {
        /*       // Deletes the entire 'mydb' database
              const conn = mongoose.createConnection(process.env.MONGODB_CNN);
              await conn.dropDatabase();
              console.log("Base de datos eliminada", process.env.MONGODB_CNN); */
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log("Base de datos online", process.env.MONGODB_CNN);
    } catch (error) {
        console.log(error);
        throw new Error("No se pudo conectar a la base de datos");
    }
};

module.exports = {
    dbConnection
};