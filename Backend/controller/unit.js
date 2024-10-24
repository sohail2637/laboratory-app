const Unit = require("../models/units");

// Add Post
const addUnit = (req, res) => {
    const addUnit = new Unit({
      userID: req.body.userId,
    unit_name: req.body.unit_name,
    unit_abb: req.body.unit_abb,
    });
  
    addUnit
      .save()
      .then((result) => {
        res.status(200).send({
          message : "Unit created successfully"
          ,result :result});
      })
      .catch((err) => {
        res.status(402).send(err);
      });
  };

  const getAllUnit = async (req, res) => {

    const findAllCataloge = await Unit.find({
      userID: req.params.userId,
    })
    res.json(findAllCataloge);
  };

  const deleteSelectedUnit = async (req, res) => {
    const deleteUnit = await Unit.deleteOne(
      { _id: req.params.id }
    );
    res.send(deleteUnit);
  };

  const editUnit = (req, res) => {
    Unit.findById(req.params.id)
      .then((unit) => {
        if (!unit) {
          return res.status(404).json({ message: "Unit not found" });
        }
  
        res.json(unit);
      })
      .catch((error) => {
        res.status(500).json({ message: "Server error", error });
      });
  };
  
  const updateUnit = async (req, res) => {
    try {
      const updatedResult = await Unit.findByIdAndUpdate(
        req.body.id,                      // Only the ID is needed here
        {
          unit_name: req.body.unit_name,   // All fields to update are passed as a single object
          unit_abb: req.body.unit_abb,
        },
        { new: true }                      // `new: true` ensures the updated document is returned
      );
  
      if (!updatedResult) {
        return res.status(404).send("Unit not found");
      }
  
      res.json(updatedResult);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

  module.exports = {
    addUnit,
    getAllUnit,
    deleteSelectedUnit,
    editUnit,
    updateUnit,
  };
  