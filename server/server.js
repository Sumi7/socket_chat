//imports
const express = require('express');
const path = require('path');

//declarations
const app = express();
const PORT = process.env.port || 3000;

//main
const PATH = path.join(__dirname, '../public');
app.use(express.static(PATH));
app.listen(PORT, function(){
  console.log(`server is running on port: ${PORT}`);
})
