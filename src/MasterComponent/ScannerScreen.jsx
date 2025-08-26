import React, { useState } from "react";
import { Link } from "react-router-dom";

const ScannerScreen = () => {
    const [email, setEmail] = useState("user@example.com"); // This would come from the actual email sent

    return (
        <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto">
            {/* Header */}
            <div className="flex justify-start mt-[100px] pb-6 px-[30px]">
                <div className="flex justify-between  space-x-2 w-full">
                    {/* Location Pin Icon */}
                    <div className="w-[161px]  h-[33px] z-40" >
                        <Link to='/'>
                            <img
                                src="./Bne25.png"
                                className="w-full h-auto object-contain"
                                alt="Bne25 Logo"
                            />
                        </Link>
                    </div>

                </div>
            </div>

            {/* Main Content Area */}
            <div className=" px-6 mt-[90px]">
                <div className="bg-[#BBF3FD] rounded-[10px] p-8 max-w-md mx-auto">
                    {/* Confirmation Message */}
                    <div className="text-center mb-6">
                        <h1 className="text-[#213B55] font-bold text-[24px] mb-4 TestNational2Bold">
                            You're all set!
                        </h1>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-white p-4 rounded-[10px] shadow-sm">
                            {/* QR Code Placeholder - Replace with actual QR code */}
                            <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <svg className="w-16 h-16 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                                    </svg>
                                    <p className="text-sm">QR Code</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="text-justify bg-white rounded-[6px] p-[20px]">
                        <p className="text-[#213B55] text-[16px] leading-relaxed TestNational2Regular" >
                            We've sent a copy of your agenda to your email address. You can also use this QR code to access your agenda.
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="px-6 pb-8 mt-[40px]">
                <div className="flex justify-center">
                    <Link to='/'>
                        <button className="text-[24px]   TestNational2Bold bg-[#50DCAA] text-[#213B55] w-[215px]  h-[56px] rounded-[87px] flex justify-center text-center items-center hover:bg-[#45C099] transition-colors">
                            Start Over
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ScannerScreen; 