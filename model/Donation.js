const Mongoose = require("mongoose");

const DonationSchema = new Mongoose.Schema({
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
    tnx_id: {
        type: String,
        unique: true,
        required: true,
    },
    bc_entry_id: {
        type: Number,
        default: null,
        required: false,
    },
});

const Donation = Mongoose.model("donation", DonationSchema);

module.exports = Donation;
