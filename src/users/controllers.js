const User = require("./model")
const jwt = require("jsonwebtoken")

const  registerUser = async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(201).json({
            message: "Successfully registered",
             user: {username: user.username, email: user.email}
             })
    } catch (error) {
        res.status(501).json({ errorMessage: error.message, error: error})
        console.log(error)
    }
}

const login = async (req, res) => {
    try{
        // handles persistent login
        if (req.authUser) {
            res.status(200).json({message: "success", 
            user: {
                username: req.authUser.username,
                email: req.authUser.email
            }})
            return
        }
        // handles manual login
        const token = await jwt.sign({id: req.user.id}, process.env.SECRET)
        res.status(200).json({
            message: "Success",
            user: {
                username: req.body.username,
                email: req.body.email,
                token: token
            }
        })
    }
    catch (error) {
        res.status(501).json({errorMessage: error.message, error: error})
    }
}


module.exports = {
    registerUser,
    login
}