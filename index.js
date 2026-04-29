require('dotenv').config();

const express = require('express');

const app = express();

const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(3000, () => {
    console.log("Server running on port 3000");
});