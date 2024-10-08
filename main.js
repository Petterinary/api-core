require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const accountsRoutes = require('./routes/account');
const consultationRoutes = require("./routes/consultation");
const doctorRoutes = require('./routes/doctor');
const liveTrackingRoutes = require('./routes/liveTracking');
const paymentsRoutes = require('./routes/payment');
const serviceRegistrationFormRoutes = require('./routes/serviceRegistrationForm');
const userRoutes = require('./routes/user');

app.use('/accounts', accountsRoutes);
app.use("/consultations", consultationRoutes);
app.use('/doctors', doctorRoutes);
app.use('/liveTrackings', liveTrackingRoutes);
app.use('/payments', paymentsRoutes);
app.use('/serviceRegistrationForms', serviceRegistrationFormRoutes);
app.use('/users', userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});