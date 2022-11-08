const Mongoose = require("mongoose");

const BankSchema = new Mongoose.Schema({
    bank_name: {
        type: String,
        required: true,
    },
    bank_account: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    tnx_id: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const Bank = Mongoose.model("bank", BankSchema);

module.exports = Bank;
