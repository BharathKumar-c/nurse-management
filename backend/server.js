import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nurseRoutes from './routes/nurseRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Nurse Management API is running' });
});

app.use('/api/nurses', nurseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

