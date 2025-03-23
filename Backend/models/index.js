const mongoose = require("mongoose");
// const uri = "mongodb+srv://sohail2637:uPIQv0P21qRnuslN@labmanual.ay7rb.mongodb.net/?retryWrites=true&w=majority&appName=labmanual"
const uri = "mongodb+srv://aqsashamshad2005:E32TbGFaoa4GfPqO@cluster0.dboel.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull")
    
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };