const mongoose = require("mongoose");
const schema = mongoose.Schema;

const invitationDb = new schema(
  {
    choices: [
      {
        vote: Boolean,
        voter_id: {
          type: schema.Types.ObjectId,
          ref: "userHof"
        }
      }
    ]
  }
);

const invitationModel = mongoose.model("InvitationDb", invitationDb);

module.exports = invitationModel;