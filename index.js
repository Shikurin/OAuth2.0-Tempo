require('dotenv').config();

const express = require('express');
const path = require('path');
const request = require('request');

const app = express();

var accessToken;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.get('/grizz', (req, res) => {
  const options = {
    url: "https://api.tempo.io/core/3/worklogs?from=2018-01-28&to=2018-02-03",
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  };
  request.get(options, (err, resp, body) => {
    console.log(JSON.parse(body));
  });
});

app.get('/auth', (req, res) => {
  res.redirect(
    `https://daka-tec.atlassian.net/plugins/servlet/ac/io.tempo.jira/oauth-authorize/?client_id=${process.env.CLIENT_ID}&redirect_uri=http://localhost:3000/oauth-callback`
  );
});

app.get('/oauth-callback', (req, res) => {

  const requestToken = req.query.code;

  const options = {
    url: 'https://api.tempo.io/oauth/token/',
    form: {
      grant_type: `${process.env.GRANT_TYPE}`,
      client_id: `${process.env.CLIENT_ID}`,
      client_secret: `${process.env.CLIENT_SECRET}`,
      code: `${requestToken}`
    }
  };

  request.post(options, (err, resp, body) => {
    if (err) {
      return console.log(err);
    }
    response = JSON.parse(body);
    accessToken = response.access_token;
    console.log('My token:', accessToken);
    res.redirect(`/?token=${accessToken}`);
  });

});

app.listen(3000);
console.log('App listening on port 3000');
