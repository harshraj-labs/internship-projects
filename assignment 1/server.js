const express = require('express');
const app = express();

app.get('/hello', (req,res) => {
    res.json({message: "Hello World!"});
});

app.get('/bye', (req,res)=>{
    res.json({message: "Bye World!"});
});

app.listen(3000, () =>{
    console.log('Server is running on port 3000');
});