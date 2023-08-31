const User = require("../users/model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const saltRounds = process.env.SALT_ROUNDS 


// hash password for data safety
const hashPass = async (req, res, next) => {
    try {
        req.body.password  = await bcrypt.hash(req.body.password, parseInt(saltRounds)) 

        formatEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!formatEmail.test(req.body.email)) {
            throw new Error("Email incorrect format");
        }
        
        next()
    } catch (error) {
        res.status(501).json({errorMessage: error.message, error: error})
    }

}

const comparePass = async (req, res, next) => {
    try{
        req.user = await User.findOne({
            where: {
                username: req.body.username
            }
        })

        if (req.user === null) {
            throw new Error("Username or password does not match!")
        }
        const match = await bcrypt.compare(req.body.password, req.user.password)

        if (!match) {
            const error = new Error("Username or password does not match")
            res.status(501).json({errorMessage: error.message, error: error})
        }

        if (req.email === null) {
            throw new Error("Email incorrect format")
        }

        formatEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        
        if (!formatEmail.test(req.body.email)) {
            throw new Error("Email incorrect format");
        }

        next()
    }
    catch (error) {
        res.status(501).json({errorMessage: error.message, error: error})
    }
}

const tokenCheck = async (req, res, next) => {
    try {
        const token = req.header("Authorization")
        
        const decodedToken = jwt.verify(token, process.env.SECRET)
        
        // check the user id encoded in the token exists in the database
        const user = await User.findOne({
            where: {
                id: decodedToken.id
            }
        })

        // if it doesn't exist - throw an error
        if (user === null) {
            throw new Error("User is not authorised!")
        }

        req.authUser = user
        // continue to the controller if it does exist
        next()
    
        
        
        // continue to the controller if it does exist
    }
    catch (error) {
        res.status(501).json({errorMessage: error.message, error: error})
    }
}

module.exports = {
    hashPass,
    comparePass,
    tokenCheck
};