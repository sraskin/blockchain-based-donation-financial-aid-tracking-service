const Donation = require("../model/Donation");
const Bank = require("../model/Bank");
const User = require("../model/User");

exports.make_donation = async (req, res, next) => {
    const {user_id, tnx_id} = req.body;
    await Bank.find({tnx_id: tnx_id})
        .then(async (tnx_info) => {
            if (tnx_id === tnx_info[0].tnx_id) {
                await User.findById(user_id)
                    .then(async (user) => {
                        await Donation.create({
                            user_id: user._id,
                            bc_user_id: user.bc_entry_id,
                            bank_name: tnx_info[0].bank_name,
                            bank_account: tnx_info[0].bank_account,
                            amount: tnx_info[0].amount,
                            tnx_id: tnx_info[0].tnx_id
                        })
                            .then(async (donation) => {
                                res.status(201).json({
                                    message: "Donation successfully made",
                                    donation_id: donation._id,
                                    user_id: donation.user_id,
                                    bc_user_id: donation.bc_user_id,
                                    bank_name: donation.bank_name,
                                    bank_account: donation.bank_account,
                                    amount: donation.amount,
                                    tnx_id: donation.tnx_id,
                                    timestamp: donation.timestamp
                                });
                            })
                            .catch((error) =>
                                res.status(400).json({
                                    message: "Donation is  not successful created",
                                    error: error.message,
                                })
                            );
                    })
            } else {
                res.status(401).json({message: "Not successful, tnx id not matched"})
            }
        })
        .catch((err) =>
            res.status(401).json({message: "Not successful", error: err.message})
        );
};
