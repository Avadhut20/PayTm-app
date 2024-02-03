// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const rootRouter = require('./routes/index');
app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1", rootRouter);

app.listen(3000, () => {
    console.log("server started ");
});
