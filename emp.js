const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const SECRET_KEY = 'mysecretkey';

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

const authentication = (req,res,next)=>{
    const token = req.headers.authorization;
    //console.log(token);
    if(!token){
        return res.status(401).send("Token required");
    }
   
    const jwtToken = token.split(" ")[1];

    jwt.verify(jwtToken,SECRET_KEY,(error,decoded)=>{
        if(error){
            return res.status(401).send("ivalid token")
        }
        console.log(decoded);
        req.user = decoded;
        next();  
    });
    

};


app.post('/employe',(req, res) => {
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
                const token = jwt.sign(
                    {
                        email:user.email
                    },
                    SECRET_KEY
                );
                return res.send({
                    message:"Login Successful",
                    token: token
            });
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



app.get('/employe',(req,res)=>{
    employe.find()
    .then((data) => {
    res.status(200).send(data);
    })
})

app.get('/employeauthe',authentication,(req,res)=>{
    employe.find()
    .then((data) => {
    res.status(200).send(data);
    })
    .catch((err) => {
        res.status(500).send(err);
    });
})




app.get("/employehead", (req, res) => {
    console.log(req.headers);//terminal
    res.send("employe");//browser
});

app.get('/employesort',(req,res)=>{
    employe.find()
    .sort({name:1})
    .then((data)=>{
        res.status(200).send(data);
    })
    .catch((error)=>{
        res.status.send(error)
    })
})

app.get('/employes',(req,res)=>{
    employe.find()
    .limit(2)
    .then((data)=>{
    res.status(200).send(data);
    })
    .catch((error)=>{
        res.status(500).send(error)
    })
})





app.put('/employeupdate/:id',(req,res)=>{
    employe.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    .then((data)=>{
        res.status(200).send(data)
    })
    .catch((error)=>{
        res.status(500).send(error)
    })
})

app.patch('/employepatch/:id',(req,res)=>{
    employe.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    .then((data)=>{
        res.status(200).send(data)
    })
    .catch((error)=>{
        res.status(500).send(error)
    })
})


app.delete('/employe/:id', (req, res) => {
    employe.findByIdAndDelete(req.params.id)
    .then((data) => {
    res.send(data);
    })
    .catch((err) => {
    res.status(500).send(err);
    });

});


app.get('/employedep',(req,res)=>{
    employe.find({department:req.query.department})
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        res.send(err)
    })
})


app.get('/employeagg',(req,res)=>{
    employe.aggregate([
        {
            $group:{
                _id:null,
                totalsalary:{
                    $sum:"$salary"
                }
            }
        }
    ])
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        res.send(err)
    })
})



app.listen(8000,()=>{
    console.log("server is running now..")
})