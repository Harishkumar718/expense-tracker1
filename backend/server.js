const Expense = require('./models/expense');
const User = require('./models/user');

const authMiddleware = require('./middleware/authMiddleware')

const dns = require("node:dns");

dns.setServers(["1.1.1.1"]);

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const app = express();
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('MongoDB connected');
}).catch((error) => {
    console.log('error connecting database',error);
});

app.use(cors());
app.use(express.json());

app.post('/api/auth/login', async (req,res) => {
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if (!user){
            return res.status(401).json({message :'invalid email'});
        }
        const isPasswordCorrect = await bcrypt.compare(
            password,user.password
        );
        if(!isPasswordCorrect){
            return res.status(401).json({message: " incorrect password "});
        }      
        const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{expiresIn: "2d"});
        res.status(200).json({message:"login successful" , token});

    } catch(error){
        res.status(500).json( {message: error.message} );
    } 
}); 

app.post('/api/expenses',authMiddleware, async (req,res) => {
    try{
        const expense = await Expense.create({...req.body , user: req.user.userId});
        res.status(201).json(expense);
    } catch(error){
        res.status(500).json({message: error.message});
    }

});

app.post('/api/auth/register',async (req,res)=>{
    try{
        const {name,email,password} = req.body;

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,email,password:hashedPassword
        });
        
        res.status(201).json({
            message: " user registered successfully",
            user
        });

    } catch (error){
        res.status(409).json({message : "email already registered"});
    }
});

app.get('/',authMiddleware,(req,res) => {
    res.send("this is first api endpoint");
})
app.get('/api/expenses',authMiddleware, async (req,res) => {
    try{
        const expenses = await Expense.find({user: req.user.userId});
        res.status(200).json(expenses);
    } catch(error){
        res.status(500).json({message: error.message});
    }
});

app.delete("/api/expenses/:id", authMiddleware,async (req,res) => {
    try {
        const expense = await Expense.findOneAndDelete({_id : req.params.id, user: req.user.userId});
        if (!expense){
        return res.status(404).json({message:"Expense not found"});
    }
    res.status(200).json({message:"Expense deleted Successfully"});
    } catch (error){
        res.status(500).json({message:error.message});
    }
});

app.put("/api/expenses/:id",authMiddleware, async (req,res) => {
    try {
        const expense = await Expense.findOneAndUpdate({_id: req.params.id,user: req.user.userId},
            req.body,
            {new: true, runValidators : true});

        if (!expense){
        return res.status(404).json({message:"Expense not found"});
    }
    res.status(200).json({message:"Expense updated Successfully"});
    } catch (error){
        res.status(500).json({message:error.message});
    }
});

app.patch("/api/expenses/:id", authMiddleware, async (req,res) => {
    try {
        const expense = await Expense.findOneAndUpdate(
    {
        _id: req.params.id,
        user: req.user.userId
    },
    req.body,
    {
        new: true,
        runValidators: true
    }
);
        if (!expense){
        return res.status(404).json({message:"Expense not found"});
    }
    res.status(200).json(expense);
    } catch (error){
        res.status(500).json({message:error.message});
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
 