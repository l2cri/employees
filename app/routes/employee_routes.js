const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Employee = require('../models/employee')

router.get('/', (req, res) => {
    const pageOptions = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
        sort: req.query.sort,
    }

    Employee.search(req.query.query)
        .skip((pageOptions.page - 1) * pageOptions.limit)
        .limit(pageOptions.limit > 0 ? pageOptions.limit : false)
        .sort(pageOptions.sort)
        .exec(function (err, items) {
            Employee.search(req.query.query).count().exec(function (err, totalItems) {
                res.json({
                    docs : items,
                    totalDocs: totalItems,
                    limit: pageOptions.limit,
                    totalPages: pageOptions.limit > 0 ? Math.ceil(totalItems / pageOptions.limit) : 1,
                    page: pageOptions.page,
                })
            })
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