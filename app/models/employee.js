const mongoose = require('mongoose')

const employeeSchema = mongoose.Schema({
    name: String,
    birthday: String,
    position: String,
    salary: String,
})

employeeSchema.statics.search = function (query, cb) {
    let queryOptions = {}
    if (query && query.length) {
        queryOptions = {
            $or: [{
                name: {
                    '$regex': query,
                    '$options': 'i'
                }
            }, {
                position: {
                    '$regex': query,
                    '$options': 'i'
                }
            }]
        }
    }
    return this.find(queryOptions, cb)
}

const Employee = mongoose.model('Employee', employeeSchema)

module.exports = Employee