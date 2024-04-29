const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

// middleWare
app.use(cors())

app.use(express.json())
 




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqcbidk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

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
    // await client.connect();
    const touristCollection = client.db('touristSpotDB').collection('touristSpot')

    app.get('/addTouristsSports', async(req,res)=>{
      const cursor = touristCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/allTouristsSports', async(req,res)=>{
      const cursor = touristCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/addTouristsSports/:_id',async (req,res)=>{
      const id = req.params._id
      const query = {_id : new ObjectId(id)}
      const result = await touristCollection.findOne(query)
      res.send(result)
    })
    app.get('/mylist/:email', async (req, res)=>{
   
      const result = await touristCollection.find({email:req.params.email}).toArray()
      res.send(result)
    })

    app.post('/addTouristsSports',async(req,res)=>{
      const newSpots = req.body;
      console.log(newSpots)
      const result = await touristCollection.insertOne(newSpots)
      res.send(result)
    })

    app.delete('/mylist/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await touristCollection.deleteOne(query);
      res.send(result)
    })
    app.put('/mylist/:id' ,async (req, res)=>{
      const id = req.params.id;
      const tourist =req.body;
      console.log("update tourist", tourist,"id:",id)
      const filter = {_id: new ObjectId(id)};
      const options = {upsert:true};
      const updateTourist = {
    
        // const updatedTouristField = {name,country,image,spotName,visitor, travelTime,seasonality,averageCost,description,location}dffdsfdsfdsf
        $set: {
          name: tourist.name,
          country: tourist.country,
          image: tourist.image,
          spotName: tourist.spotName,
          visitor: tourist.visitor,
          travelTime: tourist.travelTime,
          seasonality: tourist.seasonality,
          averageCost: tourist.averageCost,
          description: tourist.description,
          location: tourist.location
        }
      }
      const result = await touristCollection.updateOne(filter,updateTourist, options)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);












app.get('/', (req,res)=>{
    res.send('tourism management server is runnign')
})
app.listen(port, ()=>{
    console.log('this server runnig port is ', port)
})