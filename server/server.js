const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

app.use(express.json());

app.get('/api/test', (req, res) => {
    res.send({ message: 'API is working!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});