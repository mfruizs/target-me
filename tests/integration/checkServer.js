const supertest = require('supertest');

const waitForServerToStart = (url, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const interval = 100; // Check every 100ms
    let timeElapsed = 0;

    const checkServer = () => {
      if (timeElapsed > timeout) {
        reject(new Error('Server did not start within the timeout'));
        clearInterval(intervalId);
      }

      supertest(url)
        .get('/200')
        .end((err, res) => {
          if (!err && res.status === 200) {
            clearInterval(intervalId);
            resolve();
          }
        });

      timeElapsed += interval;
    };

    const intervalId = setInterval(checkServer, interval);
  });
};

module.exports = { waitForServerToStart };