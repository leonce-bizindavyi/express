const express = require("express");
const router = express.Router();
exports.router = router;
const {posts,likes} = require('../models')
const {valdateToken} = require('./../middlewares/AuthMiddleware')

// GET /posts
router.get("/", valdateToken, async (req, res) => {
  // Gestionnaire de routage pour la requête GET /posts
  // Effectuez les opérations appropriées ici
  const postsList = await posts.findAll({include:[likes]})
  const likedPosts = await likes.findAll({where: {userId: req.user.id}})
  res.json({postsList: postsList,likedPosts: likedPosts})
});
router.get("/byId/:id", async (req,res)=>{
  const id = req.params.id
  const postsList  = await posts.findByPk(id)
  res.json(postsList)
})

router.get("/byuserId/:id",valdateToken, async (req,res)=>{
  const id = req.params.id
  const postsList  = await posts.findAll({where:{userId:id},include:[likes]})
  const likedPosts = await likes.findAll({where: {userId: req.user.id}})
  res.json({postsList: postsList,likedPosts: likedPosts})
})
// POST /posts
router.post("/",valdateToken, async (req, res) => {
  // Gestionnaire de routage pour la requête POST /posts
  // Effectuez les opérations appropriées ici
  const post = req.body
  post.username = req.user.username
  post.userId = req.user.id
  await posts.create(post)
  res.json(post)
});

router.put("/title",valdateToken, async (req, res) => {
  const {newTitle,id} = req.body
  await posts.update({title:newTitle},{where:{id:id}})
  res.json(newTitle)
});

router.put("/postText",valdateToken, async (req, res) => {
  const {newpostText,id} = req.body
  await posts.update({postText:newpostText},{where:{id:id}})
  res.json(newpostText)
});

router.delete('/:postId', valdateToken, async (req, res) => {
  const postId = req.params.postId;
  posts.destroy({ where: { id: postId } });
  res.json("DELETED SUCCESSFULLY");
});
module.exports = router;