const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//middle weres
app.use(cors());
app.use(express.json());

//driver code
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y4qnm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("aventoura");
    const packageCollection = database.collection("tourPlans");
    const touristCollection = database.collection("tourists");

    // get all data API
    app.get("/plans", async (req, res) => {
      const cursor = packageCollection.find({});
      const size = parseInt(req.query.size);
      let result;
      if (size) {
        result = await cursor.limit(size).toArray();
      } else {
        result = await cursor.toArray();
      }
      res.send(result);
    });

    // get single data API
    app.get("/plans/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await packageCollection.findOne(query);
      res.send(result);
    });

    // post single data API
    app.post("/tourists", async (req, res) => {
      const doc = req.body;
      const result = await touristCollection.insertOne(doc);
      console.log(result);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// default API's
app.get("/", (req, res) => {
  res.send("Aventour Database Running Successfully");
});

app.listen(port, () => {
  console.log("db running on port", port);
});
