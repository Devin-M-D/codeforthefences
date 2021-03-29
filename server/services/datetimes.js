var moment = require('moment')

module.exports = {
  utcNow: () => {
    return moment.utc().format("YYYY-MM-DD hh:mm:ss")
  }
}
