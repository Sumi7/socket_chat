var moment = require('moment');
function generateMessage(from, text){
  return {
      from,
      text,
      createdAt: moment().valueOf()
  };
}

module.exports = generateMessage;
