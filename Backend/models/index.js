const mongoose = require("mongoose");
const uri = "mongodb+srv://sohail2637:uPIQv0P21qRnuslN@labmanual.ay7rb.mongodb.net/?retryWrites=true&w=majority&appName=labmanual"

function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull")
    
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };