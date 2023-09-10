const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json())
app.use(cors())
const db = require("./models"); 
// routers 
const postRouter = require('./routes/Posts');
app.use('/posts',postRouter)

const commentsRouter = require('./routes/Comments');
app.use('/comments',commentsRouter)

const usersRouter = require('./routes/Users');
app.use('/auth',usersRouter)

const likesRouter = require('./routes/Likes');
app.use('/like',likesRouter)

db.sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3001, () => {
    console.log(`Server started on port ${3001}`);
  });
});