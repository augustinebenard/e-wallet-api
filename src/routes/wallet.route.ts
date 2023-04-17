import { makeDeposit, getWallectAccountLogs, withdraw, transfer, getUserWalletByAccountNumber } from './../controller/wallet.controller';
import { Router } from "express";
import {
    getUserWallet,

} from "../controller/wallet.controller";

const verifyToken = require("../config/verifyToken");
const walletRoute = Router();

walletRoute.get("/easywallet/getUserWallet/:id", verifyToken, getUserWallet);
walletRoute.get("/easywallet/getWalletByAccountNo/:id", verifyToken, getUserWalletByAccountNumber);
walletRoute.post("/easywallet/deposit", verifyToken, makeDeposit);
walletRoute.post("/easywallet/withdraw", verifyToken, withdraw);
walletRoute.post("/easywallet/transfer", verifyToken, transfer);
walletRoute.get("/easywallet/logs/getAll", verifyToken, getWallectAccountLogs);

export default walletRoute;