// like-service/server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/like-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Like = mongoose.model('Like', new mongoose.Schema({
  discussionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion', nullable: true },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', nullable: true },
  userId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
}));

app.post('/likes', async (req, res) => {
  const { discussionId, commentId, userId } = req.body;
  const like = new Like({ discussionId, commentId, userId });
  await like.save();
  res.status(201).send(like);
});

app.delete('/likes/:id', async (req, res) => {
  await Like.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.listen(3004, () => {
  console.log('Like service running on port 3004');
});
