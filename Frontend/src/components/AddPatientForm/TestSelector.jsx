import React from "react";
import Select from "react-select";

export default function TestSelector({
    testOptions,
    selectedTests,
    onChange,
    handleSubtestChange,
    handleResultChange,
    handleSubtestResultChange,
}) {

    const handleTestSelection = (tests) => {
        onChange(tests.map(test => ({ ...test, selectedSubtests: test.selectedSubtests || [] })));
    };

    return (
        <div className="w-full space-y-4">
            <label className="block mb-2 text-sm font-medium text-gray-900">Select Tests</label>
            <Select
                isMulti
                options={testOptions}
                getOptionLabel={(e) => (
                    <div>
                        {e.label} {e.type === 'simple' && <span className="text-sm text-gray-500">({e.min_value}-{e.max_value})</span>}
                    </div>
                )}
                value={selectedTests}
                onChange={handleTestSelection}
                className="mb-4"
            />

            {selectedTests.map(test => (
                <div key={test.id} className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                    <h3 className="mb-2 font-semibold text-gray-800">{test.label} {test.type === 'simple' && `- RS ${test.price || 0}`}</h3>

                    {/* Subtests for group test */}
                    {test.subtests && test.subtests.length > 0 && (
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-900">Select Subtests</label>
                            <Select
                                isMulti
                                options={test.subtests.map(sub => ({
                                    value: sub._id,
                                    label: `${sub.test_name} (${sub.min_value}-${sub.max_value})`,
                                }))}
                                value={test.selectedSubtests?.map(sub => ({
                                    value: sub.subtest,
                                    label: test.subtests.find(s => s._id === sub.subtest)?.test_name
                                }))}
                                onChange={(subs) => handleSubtestChange(test.id, subs)}
                            />

                            {test.selectedSubtests?.map(sub => (
                                <div key={sub.subtest} className="mt-2">
                                    <label className="text-sm font-medium text-gray-900">
                                        Result for {test.subtests.find(s => s._id === sub.subtest)?.test_name}:
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                                        value={sub.result || ""}
                                        onChange={(e) => handleSubtestResultChange(test.id, sub.subtest, e.target.value )}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Simple test result */}
                    {test.type === 'simple' && (
                        <div className="mt-2">
                            <label className="text-sm font-medium text-gray-900">Result for {test.label}</label>
                            <input
                                type="text"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                                value={test.result || ""}
                                onChange={(e) => handleResultChange(test.id, e.target.value)}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
  