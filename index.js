const express = require("express");
const shortid = require("shortid");
const cors = require("cors");
const server = express();

let users = [];

server.use(express.json()); //this tells the server how to read json
server.use(cors());

server.get("/", (req, res) => {
  res.status(200).json({ api: "running..." });
});

server.post("/api/users", (req, res) => {
  const userInfo = req.body;
  if (!userInfo.name || !userInfo.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else if (userInfo.name && userInfo.bio) {
    userInfo.id = shortid.generate();
    users.push(userInfo);
    res.status(201).json(userInfo);
  } else {
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database"
    });
  }
});

server.get("/api/users", (req, res) => {
  if (!users) {
    res
      .status(500)
      .json({ errorMessage: "The users information could not be retrieved." });
  } else {
    res.status(200).json(users);
  }
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.filter(user => id === user.id);

  if (user.length <= 0) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else if (user.length > 0) {
    res.status(200).json(user);
  } else {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be retrieved." });
  }
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.filter(user => id === user.id);
  if (user.length <= 0) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else if (user.length > 0) {
    res.status(200).json({ message: "User deleted." });
    let newUsers = users.filter(user => id !== user.id);
    users = newUsers;
  } else {
    res.status(500).json({ errorMessage: "The user could not be removed" });
  }
});

//THIS DOESNT WORK.... YET
server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const userData = req.body;
  const user = users.filter(user => id === user.id);

  if (user.length <= 0) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else if (user.length > 0) {
    if (!userData.name || !userData.bio) {
      res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });
    } else if (userData.name && userData.bio) {
      users = users.map(user => {
        if (`${user.id}` === id) {
          userData.id = id;
          return userData;
        }
        return user;
      });
      res.status(200).json(userData);
    }
  } else {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be modified." });
  }
});

const PORT = 5000;
server.listen(PORT, () =>
  console.log(`\n ** API running on http://localhost:${PORT} ** \n`)
);
//to run the server use "node index.js"
//to run the nodemon use "npm start"
