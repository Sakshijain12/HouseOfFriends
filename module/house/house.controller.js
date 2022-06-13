const House = require("../../model/house");
const userDb = require('../../model/user.model');
const ChannelDb = require('../../model/channel.model');
const ChatDB = require('../../model/chat.model');

const houseServices = require('../house/house.services');

const commonFunctionForAuth = require("../../helpers/common");

const {
    authenticationFailed,
    sendActionFailedResponse,
    actionCompleteResponse,
    actionCompleteResponsePagination,
} = require("../../common/common");

let msg = "";

exports.getChannelChat = async (req, res, next) => {
    try {
        let { skip, limit, house_obj_id, channel_obj_id } = req.body
        let skipI = skip || 0
        let limitI = limit || 20

        if (!(house_obj_id && channel_obj_id)) {
            throw new Error("House feild & channel is required")
        }
        let checkIfUserHasAccessToHouse = {
            membersOfHouse: {
                $in: [req.user_obj_id]
            },
            _id: house_obj_id
        }

        let doesHaveAccess = await House.findOne(checkIfUserHasAccessToHouse)

        if (!doesHaveAccess) {
            throw new Error("You dont have access to the house")
        }

        let getChatCriteria = {
            house_obj_id: house_obj_id,
            channel_id: channel_obj_id,
        }

        let CHat = await ChatDB.find(getChatCriteria).skip(skipI).limit(limitI)

        let CHatTotal = await ChatDB.countDocuments(getChatCriteria)


        msg = "Chat data retrived";

        let result = {
            CHat,
            CHatTotal
        }

        actionCompleteResponse(res, result, msg);

    } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);

    }
}

exports.createChat = async (req, res, next) => {
    try {
        let {
            msg_type,
            msg,
            attachment_type,
            attachment_url,
            channel_id,
            house_obj_id
        } = req.body;


        let user_ob_id = req.user_obj_id

        let checkIfUserHasAccessToHouse = {
            membersOfHouse: {
                $in: [req.user_obj_id]
            },
            _id: house_obj_id
        }

        let doesHaveAccess = await House.findOne(checkIfUserHasAccessToHouse)
        if (!doesHaveAccess) {
            throw new Error("You dont have access to the house")
        }

        let insertObjCHat = {
            msg_type,
            msg,
            attachment_type,
            attachment_url,
            channel_id,
            house_obj_id,
            msg_sent_by: req.user_obj_id
        }

        await new ChatDB(insertObjCHat).save()
        msg = "Chat created successfully";


        actionCompleteResponse(res, "", msg);


    } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);
    }
}

exports.getAlChannel = async (req, res, next) => {
    try {
        let { skip, limit, house_obj_id } = req.body
        let skipI = skip || 0
        let limitI = limit || 20

        if (!house_obj_id) {
            throw new Error("House feild is required")
        }
        let checkIfUserHasAccessToHouse = {
            membersOfHouse: {
                $in: [req.user_obj_id]
            },
            _id: house_obj_id
        }

        let doesHaveAccess = await House.findOne(checkIfUserHasAccessToHouse)

        if (!doesHaveAccess) {
            throw new Error("You dont have access to the house")
        }

        let findCriChannelExistsWIthName = {
            house_obj_id: house_obj_id
        }

        let channelList = await ChannelDb.find(findCriChannelExistsWIthName).skip(skipI).limit(limitI)

        let channelListTotal = await ChannelDb.countDocuments(findCriChannelExistsWIthName)


        msg = "Channel data retrived";

        let result = {
            channelList,
            channelListTotal
        }

        actionCompleteResponse(res, result, msg);



    } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);

    }
}


exports.createChannel = async (req, res, next) => {
    try {

        let { name_of_chanel, house_obj_id, channel_icon } = req.body

        let checkIfUserHasAccessToHouse = {
            membersOfHouse: {
                $in: [req.user_obj_id]
            },
            _id: house_obj_id
        }

        let doesHaveAccess = await House.findOne(checkIfUserHasAccessToHouse)

        if (!doesHaveAccess) {
            throw new Error("You dont have access to the house")
        }

        let findCriChannelExistsWIthName = {
            name_of_chanel,
            house_obj_id: house_obj_id
        }

        let doesChannelExists = await ChannelDb.findOne(findCriChannelExistsWIthName)

        if (doesChannelExists) {
            throw new Error("Channel aldready exists with the name")
        }

        let insertObj = {
            name_of_chanel: name_of_chanel,
            house_obj_id: house_obj_id,
            channel_icon
        }

        let channelCreatedResult = await new ChannelDb(insertObj).save()

        msg = "Channel created successfully";

        actionCompleteResponse(res, channelCreatedResult, msg);

    } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);

    }
}

