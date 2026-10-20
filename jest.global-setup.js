// The tests run in a time zone with daylight saving time, to check the dates
// around its changes. Node reads TZ when it changes, and the workers inherit it.
module.exports = () => {
  process.env.TZ = "Europe/Rome";
};
