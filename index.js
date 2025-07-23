// index.js
import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';


// import des routes
import registerRoute from './routes/register.js';
import loginRoute from './routes/login.js';
import meRoute from './routes/me.js';
import projectRoute from './routes/project.js';
import uploadRoute from './routes/upload.js';
import userRoute from './routes/user.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'))

app.use(userRoute);
app.use(uploadRoute);
app.use(registerRoute);
app.use(loginRoute);
app.use(meRoute);
app.use(projectRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});