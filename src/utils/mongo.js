const { MongoClient } = require("mongodb");

const uri = process.env.MONGOKEY;

const client = new MongoClient(uri);

async function saveMods(id) {
    try {
        await client.connect();
        const modsCollection = client.db("MaincraBot").collection("Mods");
        const query = { _id: Number(id), mods: {} };
        await modsCollection.insertOne(query);
        return "Si se guardaron xd";
    } finally {
        await client.close();
    }
}

async function getMods(id) {
    try {
        await client.connect();
        const modsCollection = client.db("MaincraBot").collection("Mods");
        const query = { _id: Number(id) };
        const mods = await modsCollection.findOne(query);
        return mods;
    } finally {
        await client.close();
    }
}

async function insertMods(id, mods) {
    try {

        await client.connect();
        const modsCollection = client.db("MaincraBot").collection("Mods");
        const filter = { _id: Number(id)};
        const query = { $set: {} };
        for (let mod in mods) {
            query.$set[`mods.${mod}`] = mods[mod];
        }
        //await modsCollection.updateOne(filter, query);
        return "Nel ya no9 me caben mas mods xd";
    } finally {
        await client.close();
    }
}

module.exports = {
    saveMods: saveMods,
    getMods: getMods,
    insertMods: insertMods
};

