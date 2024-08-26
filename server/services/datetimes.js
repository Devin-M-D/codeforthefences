module.exports = {
  utcNow: () => {
    var d = new Date()
    var date = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDay().toString().padStart(2, "0")}`
    var time = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}.${d.getMilliseconds().toString().padEnd(3, "0")}`
    return `${date} ${time}`
  }
}
