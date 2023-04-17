import { WalletAccount } from './../entity/WalletAccount';
import { ZlogWalletAccount } from './../entity/zlogWalletAccount';
import { Response } from 'express';
import { Request } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { User } from '../entity/User';

// get user by Id
export const getUserWallet = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userById = await getRepository(User).findOne(req.params.id);
        const userWallet = userById.walletAccountId
        if (userById && userWallet) {
            return res.status(200).send(userWallet)
        }
        else {
            return res.status(404).send({ success: false, message: "User Wallet Not Found!" })
        }

    } catch (error) {
        return res.status(500).send({ success: false, error, message: "Failed!" })

    }
}


export const makeDeposit = async (req: Request, res: Response) => {
    var serviceCharge = 0.0;
    var depositAmount = parseFloat(req.query.depositAmount)
    var transactionPin = req.query.transactionPin
    var paymentMethod = req.query.paymentMethod
    var userId = req.query.userId

    try {
        const userById = await getRepository(User).findOne(userId);
        if (userById && userById.transactionPin === transactionPin) {
            var userWalletBalance = userById.walletAccountId.accountBalance
            var depositAmountAfterCharge = depositAmount - serviceCharge
            var newBalance = userWalletBalance + depositAmountAfterCharge
            userById.walletAccountId.accountBalance = newBalance
            userById.walletAccountId.lastDeposit = depositAmount
            userById.walletAccountId.lastPaymentMethod = paymentMethod
            userById.walletAccountId.lastServiceCharge = serviceCharge

            const user = await getRepository(User).save(userById);
            try {
                // Creating a logger
                const log = new ZlogWalletAccount();
                var action = "Deposit"
                var description = "You made a Deposit of " + depositAmount + " to your account"
                log.amount = depositAmount
                log.currentAccountBalance = userWalletBalance
                log.date = new Date()
                log.description = description
                log.service = action
                log.status = "Completed!"
                log.transactionCharge = serviceCharge
                log.userId = user
                await getRepository(ZlogWalletAccount).save(log)

                return res.status(200).send({ success: true, message: "Deposit was Successful", user })

            } catch (error) {
                console.log(error)
                return res.status(500).send({ success: false, message: "Error", error })
            }


        } else {
            return res.status(201).send({ success: false, message: "Invalid Transaction Pin" })
        }


    } catch (error) {
        return res.status(500).send({ success: false, error, message: "Failed!" })
    }
};

// get all logs
export const getWallectAccountLogs = async (req: Request, res: Response): Promise<Response> => {
    const log = await getRepository(ZlogWalletAccount).find();
    if (log) {
        return res.status(200).send(log)
    } else {
        return res.status(201).send({ success: false, message: "Unable to Get Wallet Account Logs" })
    }

}

export const withdraw = async (req: Request, res: Response) => {
    var serviceChargePercentage = 100 / 0.9;


    var amountToWithdraw = parseFloat(req.query.amountToWithdraw)
    var transactionPin = req.query.transactionPin
    var paymentMethod = req.query.paymentMethod
    var userId = req.query.userId

    var serviceCharge = amountToWithdraw / serviceChargePercentage;

    try {
        const userById = await getRepository(User).findOne(userId);
        if (userById && userById.transactionPin === transactionPin) {
            var userWalletBalance = userById.walletAccountId.accountBalance
            var amountAfterCharge = amountToWithdraw + serviceCharge
            var newBalance = userWalletBalance - amountAfterCharge
            userById.walletAccountId.accountBalance = newBalance
            userById.walletAccountId.lastDeposit = 0
            userById.walletAccountId.lastPaymentMethod = paymentMethod
            userById.walletAccountId.lastServiceCharge = serviceCharge

            const user = await getRepository(User).save(userById);
            try {
                // Creating a logger
                const log = new ZlogWalletAccount();
                var action = "Withdrawal"
                var description = "You made a withdrawal of " + amountToWithdraw + " to your account"
                log.amount = amountToWithdraw
                log.currentAccountBalance = userWalletBalance
                log.date = new Date()
                log.description = description
                log.service = action
                log.status = "Completed!"
                log.transactionCharge = serviceCharge
                log.userId = user
                await getRepository(ZlogWalletAccount).save(log)

                return res.status(200).send({ success: true, message: "Deposit was Successful", user })

            } catch (error) {
                console.log(error)
                return res.status(500).send({ success: false, message: "Error", error })
            }


        } else {
            return res.status(201).send({ success: false, message: "Invalid Transaction Pin" })
        }


    } catch (error) {
        return res.status(500).send({ success: false, error, message: "Failed!" })
    }
};

