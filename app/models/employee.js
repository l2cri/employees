const mongoose = require('mongoose')

const employeeSchema = mongoose.Schema({
    name: String,
    birthday: String,
    position: String,
    salary: String,
})


const Employee = mongoose.model('Employee', employeeSchema)

module.exports = Employee