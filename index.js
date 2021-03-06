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

        // get all package plans data API
        app.get("/packages", async (req, res) => {
            const cursor = packageCollection.find({}).sort({ "_id": -1 });
            const size = parseInt(req.query.size);
            let result;
            if (size) {
                result = await cursor.limit(size).toArray();
            } else {
                result = await cursor.toArray();
            }
            res.send(result);
        });

        // get single package plan data API
        app.get("/packages/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await packageCollection.findOne(query);
            res.send(result);
        });

        // post single package plan data API
        app.post("/packages", async (req, res) => {
            const doc = req.body;
            const result = await packageCollection.insertOne(doc);
            res.send(result);
        });

        // get tourist data API
        app.get("/tourists", async (req, res) => {
            const emailTourist = req.query.email;

            let result;
            if (emailTourist) {
                const query = { email: emailTourist };
                const cursor = touristCollection.find(query);
                result = await cursor.toArray();
            } else {
                const cursor = touristCollection.find({});
                result = await cursor.toArray();
            }
            res.send(result);
        });

        // post single tourist data API
        app.post("/tourists", async (req, res) => {
            const doc = req.body;
            const result = await touristCollection.insertOne(doc);
            console.log(result);
            res.send(result);
        });

        // update single tourist data API
        app.put("/tourists/:id", async (req, res) => {
            const id = req.params.id;
            const doc = req.body;
            const query = { _id: ObjectId(id) };
            const updateDoc = { $set: doc };
            const options = { upsert: true };
            const result = await touristCollection.updateOne(query, updateDoc, options);
            res.send(result);
        });

        // delete single tourist data API
        app.delete("/tourist/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await touristCollection.deleteOne(query);
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

// project done :)