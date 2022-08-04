const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const employeeSchema = mongoose.Schema({
    name: String,
    birthday: String,
    position: String,
    salary: String,
})

employeeSchema.plugin(mongoosePaginate)

const Employee = mongoose.model('Employee', employeeSchema)

module.exports = Employee