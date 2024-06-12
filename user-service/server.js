// user-service/server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/user-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  mobileNo: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
}));

app.post('/users', async (req, res) => {
  const { name, mobileNo, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, mobileNo, email, password: hashedPassword });
  await user.save();
  res.status(201).send(user);
});

app.put('/users/:id', async (req, res) => {
  const { name, mobileNo, email } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { name, mobileNo, email }, { new: true });
  res.send(user);
});

app.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.get('/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

app.get('/users/search', async (req, res) => {
  const users = await User.find({ name: new RegExp(req.query.name, 'i') });
  res.send(users);
});

app.listen(3001, () => {
  console.log('User service running on port 3001');
});
