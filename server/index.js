const express = require("express");
const app = express();
const port = process.env.PORT || 5000
const config=require('./config/key')

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const cors = require('cors')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())


mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch(err => console.log("error = ", err))


app.use('/api/users', require('./routes/users'));
app.use('/api/video', require('./routes/Video'))
app.use("/api/comment", require("./routes/comment"));
app.use("/api/like", require("./routes/like"));
app.use("/api/subscribe", require("./routes/subscribe"));

app.use("/uploads", express.static("./uploads/"));


app.listen(port, () => {
    console.log(`Server Running at ${port}`)
  });