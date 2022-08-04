const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Employee = require('../models/employee')

router.get('/', (req, res) => {
    const pageOptions = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
        sort: req.query.sort,
        pagination: !(req.query.limit && req.query.limit === '-1'), // all elements
    }

    Employee.paginate({}, pageOptions,  (err, result) => {
        res.json(result)
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