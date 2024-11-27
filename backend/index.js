const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
var path = require('path');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const courseRoute = require('./routes/course');
const lessonRoute = require('./routes/lesson');
const commentRoute = require('./routes/comment');
const notifyRoute = require('./routes/notify');
const bannerRoute = require('./routes/banner');
const orderRoute = require('./routes/order');

dotenv.config();
// mongoose.connect(process.env.MONGODB_URL, () => {
//   console.log('CONNECTED TO MONGO DB');
// });
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1); // Thoát nếu kết nối không thành công
  }
}
connectDB();
app.use(
  cors({
    origin: 'http://localhost:3000', // URL của frontend
    credentials: true, // Cho phép gửi cookies qua các yêu cầu CORS
  }),
);
app.use(cookieParser());
app.use(express.json());

//ROUTES
app.use('/v1/auth', authRoute);
app.use('/v1/user', userRoute);
app.use('/v1/course', courseRoute);
app.use('/v1/lesson', lessonRoute);
app.use('/v1/comment', commentRoute);
app.use('/v1/notify', notifyRoute);
app.use('/v1/banner', bannerRoute);
app.use('/v1/order', orderRoute);

app.listen(8000, () => {
  console.log('Server is running');
});
