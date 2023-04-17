import { Router } from "express";
const verifyToken = require("../config/verifyToken");
const userRoute = Router();



import {
    getUsers,
    getUserById,
    createUser,
    login,
    // updateUser,
    // deleteUser,
    // signIn
} from "../controller/user.controller";

userRoute.post("/easywallet/login", login);
userRoute.get("/easywallet/getUsers", getUsers);
userRoute.get("/easywallet/getUserById/:id", verifyToken, getUserById);
userRoute.post("/easywallet/createUser", createUser);
// userRoute.put("/updateUser", verifyToken, updateUser);
// userRoute.delete("/deleteUser/:id", verifyToken, deleteUser);

export default userRoute;