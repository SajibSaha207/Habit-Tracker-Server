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
const productCollection = db.collection('habits_collection');
const usersCollection = db.collection('users');





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