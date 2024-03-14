import express from "express";
const app = express();
const port = 3000;

app.use("/",(req,res)=>{
    res.json({message:"hello from haruko"});
})
app.listen(3000,()=>{
    console.log(`listen to port ${port}`);
})
