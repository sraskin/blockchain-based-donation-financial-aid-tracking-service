pragma solidity ^0.5.0;

contract Prekkha {
    uint public mainBalance = 0;
    uint public userCount = 0;
    uint public donationCount = 0;
    uint public financialAidRequestCount = 0;

    function updateBalance(uint _newAmount) public {
        mainBalance = mainBalance + _newAmount;
    }

    struct User {
        uint id;
        string user_id;
        string user_type;
        string user_details;
    }

    struct Donation {
        uint id;
        string donor_id;
        uint amount;
        string donation_details;
    }

    struct Beneficiary {
        uint id;
        string beneficiary_id;
        uint amount;
        string beneficiary_details;
        bool status;
    }

    mapping(uint => User) public users;
    mapping(uint => Donation) public donations;
    mapping(uint => Beneficiary) public beneficiaries;

    event UserCreated(
        uint id,
        string user_id,
        string user_type,
        string user_details
    );

    event DonationCreated(
        uint id,
        string donor_id,
        uint amount,
        string donation_details
    );

    event BeneficiaryCreated(
        uint id,
        string beneficiary_id,
        uint amount,
        string beneficiary_details,
        bool status
    );

    event BeneficiaryUpdated(
        uint id,
        string beneficiary_id,
        uint amount,
        string beneficiary_details,
        bool status
    );

    constructor() public {
        makeDonation("testDonorID", 0, "donation details hash");
        userRegistration("testUserID", "admin", "user details hash");
        financialAidRequest("beneficiaryID", 500, "beneficiary details hash");
    }

    function makeDonation(string memory _donor_id, uint _amount, string memory _donation_details) public {
        donationCount++;
        donations[donationCount] = Donation(donationCount, _donor_id, _amount, _donation_details);
        updateBalance(_amount);
        emit DonationCreated(donationCount, _donor_id, _amount, _donation_details);
    }

    function userRegistration(string memory _user_id, string memory _user_type, string memory _user_details) public {
        userCount++;
        users[userCount] = User(userCount, _user_id, _user_type, _user_details);
        emit UserCreated(userCount, _user_id, _user_type, _user_details);
    }

    function financialAidRequest(string memory _beneficiary_id, uint _amount,  string memory _beneficiary_details) public {
        financialAidRequestCount++;
        beneficiaries[financialAidRequestCount] = Beneficiary(financialAidRequestCount, _beneficiary_id, _amount, _beneficiary_details, false);
        emit BeneficiaryCreated(financialAidRequestCount, _beneficiary_id, _amount, _beneficiary_details, false);
    }

    function approveBeneficiary(uint _id) public {
        Beneficiary memory _beneficiary = beneficiaries[_id];
        if (_beneficiary.amount <= mainBalance && _beneficiary.status == false) {
            _beneficiary.status = !_beneficiary.status;
            mainBalance = mainBalance - _beneficiary.amount;
        }
        beneficiaries[_id] = _beneficiary;
        emit BeneficiaryUpdated(_id, _beneficiary.beneficiary_id, _beneficiary.amount, _beneficiary.beneficiary_details, _beneficiary.status);
    }
}