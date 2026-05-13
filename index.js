const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@my-app-database.mqufenv.mongodb.net/?appName=My-app-database`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
  res.send('Smart server is running')
})

async function run() {
  try {
    await client.connect();
    console.log("MongoDB connected!");

    const db = client.db('habit_tracker');
    const habitCollection = db.collection('habits_collection');
    const usersCollection = db.collection('users');

    // Users
    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    })

    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    })

    // Habits
    app.get('/habits_collection', async (req, res) => {
      const sort = req.query.sort;
      const cursor = sort === 'latest'
        ? habitCollection.find().sort({ createAt: -1 })
        : habitCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/habits_collection/:id', async (req, res) => {
      const id = req.params.id;
      const result = await habitCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    })

    app.get('/habit_collection/:email', async (req, res) => {
      const email = req.params.email;
      const result = await habitCollection.find({ creatorEmail: email }).toArray();
      res.send(result);
    })

    app.post('/habits_collection', async (req, res) => {
      const newHabit = req.body;
      const result = await habitCollection.insertOne(newHabit);
      res.send(result);
    })

    app.patch('/habits_collection/complete/:id', async (req, res) => {
      const id = req.params.id;
      const { date } = req.body;
      const result = await habitCollection.updateOne(
        { _id: new ObjectId(id) },
        { $addToSet: { completionHistory: date } }
      );
      res.send(result);
    })

    app.patch('/habits_collection/:id', async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const result = await habitCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      res.send(result);
    })

    app.delete('/habits_collection/:id', async (req, res) => {
      const id = req.params.id;
      const result = await habitCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged successfully!");

  } finally {}
}

run().catch(console.dir)

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})

module.exports = app;