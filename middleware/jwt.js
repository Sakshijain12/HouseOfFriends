const jwt = require('jsonwebtoken')
require('dotenv').config()
const commonFunction = require("../common/common")
const userDB = require("../model/user.model");
const mongoose = require("mongoose");

exports.verifyJwtToken = async (req, res, next) => {
    let token = req.headers["x-access-token"];
    try {
        if (!token) {
            throw new Error("Permission denied")
        }
        let decoded = await jwt.verify(token, commonFunction.tokenDetails.TOKENSECRET)
        req.driver_obj_id = decoded._id
        if (req.driver_obj_id) {
            let findCriteria = {
                _id: mongoose.Types.ObjectId(req.driver_obj_id),
            }
            let driverDetails = await userDB.find(findCriteria)
            if (driverDetails && Array.isArray(driverDetails) && driverDetails.length) {
                req.driverDetails = driverDetails[0]
                next();
            } else {
                throw new Error("User not found")
            }
        } else {
            throw new Error("Token is invalid")
        }

    } catch (err) {
        console.log(err)
        return commonFunction.sendActionFailedResponse(res, null, err.message)
    }

}