// discussion-service/server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/discussion-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Discussion = mongoose.model('Discussion', new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  text: String,
  image: String,
  hashtags: [String],
  createdAt: { type: Date, default: Date.now },
}));

app.post('/discussions', async (req, res) => {
  const { userId, text, image, hashtags } = req.body;
  const discussion = new Discussion({ userId, text, image, hashtags });
  await discussion.save();
  res.status(201).send(discussion);
});

app.put('/discussions/:id', async (req, res) => {
  const { text, image, hashtags } = req.body;
  const discussion = await Discussion.findByIdAndUpdate(req.params.id, { text, image, hashtags }, { new: true });
  res.send(discussion);
});

app.delete('/discussions/:id', async (req, res) => {
  await Discussion.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.get('/discussions/tags', async (req, res) => {
  const discussions = await Discussion.find({ hashtags: req.query.tag });
  res.send(discussions);
});

app.get('/discussions/search', async (req, res) => {
  const discussions = await Discussion.find({ text: new RegExp(req.query.text, 'i') });
  res.send(discussions);
});

app.listen(3002, () => {
  console.log('Discussion service running on port 3002');
});
