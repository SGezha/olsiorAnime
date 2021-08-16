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

// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
