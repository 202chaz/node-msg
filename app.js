const config = require('./config')
const express = require('express')
const app = express()
const port = config.PORT
const path = require('path')
const router = express.Router()
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

router.get('/', (req,res) => {
  res.sendFile(path.join(__dirname+'/views/index.html'));
  //__dirname : It will resolve to your project folder.
});

// Users bady-parse
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Use all files in public
app.use(express.static('public'))

//add the router
app.use('/', router);
app.listen(config.PORT, () => {
  mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true });
});

const db = mongoose.connection;
db.on('error', (err) => console.log(err))
db.once('open', () => {
  require('./routes/users')(app);
  console.log(`Server started on port ${config.PORT}`)
})
