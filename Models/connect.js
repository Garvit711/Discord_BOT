
// const dns = require("dns")
// dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
const mongoose = require("mongoose");
async function MongoDB(url) {
  return await mongoose
    .connect(url)
    .then(() => {
      console.log("MongoDb Connected");
    })
    .catch((error) => {
      console.log("Mongo DB ERROR", error);
    });
}
const studySessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["studying", "on_break", "completed", "canceled"],
    default: "studying",
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },

  breaks: [
    {
      breakStartTime: { type: Date, required: true },
      breakEndTime: { type: Date },
      durationExpected: { type: Number },
    },
  ],

  totalStudyDuration: {
    type: Number,
    default: 0,
  },

});

const userModeSchema = new mongoose.Schema({
   userId: {
    type: String,
    required: true,
    index: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  mode: {
    type: Number,
    default: 1,
  }

})

const StudySession = mongoose.model("StudySession", studySessionSchema);
const userModes = mongoose.model("userModes", userModeSchema);
module.exports = { StudySession, MongoDB , userModes};
