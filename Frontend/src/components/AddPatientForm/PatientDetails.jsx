import React from 'react';
import InputField from './InputField';

export default function PatientDetails({ patients, error, handleInputChange }) {
    return (
        <>
            <div className="flex items-center justify-center w-full gap-4">
                <InputField label="Patient Name" name="patient_name" value={patients.patient_name} onChange={handleInputChange} error={error.patient_name} placeholder="Name" />
                <InputField label="Refer By" name="refer_by" value={patients.refer_by} onChange={handleInputChange} error={error.refer_by} placeholder="Refer by" />
            </div>
            <div className="flex items-center justify-center w-full gap-4">
                <InputField label="Patient Age" name="patient_age" value={patients.patient_age} onChange={handleInputChange} error={error.patient_age} type="number" placeholder="Age" />
                <InputField label="Lab Number" readOnly name="lab_no" value={patients.lab_no} onChange={handleInputChange} error={error.lab_no} placeholder="Lab No" />
                <InputField label="Phone Number" name="phone_number" value={patients.phone_number} onChange={handleInputChange} error={error.phone_number} type="number" placeholder="Number" />
            </div>
            <div className="flex items-center justify-center w-full gap-4">
                <InputField label="Specimen" name="specimen" value={patients.specimen} onChange={handleInputChange} error={error.specimen} placeholder="Specimen" />
                <InputField label="Date" name="date" value={patients.date} onChange={handleInputChange} type="date" />
            </div>
        </>
    );
}
