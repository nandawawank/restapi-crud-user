require('dotenv').config();
const cors = require('cors');
const express = require('express');
const userRouter = require('./api/user/router');
const loginRouter = require('./api/login/router');

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use('/restapi-crud-user/api', userRouter);
app.use('/restapi-crud-user/api', loginRouter);

app.listen(port, () => {
  console.log('restapi running in port ' + port);
});
