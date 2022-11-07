const express = require('express')
const app = express()
var cors = require('cors')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// Use middlewares
app.use(cors())
app.use(express.json())

// User Name: ahmedZubair
// User Password: LtG2il8CrJ9X5GDf


app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = "mongodb+srv://ahmedZubair:LtG2il8CrJ9X5GDf@cluster0.h0tu0yu.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("food-express").collection("users");

        // get user 
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        // Get particular user
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result)
        })

        // post a data
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.send(result)
        })

        // delete user 
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        // Edit user 
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: updateUser
            };

            const result = await userCollection.updateOne(filter, updateDoc, options);

            res.send(result);
        })
    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);


app.listen(port, () => {
    console.log('Crud server is running')
})
