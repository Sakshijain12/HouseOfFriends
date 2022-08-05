const mongoose = require("mongoose");
const schema = mongoose.Schema;

const removalDb = new schema(
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

const removalModel = mongoose.model("RemovalDb", removalDb);

module.exports = removalModel;