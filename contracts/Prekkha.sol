pragma solidity ^0.5.0;

contract Prekkha {
    uint public userCount = 0;
    uint public donationCount = 0;
    uint public financialAidRequestCount = 0;
    uint public total_donation_received = 0;
    uint public total_financial_aid_provided = 0;
    uint public total_financial_aid_requested = 0;

    struct User {
        uint id;
        string user_id;
        string user_type;
        string user_details;
    }

    struct Donation {
        uint id;
        uint donor_id;
        uint amount;
        string donation_details;
    }

    struct Beneficiary {
        uint id;
        string beneficiary_id;
        uint amount;
        string beneficiary_details;
        bool status;
        bool verified;
    }

    struct Wallet {
        uint user_id;
        uint amount;
    }

    mapping(uint => User) public users;
    mapping(uint => Donation) public donations;
    mapping(uint => Beneficiary) public beneficiaries;
    mapping(uint => Wallet) public wallet;

    event UserCreated(
        uint id,
        string user_id,
        string user_type,
        string user_details
    );

    event DonationCreated(
        uint id,
        uint donor_id,
        uint amount,
        string donation_details
    );

    event BeneficiaryCreated(
        uint id,
        string beneficiary_id,
        uint amount,
        string beneficiary_details,
        bool status,
        bool verified
    );

    event BeneficiaryUpdated(
        uint id,
        string beneficiary_id,
        uint amount,
        string beneficiary_details,
        bool status,
        bool verified
    );

    event WalletUpdated(
        uint user_id,
        uint previous_amount,
        uint current_amount
    );

    function makeDonation(uint _donor_id, uint _amount, string memory _donation_details) public {
        donationCount++;
        donations[donationCount] = Donation(donationCount, _donor_id, _amount, _donation_details);
        total_donation_received += _amount;
        emit DonationCreated(donationCount, _donor_id, _amount, _donation_details);
        updateWalletBalance(_donor_id, _amount);
    }

    function userRegistration(string memory _user_id, string memory _user_type, string memory _user_details) public {
        userCount++;
        users[userCount] = User(userCount, _user_id, _user_type, _user_details);
        wallet[userCount] = Wallet(userCount, 0);
        emit UserCreated(userCount, _user_id, _user_type, _user_details);
    }

    function financialAidRequest(string memory _beneficiary_id, uint _amount, string memory _beneficiary_details) public {
        financialAidRequestCount++;
        beneficiaries[financialAidRequestCount] = Beneficiary(financialAidRequestCount, _beneficiary_id, _amount, _beneficiary_details, false, false);
        total_financial_aid_requested += _amount;
        emit BeneficiaryCreated(financialAidRequestCount, _beneficiary_id, _amount, _beneficiary_details, false, false);
    }

    //find the beneficiary, check if the amount is less than the user wallet amount, decrease the user wallet amount and update the beneficiary status to true
    function approveFinancialAidRequest(uint _beneficiary_id, uint _user_id) public {
        Beneficiary memory _beneficiary = beneficiaries[_beneficiary_id];
        Wallet memory _wallet = wallet[_user_id];
        if (_beneficiary.amount <= _wallet.amount && _beneficiary.status == false && _beneficiary.verified == true) {
            _beneficiary.status = !_beneficiary.status;
            total_financial_aid_provided += _beneficiary.amount;
            beneficiaries[_beneficiary_id] = _beneficiary;
            emit BeneficiaryUpdated(_beneficiary_id, _beneficiary.beneficiary_id, _beneficiary.amount, _beneficiary.beneficiary_details, _beneficiary.status, _beneficiary.verified);
            deductWalletBalance(_wallet.user_id, _beneficiary.amount);
        }
    }
    //verify beneficiary
    function verifyBeneficiary(uint _id) public {
        Beneficiary memory _beneficiary = beneficiaries[_id];
        if (_beneficiary.verified == false) {
            _beneficiary.verified = !_beneficiary.verified;
        }
        beneficiaries[_id] = _beneficiary;
        emit BeneficiaryUpdated(_id, _beneficiary.beneficiary_id, _beneficiary.amount, _beneficiary.beneficiary_details, _beneficiary.status, _beneficiary.verified);
    }

    //credit wallet
    function updateWalletBalance(uint _user_id, uint _amount) private {
        Wallet memory _wallet = wallet[_user_id];
        _wallet.amount = _wallet.amount + _amount;
        wallet[_user_id] = _wallet;
        emit WalletUpdated(_wallet.user_id, _wallet.amount - _amount, _wallet.amount);
    }
    //debit wallet
    function deductWalletBalance(uint _user_id, uint _amount) private {
        Wallet memory _wallet = wallet[_user_id];
        _wallet.amount = _wallet.amount - _amount;
        wallet[_user_id] = _wallet;
        emit WalletUpdated(_wallet.user_id, _wallet.amount + _amount, _wallet.amount);
    }
}