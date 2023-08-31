const { Router } = require("express")

const { hashPass, comparePass, tokenCheck } = require("../middleware")

const { registerUser, login, deleteUser, addLocation, search, removeLocation} = require("./controllers")

const userRouter = Router()

userRouter.post("/users/register", hashPass, registerUser)
userRouter.post("/users/login", comparePass, login)
userRouter.get("/users/authCheck", tokenCheck, login) // persistent login
userRouter.delete("/users/delete", deleteUser)
userRouter.put("/users/addFavorite", addLocation)
userRouter.get("/users/search", search)
userRouter.put("/users/removeFavorite", removeLocation)

module.exports = userRouter