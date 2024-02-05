const express= require("express");
const z = require("zod");
const jwt =require('jsonwebtoken');
const {JWT_SECRET}= require('../config')
const authMiddleware = require('../middleware')

const Users= require("../db")
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
    try {
        const filter = req.query.filter || '';

        // Using case-insensitive comparison for search
        const users = await Users.find({
            $or: [
                { firstName: { $regex: new RegExp(filter, 'i') } },
                { lastName: { $regex: new RegExp(filter, 'i') } }
            ]
        });

        console.log("Users:", users); // Log the users array

        // Check if users array is empty
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        // Send response
        res.json({
            users: users.map(user => ({
                username: user.username,
                firstName: user.firstname,
                lastName: user.lastname,
                _id: user._id
            }))
        });
    } catch (error) {
        console.error(error); // Log any errors that occur
        res.status(500).json({ error: 'Internal server error' }); // Respond with an error status
    }
});



module.exports=router;