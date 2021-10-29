const express = require("express");
const cort = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middle weres
app.use(cors());
app.use(express.json());

// default api's 
app.get('/',(req,res)=>{
    res.send('Aventour Database Running Successfully');
});

app.listen(port,()=> {
    console.log('db running on port',port)
})