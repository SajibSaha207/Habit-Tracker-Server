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

let client;
let habitCollection;
let usersCollection;

async function connectDB() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }

  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
    const db = client.db('habit_tracker');
    habitCollection = db.collection('habits_collection');
    usersCollection = db.collection('users');
    console.log("MongoDB connected!");
  }
}

app.get('/', async (req, res) => {
  res.send('Smart server is running')
})

app.get('/users', async (req, res) => {
  await connectDB();
  const result = await usersCollection.find().toArray();
  res.send(result);
})

app.post('/users', async (req, res) => {
  await connectDB();
  const result = await usersCollection.insertOne(req.body);
  res.send(result);
})

app.get('/habits_collection', async (req, res) => {
  await connectDB();
  const sort = req.query.sort;
  const cursor = sort === 'latest'
    ? habitCollection.find().sort({ createdAt: -1 })
    : habitCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

app.get('/habits_collection/:id', async (req, res) => {
  await connectDB();
  const result = await habitCollection.findOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
})

app.get('/habit_collection/:email', async (req, res) => {
  await connectDB();
  const result = await habitCollection.find({ creatorEmail: req.params.email }).toArray();
  res.send(result);
})

app.post('/habits_collection', async (req, res) => {
  await connectDB();
  const result = await habitCollection.insertOne(req.body);
  res.send(result);
})

app.patch('/habits_collection/complete/:id', async (req, res) => {
  await connectDB();
  const { date } = req.body;
  const result = await habitCollection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $addToSet: { completionHistory: date } }
  );
  res.send(result);
})

app.patch('/habits_collection/:id', async (req, res) => {
  await connectDB();
  const result = await habitCollection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.send(result);
})

app.delete('/habits_collection/:id', async (req, res) => {
  await connectDB();
  const result = await habitCollection.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(result);
})

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})

module.exports = app;