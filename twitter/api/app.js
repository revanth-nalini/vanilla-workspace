const Twitter = require('./api/helpers/twitter');
const twitter = new Twitter();
const express = require('express');
const app = express();
require('dotenv').config()
const port = process.env.PORT;

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    next();   
})

app.listen(port,()=>console.log(`Twitter API listening on port ${port}!`));

app.get('/',(req,res)=>res.send('Twitter Ready'));

app.get('/tweets',(req,res)=>{
    const q = req.query.q;
    const count = req.query.count;
    const maxId = req.query.max_id;
    twitter.get(q,count,maxId)
    .then((response)=>{
        res.status(200).send(response.data);
    }).catch((error)=>{
        res.status(400).send(error);
    })
})
