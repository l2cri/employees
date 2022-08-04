const ObjectId = require('mongodb').ObjectId

module.exports = function (app, collection) {
    // LIST
    app.get('/api/employees', async (req, res) => {
        const findResult = await collection.find({}).toArray();

        res.send(findResult);
    })
    // READ ON
    app.get('/api/employees/:id', async (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectId(id)};

        const findResult = await collection.findOne(details);

        res.send(findResult);
    })

    // DELETE
    app.delete('/api/employees/:id', async (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectId(id)}

        const findResult = await collection.deleteOne(details);

        res.send(findResult);
    })

    // UPDATE
    app.put('/api/employees/:id', async (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectId(id)}
        const employee = {
            name: req.body.name,
            birthday: req.body.birthday,
            position: req.body.position,
            salary: req.body.salary,
        }

        const result = collection.replaceOne(details, employee, { upsert: false })
        res.send(result)
    })

    // CREATE
    app.post('/api/employees', async (req, res) => {
        const result = await collection.insertOne({
            name: req.body.name,
            birthday: req.body.birthday,
            position: req.body.position,
            salary: req.body.salary,
        })

        res.send(result)
    })
}