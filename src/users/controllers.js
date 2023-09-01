const User = require("./model")
const jwt = require("jsonwebtoken")

const  registerUser = async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(201).json({
            message: "Successfully registered",
             user: {username: user.username, email: user.email}
             })
    } 
    catch (error) {
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
                token: token,
            }
        })
    }
    catch (error) {
        res.status(501).json({errorMessage: error.message, error: error})
    }
}

const  deleteUser = async (req, res) => {
    try {
        const token = req.header("Authorization")
        const decodedToken = jwt.verify(token, process.env.SECRET)
        const deletedUser = await User.destroy({
            where: {
                id: decodedToken.id
            }})
        res.status(201).json({
            message: "Successfully deleted",
             amount: deletedUser
            })
    } 
    catch (error) {
        res.status(501).json({ errorMessage: error.message, error: error})
        console.log(error)
    }
}

const search = async (req, res) => {
    try {
        const token = req.header("Authorization")
        const decodedToken = jwt.verify(token, process.env.SECRET)
        const user = await User.findOne({
            where: {
                id: decodedToken.id
            }
        })

        res.status(200).json({
            message: "Success", 
            user: user
        })
    }
    catch (error) {
        res.status(501).json({message: error.message, error: error})
        console.log(error)
    }
}

//CONTROLLER TO ADD LOCATION TO USER MODEL, TAKE USER INFO IN REQ, USE USER INFO TO FIND USER, ADD LOCATION TO USER DATA
const addLocation = async (req, res) => {
    try{
        //FIND USER IN DATABASE
        const token = req.header("Authorization")
        const decodedToken = jwt.verify(token, process.env.SECRET)
        const user = await User.findOne({
            where: {
                id: decodedToken.id
            }
        })
            
        let updatedUser
        if (user.favoriteLocations !== "") {
            updatedUser = await User.update({
                favoriteLocations : user.favoriteLocations + `, ${req.body.newLocation}` 
            }, {
                where: {
                    username: user.username
                }
            });
        } else {
            updatedUser = await User.update({
                favoriteLocations : req.body.newLocation 
            }, {
                where: {
                    username: user.username
                }
            });
        }

        res.status(200).json({
            message: "Successfully added location",
            user: {
                username: updatedUser.username,
                favoriteLocations: updatedUser.favoriteLocations
            }
        })
    }
    catch (error) {
        res.status(501).json({errorMessage: error.message, error: error})
    }
}

const removeLocation = async (req, res) => {
    try{
        //FIND USER IN DATABASE
        const token = req.header("Authorization")
        const decodedToken = jwt.verify(token, process.env.SECRET)
        const user = await User.findOne({
            where: {
                id: decodedToken.id
            }
        })
            
        let array = user.favoriteLocations.split(", ")

        if (array.indexOf(req.body.removedLocation) === 0 && array.length == 1) {
            updatedUser = await User.update({
                favoriteLocations : user.favoriteLocations.replace(`${req.body.removedLocation}`, "")
            },{
                where: {
                    username: user.username
                }
            })
            
        } else if (array.indexOf(req.body.removedLocation) === 0) {
            updatedUser = await User.update({
                favoriteLocations : user.favoriteLocations.replace(`${req.body.removedLocation}, `, "")  
            }, {
                where: {
                    username: user.username
                }
            });
        } else {
            updatedUser = await User.update({
                favoriteLocations : user.favoriteLocations.replace(`, ${req.body.removedLocation}`, "")
            }, {
                where: {
                    username: user.username
                }
            });
        } 

        res.status(200).json({
            message: "Successfully removed location",
            user: {
                username: updatedUser.username,
                favoriteLocations: updatedUser.favoriteLocations
            }
        })
    }
    catch (error) {
        res.status(501).json({errorMessage: error.message, error: error})
    }
}

module.exports = {
    registerUser,
    login,
    deleteUser,
    search,
    addLocation,
    removeLocation
}