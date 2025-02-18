//Backend/server.js
//assign dependencies to variables.

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require("path");
const app = express();
dotenv.config();


//specify a port number to run(8070). if that is not available use any available port. ||operator
const PORT = process.env.PORT || 8070;

const corsOptions = {
  origin: 'http://localhost:3000',  // Allow frontend
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

//app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'../Frontend/build')))

//connect database
const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to database!');
    // app.listen(process.env.PORT, () => {
    //   console.log(`Server running on port ${process.env.PORT}`);
    // });
})
.catch((err) => console.error(err));


const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Mongodb Connection Success!');
});

const studentRoute = require('./routes/students_route');
//app.use('/student', studentRoute);

app.use('/student', studentRoute);

app.listen(PORT, () => {
  console.log(`Server is up and running on port : ${PORT}`);
});
