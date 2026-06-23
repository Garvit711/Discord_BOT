const { userModes } = require("../Models/connect");


async function setReminder(message, response){
  const userId = message.author.id;
  let guild = message.guildId;
  let channel = message.channelId;
//   const text = message.content.toLowerCase();

  try{
      const track_id = userId+guild+channel;
      if(userReminders.has(track_id)){
          return await message.reply(`<@${userId}> A Reminder is already running.....`)
      }
      else{
      const numberMatch = response.match(/\d+/);
      let breakMins = 10;
      if (numberMatch) {
        breakMins = parseInt(numberMatch[0]);
        if(response.includes('hour')) breakMins *= 60;
        if(response.includes('second')) breakMins /= 60;
      }
      if(breakMins > 120){
         return await message.reply(`🤖 Sorry, but I'm not getting paid enough to babysit your break for ${breakMins} minutes 💀☕😂`)
      }
       await setTimeOut(userId, breakMins, message, null);
       return await message.reply(`🩷⏰ Okii pookie, I'll remind you ${breakMins} minutes later ✨🫶`)
    }
}

  catch(error){
      console.log("Set_Reminder Error", error);
      message.reply(`<@${userId}> I am unable to set reminder for now`)
  }

}

async function changeReminder(message, response){
     const userId = message.author.id;
      let guild = message.guildId;
      let channel = message.channelId;
    //   const text = message.content.toLowerCase();
  try{
      const track_id = userId+guild+channel;
       if(!userReminders.has(track_id)){
          return await message.reply(`<@${userId}> No Active Reminder is there Bud`)
      } 
     const numberMatch = response.match(/\d+/);
      let breakMins = 10;
      if (numberMatch) {
        breakMins = parseInt(numberMatch[0]);
        if(response.includes('hour')) breakMins *= 60;
        if(response.includes('second')) breakMins /= 60;
        if(breakMins === 42069){
             if(userReminders.has(track_id)){
                  clearTimeout(userReminders.get(track_id).timeout);
                  userReminders.delete(track_id);
             }
            return await message.reply(`💅✨ Reminder removed successfully, pookie 🫶💖`);

        }
         if(breakMins > 120){
           return await message.reply(`🤖 Sorry, but I'm not getting paid enough to babysit your break for ${breakMins} minutes 💀☕😂`)
         }
         const data = userReminders.get(track_id)
         const prevStartTime = data.startTime;
         const totalElapsedMs = new Date() - prevStartTime;
         const elapsedMins = totalElapsedMs / (1000 * 60);
         if(elapsedMins >= breakMins){
             return await message.reply(`<@${userId}> 🚨 Boss, we're already past that break time.`);
         }
         breakMins -= elapsedMins;
         await setTimeOut(userId, breakMins, message, prevStartTime)
         return await message.reply(`🫶✨ Done, pookie. Your reminder got a little makeover 💖⏰`);
      }
      else{
          return await message.reply(`🚩 Orders unclear, Comrade. Provide the new reminder time before we proceed 🫡⏰`)
      }
      

  }
  catch(error){
       console.log("change_Reminder Error", error);
       message.reply(`<@${userId}> I am unable to change reminder for now`)
     
  }
}



const userReminders = new Map();
async function setTimeOut(userId, delay, message, prevTime){
  let guild = message.guildId;
  let channel = message.channelId;
  const unique = userId+guild+channel;
  
    if(userReminders.has(unique)){
        clearTimeout(userReminders.get(unique).timeout);
        userReminders.delete(unique);
    }
    const newTimeout = setTimeout(async ()=>{
        message.channel.send(`<@${userId}>, 📢☭ Attention, Comrade! The scheduled reminder has been deployed. Return to duty 🫡⏰`);
        userReminders.delete(unique);
    }, delay * 60 * 1000);
     userReminders.set(unique, {
      timeout: newTimeout,
      startTime: prevTime || new Date()
  });
}


module.exports = {setReminder, changeReminder}