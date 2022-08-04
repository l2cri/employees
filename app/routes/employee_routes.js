const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Employee = require('../models/employee')

router.get('/', (req, res) => {
    Employee.find({}, (err, docs) => {
        res.json(docs)
    })
})

router.post('/', (req, res) => {
    new Employee(req.body).save(function (err, result) {
        res.json(result)
    });
})

router.delete('/:id',  async (req, res) => {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.json({ error : 'Wrong Id'})
    } else {
        const result = await Employee.deleteOne( {'_id': id});
        res.json(result)
    }

})

router.put('/:id',  async (req, res) => {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.json({ error : 'Wrong Id'})
    } else {
        const result = await Employee.replaceOne( {'_id': id}, req.body);
        res.json(result)
    }
})

module.exports = router