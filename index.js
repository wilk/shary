#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const http = require('http');
const ngrok = require('ngrok');
const qrcode = require('qrcode-terminal');

const BOLD = '\033[1m';

const main = async () => {
  if (process.argv.length < 3) return console.error('Missing file to serve: please provide one.');

  const filePath = path.resolve(__dirname, process.argv[2]);
  const url = await ngrok.connect(8080);

  const server = http.createServer((req, res) => {
    const stream = fs.createReadStream(filePath);
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
  Ready to serve >> ${BOLD}${filePath}
  = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  `);

  qrcode.generate(url);

  console.log(`
  = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  Scan this QRCode to download the file or go to this link: ${BOLD}${url}
  = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  `);
};

main();
