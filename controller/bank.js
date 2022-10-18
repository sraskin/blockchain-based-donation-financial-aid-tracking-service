const Bank = require("../model/Bank");
const bcrypt = require("bcryptjs");

exports.make_payment = async (req, res, next) => {
    const {bank_name, bank_account, amount} = req.body;

    bcrypt.hash("TNX", 2).then(async (hash) => {
        await Bank.create({
            bank_name: bank_name,
            bank_account: bank_account,
            amount: amount,
            tnx_id: hash
        })
            .then(async (bank) => {
                res.status(201).json({
                    message: "Payment successfully created",
                    amount: bank.amount,
                    tnx_id: bank.tnx_id,
                });
            })
            .catch((error) =>
                res.status(400).json({
                    message: "Payment not successful created",
                    error: error.message,
                })
            );
    });
};

exports.getTransaction = async (req, res, next) => {
    const {tnx_id} = req.body;
    await Bank.find({tnx_id: tnx_id})
        .then((tnx_info) => {
            res.status(200).json({tnx_info});
        })
        .catch((err) =>
            res.status(401).json({message: "Not successful", error: err.message})
        );
};