export const transfer = async (req: Request, res: Response) => {

    var amountToTransfer = parseFloat(req.query.amountToWithdraw)
    var transactionPin = req.query.transactionPin
    var userId = req.query.userId
    var recipientAcctNo = req.query.recipientAcctNo
    var recipientUserId = req.query.recipientUserId

    var percentageAmount = 0.1;
    var calculatedPercentage = amountToTransfer * percentageAmount
    var serviceCharge = calculatedPercentage / 100;

    try {
        const userById = await getRepository(User).findOne(userId);
        if (userById && userById.transactionPin === transactionPin) {
            var totalTranserExpenses = amountToTransfer + serviceCharge
            var userWalletBalance = userById.walletAccountId.accountBalance
            var amountAfterTransfer = userWalletBalance - totalTranserExpenses
            var newBalance = amountAfterTransfer
            userById.walletAccountId.accountBalance = newBalance
            userById.walletAccountId.lastDeposit = 0
            userById.walletAccountId.lastServiceCharge = serviceCharge


            const recipientId = await getRepository(User).findOne(recipientUserId);
            if (recipientId && recipientId.walletAccountId.accountNumber === recipientAcctNo) {
                var currentBal = recipientId.walletAccountId.accountBalance
                var newBal = currentBal + amountToTransfer
                recipientId.walletAccountId.accountBalance = newBal
                await getRepository(User).save(recipientId);
                const user = await getRepository(User).save(userById);

                try {
                    // Creating a logger
                    const log = new ZlogWalletAccount();
                    var action = "Transfer"
                    var description = "You made a Transfer of " + amountToTransfer + " to " + recipientAcctNo
                    log.amount = amountToTransfer
                    log.currentAccountBalance = userWalletBalance
                    log.date = new Date()
                    log.description = description
                    log.service = action
                    log.status = "Completed!"
                    log.transactionCharge = serviceCharge
                    log.userId = user
                    await getRepository(ZlogWalletAccount).save(log)

                    return res.status(200).send({ success: true, message: "Transfer was Successful", user })

                } catch (error) {
                    console.log(error)
                    return res.status(500).send({ success: false, message: "Error", error })
                }
            } else {
                return res.status(201).send({ success: false, message: "Recipient Account Number Invalid" })
            }





        } else {
            return res.status(201).send({ success: false, message: "Invalid Transaction Pin" })
        }


    } catch (error) {
        return res.status(500).send({ success: false, error, message: "Failed!" })
    }
};


export const getUserWalletByAccountNumber = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userById = await getRepository(User).findOne(req.params.accountNo);
        console.log(req.params.accountNo)
        console.log(userById)
        const userWallet = userById
        if (userById) {
            return res.status(200).send({ success: true, message: "Account found", data: userWallet })
        }
        else {
            return res.status(404).send({ success: false, message: "User Wallet Not Found!" })
        }

    } catch (error) {
        return res.status(500).send({ success: false, error, message: "Failed!" })

    }
}

// // get User Account Balance
// export const searchSubmissionsByUniqueQuoteNumber = async (req: Request, res: Response): Promise<Response> => {
//     const quotes = await getRepository(User).find({

//         where: { WalletAccount: req.query.uniqueId },
//     });
//     return res.status(200).send(quotes);
// };
