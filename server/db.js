const  mongoose= require("mongoose");
let db =mongoose.connect("mongodb://localhost:27017/PayTm-app")

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

const  accountSchema = new mongoose.schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true,
    },
    balance:{
        type:Number,
        required:true,
    }
})
const Users= mongoose.model("Users", schema);
const Account = mongoose.model("Account ", accountSchema);
module.exports={Users,Account};