/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');
const fetchMyIP = function(callback) {
  request("https://api.ipify.org/?format=json", (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(error, JSON.parse(body).ip);
  });
};
const fetchCoordsByIP = function(ip, callback) {
  request(`http://ip-api.com/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (JSON.parse(body).status === "fail") {
      const msg = `Status fail when fetching coordinates. Response: ${JSON.parse(body).message}`;
      callback(Error(msg), null);
      return;
    }
  
    const data = {
      latitude: JSON.parse(body).lat,
      longitude: JSON.parse(body).lon
    };
    callback(error, data);
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (JSON.parse(body).message === "failure") {
      const msg = `Status fail when fetching times. Reason: ${JSON.parse(body).reason}`;
      callback(Error(msg), null);
      return;
    }
  
    const data = JSON.parse(body).response;
    callback(error, data);
  });
};

// iss.js 

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
    };
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        callback(error, null);
      };
      fetchISSFlyOverTimes(coords, (error, times) =>{
        if (error) {
          callback(error, null);
        };
        callback(error, times);
      })
    })
  });
}
module.exports = { nextISSTimesForMyLocation };
