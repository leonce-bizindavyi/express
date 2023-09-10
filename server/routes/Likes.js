const express = require("express");
const router = express.Router();
const {likes} = require('../models')
const {valdateToken} = require('./../middlewares/AuthMiddleware')

router.post('/', valdateToken, async (req,res)=>{
    const {postId} = req.body
    const userId = req.user.id
    const found = await likes.findOne({where:{postId:postId,userId:userId}})
    if(!found){
        await likes.create({postId:postId,userId:userId})
        res.json({liked:true})
    }else{
        await likes.destroy({where:{postId:postId,userId:userId}})
        res.json({liked:false})
    }
})

module.exports = router;