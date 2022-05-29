const House = require("../../model/house");

const houseServices = require('../house/house.services');

const {
    authenticationFailed,
    sendActionFailedResponse,
    actionCompleteResponse,
    actionCompleteResponsePagination,
} = require("../../common/common");

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
            creator:req.user_obj_id,
            membersOfHouse: [req.user_obj_id]
        }

        let detailsSaved = await new House(createObj).save();

        let msg = "House created successfully";

        actionCompleteResponse(res, detailsSaved, msg);
        console.log(detailsSaved);
    } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);
    }
};

// exports.getInvite = (req, res, next) => {
//   const token = 123456789;
//   res
//     .status(201)
//     .json({
//       message: "Here is the joining link",
//       joiningLink: `http://localhost:${process.env.PORT_NAME}/invite/${token}`,
//     });
// };

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