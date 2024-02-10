const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  const allUsers = await prisma.user.findMany();
  res.json(allUsers);
});

// get house
app.get("/gethouse", async (req, res) => {
  const house = await prisma.house.findMany({
    include: {
      owner: true,
      builtBy: true,
    },
  });
  res.json(house);
});

// get specific house
app.get("/gethouse/:id", async (req, res) => {
  const id = req.params.id;
  const house = await prisma.house.findUnique({
    where: {
      id,
    },
    include: {
      owner: true,
      builtBy: true,
    },
  });
  res.json(house);
});

app.post("/new", async (req, res) => {
  const newUser = await prisma.user.create({ data: req.body });
  res.json(newUser);
});

// adding house
app.post("/house", async (req, res) => {
  const newHouse = await prisma.house.create({ data: req.body });
  res.json(newHouse);
});
// many house
app.post("/house/many", async (req, res) => {
  const newHouse = await prisma.house.createMany({ data: req.body });
  res.json(newHouse);
});

app.put("/:id", async (req, res) => {
  const id = req.params.id;
  const newAge = req.body.age;

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { age: newAge },
  });
  res.json(updatedUser);
});

app.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const deletedUser = await prisma.user.delete({
    where: { id: id },
  });
  res.json(deletedUser);
});

// filter

app.get("/house/withFilters", async (req, res) => {
  const filteredHouses = await prisma.house.findMany({
    where: {
      owner: {
        age: {
          gte: 22,
        },
      },
    },
    orderBy: [
      {
        owner: {
          firstName: "desc",
        },
      },
    ],
    include: {
      owner: true,
      builtBy: true,
    },
  });
  res.json(filteredHouses);
});

app.listen(process.env.PORT, () => {
  console.log("server is listening");
});
