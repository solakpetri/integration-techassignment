import express from "express";
const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Server using ES6 syntax is live!')
});

app.post('/', (req, res) => {
    res.send('This is the POST request')
});

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});