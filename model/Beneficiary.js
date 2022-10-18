const Mongoose = require("mongoose");

const BeneficiarySchema = new Mongoose.Schema({
    user_id: {
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
    bc_entry_id: {
        type: Number,
        default: null,
        required: false,
    },
});

const Beneficiary = Mongoose.model("beneficiary", BeneficiarySchema);

module.exports = Beneficiary;
