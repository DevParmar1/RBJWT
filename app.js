const express = require("express");
const cors = require("cors");
const app = express();

var corsOptions = {
    origin: 'http://localhost:3000',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const authRouter = require("./routers/auth.routes");
const userRouter = require("./routers/user.routes");

app.use("/",authRouter);
app.use("/",userRouter);


module.exports = app;
