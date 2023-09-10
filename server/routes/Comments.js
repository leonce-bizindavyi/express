const express = require("express");
const router = express.Router();
const {comments} = require('../models')
const { valdateToken } = require("../middlewares/AuthMiddleware")
// GET /comments
router.get("/:postId", async (req, res) => {
  // Gestionnaire de routage pour la requête GET /comments
  // Effectuez les opérations appropriées ici
  const postId = req.params.postId
  const comment = await comments.findAll({where:{postId:postId}})
  res.json(comment)
});

// POST /comments
router.post("/", valdateToken, async (req, res) => {
  // Gestionnaire de routage pour la requête POST /comments
  // Effectuez les opérations appropriées ici
  const username = req.user.username
  const comment = req.body
  comment.username = username
  await comments.create(comment)
  res.json(comment)
});

router.delete('/:commentId',valdateToken, async (req,res)=>{
  const commentId = req.params.commentId
  comments.destroy({where:{id:commentId}})
  res.json("DELETED SUCCESSFULLY")
})
module.exports = router;