const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const fetch = require('node-fetch');
const cors = require('cors');

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Allow cors everywhere
app.use(cors());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.post('/rankData', async (req, res) => {
  const authResponse = await authorize();
  //console.log(authResponse.headers.raw()['set-cookie']);
  const asid = getCookiesFromResposne(authResponse, 'asid');
  const authResponse2 = await authenticate(req, asid);
  const ssid = getCookiesFromResposne(authResponse2, 'ssid');
  const userId = getCookiesFromResposne(authResponse2, 'sub').split('=')[1];
  //console.log({ssid});
  //console.log({userId});
  const js = await authResponse2.json();
  const accessToken = js.response.parameters.uri.split('access_token=')[1].split('&scope')[0];
  const entRes = await getEntitlementToken(ssid, accessToken);
  const entResJson = await entRes.json();
  const entitlementToken = entResJson["entitlements_token"];
  //console.log({entResJson});
  const rankInfoRes = await getRankInfo(ssid, accessToken, entitlementToken, userId);
  const jsonRankInfo = await rankInfoRes.json();
  //console.log({jsonRankInfo});
  res.send(jsonRankInfo);
});

const getCookiesFromResposne = (res, cookieName) => {
  const cookies = res.headers.raw()['set-cookie'];
  return cookies.filter(c => c.indexOf(cookieName) >= 0)[0].split(';')[0];
}

const authorize = async () => {
  return fetch('https://auth.riotgames.com/api/v1/authorization', {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
      'Accept' : '*/*',
      'User-Agent': 'PostmanRuntime/7.26.8'

    },
    body: JSON.stringify({
    "client_id":"play-valorant-web-prod",
    "nonce":"1",
    "redirect_uri":"https://beta.playvalorant.com/opt_in",
    "response_type":"token id_token",
    "scope":"account openid"
  })
  });
}

const authenticate = async (req, asid) => {
  return fetch('https://auth.riotgames.com/api/v1/authorization', {
    method: 'PUT',
    headers: {
      'Content-Type' : 'application/json',
      'Accept' : '*/*',
      'User-Agent': 'PostmanRuntime/7.26.8',
      cookie : `${asid}`
    },
    body: JSON.stringify(
      {
        "type":"auth",
        "username": req.body.username,
        "password": req.body.password
      }
    )
  })
}

const getEntitlementToken = async (ssid, accessToken) => {
  return fetch('https://entitlements.auth.riotgames.com/api/token/v1', {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
      'Accept' : '*/*',
      'User-Agent': 'PostmanRuntime/7.26.8',
      cookie : `${ssid}`,
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({})
  })
}

const getRankInfo = async (ssid, accessToken, entitlementToken, userId) => {
  return fetch(`https://pd.ap.a.pvp.net/mmr/v1/players/${userId}/competitiveupdates?startIndex=0&endIndex=20`, {
    method: 'GET',
    headers: {
      'Content-Type' : 'application/json',
      'Accept' : '*/*',
      'User-Agent': 'PostmanRuntime/7.26.8',
      cookie : `${ssid}`,
      'Authorization': `Bearer ${accessToken}`,
      'X-Riot-Entitlements-JWT': entitlementToken
    }
  })
}

app.listen(process.env.PORT || 8080);