// follow-service/server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/follow-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Follow = mongoose.model('Follow', new mongoose.Schema({
  followerId: mongoose.Schema.Types.ObjectId,
  followingId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
}));

app.post('/follows', async (req, res) => {
  const { followerId, followingId } = req.body;
  const follow = new Follow({ followerId, followingId });
  await follow.save();
  res.status(201).send(follow);
});

app.delete('/follows/:id', async (req, res) => {
  await Follow.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.listen(3005, () => {
  console.log('Follow service running on port 3005');
});
