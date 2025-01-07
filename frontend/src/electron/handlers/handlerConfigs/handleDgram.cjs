const sendDgramData = {
  name: 'dgram',
  callback: function (e, data) {
    this.dgramClient.sendData(data)
  }
}

module.exports = sendDgramData
