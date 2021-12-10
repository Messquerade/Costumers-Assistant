const express = require('express');
const connectDB = require('./config/db');


const app = express();

// connect to database
connectDB();

// Init Middleware
app.use(express.json({extended: false}));

// Define Routes
app.get('/', (req,res) => res.send('API Running'));

app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/post', require('./routes/api/post'));
app.use('/api/costume', require('./routes/api/costume'));
app.use('/api/production', require('./routes/api/production'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));