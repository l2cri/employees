const ObjectId = require('mongodb').ObjectId

module.exports = function (app, db) {
    // LIST
    app.get('/employees', async (req, res) => {
        const findResult = await db.collection('employees').find({}).toArray();

        res.send(findResult);
    })
    // READ ON
    app.get('/employees/:id', async (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectId(id)};

        const findResult = await db.collection('employees').findOne(details);

        res.send(findResult);
    })

    // DELETE
    app.delete('/employees/:id', async (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectId(id)}

        const findResult = await db.collection('employees').deleteOne(details);

        res.send(findResult);
    })

    // UPDATE
    app.put('/employees/:id', async (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectId(id)}
        const employee = {
            name: req.body.name,
            birthday: req.body.birthday,
            position: req.body.position,
            salary: req.body.salary,
        }

        const result = db.collection('employees').replaceOne(details, employee, { upsert: false })
        res.send(result)
    })

    // CREATE
    app.post('/employees', async (req, res) => {
        const result = await db.collection('employees').insertOne({
            name: req.body.name,
            birthday: req.body.birthday,
            position: req.body.position,
            salary: req.body.salary,
        })

        res.send(result)
    })
}