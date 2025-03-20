const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    department: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    pancard: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("Employee", EmployeeSchema);
