const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseOrder = new Schema(
  {
    courseName: { type: String, required: true },
    amount: { type: String, required: true }, // Số tiền giao dịch
    bankCode: { type: String, required: true }, // Mã ngân hàng
    receiveUser: { type: String, required: true }, // Người nhận
    senderUser: { type: String, required: true }, // Người gửi
    transactionNo: { type: String, required: true }, // Số giao dịch
    transactionStatus: { type: String, required: true }, // Trạng thái giao dịch
    txnRef: { type: String, required: true }, // Mã tham chiếu giao dịch
  },
  {
    timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
  },
);

module.exports = mongoose.model('CourseOrder', CourseOrder);
