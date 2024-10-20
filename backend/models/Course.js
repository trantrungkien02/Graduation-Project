const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const Course = new Schema(
  {
    _id: { type: Number },
    userId: { type: String },
    name: { type: String, required: true },
    des: { type: String },
    image: { type: String },
    videoId: { type: String, required: true },
    level: { type: String },
    price: { type: String },
    slug: { type: String, slug: 'name', unique: true },
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
