const  mongoose= require("mongoose");
let db =mongoose.connect("mongodb://localhost:27017")
if(db){
    console.log("datatbase connected");
}
const schema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
});
const Users= mongoose.model("Users", schema);
module.exports=Users;