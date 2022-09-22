const express = require('express');
const userRoutes = require('./routes/users.js');
const transferRoutes = require('./routes/transfers.js');
var bodyParser = require('body-parser');


const app = express();
const PORT = 3000;
const apiDir = "/api/v1";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: true 
 }));

 
app.use(`${apiDir}/users`,userRoutes);
app.use(`${apiDir}/transfer`,transferRoutes);


app.listen(PORT,function() {
    console.log(`Server started on ${PORT}`);
});

app.get("/",function(request, response) {
    response.send('Hello, welcome to Big Bucks Bank');
});

app.get(`${apiDir}`,function(request, response) {
    response.send('Hello, welcome to Big Bucks Bank');
});



