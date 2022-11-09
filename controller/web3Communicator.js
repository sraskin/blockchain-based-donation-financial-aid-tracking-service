require('dotenv').config();
const Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
const contract = require("truffle-contract");
const PrekkhaArtifacts = require("../build/contracts/Prekkha.json");
const User = require("../model/User");
const Beneficiary = require("../model/Beneficiary");
const Donation = require("../model/Donation");
const wallet_id = process.env.BC_WALLET_ID;
web3.eth.defaultAccount = wallet_id;
web3.eth.sendTransaction({/* ... */});

getInstance = async () => {
    const Prekkha = contract(PrekkhaArtifacts);
    Prekkha.setProvider(web3.currentProvider);
    return await Prekkha.deployed();
}

//show total donation, total aid, total balance
exports.getDetails = async (req, res, next) => {
    const instance = await getInstance();
    const total_number_of_donation = await instance.donationCount();
    const total_number_of_financial_aid_req = await instance.financialAidRequestCount();
    const total_amount_donation_received = await instance.total_donation_received();
    const total_amount_donation_provided = await instance.total_financial_aid_provided();
    const total_amount_aid_requested = await instance.total_financial_aid_requested();
    //search in donation for active donor who donated
    const active_donors = await Donation.find({bc_entry_id: {$ne: null}});
    const active_donors_list = [];
    active_donors.map((item) => {
        active_donors_list.push(item.user_id);
    })
    //filter unique user
    const unique_active_donors = [...new Set(active_donors_list)];
    res.status(200).json({
        total_number_of_donation: total_number_of_donation.toNumber(),
        total_number_of_financial_aid_req: total_number_of_financial_aid_req.toNumber(),
        total_amount_donation_received: total_amount_donation_received.toNumber(),
        total_amount_donation_provided: total_amount_donation_provided.toNumber(),
        total_amount_aid_requested: total_amount_aid_requested.toNumber(),
        active_donors: unique_active_donors.length
    });
}

exports.getWalletBalance = async (req, res, next) => {
    const {user_id} = req.body;
    const instance = await getInstance();
    const wallet = await instance.wallet(user_id);
    res.status(200).json({available_balance: wallet.amount.toNumber()});
}

exports.registration = async (req, res, next) => {
    const {user_id, role, username} = req.body;
    const instance = await getInstance();
    await instance.userRegistration(user_id, role, username, {from: `${wallet_id}`}).then(async (arg, tt) => {
        let data = arg.logs[0].args;
        let id = data.id.toNumber();
        await User.findById(user_id)
            .then((user) => {
                user.bc_entry_id = id;
                user.save();
            })
        res.status(200).json({id});
    })
}

exports.getUserByID = async (req, res, next) => {
    const {user_id} = req.body;
    const instance = await getInstance();
    await User.findById(user_id)
        .then(async (user) => {
            const user_details = await instance.users(user.bc_entry_id);
            res.status(200).json({
                blockchain_entry_id: user.bc_entry_id,
                user_id: user_details.user_id,
                role: user_details.user_type,
                username: user_details.user_details
            });
        })
}

exports.makeDonation = async (req, res, next) => {
    const {donor_id, amount, details} = req.body;
    const instance = await getInstance();
    await instance.makeDonation(donor_id, amount, JSON.stringify(details), {from: `${wallet_id}`}).then(async (arg, tt) => {
        let data = arg.logs[0].args;
        let id = data.id.toNumber();
        await Donation.findById(details.donation_id)
            .then((user) => {
                user.bc_entry_id = id;
                user.save();
            })
        res.status(200).json({id});
    })
}

exports.getAllDonationByID = async (req, res, next) => {
    const {user_id} = req.body;
    const instance = await getInstance();
    await Donation.find({user_id: user_id, bc_entry_id: {$ne: null}})
        .then(async (user) => {
            const donation = [];
            let total_donation = 0;
            user.map(async (item) => {
                const _donation = await instance.donations(item.bc_entry_id);
                total_donation += _donation.amount.toNumber();
                donation.push({
                    bc_entry_id: _donation.id,
                    donor_id: _donation.donor_id,
                    amount: _donation.amount.toNumber(),
                    details: JSON.parse(_donation.donation_details)
                });
            })
            const donation_list = () => {
                if (donation.length === user.length) {
                    res.status(200).json({donation_details: donation, total_donation: total_donation});
                } else {
                    setTimeout(function () {
                        if (donation.length === user.length) {
                            res.status(200).json({donation_details: donation, total_donation: total_donation});
                        } else {
                            donation_list()
                        }
                    }, 200);
                }
            };
            donation_list();
        })
}

exports.makeAidRequest = async (req, res, next) => {
    const {aid_id, amount, details} = req.body;
    const instance = await getInstance();
    await instance.financialAidRequest(aid_id, amount, JSON.stringify(details), {from: `${wallet_id}`}).then(async (arg, tt) => {
        let data = arg.logs[0].args;
        let id = data.id.toNumber();
        await Beneficiary.findById(aid_id)
            .then((aid) => {
                aid.bc_entry_id = id;
                aid.save();
            })
        res.status(200).json({id});
    })
}

