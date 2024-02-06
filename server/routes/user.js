const express= require("express");
const z = require("zod");
const jwt =require('jsonwebtoken');
const {JWT_SECRET}= require('../config')
const authMiddleware = require('../middleware')

const {Users,Account} =require("../db")
const validateSignup=z.object({
    username: z.string().email(),
    firstname:z.string(),
    lastname:z.string(),
    password:z.string().min(6),

})
const signin =z.object({
    username: z.string().email(),
    password:z.string()
});
const updateBody=z.object({
    password:z.string().optional(),
    firstname:z.string().optional(),
    lastname:z.string().optional(),
})

const router= express.Router();

router.post("/signup", async function(req,res){
    const {data}= validateSignup.safeParse(req.body);
    if(!data){
        return res.status(400).json({
            msg: 'Incorrect inputs', // Changed status code from 411 to 400
        });
    }
    const  existinguser = await Users.findOne({username: data.username});
     if(existinguser){
        return res.status(409).json({
            msg:'email already exists'
        });
    };
    try{

        const newUser = await Users.create({
            username: data.username,
            firstname:data.firstname,
            lastname:data.lastname,
            password:data.password
        });
        
        const user_id=newUser._id;

        //Account 
        await Account.create({
            userId:user_id,
            balance:1+Math.random()*10000
        });

        console.log(user_id);
        const token=jwt.sign({
            user_id,
            
        },JWT_SECRET)
        res.json({
            msg:'user created successfully',
            token:token
        });
    }
    catch (err){
        console.log(err);
    }

})


router.post('/signin',async function(req,res){
    const {data}= signin.safeParse(req.body);
    if(!data){
        return res.status(411).json({
            msg:"Incorrect input"
        })
    }
    
        const user= await Users.findOne({
            username: req.body.username,
            password:req.body.password
        }) 
        
        
        if(user){

            const token= jwt.sign({
                user_id:user._id,
            },JWT_SECRET);
            res.json({
                msg:"loggedin successfully",
                token:token
            })
            return;
        }
        res.status(411).json({
            message: "Error while logging in"
        })
   
})
router.put("/", async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await Users.updateOne(req.body, {
        _id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await Users.find({
        $or: [{
            firstname: {
                "$regex": filter
            }
        }, {
            lastname: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstname,
            lastName: user.lastname,
            _id: user._id
        }))
    })
})


module.exports=router;