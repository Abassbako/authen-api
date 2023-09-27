const express = require('express');
const userRoutes = require('./server/router/userRoutes');

const cors = require('cors');
require('dotenv').config();

const mongoose = require('mongoose');

const app = express();

const PORT = process.env.PORT || 3000;
const uri = process.env.ATLAS_URI;

app.listen(PORT, () => {
    console.log(`app listening on port ${ PORT }`);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use((req, res, next) => {
    console.log(req.url, req.method);
    next();
});
app.use('/api/v1/User', userRoutes);

mongoose.connect(uri, {
    useNewUrlParser: true
})
.then(() => {
    console.log(`MongoDB Connection Successful`);
})
.catch((e) => {
    console.error(new Error(`MongoDb Connection Error: ${ e.message }`));
});