const express = require("express");
const router = express.Router();

const {register, login, update, deleteUser, getUsers} = require("./auth");
const {make_payment, getTransaction} = require("./bank");
const {make_donation} = require("./donation");
const {make_financial_aid_request} = require("./beneficiary");
const {
    getMainBalance,
    registration,
    getUserByID,
    makeAidRequest,
    getAllAidByID,
    makeDonation,
    getAllDonationByID,
    getAllAid,
    getAllDonation,
    getAllUser,
    approveDonation
} = require("./web3Communicator");
const {adminAuth} = require("../middleware/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update").put(adminAuth, update);
router.route("/deleteUser").delete(adminAuth, deleteUser);
router.route("/getUsers").get(getUsers);

router.route("/bank").post(make_payment);
router.route("/bank/getTransaction").post(getTransaction);

router.route("/donor/donation").post(make_donation);

router.route("/user/aid").post(make_financial_aid_request);

router.route("/getMainBalance").get(getMainBalance);
router.route("/blockchain/registration").post(registration);
router.route("/blockchain/getUserByID").post(getUserByID);
router.route("/blockchain/makeAidRequest").post(makeAidRequest);
router.route("/blockchain/getAllAidByID").post(getAllAidByID);
router.route("/blockchain/makeDonation").post(makeDonation);
router.route("/blockchain/getAllDonationByID").post(getAllDonationByID);
router.route("/blockchain/approveDonation").post(approveDonation);
router.route("/blockchain/admin/getAllAid").get(getAllAid);
router.route("/blockchain/admin/getAllDonation").get(getAllDonation);
router.route("/blockchain/admin/getAllUser").get(getAllUser);

module.exports = router;
