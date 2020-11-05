const { fetchMyIP, fetchCoordsByIP } = require('./iss');

fetchCoordsByIP("96.55.237.96", (error, data) => {
  console.log(error, data);
});

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned IP:' , ip);
// });