const express= require('express')
const app=express()
const cors=require('cors')
const port=process.env.PORT||5000
require('dotenv').config()
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
    const guideCollection=client.db("tourDb").collection("guide")
    const wishlistCollection =client.db("tourDb").collection("wishlist")
    const bookingCollection =client.db("tourDb").collection("bookings")
   const userCollection=client.db("tourDb").collection("users")
   const storyCollection=client.db("tourDb").collection("story")

 // jwt related api
 app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
  res.send({ token });
});

// middleware for jwt 
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send({ message: "Forbidden Access" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Forbidden Access" });
    req.decoded = decoded;
    next();
  });
};



// middle ware verify admin 
const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };
  const user = await userCollection.findOne(query);
  const isAdmin = user?.role === 'admin';
  if (!isAdmin) {
    return res.status(403).send({ message: 'forbidden access' });
  }
  next();
}

// middle ware verify guide 

const verifyGuide = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };
  const user = await userCollection.findOne(query);
  const isGuide = user?.role === 'guide';
  if (!isGuide) {
    return res.status(403).send({ message: 'forbidden access' });
  }
  next();
}



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


// guide collection
app.get("/guide",async(req,res)=>{
    const result =await guideCollection.find().toArray()
    res.send(result)
})


// users api
app.get("/users",verifyToken, async(req,res)=>{
  const result=await userCollection.find().toArray()
  res.send(result)
})

app.post("/users",async(req,res)=>{
  const user=req.body 
const query={email:user.email}
const existingUser=await userCollection.findOne(query)
if (existingUser){
  return res.send({message:"user already exist",insertedId:null})
}
 
  const result=await userCollection.insertOne(user)
  res.send(result)
})

// make admin api 
 app.patch('/users/admin/:id',async(req,res)=>{
  const id=req.params.id 
  const filter ={_id: new ObjectId(id)}
  const updatedDoc={
    $set:{
      role:"admin"
    }
  }
  const result =await userCollection.updateOne(filter,updatedDoc)
  res.send(result)
 })


// admmin api 
app.get("/users/admin/:email",verifyToken,async(req,res)=>{
  const email=req.params.email
  if(email !==req.decoded.email){
    return res.status(403).send({message:"unathorize access"})
  }
  const query={email:email}
  const user=await userCollection.findOne(query)
  let admin=false 
  if(user){
    admin=user?.role == "admin"
  }
  res.send({admin})
  })
  





// make guide api
 app.patch('/users/guide/:id',async(req,res)=>{
  const id=req.params.id 
  const filter ={_id: new ObjectId(id)}
  const updatedDoc={
    $set:{
      role:"guide"
    }
  }
  const result =await userCollection.updateOne(filter,updatedDoc)
  res.send(result)
 })

// guide api 
app.get("/users/guide/:email",verifyToken,async(req,res)=>{
  const email=req.params.email
  if(email !==req.decoded.email){
    return res.status(403).send({message:"unathorize access"})
  }
  const query={email:email}
  const user=await userCollection.findOne(query)
  let guide=false 
  if(user){
    guide=user?.role == "guide"
  }
  res.send({guide})
  })
  








// wishlist collection
app.post("/wishlist",async(req,res)=>{
  const cart =req.body
  const result=await wishlistCollection.insertOne(cart)
  res.send(result)
})
app.get("/wishlist",async(req,res)=>{
  const email=req.query.email
  const query={email: email}
  const result=await wishlistCollection.find(query).toArray()
  res.send(result)
})

app.delete("/wishlist/:id",async(req,res)=>{
  const id=req.params.id
  const query={_id: new ObjectId(id)}
  const result=await wishlistCollection.deleteOne(query)
  res.send(result)
})


// bookings collection
app.post("/bookings",async(req,res)=>{
  const booking=req.body
  const result=await bookingCollection.insertOne(booking)
  res.send(result)
})


app.get("/bookings",async(req,res)=>{
  const email=req.query.email
  const query={email: email}
  const result=await bookingCollection.find(query).toArray()
  res.send(result)
})

// bookings for guide 
app.get("/guidebookings",async(req,res)=>{
  const result=await bookingCollection.find().toArray()
  res.send(result)
})


// handle accept api 
app.patch('/guidebookings/accept/:id',async(req,res)=>{
  const id=req.params.id 
  const filter ={_id: new ObjectId(id)}
  const updatedDoc={
    $set:{
      status:"Accepted"
    }
  }
  const result =await bookingCollection.updateOne(filter,updatedDoc)
  res.send(result)
 })

// handle reject api 
app.patch('/guidebookings/reject/:id',async(req,res)=>{
  const id=req.params.id 
  const filter ={_id: new ObjectId(id)}
  const updatedDoc={
    $set:{
      status:"Rejected"
    }
  }
  const result =await bookingCollection.updateOne(filter,updatedDoc)
  res.send(result)
 })
// cancel api 
 app.delete("/guidebookings/:id",async(req,res)=>{
  const id=req.params.id
  const query={_id: new ObjectId(id)}
  const result=await bookingCollection.deleteOne(query)
  res.send(result)
})




// tourist story section 
app.get("/story",async(req,res)=>{
  const result=await storyCollection.find().toArray()
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