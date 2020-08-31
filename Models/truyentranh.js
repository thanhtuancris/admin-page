const mongoose = require('mongoose');

const schemaTruyenTranh = new mongoose.Schema({
    name: String,
    image: String,
    date_pub: Number
});

module.exports = mongoose.model("TruyenTranh", schemaTruyenTranh);