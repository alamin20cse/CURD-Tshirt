const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});
const upload = multer({ storage });

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.uslpn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const tshirtCollection = client.db('tshirtDB').collection('tshirt');

    // Fetch all T-shirts
    app.get('/tshirts', async (req, res) => {
      const cursor = tshirtCollection.find();
      const result = await cursor.toArray();
      res.send(result);




      
    });

    // Add a new T-shirt
    app.post('/tshirts', async (req, res) => {
      const newTshirt = req.body;
      const result = await tshirtCollection.insertOne(newTshirt);
      res.send(result);
    });

    // Delete a T-shirt
    app.delete('/tshirts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tshirtCollection.deleteOne(query);
      res.send(result);
    });

    // Get a single T-shirt for update
    app.get('/tshirts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tshirtCollection.findOne(query);
      res.send(result);
    });

    // Update a T-shirt
    app.put('/tshirts/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatetshirt = req.body;
      const tshirt = {
        $set: {
          brand: updatetshirt.brand,
          size: updatetshirt.size,
          color: updatetshirt.color,
          category: updatetshirt.category,
          photo: updatetshirt.photo,
        },
      };
      const result = await tshirtCollection.updateOne(filter, tshirt, options);
      res.send(result);
    });

    // File upload route
    app.post('/upload', upload.single('image'), (req, res) => {
      if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded' });
      }
      const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
      res.send({ url: fileUrl });
    });

    console.log('Connected to MongoDB!');
  } finally {
    // Ensure proper cleanup
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




