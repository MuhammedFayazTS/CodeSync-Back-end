const express = require('express');
const router = express.Router()

router.get('/',(req,res)=>{
    console.log("req",req.user)
    if(req.user){
        res.status(200).json({message:"User login Successfull",user:req.user})
    }else{
        res.status(401).json({message:"Not Authorized"})
    }

})


module.exports = router