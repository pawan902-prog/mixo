import React from 'react';

const TermsAndConditionsPopup = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-[#5C2B62]">Terms and Conditions</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed mb-6">
                            By participating in this engagement, I hereby confirm that I have read, understood, and agreed to the Terms and Conditions as communicated by the organisers and/or the brand below.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-6">
                            I willingly provide my consent for the collection, storage, and use of my personal information, including but not limited to my name, email address, and/or phone number, for purposes associated with this engagement.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-6">
                            I also grant permission for my photograph to be taken during the course of the engagement. I understand and accept that such images and any content captured as part of my participation may be used by the brand and its affiliates for marketing, promotional, or communication purposes, including but not limited to digital media, print, and social media platforms.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-6">
                            I acknowledge that my participation is voluntary, and I have no objection to the use of my likeness or information in the above-stated context.
                        </p>

                        <div className="bg-[#F5EA60] bg-opacity-20 border-l-4 border-[#F5EA60] p-4 rounded-r-lg mt-6">
                            <p className="text-sm text-gray-600">
                                <strong>Note:</strong> By clicking "I Agree" or proceeding with the engagement, you acknowledge that you have read and understood these terms and conditions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => {
                                // Handle agreement
                                console.log("User agreed to terms and conditions");
                                onClose();
                            }}
                            className="px-6 py-3 bg-[#F5EA60] text-black rounded-lg hover:bg-[#F0E050] transition-colors duration-200 font-bold"
                        >
                            I Agree
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditionsPopup; 