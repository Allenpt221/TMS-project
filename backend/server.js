import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/Db.js';

import authRoute from './Router/auth.router.js';

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Server is running...');
});

app.use('/api/', authRoute);

app.listen(PORT, () => {
    console.log(`server ready http://localhost:${PORT}`);
    connectDB();
});


