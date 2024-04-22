const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.mqe77mp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db('CoffeeDB');
    const coffeecollection = database.collection('coffeeAdd');

    app.get('/coffees', async (req, res) => {
      const coffe = coffeecollection.find();
      const result = await coffe.toArray();
      res.send(result);
    });

    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const quntry = { _id: new ObjectId(id) };
      const result = await coffeecollection.findOne(quntry);
      res.send(result);
    });

    app.post('/coffees', async (req, res) => {
      const coffee = req.body;
      const result = await coffeecollection.insertOne(coffee);
      res.send(result);
    });

    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updeate = req.body;
      const coff = {
        $set: {
          name: updeate.name,
          chef: updeate.chef,
          details: updeate.details,
          supplier: updeate.supplier,
          taste: updeate.taste,
          photo: updeate.photo,
          category: updeate.category,
        },
      };
      const result = await coffeecollection.updateOne(filter, coff, options);
      res.send(result);
    });

    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const qunty = { _id: new ObjectId(id) };
      const result = await coffeecollection.deleteOne(qunty);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('this is coffe server site ');
});

app.listen(port, () => {
  console.log(`this is server site is :${port}`);
});
