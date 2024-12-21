const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;



// middleWare
app.use(cors());
app.use(express.json());






// 
// 







const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.uslpn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
console.log();
console.log();

    const tshirtCollection=client.db('tshirtDB').collection('tshirt');

    app.get('/tshirts',async(req,res)=>{
        const cursor=tshirtCollection.find();
        const result=await cursor.toArray();
        res.send(result);
    })


    app.post('/tshirts',async(req,res)=>{
        const newTshirt=req.body;
        console.log(newTshirt);

        const result=await tshirtCollection.insertOne(newTshirt);
        res.send(result);

    })

    app.delete('/tshirts/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)}
        const result= await tshirtCollection.deleteOne(query);
        res.send(result);
    })


    // for update
    app.get('/tshirts/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)}
        const result=await tshirtCollection.findOne(query)
        res.send(result);
    })


    app.put('/tshirts/:id',async(req,res)=>{
        const id=req.params.id;
        const filter={_id:new ObjectId(id)}
        const options={ upsert:true };
        const updatetshirt=req.body;
        const tshirt={
            $set:{
                brand:updatetshirt.brand,
                size:updatetshirt.size, 
                color:updatetshirt.color, 
                category:updatetshirt.category, 
                photo:updatetshirt.photo, 
            }
        }
        const result=tshirtCollection.updateOne(filter,tshirt,options)
        res.send(result);
    })


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);








// Fix the route handler
app.get('/', (req, res) => {
    res.send('running');
});

app.listen(port, () => {
    console.log(`running on port ${port}`);
});
