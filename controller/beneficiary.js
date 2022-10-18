const Beneficiary = require("../model/Beneficiary");
const User = require("../model/User");

exports.make_financial_aid_request = async (req, res, next) => {
    const {user_id, bank_name, bank_account, amount, authorizer_name, authorizer_phone} = req.body;
    await User.findById(user_id)
        .then(async (user) => {
            await Beneficiary.create({
                user_id: user_id,
                bc_user_id: user.bc_entry_id,
                bank_name: bank_name,
                bank_account: bank_account,
                amount: +amount,
                authorizer_name: authorizer_name,
                authorizer_phone: authorizer_phone
            })
                .then(async (aid) => {
                    res.status(201).json({
                        message: "Financial Aid request successfully made",
                        id: aid._id,
                        amount: aid.amount,
                        aid_details: aid
                    });
                })
                .catch((error) =>
                    res.status(400).json({
                        message: "Financial Aid request is  not successful created",
                        error: error.message,
                    })
                );
        })
}

exports.getAllAidByUser = async (req, res, next) => {
    const {user_id} = req.body;
    await Beneficiary.find({user_id: user_id})
        .then((aid_info) => {
            if (aid_info !== null) {
                res.status(200).json({aid_info});
            } else res.status(200).json({message: "invalid username"});
        })
        .catch((err) =>
            res.status(401).json({message: "Not successful", error: err.message})
        );
};

exports.getAllAid = async (req, res, next) => {
    await Beneficiary.find({})
        .then((aid_info) => {
            if (aid_info[0] !== null) {
                res.status(200).json({aid_info});
            } else res.status(200).json({message: "invalid username"});
        })
        .catch((err) =>
            res.status(401).json({message: "Not successful", error: err.message})
        );
};