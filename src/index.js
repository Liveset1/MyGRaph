const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const staticFilesPath = path.join(__dirname, 'public');
console.log(staticFilesPath);
// Serve static files
app.use(express.static(staticFilesPath));

// Set the views directory and template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render("index");
})

app.get('/calculator', (req, res) => {
  res.render('calculator');
})

app.get('/dev-calculator', (req, res) => {
  res.render('devCalc');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})