import { WalletAccount } from './../entity/WalletAccount';
import { User } from './../entity/User';
import { Request, Response } from "express";
import { Connection, ConnectionManager, getRepository } from "typeorm";

const jwt = require('jsonwebtoken'); //use to create, verify, and decode tokens
const bcrypt = require('bcryptjs'); //use to hash passwords
const secret = require('../config/clientSecret').secret; //contains secret key used to sign tokens


// get list of Users
export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    const users = await getRepository(User).find();
    return res.status(200).send(users)
}

// get user by Id
export const getUserById = async (req: Request, res: Response): Promise<Response> => {
    const userById = await getRepository(User).findOne(req.params.id);
    return res.status(200).send(userById)
}


// create a User
export const createUser = async (req: Request, res: Response): Promise<Response> => {
    req.body.plainPassword = req.body.password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    req.body.profilePic = "https://www.ultradrilling.co.za/wp-content/uploads/2019/05/empty-profile-1.png"
    req.body.dateCreated = new Date();

    // CREATING USER WALLET
    const walletAccount = new WalletAccount();
    walletAccount.accountBalance = 0.0;
    walletAccount.lastDeposit = 0.0;
    var userPhone = req.body.phone;

    // generating transaction pin
    var generatedPin = Math.floor(Math.random() * (999 - 100 + 1) + 100);
    var position;
    var length;
    if (userPhone.length % 2 === 1) {
        position = userPhone.length / 2;
        length = 1;
    } else {
        position = userPhone.length / 2 - 1;
        length = 2;
    }
    var twoNumberFromPhone = userPhone.substring(position, position + length + 1);
    const pin = generatedPin + twoNumberFromPhone;
    req.body.transactionPin = pin

    // Generating account number
    var generatedSixDigits = Math.floor(100000 + Math.random() * 900000)
    var userPhoneLastFourDigits = userPhone.substr(userPhone.length - 4);
    const newWalletAccountNumber = generatedSixDigits + userPhoneLastFourDigits;
    walletAccount.accountNumber = newWalletAccountNumber

    //check if user already exist
    const searchedUser = await getRepository(User).findOne({
        where: [{ username: req.body.username }, { email: req.body.email }]
    });
    if (searchedUser) {
        return res.status(200).send({ success: false, message: "User already exist" });
    }

    const wallet = await getRepository(WalletAccount).save(walletAccount)
    req.body.walletAccountId = wallet
    const newUser = req.body;
    const results = await getRepository(User).save(newUser);

    if (results) {
        return res.status(200).send({ success: true, message: "User Creation Successful!", results });
    }
    else {
        return res.status(500).send({ success: false, message: "There was a problem" });
    }

};

// User Login
export const login = async (req: Request, res: Response): Promise<Response> => {
    const searchedUser = await getRepository(User).findOne({
        where: [{ username: req.body.username }, { email: req.body.username }]
    });

    if (searchedUser) {
        var passwordIsValid = bcrypt.compareSync(req.body.password, searchedUser.password);
        if (!passwordIsValid) return res.status(200).send({ success: false, auth: false, message: "Invalid Password", token: null })

        let token = jwt.sign({ id: req.body.username }, secret, {
            expiresIn: 1200 // expires in 20 minutes
        })
        // console.log(searchedUser)
        //send json to the user if successful
        return res.status(200).send({ success: true, token: token, message: "User Authenticated Successfully!", user: searchedUser });

    }
    else {
        return res.status(200).send({ success: false, auth: false, message: "Invalid username or Password", token: null })
    }
}