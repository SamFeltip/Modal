const express = require('express');
const path = require('path');

const app = express();
const port = 4000;

// return pages in the public folder (styles and scripts)
app.use(express.static('public'))


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/information', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/information.html'));
});

app.get('/getAjaxData', (req, res) => {
  res.sendFile(path.join(__dirname, "public/ajax.html"))
});


app.get('/lamp', (req, res) => {
  res.sendFile(path.join(__dirname, "public/genie.html"))
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
