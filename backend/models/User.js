const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 6,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 50,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
    },
    slug: { type: String, slug: 'username', unique: true },
    registeredCourses: [
      {
        courseId: { type: String, required: true },
        courseName: { type: String, required: true },
        courseAvt: { type: String, required: true },
        courseSlug: { type: String, required: true },
        lessonsCompleted: { type: Number, default: 0 },
      },
    ],
    info: {
      fullName: { type: String, required: false, default: '' },
      bio: { type: String, required: false, default: '' },
      address: { type: String, required: false, default: '' },
      courseCount: { type: Number, required: false, default: '' },
      studentCount: { type: Number, required: false, default: '' },
      avatar: { type: String, required: false, default: '' },
      headerImage: { type: String, required: false, default: '' },
      github: { type: String, required: false, default: '' },
      facebook: { type: String, required: false, default: '' },
      tiktok: { type: String, required: false, default: '' },
    },
    isLimit: {
      type: String,
      default: '0',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
