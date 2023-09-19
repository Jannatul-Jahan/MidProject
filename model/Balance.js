const mongoose = require("mongoose");

const balanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        unique: true,
    },
    balance:{
        type: Number,
    },
});

const Balance = mongoose.model("Balance", balanceSchema);
module.exports = Balance;
