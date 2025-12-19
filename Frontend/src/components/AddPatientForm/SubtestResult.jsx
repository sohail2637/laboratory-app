import React from 'react';

export default function SubtestResult({ test, handleSubtestResultChange }) {
    return (
        <>
            {test.selectedSubtests.map(subtest => (
                <div key={subtest.subtest}>
                    <label className="block text-sm font-medium text-gray-900">
                        Enter Result for {test.subtests.find(s => s._id === subtest.subtest)?.test_name || "Subtest"}:
                    </label>
                    <input
                        type="text"
                        value={subtest.result || ""}
                        onChange={(e) => handleSubtestResultChange(test.id, subtest.subtest, e.target.value)}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                    />
                </div>
            ))}
        </>
    );
}
