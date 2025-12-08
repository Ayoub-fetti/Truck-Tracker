const express = require('express');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// app.use('/', (req, res) => {
//     res.send('API is running....');
// })
app.use('/api/auth', authRoutes);

app.use(errorHandler);

module.exports = app;
