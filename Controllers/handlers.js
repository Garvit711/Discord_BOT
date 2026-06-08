const { StudySession } = require("../Models/connect");

async function handleStart(message) {
  const userId = message.author.id;
  const guildId = message.guildId;
  const channelId = message.channelId;

  try {
    const activeSession = await StudySession.findOne({
      userId: userId,
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

async function handleBreak(message) {
  const userId = message.author.id;
  const guildId = message.guildId;
  const channelId = message.channelId;
  const text = message.content.toLowerCase();
  try {
    const session = await StudySession.findOne({
      userId: userId,
      status: { $in: ["studying", "on_break"] },
    });

    if (!session) {
      message.reply(
        `${message.author.globalName} you are not active on study right now I cant do it`,
      );
    } else if (session.status === "on_break") {
      // Check if they want to adjust the time instead of denying them then
      const numberMatch = text.match(/\d+/);

      if (numberMatch) {
        let breakMinutes = parseInt(numberMatch[0]);
        if (session.breaks.length > 0) {
          session.breaks[session.breaks.length - 1].durationExpected =
            breakMinutes;
        }
        await session.save();
        message.reply(
          `🔧 **Break Updated!** I've adjusted your current break timer to **${breakMinutes} minutes**.`,
        );
      } else if (text.includes("extend") || text.includes("increase")) {
        message.reply(
          `Break: 100% | 📚 Study: 0% — Extension of break denied ❌😭`,
        );
      } else {
        message.reply(`😭🙏 Bro, you're already on a break.`);
      }
    } else {
      const numberMatch = text.match(/\d+/); // Parsing the break time
      let breakMinutes = 10; // Default time

      if (numberMatch) {
        breakMinutes = parseInt(numberMatch[0]);
      }
      session.status = "on_break";
      session.breaks.push({
        breakStartTime: new Date(),
        durationExpected: breakMinutes,
      });
      await session.save();
      message.reply(
        `☕ **Break mode active!** Your ${breakMinutes}-minute timer starts now. Go clear your head!`,
      );

      // Handling Break time to do the PING
      setTimeout(
        async () => {
          const currentSession = await StudySession.findById(session._id);
          if (currentSession && currentSession.status === "on_break") {
            currentSession.status = "studying";
            if (currentSession.breaks.length > 0) {
              currentSession.breaks[
                currentSession.breaks.length - 1
              ].breakEndTime = new Date();
            }

            await currentSession.save();
            message.channel.send(
              `<@${userId}>, ⏰ **Your ${breakMinutes}-minute break is over!** Time to dive back in.`,
            );
          }
        },
        breakMinutes * 60 * 1000,
      );
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
  try {
    const session = await StudySession.findOne({
      userId: userId,
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
module.exports = { handleStart, handleBreak, handleBreakOver, handleEnd };