exports.getAllAidByID = async (req, res, next) => {
    const {user_id} = req.body;
    const instance = await getInstance();
    await Beneficiary.find({user_id: user_id, bc_entry_id: {$ne: null}})
        .then(async (user) => {
            const beneficiary = [];
            user.map(async (item) => {
                const _aid = await instance.beneficiaries(item.bc_entry_id);
                // console.log("aid",_aid);
                beneficiary.push({
                    bc_entry_id: _aid.id,
                    aid_id: _aid.beneficiary_id,
                    amount: _aid.amount.toNumber(),
                    details: _aid.beneficiary_details,
                    status: _aid.status === false ? 'Pending' : 'Approved',
                    verified: _aid.verified === false ? 'NotVerified' : 'Verified'
                });
            })
            const aid_list = () => {
                if (beneficiary.length === user.length) {
                    res.status(200).json({beneficiary});
                } else {
                    setTimeout(function () {
                        if (beneficiary.length === user.length) {
                            res.status(200).json({beneficiary});
                        } else {
                            aid_list()
                        }
                    }, 200);
                }
            };
            aid_list();
        })
}

//admin
exports.getAllAid = async (req, res, next) => {
    const instance = await getInstance();
    await Beneficiary.find({bc_entry_id: {$ne: null}})
        .then(async (aid) => {
            const beneficiary = [];
            aid.map(async (item) => {
                const _aid = await instance.beneficiaries(item.bc_entry_id);
                const _parsed_aid = JSON.parse(_aid.beneficiary_details);
                beneficiary.push({
                    bc_entry_id: _aid.id,
                    aid_id: _aid.beneficiary_id,
                    amount: _aid.amount.toNumber(),
                    timestamp: _parsed_aid.timestamp,
                    details: _parsed_aid,
                    status: _aid.status === false ? 'Pending' : 'Donated',
                    verified: _aid.verified === false ? 'NotVerified' : 'Verified'
                });
            })
            const aid_list = () => {
                if (beneficiary.length === aid.length) {
                    res.status(200).json({beneficiary});
                } else {
                    setTimeout(function () {
                        if (beneficiary.length === aid.length) {
                            res.status(200).json({beneficiary});
                        } else {
                            aid_list()
                        }
                    }, 200);
                }
            };
            aid_list();
        })
}

exports.getAllDonation = async (req, res, next) => {
    const instance = await getInstance();
    await Donation.find({bc_entry_id: {$ne: null}})
        .then(async (donation_details) => {
            const donation = [];
            const active_donors = [];
            let total_donation = 0;
            donation_details.map(async (item) => {
                const _donation = await instance.donations(item.bc_entry_id);
                total_donation += _donation.amount.toNumber();
                donation.push({
                    bc_entry_id: _donation.id,
                    donor_id: _donation.donor_id,
                    amount: _donation.amount.toNumber(),
                    details: JSON.parse(_donation.donation_details)
                });
                active_donors.push(_donation.donor_id);
            })
            const donation_list = () => {
                if (donation.length === donation_details.length) {
                    let _active_donors = [...new Set(active_donors)];
                    res.status(200).json({
                        donation_details: donation,
                        total_donation: total_donation,
                        active_donors: _active_donors.length
                    });
                } else {
                    setTimeout(function () {
                        if (donation.length === donation_details.length) {
                            let _active_donors = [...new Set(active_donors)];
                            res.status(200).json({
                                donation_details: donation,
                                total_donation: total_donation,
                                active_donors: _active_donors.length
                            });
                        } else {
                            donation_list()
                        }
                    }, 200);
                }
            };
            donation_list();
        })
}

exports.getAllUser = async (req, res, next) => {
    const instance = await getInstance();
    await User.find({bc_entry_id: {$ne: null}})
        .then(async (user) => {
            const users = [];
            user.map(async (item) => {
                const _user = await instance.users(item.bc_entry_id);
                users.push({
                    bc_entry_id: _user.id,
                    user_id: _user.user_id,
                    role: _user.user_type,
                    other_details: {user_name: _user.user_details}
                });
            })
            const user_list = () => {
                if (users.length === user.length) {
                    res.status(200).json({users});
                } else {
                    setTimeout(function () {
                        if (users.length === user.length) {
                            res.status(200).json({users});
                        } else {
                            user_list()
                        }
                    }, 200);
                }
            };
            user_list();
        })
}

exports.verifyDonation = async (req, res, next) => {
    const {bc_entry_id} = req.body;
    const instance = await getInstance();
    await instance.verifyBeneficiary(bc_entry_id, {from: `${wallet_id}`}).then(async (arg, tt) => {
        let data = arg.logs[0].args;
        res.status(200).json({
            data: data,
            status: data.status === false ? 'Pending' : 'Approved',
            verified: data.verified === false ? 'NotVerified' : 'Verified'
        });
    })
}

exports.approveDonation = async (req, res, next) => {
    const {bc_entry_id, user_id} = req.body;
    const instance = await getInstance();
    await instance.approveFinancialAidRequest(bc_entry_id, user_id, {from: `${wallet_id}`}).then(async (arg, tt) => {
        try {
            let data = arg.logs[0].args;
            res.status(200).json({
                data: data,
                status: data.status === false ? 'Pending' : 'Donated',
                verified: data.verified === false ? 'NotVerified' : 'Verified'
            });
        } catch (e) {
            res.status(502).json({
                data: e,
                status: 'Failed'
            });
        }
    })
}