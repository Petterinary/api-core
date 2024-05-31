require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const userRoutes = require('./routes/user');
const doctorRoutes = require('./routes/doctor');
const serviceRegistrationFormRoutes = require('./routes/serviceRegistrationForm');
const paymentsRoutes = require('./routes/payment');

app.use('/users', userRoutes);
app.use('/doctors', doctorRoutes);
app.use('/serviceRegistrationForms', serviceRegistrationFormRoutes);
app.use('/payments', paymentsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});