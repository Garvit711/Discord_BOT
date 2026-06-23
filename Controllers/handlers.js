const { StudySession } = require("../Models/connect");

async function handleStart(message) {
  const userId = message.author.id;
  const guildId = message.guildId;
  const channelId = message.channelId;

  try {
    const activeSession = await StudySession.findOne({
      userId: userId,
      guildId: guildId,
      channelId: channelId,
      status: { $in: ["studying", "on_break"] },
    });
    if (activeSession) {
      message.reply(
        `${message.author.globalName} you already have a study session going on🙏😭`,
      );
    } else {
      const newSession = new StudySession({
        userId,
        guildId,
        channelId,
        status: "studying",
        startTime: new Date(),
      });
      await newSession.save();
      message.reply(
        `📝 **Session Started!** I've locked you in ${message.author.globalName}. Focus up, and let me know when you need a break or finish!`,
      );
    }
  } catch (error) {
    console.log(error);
    message.reply(
      `Error Encountered while creating ${message.author.globalName} study session`,
    );
  }
}

async function handleBreak(message, response) {
  const userId = message.author.id;
  const guildId = message.guildId;
  const channelId = message.channelId;
  const text = message.content.toLowerCase();
  try {
    const session = await StudySession.findOne({
      userId: userId,
      guildId: guildId,
      channelId: channelId,
      status: { $in: ["studying", "on_break"] },
    });
    if (!session) {
      message.reply(
        `${message.author.globalName} you are not active on study right now I cant do it`,
      );
    } else if (session.status === "on_break") {
      // will add handling hours and seconds
      // also no extend or increase is there only change is possible
      if(!response.includes("CHANGE")){
          return await message.reply(`💀🍔 BRO IS ALREADY ON A BREAK AND WANTS ANOTHER ONE 😭🙏`);
      }
      const numberMatch = response.match(/\d+/);
      let breakMins = 10;
      if (numberMatch) {
        if (session.breaks.length > 0) {
          let breakMins = parseInt(numberMatch[0]);
          if(response.includes('hour')){
             breakMins *= 60;
          }
          if(response.includes('second')){
             breakMins /= 60;
          }
          const currentBreak = session.breaks.find(
            (b) => b.breakStartTime && !b.breakEndTime,
          );
          const now = new Date();
          const totalElapsed = now - new Date(currentBreak.breakStartTime);
          const elapsedSeconds = Math.floor(totalElapsed / 1000);
          const elapsedMins = Math.floor(elapsedSeconds / 60);
          if (elapsedMins >= breakMins) {
            message.reply(
              `<@${userId}> 🚨 Boss, we're already past that break time.`,
            );
          } else {
            session.breaks[session.breaks.length - 1].durationExpected =
              breakMins;
            await session.save();
            const timeOutDelay = breakMins - elapsedMins;
            message.reply(`<@${userId}> 🔄 Your break has been updated to ${breakMins} mins.`);
            setTimeOut(userId, timeOutDelay, breakMins, session._id, message);
          }
        }
      } else {
        message.reply(`<@${userId}> 🕒 Boss, what would you like to change the time to?`);
      }
    } else {
      if(response.includes("CHANGE")){
        return await message.reply(`🍔💀 Bro is managing imaginary break schedules now 😭 You haven't even started a break yet 💀`)
      }
      const numberMatch = response.match(/\d+/);
      let breakMins = 10;
      if (numberMatch) {
        breakMins = parseInt(numberMatch[0]);
        if(response.includes('hour')) breakMins *= 60;
        if(response.includes('second')) breakMins /= 60;
      }
      session.status = "on_break";
      session.breaks.push({
        breakStartTime: new Date(),
        durationExpected: breakMins,
      });
      await session.save();
      message.reply(
        `☕ **Break mode active!** Your ${breakMins}-minute timer starts now. Go clear your head!`,
      );
      setTimeOut(userId, breakMins, breakMins, session._id, message);
    }
  } catch (error) {
    console.log("Break Creation Error", error);
    message.reply(`<@${userId}> I am facing Trouble in Break Creation`);
  }
}

async function handleBreakOver(message) {
  const userId = message.author.id;
  const guildId = message.guildId;
  const channelId = message.channelId;

  try {
    const session = await StudySession.findOne({
      userId: userId,
      guildId: guildId,
      channelId: channelId,
      status: { $in: ["studying", "on_break"] },
    });
    if (!session) {
      message.reply(`<@${userId}> start a session first to cancel you break`);
    } else if (session.status === "studying") {
      message.reply(`<@${userId}>, No Active Breaks were going on for you`);
    } else {
      session.status = "studying";
      if (session.breaks.length > 0) {
        session.breaks[session.breaks.length - 1].breakEndTime = new Date();
      }
      await session.save();
       if(userTimeouts.has(userId)){   // this will remove the PING 
        clearTimeout(userTimeouts.get(userId));
         userTimeouts.delete(userId);
      }
      return message.reply(
        "🚀 **Welcome back!** Your break has been logged as finished. Back to grinding!",
      );
    }
  } catch (error) {
    console.log("Break Over Error: ", error);
    message.reply(
      `<@${userId}> I am Unable to check your Break Status right now`,
    );
  }
}

