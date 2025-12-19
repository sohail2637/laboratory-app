const Test = require("../models/tests");
const addTest = async (req, res) => {
  try {
    const {
      userID,
      type,
      test_name,
      min_value,
      max_value,
      unit,
      price,
      parent,
    } = req.body;

    // Basic validation
    if (!userID || !type || !test_name) {
      return res.status(400).json({
        message: "userID, type and test_name are required",
      });
    }

    // GROUP TEST (CBC)
    if (type === "group") {
      const groupTest = new Test({
        userID,
        type,
        test_name,
      });

      const saved = await groupTest.save();
      return res.status(200).json({
        message: "Group test created successfully",
        result: saved,
      });
    }

    // SIMPLE TEST validation
    if (type === "simple") {
      if (!min_value || !max_value || !unit || !price) {
        return res.status(400).json({
          message: "Simple test requires min, max, unit and price",
        });
      }
    }

    // SUBTEST validation
    if (type === "subtest") {
      if (!parent) {
        return res.status(400).json({
          message: "Subtest must have a parent group",
        });
      }

      const parentTest = await Test.findById(parent);
      if (!parentTest || parentTest.type !== "group") {
        return res.status(400).json({
          message: "Invalid parent group",
        });
      }
    }

    // SIMPLE or SUBTEST creation
    const test = new Test({
      userID,
      type,
      test_name,
      min_value,
      max_value,
      unit,
      price,
      parent: parent || null,
    });

    const savedTest = await test.save();

    res.status(200).json({
      message: "Test created successfully",
      result: savedTest,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const getAllTest = async (req, res) => {
  try {
    const tests = await Test.find({
      userID: req.params.userId,
      parent: null, // only parent tests
    })
      .populate("unit", "unit_abb symbol") 
      .sort({ createdAt: -1 });

    res.status(200).json(tests);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving parent tests",
      error: err.message,
    });
  }
};
;
const getSubtestsByGroup = async (req, res) => {
  try {
    const subtests = await Test.find({
      parent: req.params.groupId,
    })
      .populate("unit", "unit_name unit_abb")
      .sort({ createdAt: -1 });

    res.status(200).json(subtests);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving subtests",
      error: err.message,
    });
  }
};

const deleteSelectedTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // If deleting a group, delete its subtests also
    if (test.type === "group") {
      await Test.deleteMany({ parent: test._id });
    }

    await Test.deleteOne({ _id: req.params.id });

    res.json({ message: "Test deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const editTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate("unit", "unit_name")
      .populate("parent", "test_name");

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json(test);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
const updateTest = async (req, res) => {
  try {
    const updated = await Test.findByIdAndUpdate(
      req.params.id,
      {
        test_name: req.body.test_name,
        min_value: req.body.min_value,
        max_value: req.body.max_value,
        unit: req.body.unit,
        price: req.body.price,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateGroup = async (req, res) => {
  try {
    const updated = await Test.findOneAndUpdate(
      { _id: req.params.id, type: "group" },
      { test_name: req.body.test_name },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateSubtest = async (req, res) => {
  try {
    const { id } = req.params;
    const { test_name, min_value, max_value, unit, price } = req.body;

    const subtest = await Test.findOne({ _id: id, type: "subtest" });
    if (!subtest) {
      return res.status(404).json({
        message: "Subtest not found",
      });
    }

    if (
      !test_name ||
      min_value === undefined ||
      max_value === undefined ||
      !unit ||
      price === undefined
    ) {
      return res.status(400).json({
        message: "All subtest fields are required",
      });
    }

    subtest.test_name = test_name;
    subtest.min_value = min_value;
    subtest.max_value = max_value;
    subtest.unit = unit;
    subtest.price = price;

    const updated = await subtest.save();

    res.status(200).json({
      message: "Subtest updated successfully",
      result: updated,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const deleteSubtest = async (req, res) => {
  try {
    const { id } = req.params;

    const subtest = await Test.findOne({ _id: id, type: "subtest" });

    if (!subtest) {
      return res.status(404).json({
        message: "Subtest not found",
      });
    }

    await Test.deleteOne({ _id: id });

    res.status(200).json({
      message: "Subtest deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const addSubtest = async (req, res) => {
  const { groupId } = req.params;
  const { test_name, min_value, max_value, unit, price, userID } = req.body;

  if (!test_name || !userID) {
    return res.status(400).json({ message: "Test name and userID are required" });
  }

  try {
    const newSubtest = new Test({
      test_name,
      min_value,
      max_value,
      unit,
      price,
      type: "subtest",
      parent: groupId,
      userID,
    });

    await newSubtest.save();
    res.status(201).json(newSubtest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create subtest" });
  }
}
module.exports = {
  addTest,
  getAllTest,
  getSubtestsByGroup,
  deleteSelectedTest,
  editTest,
  updateTest,
  updateGroup,
  updateSubtest,
  deleteSubtest,
  addSubtest
};
