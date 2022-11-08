const Mongoose = require("mongoose");

const BeneficiarySchema = new Mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    user_name: {
        type: String,
        required: true,
    },
    bc_user_id: {
        type: String,
        required: true,
    },
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
    authorizer_name: {
        type: String,
        required: true,
    },
    authorizer_phone: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: false,
    },
    purpose: {
        type: String,
        default: false,
        required: true,
    },
    details: {
        type: String,
        default: false,
        required: true,
    },
    bc_entry_id: {
        type: Number,
        default: null,
        unique: true,
        required: false,
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const Beneficiary = Mongoose.model("beneficiary", BeneficiarySchema);

module.exports = Beneficiary;
