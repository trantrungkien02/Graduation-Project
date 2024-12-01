const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const Course = new Schema(
  {
    userId: { type: String },
    userName: { type: String },
    name: { type: String, required: true },
    tittle: { type: String },
    require: { type: String },
    result: { type: String },
    des: { type: String },
    image: { type: String },
    videoId: { type: String, required: true },
    level: { type: String },
    price: { type: String },
    slug: { type: String, slug: 'name', unique: true },
    registrations: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: false },
    isAds: { type: String, default: '1' },
    registeredUsers: [
      {
        userId: { type: String, required: true }, // ID của người dùng đã đăng ký
        name: { type: String }, // Tên người dùng
        email: { type: String }, // Email người dùng
        lessonCompleted: { type: Number, default: 0 },
        registeredAt: { type: Date, default: Date.now }, // Thời gian đăng ký
      },
    ],
  },
  {
    _id: false,
    timestamps: true,
  },
);

Course.plugin(AutoIncrement);
Course.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

module.exports = mongoose.model('Course', Course);
