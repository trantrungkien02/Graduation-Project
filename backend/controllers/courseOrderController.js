const CourseOrder = require('../models/CourseOrder');

const courseOrderController = {
  // Get all orders, sorted by the most recently created first
  getAllOrders: async (req, res) => {
    try {
      const orders = await CourseOrder.find().sort({ createdAt: -1 });
      res.status(200).json(orders);
    } catch (err) {
      console.error('Error retrieving orders:', err);
      res.status(500).json({ message: 'Error retrieving orders', error: err });
    }
  },

  // Create a new order
  createOrder: async (req, res) => {
    try {
      const { courseName, amount, bankCode, receiveUser, senderUser, transactionNo, transactionStatus, txnRef, type } = req.body;

      // Create a new instance of CourseOrder with the data from the request body
      const newOrder = new CourseOrder({
        courseName,
        amount,
        bankCode,
        receiveUser,
        senderUser,
        transactionNo,
        transactionStatus,
        txnRef,
        type,
      });

      // Save the new order to the database
      const savedOrder = await newOrder.save();
      res.status(200).json(savedOrder);
    } catch (err) {
      console.error('Error creating order:', err);
      res.status(500).json({ message: 'Error creating order', error: err });
    }
  },

  // Update an existing order by its ID
  updateOrder: async (req, res) => {
    try {
      const { id } = req.params; // Extract the order ID from the request parameters
      const updateData = req.body; // Data to update, coming from the client

      // Find and update the order, and return the updated document
      const updatedOrder = await CourseOrder.findByIdAndUpdate(id, updateData, {
        new: true, // Return the updated document instead of the original
        runValidators: true, // Ensure validations are run on the update
      });

      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json(updatedOrder);
    } catch (err) {
      console.error('Error updating order:', err);
      res.status(500).json({ message: 'Error updating order', error: err });
    }
  },

  // Delete an order by its ID
  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params; // Extract the order ID from the request parameters

      // Find and delete the order by its ID
      const deletedOrder = await CourseOrder.findByIdAndDelete(id);

      if (!deletedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json({
        message: 'Order deleted successfully',
        deletedOrder,
      });
    } catch (err) {
      console.error('Error deleting order:', err);
      res.status(500).json({ message: 'Error deleting order', error: err });
    }
  },
};

module.exports = courseOrderController;
