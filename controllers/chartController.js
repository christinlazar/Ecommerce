const Order = require("../models/orderModel");

const fetchsalesdata = async (req, res) => {
  try {
    const msg = req.body.msg;
    if (msg) {
      const salesData = await Order.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" }, // Group by month
            totalAmount: { $sum: "$totalamount" }, // Calculate total sales amount for each month
          },
        },
        {
          $project: {
            month: "$_id", // Project month as '_id'
            totalAmount: 1, // Include totalAmount field
            _id: 0, // Exclude '_id' field from the result
          },
        },
      ]);

      // Transform data into an array of total amounts
      const dataArray = Array.from({ length: 12 }, (_, i) => {
        const monthData = salesData.find((item) => item.month === i + 1); // Find data for the month
        return monthData ? monthData.totalAmount : 0; // If data found, return totalAmount, otherwise return 0
      });

      const pieData = await Order.aggregate([
        {
          $unwind: "$products", // Unwind the products array
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $lookup: {
            from: "categories",
            localField: "product.category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $group: {
            _id: "$category.name", // Group by category name
            totalAmount: { $sum: "$totalamount" }, // Calculate total amount for each category
          },
        },
      ]);
      let arr1 = [];
      let arr2 = [];
      pieData.forEach((el) => {
        (name = el._id), arr1.push(name);
      });
      pieData.forEach((el2) => {
        totalamount = el2.totalAmount;
        arr2.push(totalamount);
      });
      res.json({ salesData: dataArray, arr1: arr1, arr2: arr2 });
    }
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  fetchsalesdata,
};
