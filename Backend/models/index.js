const mongoose = require("mongoose");
// const uri = "mongodb+srv://sohail2637:uPIQv0P21qRnuslN@labmanual.ay7rb.mongodb.net/?retryWrites=true&w=majority&appName=labmanual"
// const uri = "mongodb+srv://aqsashamshad2005:E32TbGFaoa4GfPqO@cluster0.dboel.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const uri = "mongodb+srv://aqsashamshad2005_db_user:g9IhN1VQ2Vvc4sbL@cluster0.0bmqna0.mongodb.net/?appName=Cluster0"
// const uri = "mongodb+srv://sohail25816_db_user:3AF0NqGSkQVbFvZo@cluster0.gszw7xg.mongodb.net/"
// const uri = "mongodb+srv://khalidbaig3294:LglmuXkHsrrBZseK@cluster0.xfscky1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// UserName: sohail25816_db_user
// Password: 3AF0NqGSkQVbFvZo
// mongodb+srv://sohail25816_db_user:<db_password>@cluster0.gszw7xg.mongodb.net/?appName=Cluster0

function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull")

    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };