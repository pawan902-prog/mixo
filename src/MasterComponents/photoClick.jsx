import React, { useState, useRef, useCallback, useEffect } from "react";
import Headerlayout from "./HeaderLayout";
import { Link, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";

const PhotoClick = () => {
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [showCountdown, setShowCountdown] = useState(false);
    const [isCaptured, setIsCaptured] = useState(false);
    const [webcamReady, setWebcamReady] = useState(false);
    const [webcamError, setWebcamError] = useState(null);
    const [preview, setPreview] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const webcamRef = useRef(null);
    const [facingMode, setFacingMode] = useState("environment"); // "environment" for back, "user" for front
    const [file, setFile] = useState(null)

    const videoConstraints = {
        width: 400,
        height: 400,
        facingMode: "user"
    };

    const startCountdown = () => {
        // Start countdown without capturing immediately
        setIsCapturing(true);
        setShowCountdown(true);
        setCountdown(3);
    };
    function base64ToFile(base64String, filename) {
        const arr = base64String.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    const capture = () => {
        // Capture image when countdown reaches zero
        if (webcamRef.current) {
            try {
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) {
                    const file = base64ToFile(imageSrc, 'captured-image.jpg');
                    setCapturedImage(imageSrc);
                    setFile(file);

                    // Store captured image in localStorage
                    localStorage.setItem("sourceImage", imageSrc);
                }
            } catch (error) {
                console.error("Error capturing image:", error);
            }
        }

        setIsCapturing(false);
        setShowCountdown(false);
        setIsCaptured(true);
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        setFile(null);
        setIsCapturing(false);
        setShowCountdown(false);
        setIsCaptured(false);
    };

    const handleWebcamReady = () => {
        console.log("Webcam is ready!");
        setWebcamReady(true);
        setWebcamError(null);
    };

    const handleWebcamError = (error) => {
        console.error("Webcam error:", error);
        setWebcamError(error);
        setWebcamReady(false);
    };


    useEffect(() => {
        if (showCountdown && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (showCountdown && countdown === 0) {
            capture();
        }
    }, [showCountdown, countdown]);

    const navigate = useNavigate()
    const handleSubmitt = async () => {
        try {
            setIsSubmitting(true)
            setPreview(true)

            // Get the selected avatar ID from localStorage
            const selectedAvatarId = localStorage.getItem("activeAvatarId")
            if (!selectedAvatarId) {
                alert("Please select an avatar first. Go back to avatar selection.")
                setIsSubmitting(false)
                setPreview(false)
                return
            }

            console.log('Selected Avatar ID:', selectedAvatarId)
            console.log('Captured image available:', !!capturedImage)

            // Create FormData for the registration API
            const formData = new FormData()

            // Convert base64 image to File object
            try {
                const response = await fetch(capturedImage)
                const blob = await response.blob()
                const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' })
                formData.append('sourceImage', file)
            } catch (error) {
                console.error('Error converting image:', error)
                alert('Error processing image. Please try again.')
                setIsSubmitting(false)
                setPreview(false)
                return
            }

            formData.append('avatarId', selectedAvatarId)

            // Call the registration API
            console.log('Sending registration request...')
            const apiResponse = await axios.post(
                'https://tagglabsapi.logarithm.co.in/TagglabsServer1api/ihcl/register-ihcl-user',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 30000, // 30 second timeout
                }
            )

            console.log('Registration successful:', apiResponse.data)

            // Store the registration response if needed
            localStorage.setItem("registrationResponse", JSON.stringify(apiResponse.data))

            // Save the captured image to localStorage for potential future use
            if (capturedImage) {
                localStorage.setItem("sourceImage", capturedImage)
            }

            // Navigate to the next page
            navigate('/ScannerOutput')

        } catch (error) {
            console.error('Registration failed:', error)
            setPreview(false)

            let errorMessage = 'Registration failed. Please try again.'

            if (error.response) {
                // Server responded with error status
                errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
            } else if (error.request) {
                // Network error
                errorMessage = 'Network error. Please check your connection and try again.'
            } else {
                // Other error
                errorMessage = error.message || 'An unexpected error occurred.'
            }

            alert(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <div className="">


                <Headerlayout>
                    {preview && (
                        <div className="fixed inset-0   z-50 flex items-center justify-center">
                            <div className="relative max-h-full p-4 md:h-[697px] md:w-[662px] w-[189px] h-[180px] z-50">
                                <img
                                    src="/loading.png"
                                    alt="Preview"
                                    className=""
                                />
                            </div>
                        </div>
                    )}
                    <div className="">
                        <h3 className="boldCalibri text-2xl md:text-[64px] text-white leading-[28px] md:leading-[67px] md:mt-[71px] mt-[30px]">
                            Click your picture
                        </h3>
                    </div>

                    <div className="flex justify-center items-center md:mt-[50px] mt-[30px]">
                        <div className="relative">
                            {/* Circular frame with border */}
                            <div className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[500px] md:h-[500px] lg:w-[700px] lg:h-[700px] xl:w-[845px] xl:h-[845px] rounded-full border-[4px] md:border-[20px] border-[#8DB6D5] overflow-hidden flex items-center justify-center">
                                <div className="relative w-full h-full">
                                    {/* Always show webcam feed */}
                                    {!capturedImage && !webcamError && (
                                        <Webcam
                                            playsInline
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            videoConstraints={videoConstraints}
                                            className="w-full h-full object-cover"
                                            onUserMedia={handleWebcamReady}
                                            onUserMediaError={handleWebcamError}
                                        />
                                    )}

                                    {/* Countdown overlay */}
                                    {showCountdown && (
                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                            <div className="text-white text-6xl md:text-8xl font-bold  bg-opacity-50 rounded-full w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
                                                {countdown}
                                            </div>
                                        </div>
                                    )}

                                    {/* Captured image overlay */}
                                    {capturedImage && (
                                        <img
                                            src={capturedImage}
                                            alt="Captured"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    )}

                                    {/* Webcam error state */}
                                    {webcamError && (
                                        <div className="absolute inset-0 text-white text-center p-4 flex flex-col items-center justify-center">
                                            <div className="text-2xl mb-2">📷</div>
                                            <div className="text-sm">Camera access required</div>
                                            <div className="text-xs mt-2">Please allow camera permissions</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-center gap-5 sm:gap-10 md:gap-[120px] lg:gap-[188px] md:mt-[40px] mt-[30px] mb-10">
                        {!capturedImage ? (
                            // Capture button
                            <button
                                onClick={startCountdown}
                                disabled={isCapturing}
                                className="w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] md:w-[180px] md:h-[180px] lg:w-[228px] lg:h-[228px] p-[10px] mt-[30px] rounded-full bg-white border-4 border-white flex items-center justify-center disabled:opacity-50"
                            >
                                <div className="rounded-full bg-white w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] md:w-[140px] md:h-[140px] lg:w-[170px] lg:h-[170px] border-[8px] md:border-[10px] border-[#173452]"></div>
                            </button>
                        ) : (
                            // Retake and Submit buttons
                            <>
                                <button
                                    onClick={retakePhoto}
                                    className="px-6 py-3 sm:px-10 md:px-[60px] lg:px-[96px] mt-[30px] md:mt-[100px] lg:mt-[130px] text-white border-[3px] md:border-[5px] border-white rounded-lg font-semibold text-lg sm:text-2xl md:text-[40px] lg:text-[63px] boldCalibri"
                                >
                                    Retake
                                </button>
                                <button
                                    onClick={handleSubmitt}
                                    disabled={isSubmitting}
                                    className={`px-6 py-3 sm:px-10 md:px-[60px] lg:px-[96px] mt-[30px] md:mt-[100px] lg:mt-[130px] bg-white text-[#002A49] rounded-lg font-semibold text-lg sm:text-2xl md:text-[40px] lg:text-[63px] boldCalibri ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                                >
                                    {isSubmitting ? 'Processing...' : 'Submit'}
                                </button>
                            </>
                        )}
                    </div>


                    {/* Debug info - remove this in production */}
                    {/* <div className="text-white text-xs mt-4 text-center">
                        Debug: {isCaptured ? "Photo captured" : "No photo"} |
                        Countdown: {showCountdown ? countdown : "Off"} |
                        Capturing: {isCapturing ? "Yes" : "No"} |
                        Webcam: {webcamError ? "Error" : webcamReady ? "Ready" : "Loading..."} |
                        Image: {capturedImage ? "Yes" : "No"}
                    </div> */}

                </Headerlayout>
            </div>
        </>
    )
}

export default PhotoClick