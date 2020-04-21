const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
const https = require('https')
const crypto = require('crypto')
require('dotenv').config()

app.use(express.static(__dirname + '/dist/memoria'));
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/memoria/index.html'));
});

app.get('/getcharacters', getCharactersData, function(req, res) {

});

function getCharactersData(req, res, next) {
  const ts = Date.now();
  let privateKey = process.env.MARVEL_PRIVATE_KEY
  let publicKey = process.env.MARVEL_PUBLIC_KEY
  let hash = crypto.createHash('md5')
  .update(`${ts}${privateKey}${publicKey}`)
  .digest("hex")
  const options = {
    hostname: 'gateway.marvel.com',
    port: 443,
    path: `/v1/public/characters?limit=12&orderBy=modified&apikey=${publicKey}&ts=${ts}&hash=${hash}`,
    method: 'GET'
  }
  let charactersData = '';
  const request = https.request(options, response => {
    console.log(`statusCode: ${response.statusCode}`)
    response.on('data', d => {
      charactersData += d
      // process.stdout.write(d)
    })
    response.on('end', () => {
      try {
        const parsedData = JSON.parse(charactersData);
        console.log(parsedData.data.limit);
        res.send(parsedData)
      } catch (e) {
        console.error(e.message);
      }
    });
  })

  request.on('error', error => {
    console.error(error)
  })

  request.end()
}

app.listen(port, () => {
  console.log(`listening on ${port}`)
});