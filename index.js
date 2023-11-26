const express= require('express')
const app=express()
const cors=require('cors')
const port=process.env.PORT||5000
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crat2tn.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const dataCollection=client.db("tourDb").collection("data")
    const categoryCollection=client.db("tourDb").collection("category")

// data collection
app.get("/data",async(req,res)=>{
    const result =await dataCollection.find().toArray()
    res.send(result)
})





// category collection 




app.get("/category",async(req,res)=>{
    const result =await categoryCollection.find().toArray()
    res.send(result)
})



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);














app.get("/",(req,res)=>{
    res.send('Tour is running')
})

app.listen(port,()=>{
    console.log(`Tour is running in port ${port}`)
})