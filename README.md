# Shary
Share your files effortlessly with QRCodes

![Shary](shary.gif)

## Usage
You want to share a file from your computer to, well, wherever you want:

```bash
$ npx shary hello.pdf
```

A new http connection is temporary created and served through `ngrok` on port `8080`, then a QRCode is generated from that url directly in your terminal.

Scan it with your smartphone and you're done!
