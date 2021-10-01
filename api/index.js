const express = require('express')
const fs = require('fs');
const axios = require('axios');

// Create express instance
const app = express()

app.get('/', (req, res) => res.status(200).json([{ name: "sss" }, { name: "John" }]))

app.get('/list', (req, res) => {
  let data = JSON.parse(fs.readFileSync(`${__dirname}/list.json`).toString());
  res.status(200).json(JSON.stringify(data))
})

app.get('/anime', (req, res) => {
  let data = JSON.parse(fs.readFileSync(`${__dirname}/anime/${req.url.split("?")[1]}.json`).toString());
  res.status(200).json(JSON.stringify(data))
})

app.get('/getdonations', (req, res) => {
  let data = fs.readFileSync(`${__dirname}/donations.txt`).toString();
  res.status(200).send(data);
})

app.get('/video', (req, res) => {
  const videoPath = `https://olsiorvideo.herokuapp.com/1082`;
  const videoStat = fs.statSync(videoPath);
  const fileSize = videoStat.size;
  const videoRange = req.headers.range;
  if (videoRange) {
    const parts = videoRange.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
})

// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
