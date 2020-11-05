const request = require('request-promise-native');

const fetchMyIP= function(){
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`http://ip-api.com/json/${ip}`);
};

const fetchISSFlyOverTimes = function(body){
  const coords = {
    latitude: JSON.parse(body).lat,
    longitude: JSON.parse(body).lon
  };
  return request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`);
};

const nextISSTimesForMyLocation = function(body){
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then((data) => {
    const { response } = JSON.parse(data);
    return response;
  });
};

module.exports = nextISSTimesForMyLocation;