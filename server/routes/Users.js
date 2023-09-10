const express = require("express");
const router = express.Router();
const {users} = require('../models')
const bcrypt = require('bcryptjs') 
const {sign} = require('jsonwebtoken')
const {valdateToken} = require('./../middlewares/AuthMiddleware')

// GET /users
router.post("/login", async (req, res) => {
  // Gestionnaire de routage pour la requête GET /users
  // Effectuez les opérations appropriées ici
  const {username,password} = req.body
  const user = await users.findOne({where:{username:username}})
  if(!user) res.json({error: "User Doesn't Exist"})
  
    bcrypt.compare(password,user.password).then((match)=>{
      if(!match) res.json({error:"Wrong username and passward combinaition"})
      
      const accessToken = sign({username: user.username,id:user.id},"importantsecret")
      res.json({token:accessToken,username: username,id: user.id})
    })
});

// POST /comments
router.post("/", async (req, res) => {
  // Gestionnaire de routage pour la requête POST /comments
  // Effectuez les opérations appropriées ici
  const {username,password} = req.body
  bcrypt.hash(password,10).then((hash)=>{
    users.create({
        username:username,
        password: hash
    })
    res.json("Success !")
  })
});

router.get("/auth",valdateToken,(req,res)=>{
  res.json(req.user)
})

router.put("/changepass",valdateToken,async (req,res)=>{
  const {oldpassword,newpassword} = req.body
  const user = await users.findOne({where:{username:req.user.username}})
  bcrypt.compare(oldpassword,user.password).then((match)=>{
    if(!match) res.json({error:"Wrong  passward Entered !"})
    bcrypt.hash(newpassword,10).then(async (hash)=>{
      await users.update({password:hash},{where:{username :req.user.username}})
      res.json('Success !!')
    })
  })
})

router.get('/basicinfo/:id', async (req,res)=>{
  const id = req.params.id
  const basicinfo = await users.findByPk(id,{
    attributes: {exclude:['password']}
  })
  res.json(basicinfo)
})

module.exports = router;