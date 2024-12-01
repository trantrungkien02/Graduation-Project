const Banner = require('../models/Banner');

const bannerController = {
  getAllImages: async (req, res) => {
    try {
      // Truy vấn và sắp xếp các ảnh theo trường createdAt từ mới nhất đến cũ nhất
      const images = await Banner.find().sort({ createdAt: -1 });

      if (!images || images.length === 0) {
        return res.status(404).json({ message: 'No images found' });
      }

      res.status(200).json(images);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving images', error: err });
    }
  },

  createImage: async (req, res) => {
    try {
      const { url, title, description, endDate } = req.body;

      const newImage = new Banner({
        url,
        title,
        description,
        endDate,
      });

      const savedImage = await newImage.save();
      res.status(200).json(savedImage);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating image', error: err });
    }
  },
  updateImage: async (req, res) => {
    try {
      const { id } = req.params; // ID của ảnh cần cập nhật
      const updateData = req.body; // Dữ liệu mới được gửi từ client

      const updatedImage = await Banner.findByIdAndUpdate(id, updateData, {
        new: true, // Trả về đối tượng đã được cập nhật
        runValidators: true, // Chạy các validator để đảm bảo dữ liệu hợp lệ
      });

      if (!updatedImage) {
        return res.status(404).json({ message: 'Image not found' });
      }

      res.status(200).json(updatedImage);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating image', error: err });
    }
  },
  deleteImage: async (req, res) => {
    try {
      const { id } = req.params; // ID của ảnh cần xóa

      const deletedImage = await Banner.findByIdAndDelete(id);

      if (!deletedImage) {
        return res.status(404).json({ message: 'Image not found' });
      }

      res.status(200).json({ message: 'Image deleted successfully', deletedImage });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error deleting image', error: err });
    }
  },
};

module.exports = bannerController;
