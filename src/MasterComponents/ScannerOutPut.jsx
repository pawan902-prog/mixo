import React, { useState, useEffect, useRef } from "react";
import Headerlayout from "./HeaderLayout";
import { Link, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";



const ScannerOutput = () => {
    const [qrCodeData, setQrCodeData] = useState("");
    const [generatedImageUrl, setGeneratedImageUrl] = useState("");
    const [downloadImageUrl, setDownloadImageUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadMessage, setDownloadMessage] = useState("");
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const navigate = useNavigate();

    // Array of messages to cycle through
    const messages = [
        "Scan the QR code to download your superhero moment.",
        "Your image has been saved locally!"
    ];


    useEffect(() => {
        // Get the registration response from localStorage
        const registrationResponse = localStorage.getItem("registrationResponse");

        if (!registrationResponse) {
            setError("No registration data found. Please start over.");
            setIsLoading(false);
            return;
        }

        try {
            const response = JSON.parse(registrationResponse);
            console.log("Registration response:", response);

            // Extract image URL and download link from the response
            if (response.result && response.result.imageURL) {
                setGeneratedImageUrl(response.result.imageURL);
            } else {
                setError("Generated image not found in response");
                setIsLoading(false);
                return;
            }

            if (response.result && response.result.downloadLink) {
                setQrCodeData(response.result.downloadLink);
                setDownloadImageUrl(response.result.downloadLink);
            } else {
                setError("Download link not found in response");
                setIsLoading(false);
                return;
            }

            setIsLoading(false);
        } catch (error) {
            console.error("Error parsing registration response:", error);
            setError("Invalid registration data. Please start over.");
            setIsLoading(false);
        }
    }, []);

    const handleStartOver = () => {
        // Clear all stored data and go back to home
        localStorage.removeItem("registrationResponse");
        localStorage.removeItem("sourceImage");
        localStorage.removeItem("activeAvatarId");
        localStorage.removeItem("selectedGender");
        navigate('/');
    };


    const handleDownload = () => {
        if (!downloadImageUrl) {
            alert('No image available for download.');
            return;
        }

        setIsDownloading(true);
        setDownloadMessage("Downloading image...");

        try {
            // Create a direct download link
            const link = document.createElement('a');
            link.href = downloadImageUrl;

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.download = `superhero-photo-${timestamp}.jpg`;

            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setDownloadMessage("Image downloaded successfully!");

            // Remove message after 3 seconds
            setTimeout(() => {
                setDownloadMessage("");
                setIsDownloading(false);
            }, 3000);

        } catch (error) {
            console.error('Download failed:', error);
            setDownloadMessage("Download failed. Please try again.");
            setIsDownloading(false);

            // Remove error message after 3 seconds
            setTimeout(() => {
                setDownloadMessage("");
            }, 3000);
        }
    };


    const [qrSize, setQrSize] = useState(200);

    useEffect(() => {
        const updateSize = () => {
            setQrSize(window.innerWidth < 768 ? 100 : 200); // <768 = mobile
        };

        updateSize(); // set on load
        window.addEventListener("resize", updateSize); // update on resize
        return () => window.removeEventListener("resize", updateSize);
    }, []);
    // Effect to cycle through messages every 3 seconds
    useEffect(() => {
        if (generatedImageUrl) {
            let lastTime = Date.now();

            const interval = setInterval(() => {
                const currentTime = Date.now();
                // Check if enough time has passed (accounting for window focus issues)
                if (currentTime - lastTime >= 2500) { // Slightly less than 3 seconds to be safe
                    setCurrentTextIndex((prevIndex) => (prevIndex + 1) % messages.length);
                    lastTime = currentTime;
                }
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [generatedImageUrl, messages.length]);

    useEffect(() => {
        if (downloadImageUrl) {
            const timer = setTimeout(() => {
                console.log('Auto-downloading image after 3 seconds');
                handleDownload();
            }, 3000); // 3 seconds delay

            return () => clearTimeout(timer); // cleanup if `downloadImageUrl` changes quickly
        }
    }, [downloadImageUrl])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center"
                style={{ background: `url('./background.png')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <div className="text-white text-2xl">Loading your superhero moment...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center"
                style={{ background: `url('./background.png')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <div className="text-center text-white">
                    <div className="text-xl mb-4">{error}</div>
                    <button
                        onClick={handleStartOver}
                        className="bg-[#FF4C25] text-white px-6 py-3 rounded-lg text-lg heebo font-bold"
                    >
                        Start Over
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="">
                <Headerlayout>
                    <div className="">
                        {/* Main content container */}
                        <div className="flex flex-col  items-center justify-center gap-8 lg:gap-[92px] max-w-6xl w-full mt-[111px] text-center">

                            {/* Superhero Image Frame */}
                            <div className="relative flex justify-center items-center">
                                <div className="w-[200px] z-50 h-[356px] md:w-[400px] md:h-[711px] lg:w-[450px] lg:h-[800px] rounded-[35px] border-[14px] border-[#8DB6D5] overflow-hidden bg-white shadow-2xl">
                                    <img
                                        src={generatedImageUrl}
                                        alt="Your Superhero Photo"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            console.error("Failed to load generated image:", generatedImageUrl);
                                            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TdXBlcmhlcm8gUGhvdG88L3RleHQ+PC9zdmc+";
                                        }}
                                    />
                                </div>

                                {/* QR Code overlapping the frame */}
                                <div className="inline-block bg-white p-3 rounded-lg shadow-lg relative right-2 border-[14px] border-[#8DB6D5]">
                                    <QRCode
                                        value={qrCodeData}
                                        size={qrSize}
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>

                            </div>

                            {/* Text Content */}
                            <div className="text-center lg:text-center w-full max-w-4xl">
                                <h1 className="boldCalibri text-4xl md:text-6xl lg:text-7xl text-white mb-2">
                                    Thank You!
                                </h1>

                                <p className="text-white text-2xl md:text-[50px] mb-2  flex items-center justify-center">
                                    Scan the QR code to download your superhero moment.
                                </p>

                                {downloadMessage && (
                                    <p className="text-green-400 text-xl md:text-[30px] mb-2 flex items-center justify-center">
                                        {downloadMessage}
                                    </p>
                                )}
                                {/* Emojis */}

                            </div>
                        </div>

                        {/* Bottom navigation */}
                    </div>
                    <div className="md:max-w-4xl md:min-w-4xl relative mt-4 mb-10 flex justify-start">
                        {/* Home Button on the Left */}
                        <button onClick={handleStartOver} className="z-50 ml-4 md:ml-8">
                            <img src="./home.png" alt="Home" className="w-[32px] h-[32px] md:w-[57px] md:h-[59px]" />
                        </button>

                        {/* Download Status Message */}
                        {isDownloading && (
                            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-4">
                                <div className="text-white text-sm font-bold bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                                    Downloading...
                                </div>
                            </div>
                        )}
                    </div>

                </Headerlayout>
            </div>
        </>
    )
}

export default ScannerOutput
