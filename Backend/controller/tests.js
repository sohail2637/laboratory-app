const Test = require("../models/tests");

// Add Post
const addTest = (req, res) => {
    const addTest = new Test({
        userID: req.body.userId,
        test_name: req.body.test_name,
        min_value: req.body.min_value,
        max_value: req.body.max_value,
        unit: req.body.unit,
    });

    addTest
        .save()
        .then((result) => {
            res.status(200).send({
                message: "Test created successfully"
                , result: result
            });
        })
        .catch((err) => {
            res.status(402).send(err);
        });
};

const getAllTest = async (req, res) => {
    try {
        // Find all tests by userID and populate the 'unit' field
        const findAllCataloge = await Test.find({
            userID: req.params.userId,
        })
        .populate('unit', 'unit_abb') // Populate only the 'name' field from the 'Unit' document

        res.json(findAllCataloge);
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving tests",
            error: err.message
        });
    }
};


const deleteSelectedTest = async (req, res) => {
    const deleteTest = await Test.deleteOne(
        { _id: req.params.id }
    );
    res.send(deleteTest);
};

const editTest = (req, res) => {
    Test.findById(req.params.id)
        .then((test) => {
            if (!test) {
                return res.status(404).json({ message: "Test not found" });
            }

            res.json(test);
        })
        .catch((error) => {
            res.status(500).json({ message: "Server error", error });
        });
};

const updateTest = async (req, res) => {
    try {
        const updatedResult = await Test.findByIdAndUpdate(
            req.body.id,
            {
                test_name: req.body.test_name,
                min_value: req.body.min_value,
                max_value: req.body.max_value,
                unit: req.body.unit,
            },
            { new: true }
        );

        if (!updatedResult) {
            return res.status(404).send("Test not found");
        }

        res.json(updatedResult);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    addTest,
    getAllTest,
    deleteSelectedTest,
    editTest,
    updateTest,
};
