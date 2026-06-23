async function modeSwitch(user, reqMode, message){
      const userId = message.author.id;
      const currMode = user.mode;

      if(currMode === reqMode){
          if(currMode === 1){
             await message.reply(`<@${userId}> Buddy I am on study mode only`);
          }
          else {
              await message.reply(`<@${userId}> Buddy I am on chill mode only`);
          }
      }
      else{
          const nextMode = 1 - currMode;
          user.mode = nextMode;
          await user.save();
          if(nextMode === 1){
             await message.reply(`<@${userId}> Study Mode Activated...!`);
          }
          else {
              await message.reply(`<@${userId}> Chill Mode Activated...!`);
          }
      }
      return 1;
}

module.exports = { modeSwitch }