const Login = require('../models/loginSchema')

exports.getLoginCredentials = ( req, res) => {
    res.status(200).json({message:" route is working fine"})
}