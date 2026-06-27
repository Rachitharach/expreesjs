const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const app=express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/empinfo")
.then(()=>{
    console.log("Mongodb connected")
})
.catch(()=>{
    console.log("Not connected")
})

const empSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:Number,
    email:String,
    password:String,
    department:String,
    salary:Number
});
const employe = mongoose.model("Employe",empSchema);
employe.find()

// const userSchema = new mongoose.Schema({
//     username:String,
//     email:String,
//     password:String
// });
// const user = mongoose.model("user",userSchema);



app.post('/employe', (req, res) => {

    bcrypt.hash(req.body.password, 10)
    .then((hash) => {

        req.body.password = hash;

        employe.insertMany(req.body)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send(err);
        });

    })
    .catch((err) => {
        res.status(500).send(err);
    });

});

app.get('/employe',(req,res)=>{
    employe.find()
    .then((data) => {
    res.status(200).send(data);
    })
    .catch((err) => {
        res.status(500).send(err);
    });
})

app.delete('/employe', (req, res) => {
    employe.deleteOne({
        _id: "6a3e5fb23ab4690823ba42fe"
    })
    .then((data) => {
    res.send(data);
    })
    .catch((err) => {
    res.status(500).send(err);
    });

});



app.post('/login',(req,res)=>{
    
    employe.findOne({
        email:req.body.email
    })
    .then((user)=>{
        if(!user){
            return res.send("User Not Found");
        }
        
        bcrypt.compare(req.body.password,user.password)
        .then((result)=>{
            if(result){
                return res.send("Login Successful");
            }else{
                return res.send("Invalid Password");
            }
        })
        .catch((error)=>{
            console.log(error)
        })
        
    })
    .catch((error)=>{
        res.status(500).send(error)
    })
})

app.listen(5000,()=>{
    console.log("server running");
})