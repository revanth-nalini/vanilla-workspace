const express = require('express');
const app = express();
const port = process.env.PORT;
var cors = require('cors');
const jwt = require("jsonwebtoken");

const mongoose = require('mongoose');
const{Schema} = mongoose;

app.listen(port,()=>{
    console.log(`I am listening on port ${port}`)
})

mongoose.connect('mongodb+srv://revanth:xP77a3S2FMMgtJJ5@cluster0.mvytt.mongodb.net/netflix-api?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const User = mongoose.model('Users',new Schema(
    {
        name : String,
        email : {
            type : String, 
            required : true,
            unique : true
        },
        password : {
            type : String, 
            required : true,
        }
    }
))

const WishListSchema = new Schema(
    {
        user : {
            type : Schema.Types.ObjectId,
            ref : 'Users'
        },
        movieId : Number,
        backdrop_path : String,
        title : String
    }
)

WishListSchema.index({user : 1, movieId : 1},{unique: true})

const WishList = mongoose.model('WishList', WishListSchema)



app.use(cors());
app.use(express.json());
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    next();
})

app.get("/wishlist", authenticateToken, (req,res)=>{
    WishList.find({user : req.user.id} , (error, docs)=>{
        if(error){
            res.status(400).send("error")
        }
        else{
            res.status(200).send({
                status : "success",
                results : docs
            })
        }
    })
})

app.post("/wishlist",authenticateToken, (req,res)=>{
    const wishListItem = new wishListItem({
        user : req.user.id,
        movieId : req.body.movieId,
        backdrop_path : req.body.backdrop_path,
        title : req.body.title
    })

    wishListItem.save((error, wishListItem)=>{
        if(error){
            res.status(400).send({status : "error"})
        } else{
            res.status(200).send({
                wishListItem : wishListItem,
                status: "saved"
            })
        }
    })
})

function authenticateToken(req,res,next){
    const authHeaderToken = req.headers['authorization'];
    if(!authHeaderToken) return res.sendStatus(401);
    jwt.verify(authHeaderToken,"asdasdasd",(error,user)=>{
        if(error) res.sendStatus(403);
        req.user = user;
        next()
    })
}

function generateAccessToken(user){
    const payload = {
        id : user.id,
        name : user.name
    }
    return jwt.sign(payload,"asdasdasd",{expiresIn: '7200s'})
}


app.post('/register', (req,res)=>{
    const user = new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        });

    user.save((error,user)=>{
        if(error)
            res.status(400).send({status : error});
        else
            res.status(200).send({status:"registered"});
    });  
});

app.post('/login',(req,res)=>{
    const password = req.body.password;
    const email = req.body.email;
    User.findOne({
        email:email,
        password:password
    },
    (error,user) =>{
        if(user) {
            const token = generateAccessToken(user);
            res.status(200).send({status:"valid", token:token});
        }
        else
            res.status(404).send({status:"not found"});
    })
});