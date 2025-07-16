import React, { useState } from "react";
import TermsAndConditionsPopup from "./TermsAndConditionsPopup";

const BasicForm = ({ onBack }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [showTermsPopup, setShowTermsPopup] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!agreeToTerms) {
            alert("Please agree to the Terms and Conditions to continue.");
            return;
        }

        console.log("Form submitted with:", { name, email, phone, gender, agreeToTerms });
        // Add your form submission logic here
        alert(`Hello ${name}! Form submitted successfully.`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8"
            style={{
                backgroundImage: "url('/bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}>

            {/* Header with Logo */}
            <div className="absolute top-0 mt-[20px] sm:mt-[35px] lg:mt-[55px]">
                <img src="/logo.png" className="w-[150px] h-[65px] sm:w-[180px] sm:h-[78px] lg:w-[228.42px] lg:h-[99.18px]" />
            </div>

            {/* Back Button */}
            <button
                onClick={onBack}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 px-4 py-2 bg-[#5C2B62] text-white rounded-full hover:bg-[#4A1F4F] transition-colors duration-200 text-sm sm:text-base"
            >
                ← Back
            </button>

            {/* Form Container */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl max-w-md w-full mx-4">
                <h2 className="text-[#5C2B62] text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 NeueMontrealBold">
                    Get Started
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-left text-[#5C2B62] font-semibold mb-2 text-sm sm:text-base">
                            Your Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                            className="w-full px-4 py-3 border-2 border-[#5C2B62] rounded-lg focus:outline-none focus:border-[#F5EA60] transition-colors duration-200 text-sm sm:text-base"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-left text-[#5C2B62] font-semibold mb-2 text-sm sm:text-base">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="w-full px-4 py-3 border-2 border-[#5C2B62] rounded-lg focus:outline-none focus:border-[#F5EA60] transition-colors duration-200 text-sm sm:text-base"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-left text-[#5C2B62] font-semibold mb-2 text-sm sm:text-base">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your phone number"
                            className="w-full px-4 py-3 border-2 border-[#5C2B62] rounded-lg focus:outline-none focus:border-[#F5EA60] transition-colors duration-200 text-sm sm:text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-left text-[#5C2B62] font-semibold mb-2 text-sm sm:text-base">
                            Gender *
                        </label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="1"
                                    checked={gender === "1"}
                                    onChange={() => setGender("1")}
                                    required
                                    className="mr-2"
                                />
                                <span className="text-sm sm:text-base">Male</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="2"
                                    checked={gender === "2"}
                                    onChange={() => setGender("2")}
                                    required
                                    className="mr-2"
                                />
                                <span className="text-sm sm:text-base">Female</span>
                            </label>
                        </div>
                    </div>

                    {/* Terms and Conditions Checkbox */}
                    <div className="text-left">
                        <label className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                required
                                className="mt-1"
                            />
                            <div className="text-sm text-gray-700">
                                I agree to the{" "}
                                <button
                                    type="button"
                                    onClick={() => setShowTermsPopup(true)}
                                    className="text-[#5C2B62] underline hover:text-[#4A1F4F] font-medium"
                                >
                                    Terms and Conditions
                                </button>
                                {" "}and consent to the collection and use of my personal information.
                            </div>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-[#F5EA60] text-black font-bold rounded-full hover:bg-[#F0E050] transition-colors duration-200 text-sm sm:text-base"
                    >
                        Submit
                    </button>
                </form>
            </div>

            {/* Terms and Conditions Popup */}
            <TermsAndConditionsPopup
                isOpen={showTermsPopup}
                onClose={() => setShowTermsPopup(false)}
            />
        </div>
    );
};

export default BasicForm; 