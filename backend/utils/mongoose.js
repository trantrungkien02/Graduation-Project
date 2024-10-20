module.exports = {
    multipleMongooseToObject: function (mongooses) {
        return mongooses.map((mongoose) => mongoose.toObject());
    },
    mongooseToOject: function (mongoose) {
        return mongoose.toObject() || mongoose;
    },
};
