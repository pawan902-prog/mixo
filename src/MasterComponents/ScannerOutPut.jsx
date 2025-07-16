import React, { useState, useEffect } from "react";
import Headerlayout from "./HeaderLayout";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";

const ScannerOutput = () => {
    const [qrCodeData, setQrCodeData] = useState("https://example.com/download-photo");
    const [generatedImageUrl, setGeneratedImageUrl] = useState("/superhero-photo.jpg");
    const [isLoading, setIsLoading] = useState(true);

    // Get the API response data from localStorage
    useEffect(() => {
        try {
            const registrationResponse = localStorage.getItem("registrationResponse");
            if (registrationResponse) {
                const responseData = JSON.parse(registrationResponse);
                console.log('Registration response data:', responseData);

                if (responseData.result) {
                    // Set the generated image URL
                    if (responseData.result.imageURL) {
                        console.log('Setting generated image URL:', responseData.result.imageURL);
                        setGeneratedImageUrl(responseData.result.imageURL);
                    } else {
                        console.warn('No imageURL in response');
                    }

                    // Set the download link for QR code
                    if (responseData.result.downloadLink) {
                        console.log('Setting download link for QR code:', responseData.result.downloadLink);
                        setQrCodeData(responseData.result.downloadLink);
                    } else {
                        console.warn('No downloadLink in response');
                    }
                } else {
                    console.warn('No result in registration response');
                }
            } else {
                console.warn('No registration response found in localStorage');
            }
        } catch (error) {
            console.error('Error parsing registration response:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <>
            <div className="">
                <Headerlayout>
                    <div className="">
                        {/* Main content container */}
                        <div className="flex flex-col  items-center justify-center gap-8 lg:gap-[92px] max-w-6xl w-full mt-[111px] text-center">

                            {/* Superhero Image Frame */}
                            <div className="relative flex justify-center items-center">
                                <div className="w-[200px] z-50 h-[300px] md:w-[566px] md:h-[746px] lg:w-[400px] lg:h-[600px] rounded-2xl border-4 border-[#8DB6D5] overflow-hidden bg-white shadow-2xl">
                                    {isLoading ? (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                            <div className="text-gray-600 text-lg">Loading...</div>
                                        </div>
                                    ) : generatedImageUrl && generatedImageUrl !== "/superhero-photo.jpg" ? (
                                        <img
                                            src={generatedImageUrl}
                                            alt="Generated Superhero Photo"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.error('Error loading generated image:', e);
                                                // Fallback to a placeholder if image doesn't exist
                                                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TdXBlcmhlcm8gUGhvdG88L3RleHQ+PC9zdmc+";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                            <div className="text-gray-600 text-center p-4">
                                                <div className="text-2xl mb-2">🦸‍♂️</div>
                                                <div className="text-sm">Generated image not available</div>
                                                <div className="text-xs mt-2">Please try again</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* QR Code overlapping the frame */}
                                <div className="inline-block bg-white p-3 rounded-lg shadow-lg relative right-2">
                                    <QRCode
                                        value={qrCodeData}
                                        size={200} // this sets both width and height
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>

                            </div>

                            {/* Text Content */}
                            <div className="text-center lg:text-center  ">
                                <h1 className="boldCalibri text-4xl md:text-6xl lg:text-7xl text-white mb-2">
                                    Thank you!
                                </h1>

                                <p className="text-white text-2xl  md:text-[50px] mb-2">
                                    Scan the QR code to download your superhero moment.
                                </p>


                                {/* Emojis */}
                                <div className="flex justify-center lg:justify-center gap-4 text-4xl md:text-5xl text-center">
                                    <span>🦸‍♂️</span>
                                    <span>📸</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom navigation */}



                    </div>
                    x<div className="flex justify-center items-center w-full relative mt-4 mb-10">
                        {/* Home Button on the Left */}
                        <Link to="/" className="absolute left-4 top-1/2 -translate-y-1/2 z-50">
                            <img src="./home.png" alt="Home" className="w-[32px] h-[32px] md:w-[57px] md:h-[59px]" />
                        </Link>

                        {/* Center Hashtag Text */}

                    </div>

                </Headerlayout>
            </div>
        </>
    )
}

export default ScannerOutput