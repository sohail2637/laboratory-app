const Counter = require("../models/counter");



// GET CURRENT COUNTER (NO INCREMENT)
const getCurrentCounter = async (req, res) => {
  try {
    const { type } = req.query;
    const { userId } = req.params;

    if (!type || !["Lab", "Bill"].includes(type)) {
      return res.status(400).json({ message: "Invalid counter type" });
    }

    const counter = await Counter.findOne({ userID: userId, type });

    const currentCount = counter ? counter.count : 0;

    const formattedCounter = currentCount
      .toString()
      .padStart(4, "0");

    res.status(200).json({
      message: `${type} current counter`,
      count: formattedCounter,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getNextCounter = async (req, res) => {
  try {
    const { type } = req.query;
    const { userId } = req.params;

    if (!type || !["Lab", "Bill"].includes(type)) {
      return res.status(400).json({ message: "Invalid counter type" });
    }

    const counter = await Counter.findOneAndUpdate(
      { userID: userId, type },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    const formattedCounter = counter.count
      .toString()
      .padStart(4, "0");

    res.status(200).json({
      message: `${type} number generated successfully`,
      count: formattedCounter,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  getNextCounter,
  getCurrentCounter
};
