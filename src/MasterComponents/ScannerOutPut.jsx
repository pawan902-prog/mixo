import React, { useState, useEffect, useRef } from "react";
import Headerlayout from "./HeaderLayout";
import { Link, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";



const ScannerOutput = () => {
    const [qrCodeData, setQrCodeData] = useState("");
    const [generatedImageUrl, setGeneratedImageUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPrinting, setIsPrinting] = useState(false);
    const [showPrintMessage, setShowPrintMessage] = useState("");
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const navigate = useNavigate();

    // Array of messages to cycle through
    const messages = [
        "Scan the QR code to download your superhero moment.",
        "Your print will be ready in 2-3 minutes"
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


    const handlePrint = () => {
        if (!generatedImageUrl) {
            alert('No image available for printing.');
            return;
        }

        setIsPrinting(true);

        // Remove print message after printing is done
        setTimeout(() => {
            setShowPrintMessage("");
            setIsPrinting(false);
        }, 5000); // Remove message after 5 seconds

        // Create print content
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Superhero Photo Print</title>
                 <style>
                @page {
                    size: 4in 6in;
                    margin: 0;
                }
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    background: white;
                    width: 4in;
                    height: 6in;
                    overflow: hidden;
                }
                .print-container {
                    width: 4in;
                    height: 6in;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .image-container {
                    width: 4in;
                    height: 5.6in;
                    overflow: hidden;
                    padding: 0.1in 0;
                }
                .image {
                    width: 100%;
                    height: 100%;
                    display: block;
                    object-fit: cover;
                    object-position: center top;
                }
            </style>
            </head>
            <body>
                <div class="print-container">
                    <div class="image-container">
                        <img class="image" src="${generatedImageUrl}" alt="Superhero Photo" />
                    </div>
                </div>
                
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            setTimeout(function() {
                                window.close();
                            }, 1000);
                        }, 500);
                    };
                </script>
            </body>
            </html>
        `;

        // Open new window and print
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
        } else {
            alert('Popup blocked. Please allow popups and try again.');
            setIsPrinting(false);
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
        if (generatedImageUrl) {
            const timer = setTimeout(() => {
                console.log('Showing print message after 3 seconds');
                handlePrint();
            }, 3000); // 3 seconds delay

            return () => clearTimeout(timer); // cleanup if `generatedImageUrl` changes quickly
        }
    }, [generatedImageUrl])

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
                                    Thank you!
                                </h1>

                                <p className="text-white text-2xl md:text-[50px] mb-2  flex items-center justify-center">
                                    Scan the QR code to download your superhero moment.
                                </p>
                                <p className="text-white text-2xl md:text-[40px] mb-2  flex items-center justify-center">
                                    our print will be ready in 2-3 minutes  .                              </p>
                                {/* Emojis */}
                                <div className="flex justify-center lg:justify-center gap-4 text-4xl md:text-5xl text-center">
                                    <span>🦸‍♂️</span>
                                    <span>📸</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom navigation */}
                    </div>
                    <div className="md:max-w-4xl md:min-w-4xl relative mt-4 mb-10 flex justify-start">
                        {/* Home Button on the Left */}
                        <button onClick={handleStartOver} className="z-50 ml-4 md:ml-8">
                            <img src="./home.png" alt="Home" className="w-[32px] h-[32px] md:w-[57px] md:h-[59px]" />
                        </button>

                        {/* Center Printer Button */}
                        {/* <button
                            onClick={() => {
                                if (generatedImageUrl) {
                                    console.log('Printing image...');
                                    handlePrint();
                                } else {
                                    alert('Please wait for the image to load before printing.');
                                }
                            }}
                            disabled={isPrinting || !generatedImageUrl}
                            className="z-50 cursor-pointer hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <img src="./printer.png" className="md:w-[135px] md:h-[135px] h-auto w-[180px]" alt="Print" />
                            {isPrinting && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-white text-sm font-bold">Printing...</div>
                                </div>
                            )}
                        </button> */}
                    </div>

                </Headerlayout>
            </div>
        </>
    )
}

export default ScannerOutput
