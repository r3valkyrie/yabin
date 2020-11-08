import dotenv from 'dotenv';
import {MongoClient, ObjectID} from 'mongodb';

dotenv.config()


interface YabinPaste {
    content: string
    encrypted: boolean
}

const {
    MONGODB_URI,
    MONGODB_DB,
    MONGODB_COLLECTION,
} = process.env

const clientOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
}


export const mdb_put = async function (paste: YabinPaste) {
    return new Promise(async (resolve, reject) => {
        const client = new MongoClient(MONGODB_URI, clientOpts)
        await client.connect();

        const database = client.db(MONGODB_DB);
        const collection = database.collection(MONGODB_COLLECTION);

        await collection.insertOne(paste, async (err, res) => {
            if (err) reject(err);
            await resolve(res)
            await client.close()
        })
    })
}

export const mdb_find = async function (id: string) {
    return new Promise(async (resolve, reject) => {
        if (id.length !== 24){
            resolve({content: 'That paste could not be found.'})
        }
        const client = new MongoClient(MONGODB_URI, clientOpts)
        await client.connect();

        const database = client.db(MONGODB_DB);
        const collection = database.collection(MONGODB_COLLECTION);

        await collection.findOne({_id: new ObjectID(id)}, async (err, res) => {
            if (err) resolve({content: 'That paste could not be found.'});
            await resolve(res)
            await client.close()
        })
    })
}