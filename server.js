// comment-service/server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/comment-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Comment = mongoose.model('Comment', new mongoose.Schema({
  discussionId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  text: String,
  createdAt: { type: Date, default: Date.now },
}));

app.post('/comments', async (req, res) => {
  const { discussionId, userId, text } = req.body;
  const comment = new Comment({ discussionId, userId, text });
  await comment.save();
  res.status(201).send(comment);
});

app.put('/comments/:id', async (req, res) => {
  const { text } = req.body;
  const comment = await Comment.findByIdAndUpdate(req.params.id, { text }, { new: true });
  res.send(comment);
});

app.delete('/comments/:id', async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.listen(3003, () => {
  console.log('Comment service running on port 3003');
});
