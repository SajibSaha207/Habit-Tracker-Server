const express = require('express')
const cors = require('cors');
// require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;



app.use(cors());
app.use(express.json())

//
//


const uri = "mongodb+srv://habit_tracker:Tq1p9uRVOF09bAH3@my-app-database.mqufenv.mongodb.net/?appName=My-app-database";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res)=>{
    res.send('Smart server is running')
})

async function run(){
    try{
await client.connect();

const db = client.db('habit_tracker');
const habitCollection = db.collection('habits_collection');
const usersCollection = db.collection('users');


app.get('/users', async(req, res)=>{
    const cursor = usersCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})



app.post('/users', async(req, res)=>{
    const newUser = req.body;
    console.log('user info', newUser)
    const result = await usersCollection.insertOne(newUser);
    console.log(result);
    res.send(result);

})

//HABIT RELATED API POST

app.patch('/habits_collection/:id', async(req, res)=>{
    const id = req.params.id;
    const updateData = req.body;
    const result = await habitCollection.updateOne({_id: new ObjectId(id)}, { $set: updateData});
    res.send(result);
});

app.get('/habits_collection/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id) };
    const result = await habitCollection.findOne(query);
    res.send(result);
})


app.get('/habits_collection', async(req, res)=>{
    const cursor = habitCollection.find().sort({ createAt: -1 })
    const result = await cursor.toArray();
    res.send(result)
})


app.get('/habit_collection/:email', async(req, res)=>{
    const email = req.params.email;
    const result = await habitCollection.find({ creatorEmail: email}).toArray();
    res.send(result)
})


app.post('/habits_collection', async(req, res)=>{
    const newHabit = req.body;
    console.log('habit info', newHabit)
    const result = await habitCollection.insertOne(newHabit);
    console.log(result)
    res.send(result)
})


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally{

    }

}

run().catch(console.dir)


app.listen(port, ()=>{
    console.log(`Smart server is running on port: ${port}`)
})