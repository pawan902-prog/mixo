import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import surveyResponses from "../Question.js";

// Custom hook for detecting clicks outside of elements
const useClickOutside = (ref, callback) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [ref, callback]);
};

const QuestionWithOption = ({ onQuestionChange }) => {
    const navigate = useNavigate()
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [otherInput, setOtherInput] = useState("");
    const [textInput, setTextInput] = useState("");

    // Ref for dropdown container
    const dropdownRef = useRef();

    // Initialize user responses from localStorage or default values
    const [userResponses, setUserResponses] = useState(() => {
        const saved = localStorage.getItem('userResponses');
        return saved ? JSON.parse(saved) : {
            businessType: '',
            products: [],
            location: '',
            XeroconsAttended: ''
        };
    });

    // Initialize textInput from localStorage if available
    useEffect(() => {
        if (userResponses.XeroconsAttended) {
            setTextInput(userResponses.XeroconsAttended);
        }
    }, [userResponses.XeroconsAttended]);

    const currentQuestion = surveyResponses[currentQuestionIndex];
    const isMultipleSelection = currentQuestion?.multipleSelection;

    // Set default selections for specific questions


    // Call onQuestionChange whenever currentQuestionIndex changes
    useEffect(() => {
        if (onQuestionChange) {
            onQuestionChange(currentQuestionIndex);
        }
    }, [currentQuestionIndex, onQuestionChange]);

    // Save user responses to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('userResponses', JSON.stringify(userResponses));
    }, [userResponses]);

    // Click-outside handler for dropdown
    useClickOutside(dropdownRef, () => {
        if (isDropdownOpen) {
            setIsDropdownOpen(false);
        }
    });

    // Function to call API and store data in sessionStorage
    const callAgendaAPI = async (finalUserResponses) => {
        try {
            const data = localStorage.getItem('userResponses');

            // Validate that we have all required data
            if (!finalUserResponses.businessType || !finalUserResponses.products || !finalUserResponses.location || !finalUserResponses.XeroconsAttended) {
                console.error('Missing required data for API call:', {
                    businessType: finalUserResponses.businessType,
                    products: finalUserResponses.products,
                    location: finalUserResponses.location,
                    XeroconsAttended: finalUserResponses.XeroconsAttended
                });

                // Try to get data from localStorage as fallback
                const fallbackData = JSON.parse(data || '{}');
                if (fallbackData.businessType && fallbackData.products && fallbackData.location && fallbackData.XeroconsAttended) {
                    console.log('Using fallback data from localStorage');
                    finalUserResponses = fallbackData;
                } else {
                    throw new Error('Missing required user response data');
                }
            }

            const response = await axios.post("https://xeroapi.logarithm.dev/create-agenda", {
                businessType: finalUserResponses.businessType,
                products: finalUserResponses.products,
                location: finalUserResponses.location,
                keyTakeaway: finalUserResponses.XeroconsAttended
            });

            console.log('Agenda API response:', response.data);

            // Store agenda data in sessionStorage
            if (response.data.agenda) {
                sessionStorage.setItem('agendaData', JSON.stringify(response.data.agenda));
                sessionStorage.setItem('exhibitorBooth', JSON.stringify(response.data.exhibitorBooth));
                sessionStorage.setItem('apiDataReceived', 'true');
                console.log('Agenda data stored in sessionStorage');

                // Now call uploadPDF after data is stored
                setTimeout(() => {
                    uploadPDFToServer();
                }, 1000); // Small delay to ensure data is properly stored
            }

        } catch (error) {
            console.error('Error calling agenda API:', error);
            sessionStorage.setItem('apiError', 'true');
        }
    };

    // Function to generate PDF blob and upload to server
    const uploadPDFToServer = async () => {
        try {
            console.log('Starting PDF generation and upload from QuestionWithOption...');

            // Get agenda data from sessionStorage
            const agendaData = sessionStorage.getItem('agendaData');
            const exhibitorBooth = sessionStorage.getItem('exhibitorBooth');

            if (!agendaData) {
                console.log('No agenda data found in sessionStorage, skipping PDF upload');
                return;
            }

            // Import PDFGenerator and generate PDF blob
            const { PDFGenerator } = await import('./PDFGenerator');
            const { pdf } = await import('@react-pdf/renderer');

            // Parse the agenda data
            const parsedAgendaData = JSON.parse(agendaData);

            // Generate PDF blob
            const pdfBlob = await pdf(<PDFGenerator agendaData={parsedAgendaData} />).toBlob();

            // Create FormData with the actual PDF file
            const formData = new FormData();
            formData.append('pdf', pdfBlob, 'xerocon-agenda.pdf');

            // Upload PDF file to server
            const uploadResponse = await axios.post('https://xeroapi.logarithm.dev/upload-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('PDF file uploaded successfully from QuestionWithOption:', uploadResponse.data);

            // Store PDF location for QR code in both localStorage and sessionStorage
            if (uploadResponse.data && uploadResponse.data.data && uploadResponse.data.data.Location) {
                let pdfLocation = uploadResponse.data.data.Location;

                // Ensure the URL has proper protocol
                if (!pdfLocation.startsWith('http://') && !pdfLocation.startsWith('https://')) {
                    pdfLocation = 'https://' + pdfLocation;
                }

                localStorage.setItem('pdfLocation', pdfLocation);
                sessionStorage.setItem('pdfLocation', pdfLocation);
                console.log('PDF location stored in localStorage and sessionStorage from QuestionWithOption:', pdfLocation);
            }

        } catch (error) {
            console.error('Error generating or uploading PDF from QuestionWithOption:', error);
        }
    };

    const handleOptionSelect = (option) => {
        if (isMultipleSelection) {
            setSelectedOptions(prev => {
                if (prev.includes(option)) {
                    return prev.filter(item => item !== option);
                } else {
                    return [...prev, option];
                }
            });
        } else {
            setSelectedOption(option);
            setIsDropdownOpen(false);
            if (option !== "Other") {
                setOtherInput("");
            }
        }
    };

    const handleRemoveOption = (optionToRemove) => {
        setSelectedOptions(prev => prev.filter(option => option !== optionToRemove));
    };

    const handleNext = () => {
        // Save current question response before moving to next
        if (currentQuestionIndex === 0) {
            // Business Type - Multiple selection question
            setUserResponses(prev => ({ ...prev, businessType: selectedOptions }));
        } else if (currentQuestionIndex === 1) {
            // Products
            setUserResponses(prev => ({ ...prev, products: selectedOptions }));
        } else if (currentQuestionIndex === 2) {
            // Location
            setUserResponses(prev => ({ ...prev, location: selectedOption }));
        } else if (currentQuestionIndex === 3) {
            // Xerocons Attended - Text input question
            setUserResponses(prev => ({ ...prev, XeroconsAttended: textInput }));
        }

        if (isMultipleSelection) {
            if (currentQuestionIndex === surveyResponses.length - 1) {
                // Last question - save response and navigate to chat
                const finalUserResponses = {
                    ...userResponses,
                    businessType: selectedOptions || userResponses.businessType,
                    products: userResponses.products,
                    location: userResponses.location,
                    XeroconsAttended: userResponses.XeroconsAttended
                };

                // Update localStorage immediately
                localStorage.setItem('userResponses', JSON.stringify(finalUserResponses));

                // Navigate to chat
                navigate('/chat');
                return;
            }
            if (currentQuestionIndex < surveyResponses.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOptions([]);
                setSelectedOption("");
                setOtherInput("");
                setTextInput("");
                setIsDropdownOpen(false);
            }
        } else {
            if (currentQuestionIndex === surveyResponses.length - 1) {
                // Last question - save response and navigate to chat
                const finalUserResponses = {
                    ...userResponses,
                    businessType: userResponses.businessType,
                    products: userResponses.products,
                    location: selectedOption || userResponses.location,
                    XeroconsAttended: textInput || userResponses.XeroconsAttended
                };

                // Update localStorage immediately
                localStorage.setItem('userResponses', JSON.stringify(finalUserResponses));

                // Navigate to chat
                navigate('/chat');
                return;
            }
            if (currentQuestionIndex < surveyResponses.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOption("");
                setOtherInput("");
                setTextInput("");
                setIsDropdownOpen(false);
            }
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setSelectedOption("");
            setSelectedOptions([]);
            setOtherInput("");
            setTextInput("");
            setIsDropdownOpen(false);
        }
    };

    const isNextDisabled = () => {
        // For text input questions, require text input
        if (currentQuestion.type === "text") {
            return !textInput.trim();
        }
        // For textarea questions, require text input
        if (currentQuestion.type === "textarea") {
            return !textInput.trim();
        }

        if (isMultipleSelection) {
            // For multiple selection questions, require at least one option
            return selectedOptions.length === 0;
        }

        // For single selection questions, require a selection
        if (!selectedOption) {
            return true;
        }

        // If "Other" is selected, require input text
        if (selectedOption === "Other") {
            return !otherInput.trim();
        }

        return false;
    };

    return (

        <div className="relative">
            {/* Top Section */}
            <div className="flex-1">
                {/* Step Number */}
                <div className="text-[#12B5EB] md:mb-[40px] mb-[37px] font-bold text-[33px] TestNational2Condensed  tracking-[1px]">
                    Step  {currentQuestionIndex + 1} of {surveyResponses?.length}
                </div>

                {/* Question */}
                <div className="text-center">
                    <h2 className="text-[#213B55]  mb-[40px] font-bold text-[33px] leading-[43px] TestNational2Bold text-left"
                        style={{
                            fontFamily: 'TestNational2Bold',
                            fontStyle: 'normal',
                            fontWeight: 700,
                            fontSize: '33px',
                            lineHeight: '43px',
                            color: '#213B55',
                            flex: 'none',
                            order: 1,
                            alignSelf: 'stretch',
                            flexGrow: 0
                        }}>
                        {currentQuestion.question}
                    </h2>
                </div>

                {/* Dropdown - Only show for non-text and non-textarea questions */}
                {currentQuestion.type !== "text" && currentQuestion.type !== "textarea" && (
                    <div ref={dropdownRef} className="relative max-w-md mx-auto md:max-w-none">
                        <div
                            className="bg-white rounded-[6px] p-4 cursor-pointer border border-gray-200"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    {isMultipleSelection && selectedOptions.length > 0 ? (
                                        <div>
                                            {/* <div className="text-[#213B55] text-[20px] TestNational2Regular mb-[23px]">{currentQuestion.heading}</div> */}
                                            <div className="flex flex-wrap gap-2">
                                                {selectedOptions.map((option, index) => (
                                                    <div key={index} className="bg-[#BBF3FD4D] text-[#213B55] px-3 py-1 rounded-full flex items-center gap-2">
                                                        <span className="text-sm TestNational2Regular">{option}</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveOption(option);
                                                            }}
                                                            className="text-[#FF6469] hover:text-red-700"
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M8 0C3.576 0 0 3.576 0 8C0 12.424 3.576 16 8 16C12.424 16 16 12.424 16 8C16 3.576 12.424 0 8 0ZM12 10.872L10.872 12L8 9.128L5.128 12L4 10.872L6.872 8L4 5.128L5.128 4L8 6.872L10.872 4L12 5.128L9.128 8L12 10.872Z" fill="#FF6469" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className={` TestNational2Regular text-[20px] ${isMultipleSelection
                                            ? (selectedOptions.length > 0 ? 'text-[#12B5EB]' : 'text-gray-800')
                                            : (selectedOption ? 'text-[#12B5EB]' : 'text-[#213B55]')
                                            }`}>
                                            {isMultipleSelection
                                                ? (selectedOptions.length > 0 ? `${selectedOptions.length} selected` : currentQuestion?.heading)
                                                : (selectedOption || currentQuestion?.heading)
                                            }
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {isMultipleSelection && selectedOptions.length > 0 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="cursor-pointer"
                                        >

                                        </button>
                                    )}
                                    <svg width="18" height="9" viewBox="0 0 18 9" fill="none" xmlns="http://www.w3.org/2000/svg"
                                        className={`w-5 h-5 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    >
                                        <path d="M9.06298 9L0.729645 0.69458H17.3963L9.06298 9Z" fill="#213B55" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Dropdown Options */}
                        {isDropdownOpen && (
                            <div className="z-40 top-full left-0 right-0 bg-white rounded-lg shadow-xl border border-gray-200 mt-1 max-h-60 overflow-y-auto">
                                {currentQuestion.options.map((option, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 px-[20px] cursor-pointer hover:bg-blue-50 transition-colors flex items-center gap-3 ${isMultipleSelection
                                            ? (selectedOptions.includes(option) ? '' : '')
                                            : (selectedOption === option ? 'bg-blue-100' : '')
                                            } ${index === 0 ? 'rounded-t-lg' : ''} ${index === currentQuestion.options.length - 1 ? 'rounded-b-lg' : ''}`}
                                        onClick={() => handleOptionSelect(option)}
                                    >
                                        {isMultipleSelection && (
                                            <input
                                                type="checkbox"
                                                checked={selectedOptions.includes(option)}
                                                onChange={() => { }}
                                                className="w-4 h-4 text-[#12B5EB] bg-gray-100 border-gray-300 rounded focus:ring-[#12B5EB] focus:ring-2"
                                            />
                                        )}
                                        <span className={`font-medium TestNational2Regular ${isMultipleSelection
                                            ? (selectedOptions.includes(option) ? 'text-[#12B5EB]' : 'text-gray-800')
                                            : (selectedOption === option ? 'text-[#12B5EB]' : 'text-gray-800')
                                            }`}>
                                            {option}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Text Input Field - Shows when question type is "text" */}
                {currentQuestion.type === "text" && (
                    <div className="mt-4 max-w-md mx-auto">
                        <div className="bg-white rounded-[6px] p-4 border border-gray-200">
                            <input
                                type="text"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder={currentQuestion.placeholder || "Type your answer"}
                                className="w-full text-gray-800 font-medium TestNational2Regular focus:outline-none"
                            />
                        </div>
                    </div>
                )}

                {/* Textarea Field - Shows when question type is "textarea" */}
                {currentQuestion.type === "textarea" && (
                    <div className="mt-4 max-w-md mx-auto md:max-w-none">
                        <textarea
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder={currentQuestion.placeholder || "Type your answer"}
                            maxLength={currentQuestion.maxLength || 200}
                            rows={4}
                            className="w-full text-[#213B55] text-[20px] placeholder:text-[#213B55] pt-[21.5px] pl-[20px] h-[112px] rounded-[6px] font-medium border bg-white/40
 border-[#FFFFFF] TestNational2Regular focus:outline-none resize-none"
                        />

                    </div>
                )}

                {/* Other Input Field - Shows when "Other" is selected */}
                {selectedOption === "Other" && (
                    <div className="mt-4 max-w-md mx-auto">
                        <div className="bg-white rounded-[6px] p-4 border border-gray-200">
                            <input
                                type="text"
                                value={otherInput}
                                onChange={(e) => setOtherInput(e.target.value)}
                                placeholder="Type your answer"
                                className="w-full text-gray-800 font-medium TestNational2Regular focus:outline-none"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className={`flex  items-center mt-[60px] pb-10 ${currentQuestionIndex === 0 ? 'justify-end' : 'justify-between '}`}>
                {/* Back Button */}
                {
                    currentQuestionIndex !== 0 && (
                        <>
                            <button
                                onClick={handleBack}
                                disabled={currentQuestionIndex === 0}
                                className={` w-[76px] h-[56px] flex items-center justify-center z-40 ${currentQuestionIndex === 0
                                    ? 'cursor-not-allowed'
                                    : ''
                                    } transition-colors`}
                            >
                                <img src="./backbutton.png" className="object-cover h-[56px]" />
                            </button>
                        </>
                    )
                }

                {/* Next Button */}
                <>
                    {
                        currentQuestionIndex !== 3 ? (
                            <>
                                <button
                                    onClick={handleNext}
                                    disabled={isNextDisabled()}
                                    className={`flex items-center  z-50 w-[149px] h-[56px] ${!isNextDisabled()
                                        ? ''
                                        : 'cursor-not-allowed opacity-50'
                                        } transition-colors`}
                                >
                                    <img src="./Button.png" className="h-[56px]" />

                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleNext}
                                    disabled={isNextDisabled()}
                                    className={`flex items-center  z-50  ${!isNextDisabled()
                                        ? ''
                                        : 'cursor-not-allowed opacity-50'
                                        } transition-colors`}
                                >
                                    <img src="./finalstep.png" className="h-[56px] w-[199px]" />


                                </button>
                            </>
                        )
                    }

                </>
            </div>
        </div>
    );
};

export default QuestionWithOption;