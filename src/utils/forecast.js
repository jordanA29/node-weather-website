const request = require('request');

const forecast = (lat, long, callback) => {
  const url = `https://api.darksky.net/forecast/41fce7b9b63db75f5aed1dc53c2bf4a0/${lat},${long}?units=auto`;
  request({ url, json: true }, (error, { body } = {}) => {
    if (error) {
      callback('Unable to connect to weather service');
    } else if (body.error) {
      callback('Unable to find location', body.error);
    } else {
      const dailyData = body.daily.data[0];
      callback(
        undefined,
        dailyData.summary +
          ` It is currently ${
            body.currently.temperature
          } degrees out. There is ${body.currently.precipProbability *
            100} % chance of rain. The high is ${
            dailyData.temperatureHigh
          } and the low is ${dailyData.temperatureLow}`
      );
    }
  });
};

module.exports = forecast;
