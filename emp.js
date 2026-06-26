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

app.post('/employe',(req,res)=>{
     employe.insertMany(req.body)
    .then((data)=>{
        console.log(data);
        res.status(200).send(data);
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send(err);
    })
})

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


employe.find()
.then(function(data){
    const pswd = data.map(function(user){
        return bcrypt.hash(user.password,10)
        .then(function(hash){
            user.password = hash;
            return user.save();
        })
    });
return Promise.all(pswd);

})


app.listen(5000,()=>{
    console.log("server running");
})