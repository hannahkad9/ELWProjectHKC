import express from 'express';
import { usersRouter } from './users/users.routes.js';
import bodyParser from 'body-parser';
import mongoose, { mongo } from 'mongoose';
import cors from 'cors';
import { createUser } from './users/users.controllers.js';

const app = express();
const port = 3000;

app.use(cors()); 
app.use(bodyParser.json()); 

await mongoose.connect('mongodb://localhost:27017/myapp');

let users = [];

app.use('/users', usersRouter);

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  createUser(email);
  

  return res.status(201).json({ message: 'User created successfully' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
