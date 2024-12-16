
import {userModel} from './users.model.js';

export async function handleGetUsers(req, res) {
 const users = await userModel.find({});
  res.json(users);
}

export async function handleGetUserById(req, res) {
    const id = req.params.id;
    const foundUser = await userModel.findById(id);
    res.json(foundUser);
}

export async function createUser(req, res) {
  const existingUser = await userModel.findOne({email:req.body.email});
  if(existingUser) {
      res.status(400).json({
          message: 'User with this email already exists'
      });
    }
    const newUser = new userModel(req.body);
    newUser.secret= Math.random().toString(36).substring(7);
    await newUser.save();
    res.json(newUser);
}