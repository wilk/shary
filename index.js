#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const http = require('http');
const ngrok = require('ngrok');
const qrcode = require('qrcode-terminal');

const main = async () => {
  if (process.argv.length < 3) return console.error('Missing file to serve: please provide one.');
  const filePath = path.resolve(__dirname, process.argv[2]);
  console.log(filePath);
  const stream = fs.createReadStream(filePath);

  const url = await ngrok.connect(8080);

  const server = http.createServer((req, res) => {
    stream.pipe(res);
    stream.on('end', async () => {
      console.log('File served! Closing all the connections...');
      server.close();
      await ngrok.kill();
      console.log('Connection closed, goodbye!');
    });
  }).listen(8080);

  console.log(`
  = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  Ready to serve >> ${'\033'}[1m${filePath}
  = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  `);
  qrcode.generate(url);

  console.log(`
  = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  Scan this QRCode to download the file!
  = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  `);
};

main();