async function handleEnd(message) {
  const userId = message.author.id;
  const guildId = message.guildId;
  const channelId = message.channelId;
  try {
    const session = await StudySession.findOne({
      userId: userId,
      guildId: guildId,
      channelId: channelId,
      status: { $in: ["studying", "on_break"] },
    });
    if (!session) {
      message.reply(
        `Bro, you haven't started studying yet, stop imagining the victory edit 💀🔥`,
      );
    } else {
      const endTime = new Date();
      session.endTime = endTime;

      if (session.status === "on_break" && session.breaks.length > 0) {
        const lastBreak = session.breaks[session.breaks.length - 1];
        if (!lastBreak.breakEndTime) lastBreak.breakEndTime = endTime;
      }
      session.status = "completed";

      let totalStudyTime = endTime - session.startTime;

      let breakTime = 0;
      if (session.breaks && session.breaks.length > 0) {
        session.breaks.forEach((b) => {
          const startTime = new Date(b.breakStartTime);
          const breakEnd = b.breakEndTime ? new Date(b.breakEndTime) : endTime;

          breakTime += breakEnd - startTime;
        });
      }

      let effectiveStudyTime = (totalStudyTime - breakTime) / (1000 * 60);
      session.totalStudyDuration = Math.max(0, Math.round(effectiveStudyTime));
      await session.save();
      message.reply(
        `🏆 **Session Wrapped Up!**\n⏱️ You studied for a net total of **${session.totalStudyDuration} minutes** (excluding breaks). Brilliant work today!`,
      );
    }
  } catch (error) {
    console.log("Ending Study Tracker Error: ", error);
    message.reply(`Unable to END the session right now`);
  }
}
const userTimeouts = new Map();
async function setTimeOut(userId, delay, breakMins, sessionId, message){
  let guild = message.guildId;
  let channel = message.channelId;
  const unique = userId+guild+channel;
  
    if(userTimeouts.has(unique)){
        clearTimeout(userTimeouts.get(unique));
        userTimeouts.delete(unique);
    }
    const newTimeout = setTimeout(async ()=>{
        const currentSession = await StudySession.findById(sessionId);
        if (currentSession && currentSession.status === "on_break") {
            currentSession.status = "studying";
            if (currentSession.breaks.length > 0) {
              currentSession.breaks[
                currentSession.breaks.length - 1
              ].breakEndTime = new Date();
            }
               await currentSession.save();
                message.channel.send(
              `<@${userId}>, ⏰ **Your ${breakMins}-minute break is over!** Time to dive back in.`);
        }
        userTimeouts.delete(unique);
    }, delay * 60 * 1000);
     userTimeouts.set(unique, newTimeout);
}

async function handleSessionTime(message){
    const userId = message.author.id;
    const guildId = message.guildId;
    const channelId = message.channelId;
    try{
        const session = await StudySession.findOne({
        userId: userId,
        guildId: guildId,
       channelId: channelId,
        status: { $in: ["studying", "on_break"] },
      });
      if (!session) {
      message.reply(
        `Bro, you haven't started studying yet, stop imagining the victory edit 💀🔥`,
      );
    }
    else{
        const checkTime = new Date();
        let totalStudyTime = checkTime - session.startTime;
          let breakTime = 0;
          if (session.breaks && session.breaks.length > 0) {
        session.breaks.forEach((b) => {
          const startTime = new Date(b.breakStartTime);
          const breakEnd = b.breakEndTime ? new Date(b.breakEndTime) : checkTime;

          breakTime += breakEnd - startTime;
        });
       }
       let effectiveStudyTime = (totalStudyTime - breakTime) / (1000 * 60);
       let finalCalculated = Math.max(0, Math.round(effectiveStudyTime));
       if(finalCalculated <= 0){
          message.reply(`<@${userId}> 😭 0 minutes studied. Stop romanticizing productivity and actually begin.`);
       }
       else{
          message.reply(`<@${userId}> 🌟 You've studied for ${finalCalculated} minutes so far. Future you will thank you for today's effort. 📚`)
       }

    }

 }
    catch(error){
        console.log("Error while getting the session time", error);
        message.reply(`<@${userId}> I am unable to get your session time right now`)
    }
}

module.exports = { handleStart, handleBreak, handleBreakOver, handleEnd, handleSessionTime };
