const { Router } = require("express")

const { hashPass, comparePass } = require("../middleware")

const { registerUser, login } = require("./controllers")

const userRouter = Router()

userRouter.post("/users/register", hashPass, registerUser)
userRouter.post("/users/login", comparePass, login)


module.exports = userRouter