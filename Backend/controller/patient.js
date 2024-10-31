const Patient = require("../models/patient");

// Add Post
const addPatient = (req, res) => {
    const addPatient = new Patient({
        userID: req.body.userId,
        patient_name: req.body.patient_name,
        patient_age: req.body.patient_age,
        refer_by: req.body.refer_by,
        lab_no: req.body.lab_no,
        specimen: req.body.specimen,
        test_type: req.body.test_type,
        phone_number: req.body.phone_number,
        date: req.body.date,
    });

    addPatient
        .save()
        .then((result) => {
            res.status(200).send({
                message: "Patient created successfully"
                , result: result
            });
        })
        .catch((err) => {
            res.status(402).send(err);
        });
};

const getAllPatient = async (req, res) => {
    try {
        const findAllCataloge = await Patient.find({
            userID: req.params.userId,
        })


        res.json(findAllCataloge);
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving tests",
            error: err.message
        });
    }
};


const deleteSelectedPatient = async (req, res) => {
    const deleteTest = await Patient.deleteOne(
        { _id: req.params.id }
    );
    res.send(deleteTest);
};

const editPatient = (req, res) => {
    Patient.findById(req.params.id)
        .populate({
            path: "test_type.test",
            model: "Test"
        })

        .then(patient => res.json(patient))
        .catch(err => res.status(500).json({ error: "Failed to retrieve patient data." }));
};



const updatePatient = async (req, res) => {
    try {
        const updatedResult = await Patient.findByIdAndUpdate(
            req.params.id,
            {
                patient_name: req.body.patient_name,
                patient_age: req.body.patient_age,
                refer_by: req.body.refer_by,
                lab_no: req.body.lab_no,
                specimen: req.body.specimen,
                test_type: req.body.test_type,
                phone_number: req.body.phone_number,
                date: req.body.date,

            },
            { new: true }
        );

        if (!updatedResult) {
            return res.status(404).send("Patient not found");
        }

        res.json(updatedResult);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



module.exports = {
    addPatient,
    getAllPatient,
    deleteSelectedPatient,
    editPatient,
    updatePatient,
};