exports.createHouse = async (req, res, next) => {
    try {
        const {
            name,
            logo,
            displayIconUrl,
        } = req.body;

        await houseServices.checkIfHouseExistsWIththisName(name);

        const createObj = {
            name,
            logo,
            displayIconUrl,
            creator: req.user_obj_id,
            membersOfHouse: [req.user_obj_id]
        }

        let detailsSaved = await new House(createObj).save();

        let insertObjChannel = {
            name_of_chanel: "Default Channel",
            house_obj_id: detailsSaved._id,
            channel_icon: displayIconUrl,

        }

        await new ChannelDb(insertObjChannel).save()

        msg = "House created successfully";

        actionCompleteResponse(res, detailsSaved, msg);
        console.log(detailsSaved);
    } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);
    }
};

exports.getInvite = async (req, res, next) => {
    try {
        let findCriteria = {
            _id: mongoose.Types.ObjectId(req.user_obj_id),
        };

        let detailsSaved = await userDb.findOne(findCriteria);

        let tokenEmbed = {
            _id: detailsSaved._id,
            user_details: detailsSaved.user_details,
        };

        let token = commonFunctionForAuth.generateAccessToken(tokenEmbed);

        let findHouseCriteria = {
            membersOfHouse: mongoose.Types.ObjectId(req.user_obj_id)
        };

        let house = await House.findOne(findHouseCriteria);

        let joiningLink = `http://${process.env.HOST_NAME || "localhost"}:${process.env.PORT || 8000}/joinHouse/${token}/${house._id}`;

        msg = "Join the house through this link"

        actionCompleteResponse(res, joiningLink, msg);
        console.log(detailsSaved);

    } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);
    }
};

// exports.addMember = (req, res, next) => {
//   function validPattern(url) {
//     var token = 123456789;
//     if (token !== Number(req.params.token)) {
//       flag = false;
//     } else {
//       var pattern = `http://localhost:${process.env.PORT_NAME}/invite/${token}`;

//       var targetPattern = [];

//       for (var i = 0; i < 80; i++) {
//         targetPattern.push(url[i]);
//       }
//       var flag = true;
//       for (var i = 0; i < pattern.length; i++) {
//         if (targetPattern[i] == pattern[i]) {
//           flag = true;
//         } else {
//           flag = false;
//           break;
//         }
//       }
//     }
//     if (flag) {
//       return true;
//     } else {
//       return false;
//     }
//   }

//   var { name, contactNumber } = req.body;
//   var link = req.protocol + '://' + req.get('host') + req.originalUrl;
//   console.log(link);
//   if (validPattern(link)) {
//     var member = new Member({
//       name: name,
//       joiningLink: link,
//       contactNumber: contactNumber,
//     });
//     member
//       .save()
//       .then((data) => {
//         console.log(data);
//         return res
//           .status(201)
//           .json({ message: "Member added successfully!", records: data });
//       })
//       .catch((err) => {
//         if (!err.statusCode) {
//           err.statusCode = 500;
//         }
//         next(err);
//       });
//   } else {
//     return res.status(500).json({ message: "Invalid link" });
//   }
// };

// exports.deleteMember = (req, res, next) => {
//   const contactNumber = req.query.contactNumber;
//   console.log(contactNumber);
//   Member.findOne({ contactNumber: contactNumber })
//     .then((member) => {
//       console.log(member);
//       if (!member) {
//         const error = new Error("Could not find the member");
//         error.statusCode = 404;
//         throw error;
//       }
//       Member.deleteOne({ contactNumber: contactNumber }).then(result => {
//         return res.status(201).json({ message: "Succesfully deleted!" ,deleteCount : result});
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };