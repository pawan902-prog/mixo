import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";

// Small Calendar component

const SmallCalendar = ({ isOpen, onClose, agendaData }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    if (!isOpen) return null;

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = [];

        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const getEventsForDate = (date) => {
        if (!agendaData || !date) return [];

        const dateString = date.toDateString();
        const dayData = agendaData.find(day => {
            const dayDate = new Date(day.day);
            return dayDate.toDateString() === dateString;
        });

        return dayData ? dayData.events : [];
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="absolute top-full right-0 mt-2 z-50 bg-white rounded-md shadow-md border border-gray-200 p-2 w-56 text-xs">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[#213B55]">Calendar</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-2">
                <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h4 className="text-sm font-medium text-[#213B55]">
                    {monthNames[currentDate.getMonth()].substring(0, 3)} {currentDate.getFullYear()}
                </h4>
                <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5 mb-2">
                {dayNames.map(day => (
                    <div key={day} className="text-center font-medium text-gray-500">{day.charAt(0)}</div>
                ))}

                {getDaysInMonth(currentDate).map((day, index) => (
                    <div
                        key={index}
                        className={`text-center py-1 cursor-pointer rounded ${day ? 'text-[#213B55]' : 'text-gray-300'} 
                        ${selectedDate && day && day.toDateString() === selectedDate.toDateString() ? 'bg-[#12B5EB] text-white' : ''}`}
                        onClick={() => day && setSelectedDate(day)}
                    >
                        {day ? day.getDate() : ''}
                    </div>
                ))}
            </div>

            {/* Selected Date Events */}
            {selectedDate && (
                <div className="border-t pt-2 mt-1">
                    <h5 className="font-semibold text-[#213B55] mb-1 truncate">
                        {selectedDate.toDateString()}
                    </h5>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                        {getEventsForDate(selectedDate).map((event, index) => (
                            <div key={index} className="bg-[#BBF3FD] px-2 py-1 rounded">
                                <div className="font-medium text-xs text-[#213B55]">{event.time}</div>
                                <div className="text-xs text-[#213B55] truncate">{event.title}</div>
                                <div className="text-[10px] text-[#12B5EB] truncate">{event.location}</div>
                            </div>
                        ))}
                        {getEventsForDate(selectedDate).length === 0 && (
                            <p className="text-gray-400 text-xs">No events</p>
                        )}
                    </div>
                </div>
            )}

            {/* Close Button */}
            <div className="mt-2 text-center">
                <button
                    onClick={onClose}
                    className="bg-[#12B5EB] text-white px-2 py-1 rounded text-xs hover:bg-[#0EA5D1] transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
};


import AgendaPDFDownloader from "./PDFGenerator";
// Get dynamic agenda data from sessionStorage
const getAgendaData = () => {
    try {
        const storedData = sessionStorage.getItem('agendaData');
        const exhibitorBooth = sessionStorage.getItem('exhibitorBooth');

        console.log('FinalOutputScreen - Raw sessionStorage data:', storedData);
        console.log('FinalOutputScreen - Raw exhibitorBooth data:', exhibitorBooth);

        if (storedData) {
            const rawAgenda = JSON.parse(storedData);
            const rawExhibitorBooth = exhibitorBooth ? JSON.parse(exhibitorBooth) : null;

            console.log('FinalOutputScreen - Parsed sessionStorage agenda data:', rawAgenda);
            console.log('FinalOutputScreen - Parsed sessionStorage exhibitorBooth data:', rawExhibitorBooth);

            // Group agenda items by day
            const groupedByDay = {};

            rawAgenda.forEach(item => {
                const day = item.day;
                if (!groupedByDay[day]) {
                    groupedByDay[day] = [];
                }
                console.log(item, 'item')
                groupedByDay[day].push({
                    time: item.time,
                    location: item.stage,
                    stageNumber: item?.stageNumber,
                    title: item.title,
                    appPartner: item?.appPartner,
                    description: item.shortDescription,
                    status: "add", // Default to add status
                    speaker: {
                        name: item.xeroPresenters,
                        role: "Speaker",
                        image: null
                    }
                });
            });

            console.log('FinalOutputScreen - Grouped by day:', groupedByDay);

            // Convert to the format expected by the component
            const result = Object.keys(groupedByDay).map(day => ({
                day: day,
                events: groupedByDay[day]
            }));

            // Add exhibitorBooth data at the root level
            if (rawExhibitorBooth && Array.isArray(rawExhibitorBooth)) {
                result.exhibitorBooth = rawExhibitorBooth;
            }

            console.log('FinalOutputScreen - Final formatted sessionStorage data:', result);
            return result;
        }
    } catch (error) {
        console.error('Error parsing agenda data:', error);
    }

    // Fallback to default data if no stored data
    return [];
};


const FinalOutPutScreen = () => {
    const [agendaData, setAgendaData] = useState(getAgendaData());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedEventIndex, setSelectedEventIndex] = useState(null);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
    const [pdfLocation, setPdfLocation] = useState(localStorage.getItem('pdfLocation'));
    const [isWaitingForData, setIsWaitingForData] = useState(false);

    // Refresh agenda data when component mounts and poll every 2 seconds for new data
    useEffect(() => {
        const refreshData = () => {
            const newData = getAgendaData();
            console.log('FinalOutputScreen - Agenda data loaded:', newData);
            setAgendaData(newData);
        };

        // Check immediately
        refreshData();

        // Set loading state if no data available
        if (!getAgendaData() || getAgendaData().length === 0) {
            setIsWaitingForData(true);
            console.log('FinalOutputScreen - No agenda data found, setting loading state');
        } else {
            console.log('FinalOutputScreen - Agenda data found, clearing loading state');
            setIsWaitingForData(false);
        }

        // Set up interval to check every 2 seconds for new data arrival
        const interval = setInterval(() => {
            const apiDataReceived = sessionStorage.getItem('apiDataReceived');
            const apiError = sessionStorage.getItem('apiError');

            if (apiDataReceived === 'true') {
                console.log('API data received, refreshing agenda data...');
                refreshData();
                setIsWaitingForData(false); // Data received, stop loading
                // Clear the flag after processing
                sessionStorage.removeItem('apiDataReceived');
            }

            if (apiError === 'true') {
                console.log('API error detected');
                setIsWaitingForData(false); // Stop loading on error
                // Clear the error flag
                sessionStorage.removeItem('apiError');
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Watch for changes in PDF location from localStorage
    useEffect(() => {
        const checkPdfLocation = () => {
            const storedPdfLocation = localStorage.getItem('pdfLocation');
            if (storedPdfLocation !== pdfLocation) {
                console.log('PDF Location updated:', storedPdfLocation);
                setPdfLocation(storedPdfLocation);
            }
        };
        // Check immediately
        checkPdfLocation();

        // Set up interval to check for changes
        const interval = setInterval(checkPdfLocation, 1000);

        return () => clearInterval(interval);
    }, [pdfLocation]);

    // Generate QR code when agenda data changes





    const renderStatusIcon = (status, eventIndex) => {
        if (status === "confirmed") {
            return (
                <div className="w-6 h-6  rounded-full flex items-center justify-center">
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_2016_209" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="25">
                            <rect y="0.0488281" width="24" height="24" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_2016_209)">
                            <path d="M11.9375 22.0264C10.5542 22.0264 9.25417 21.7639 8.0375 21.2389C6.82083 20.7139 5.7625 20.0014 4.8625 19.1014C3.9625 18.2014 3.25 17.143 2.725 15.9264C2.2 14.7097 1.9375 13.4097 1.9375 12.0264C1.9375 10.643 2.2 9.34303 2.725 8.12637C3.25 6.9097 3.9625 5.85137 4.8625 4.95137C5.7625 4.05137 6.82083 3.33887 8.0375 2.81387C9.25417 2.28887 10.5542 2.02637 11.9375 2.02637C13.3208 2.02637 14.6208 2.28887 15.8375 2.81387C17.0542 3.33887 18.1125 4.05137 19.0125 4.95137C19.9125 5.85137 20.625 6.9097 21.15 8.12637C21.675 9.34303 21.9375 10.643 21.9375 12.0264C21.9375 13.4097 21.675 14.7097 21.15 15.9264C20.625 17.143 19.9125 18.2014 19.0125 19.1014C18.1125 20.0014 17.0542 20.7139 15.8375 21.2389C14.6208 21.7639 13.3208 22.0264 11.9375 22.0264Z" fill="#12B5EB" />
                            <path d="M17.5875 9.57627L10.5375 16.6263L6.28751 12.3763L7.68751 10.9763L10.5375 13.8263L16.1875 8.17627L17.5875 9.57627Z" fill="#FDCC08" />
                        </g>
                    </svg>

                </div>
            );
        } else if (status === "add") {
            return (
                <div className="relative">
                    <div className="w-6 h-6  rounded-full flex items-center justify-center cursor-pointer" onClick={() => {
                        setSelectedEventIndex(eventIndex);
                        setIsCalendarOpen(true);
                    }}>
                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask0_2016_293" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="25">
                                <rect y="0.0488281" width="24" height="24" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_2016_293)">
                                <path d="M17 22.0488V19.0488H14V17.0488H17V14.0488H19V17.0488H22V19.0488H19V22.0488H17ZM5 20.0488C4.45 20.0488 3.97917 19.853 3.5875 19.4613C3.19583 19.0697 3 18.5988 3 18.0488V6.04883C3 5.49883 3.19583 5.02799 3.5875 4.63633C3.97917 4.24466 4.45 4.04883 5 4.04883H6V2.04883H8V4.04883H14V2.04883H16V4.04883H17C17.55 4.04883 18.0208 4.24466 18.4125 4.63633C18.8042 5.02799 19 5.49883 19 6.04883V12.1488C18.6667 12.0988 18.3333 12.0738 18 12.0738C17.6667 12.0738 17.3333 12.0988 17 12.1488V10.0488H5V18.0488H12C12 18.3822 12.025 18.7155 12.075 19.0488C12.125 19.3822 12.2167 19.7155 12.35 20.0488H5ZM5 8.04883H17V6.04883H5V8.04883Z" fill="#FF6469" />
                            </g>
                        </svg>
                    </div>
                    {/* Small Calendar Popup */}
                    {selectedEventIndex == eventIndex && isCalendarOpen && (
                        <SmallCalendar
                            isOpen={isCalendarOpen}
                            onClose={() => {
                                setIsCalendarOpen(false);
                                setSelectedEventIndex(null);
                            }}
                            agendaData={agendaData}
                            selectedEventIndex={selectedEventIndex}
                        />
                    )}
                </div>
            );
        }
        return null;
    };

    const renderSpeaker = (speaker) => {
        if (!speaker) return null;

        return (
            <div className=" items-center space-x-3 mb-3">
                <div className="relative">
                    {/* <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div> */}
                    {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"></div> */}
                </div>
                <div>
                    <h4 className="text-[#213B55] font-bold text-[16px] TestNational2Bold">{speaker.name}</h4>
                    {/* <p className="text-[#12B5EB] text-xs">{speaker.role}</p> */}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen mt-[100px] md:mt-[66px]">
            {/* Header */}
            <div className=" mb-8  md:mb-[59px] md:ml-[89px] ml-[30px]">
                <div className="w-[161px]  h-[33px]  z-50 md:w-[341px]">
                    <Link to='/'>
                        <img
                            src="./Bne25.png"
                            className="w-full h-auto object-contain md:hidden block"
                            alt="Bne25 Logo"
                        />
                    </Link>
                    <Link to='/' className="md:block hidden">
                        <svg width="342" height="35" viewBox="0 0 342 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M216.221 22.8338H220.211C222.383 22.8338 223.328 21.9613 223.328 20.27C223.328 18.5787 222.284 17.666 220.211 17.666H216.221V22.8204V22.8338ZM216.221 12.7666H219.521C221.466 12.7666 222.51 11.9478 222.51 10.2431C222.51 8.5384 221.551 7.59879 219.605 7.59879H216.221V12.7532V12.7666ZM226.289 14.9546C230.152 15.4512 232.408 17.9613 232.408 21.3573C232.408 25.6929 229.193 28.9949 222.214 28.9949H207.648V1.41083H222.171C227.938 1.41083 231.196 4.29676 231.196 8.75317C231.196 12.176 229.151 14.2431 226.289 14.8606V14.9411V14.9546Z" fill="#12B5EB" />
                            <path d="M253.037 1.41083H261.497V28.9815H253.643L243.279 14.1626H243.195V28.9815H234.692V1.41083H243.026L252.952 16.2297H253.037V1.41083Z" fill="#12B5EB" />
                            <path d="M286.863 28.9815H265.304V1.41083H286.779V8.37732H273.849V12.0149H285.298V18.2029H273.849V22.0016H286.863V28.9815Z" fill="#12B5EB" />
                            <path d="M15.3072 21.3841H15.1662L10.0478 29.0218H0.783936L10.2593 15.1559L1.24924 1.86719H10.8656L15.3918 8.98134H15.561L20.0871 1.86719H29.3087L20.4255 15.0351L29.8586 29.0218H20.3409L15.3072 21.3841Z" fill="#213B54" />
                            <path d="M52.6163 29.0218H31.3955V1.86719H52.5317V8.73972H39.8133V12.3102H51.0794V18.4042H39.8133V22.1492H52.6163V29.0218Z" fill="#213B54" />
                            <path d="M68.592 8.53838H64.4042V13.9478H68.592C70.5942 13.9478 71.7504 13.0887 71.7504 11.1827C71.7504 9.47798 70.7211 8.53838 68.592 8.53838ZM72.9913 29.0218C72.1734 28.0822 71.8773 27.317 71.5812 25.8539L70.989 22.8069C70.6083 20.9009 69.6213 20.3237 67.8729 20.3237H64.4183V29.0218H55.8313V1.86719H69.6636C76.192 1.86719 80.7605 4.26989 80.7605 10.1626C80.7605 14.0686 77.8981 16.4176 74.8243 16.9143V16.9948C77.3482 17.3975 78.8005 18.8203 79.4351 21.3036L80.5067 25.6526C80.8874 27.0754 81.4091 28.0553 82.382 29.0218H72.9913Z" fill="#213B54" />
                            <path d="M91.6459 15.4378C91.6459 19.8673 93.4366 22.5519 96.6797 22.5519C99.9227 22.5519 101.713 19.8673 101.713 15.4378C101.713 11.0082 99.9227 8.32362 96.6797 8.32362C93.4366 8.32362 91.6459 11.0082 91.6459 15.4378ZM110.738 15.4378C110.738 24.0956 105.323 29.505 96.6938 29.505C88.0644 29.505 82.6077 24.0956 82.6077 15.4378C82.6077 6.77999 88.0645 1.38397 96.6797 1.38397C105.295 1.38397 110.724 6.79341 110.724 15.4512" fill="#213B54" />
                            <path d="M126.022 1.38396C132.085 1.38396 136.569 4.35043 137.937 8.98134L130.041 12.1491C129.66 10.0417 128.461 8.36388 125.98 8.36388C123.117 8.36388 121.031 10.5518 121.031 15.4378C121.031 20.3237 123.117 22.5519 125.98 22.5519C128.461 22.5519 129.646 20.8069 130.041 18.6861L137.937 21.8539C136.569 26.5251 132.085 29.4916 126.022 29.4916C117.35 29.4916 111.978 24.0821 111.978 15.4243C111.978 6.76655 117.365 1.35712 126.022 1.35712" fill="#213B54" />
                            <path d="M190.672 1.86719H198.991V29.0218H191.264L181.055 14.431H180.971V29.0218H172.609V1.86719H180.802L190.587 16.4579H190.672V1.86719Z" fill="#213B54" />
                            <path d="M154.801 17.5318C156.634 17.5318 158.114 16.109 158.114 14.3774C158.114 12.6459 156.62 11.223 154.801 11.223C152.982 11.223 151.487 12.6324 151.487 14.3774C151.487 16.1224 152.982 17.5318 154.801 17.5318Z" fill="#12B5EB" />
                            <path d="M154.801 22.6055C150.035 22.6055 146.157 18.9142 146.157 14.3773C146.157 9.84035 150.035 6.14905 154.801 6.14905C159.567 6.14905 163.444 9.84035 163.444 14.3773C163.444 18.9142 159.567 22.6055 154.801 22.6055ZM165.334 4.35038C159.51 -1.19329 150.077 -1.19329 144.268 4.35038C138.445 9.89404 138.445 18.874 144.268 24.4042L154.801 34.4311L165.334 24.4042C171.157 18.8606 171.157 9.88062 165.334 4.35038Z" fill="#12B5EB" />
                            <path d="M317.334 28.9815H294.999V23.0754C304.108 16.8069 308.098 14.0418 308.098 10.4445C308.098 8.83371 307.097 7.71961 305.49 7.71961C303.882 7.71961 302.98 8.83371 302.98 10.2834C302.98 11.0619 303.375 11.7331 303.84 12.3505L296.55 15.1559C295.338 13.8807 294.604 12.0149 294.604 9.90754C294.604 5.23637 298.553 0.914185 305.927 0.914185C313.301 0.914185 316.982 4.95448 316.982 10.2431C316.982 15.5317 312.032 19.3707 306.872 21.9613H317.32V28.9815H317.334Z" fill="#213B54" />
                            <path d="M321.62 1.41081H340.007V8.21623H328.473L328.261 12.3371C329.305 11.5988 331.082 10.9411 332.985 10.9411C338.498 10.9411 341.826 14.525 341.826 19.3573C341.826 26.0821 336.101 29.4647 330.038 29.4647C323.975 29.4647 319.59 26.364 318.504 22.0284L326.358 19.4244C326.527 21.572 328.008 22.9278 329.996 22.9278C331.984 22.9278 333.253 21.6928 333.253 19.5452C333.253 17.6928 332.125 16.4445 330.391 16.4445C329.178 16.4445 328.402 16.9814 327.923 17.5989H320.901L321.634 1.37054L321.62 1.41081Z" fill="#213B54" />
                        </svg>

                    </Link>


                </div>
            </div>
            <div className="max-w-md mx-auto px-[30px] md:max-w-[768px]">


                <div className="">
                    <h3
                        className="
      text-[33px] leading-[50px] 
      font-bold 
      uppercase 
      text-[#12B5EB] 
      TestNational2Condensed
    "
                    >
                        Your AI Agenda: Ready!
                    </h3>
                    <p className="text-[#213B55] TestNational2Regular mb-[41px] text-[20px] leading-[29px]">
                        Your custom Xerocon schedule is here! Get ready to discover everything tailored for your best event yet.
                    </p>
                </div>

                {/* Loading State - Show when waiting for API data */}
                {isWaitingForData && (
                    <div className="text-center py-12 mb-8">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#12B5EB] mx-auto mb-4"></div>
                        <h3 className="text-[#213B55] font-bold text-xl mb-2 TestNational2Bold">
                            Building Your Agenda...
                        </h3>
                        <p className="text-[#213B55] TestNational2Regular text-lg">
                            We're creating your personalized Xerocon schedule. This may take a few moments.
                        </p>
                        <p className="text-[#12B5EB] text-sm mt-2">
                            Checking for updates every 2 seconds...
                        </p>
                    </div>
                )}

                {/* Dynamic Agenda Sections */}
                {!isWaitingForData && Array.isArray(agendaData) && agendaData.length > 0 ? (
                    agendaData.map((dayData, dayIndex) => (
                        <div key={dayIndex}>
                            <h2 className="text-[#12B5EB] font-bold text-xl mb-4 TestNational2Bold">
                                {dayData.day}
                            </h2>

                            {/* No more bg on this wrapper */}
                            <div className="mb-8">
                                {dayData.events && dayData.events.map((event, eventIndex) => (
                                    <div
                                        key={eventIndex}
                                        className="bg-[#BBF3FD] p-[30px] rounded-[10px] mb-6" // 👈 moved bg/padding here
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4 text-[#12B5EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-black text-sm TestNational2Medium">{event.time || ""}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 mb-3">
                                            <svg className="w-4 h-4 text-[#12B5EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>

                                            <span className="text-black text-sm TestNational2Medium">{event.location} {event?.stageNumber}</span>
                                        </div>

                                        <div className="bg-white rounded-lg p-4 border border-[#12B5EB]">
                                            {!event.title ? (
                                                <div>
                                                    <h3 className="text-[#213B55] font-bold text-[20px] mb-2 TestNational2Bold">
                                                        {event.appPartner || ""}
                                                    </h3>
                                                    <p className="text-[#213B55] text-xs TestNational2Regular">
                                                        *Agenda subject to change
                                                    </p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <h3 className="text-[#213B55] font-bold text-[20px] mb-2 TestNational2Bold">
                                                        {event.title}
                                                    </h3>
                                                    {renderSpeaker(event.speaker)}
                                                    <p className="text-[#213B55] text-[16px] mb-3 leading-relaxed TestNational2Regular">
                                                        {event.description}
                                                    </p>
                                                    <p className="text-[#213B55] text-xs TestNational2Regular">
                                                        *Agenda subject to change
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : !isWaitingForData ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No agenda data available. Please create your agenda first.</p>
                    </div>
                ) : null}

                {/* Exhibitor Booths Section */}
                {!isWaitingForData && Array.isArray(agendaData) && agendaData.length > 0 && (
                    <div className="mb-8">
                        <div className="bg-[#BBF3FD] p-[30px] rounded-[10px]">
                            <div className="flex items-center space-x-2 mb-4">
                                <svg className="w-5 h-5 text-[#12B5EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <h2 className="text-[#213B55] font-bold text-xl TestNational2Bold">Exhibitor Booths</h2>
                            </div>

                            <div className="bg-white rounded-lg p-4 ">
                                <ul className="list-disc list-inside text-[#213B55] space-y-2">
                                    {agendaData.exhibitorBooth && Array.isArray(agendaData.exhibitorBooth) && agendaData.exhibitorBooth.length > 0 ? (
                                        agendaData.exhibitorBooth.map((exhibitor, index) => (
                                            <li key={index} className="TestNational2Regular">
                                                {exhibitor.appDisplayName}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500">No exhibitor information available</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}


                <div className="mx-auto justify-center flex mb-[20px] md:py-[86px]">
                    {/* <button

                    >
                        <span className="flex text-[24px] gap-[10px] items-center TestNational2Bold">
                            Download Agenda
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.8333 0.333008V2.66634H13.1667V0.333008H10.8333ZM10.8333 4.99967V15.0166L6.99155 11.1748L5.34181 12.8245L12 19.4827L18.6582 12.8245L17.0085 11.1748L13.1667 15.0166V4.99967H10.8333ZM0.333344 17.833V23.6663H23.6667V17.833H21.3333V21.333H2.66668V17.833H0.333344Z" fill="#213B55" />
                            </svg>
                        </span>
                    </button> */}
                    <AgendaPDFDownloader />
                </div>
                {/* QR Code Section - Only visible on landscape/desktop */}
                <div className="text-center mb-8 hidden md:block bg-[#BBF3FD] rounded-2xl p-8 mx-4">
                    <div className="flex flex-col items-center">
                        {/* "Get on your phone!" text */}
                        <h2 className="text-3xl font-bold text-[#1e3752] mb-6">
                            Get on your phone!
                        </h2>

                        {/* QR Code */}
                        {(() => {
                            if (pdfLocation && pdfLocation.trim() !== '') {
                                return (
                                    <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                                        <QRCode
                                            size={192}
                                            value={pdfLocation}
                                            alt="Agenda QR Code"
                                            className="w-48 h-48"
                                        />
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="w-48 h-48 bg-gray-100 border-2 border-gray-300 rounded-xl flex items-center justify-center mb-6">
                                        <div className="text-center text-gray-500">
                                            <svg className="w-16 h-16 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                                            </svg>
                                            <p className="text-sm">PDF not ready yet...</p>
                                        </div>
                                    </div>
                                );
                            }
                        })()}

                        {/* Instruction text */}
                        <div className="bg-white px-6 py-4 rounded-xl w-full">
                            <p className="text-[#213B55] text-lg font-medium">
                                {pdfLocation
                                    ? 'Scan this QR code to download your agenda PDF'
                                    : 'Use this QR code to access your agenda'
                                }
                            </p>
                        </div>
                    </div>
                </div>


                {/* Download Agenda Button - Mobile only */}

                {/* Start Again Section */}
                <div className="text-center mb-8 ">
                    <p className="text-gray-600 text-sm mb-2">Not exactly right for you?</p>
                    <Link
                        to="/QuestionScreen"
                        className="text-[#213B55] font-bold border-b-[3px] border-[#1BB1E7] TestNational2Bold"
                        onClick={() => localStorage.removeItem('userResponses')}
                    >
                        Start Over
                    </Link>
                </div>


                {/* QR Code Section */}

                {/* PDF Download Section */}
                {/* <div className="text-center mb-8">
                    <h3 className="text-[#213B55] font-bold text-lg mb-4 TestNational2Bold">
                        Download Your Agenda
                    </h3>
                    <p className="text-[#213B55] TestNational2Regular mb-4 text-sm">
                        Get your personalized schedule as a PDF file
                    </p>
                    <Link
                        to="/pdf-generator"
                        className="inline-block bg-[#12B5EB] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0EA5D1] transition-colors"
                    >
                        Download PDF
                    </Link>
                </div> */}

                {/* Send Agenda Section */}

            </div>

            {/* Small Calendar Popup */}


            {/* <div className="bg-[#BBF3FD] p-6">
                <h3 className="text-[#213B55] font-bold text-lg mb-4 TestNational2Bold">
                    Send your agenda
                </h3>

                <form onSubmit={handleEmailSubmit} className="flex space-x-3">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 border border-white rounded-tl-[6px] rounded-tr-[36px] rounded-br-[36px] rounded-bl-[6px] bg-[#D7F8FE] px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#12B5EB]"
                        required
                    />
                    <button
                        type="submit"
                        className="w-12 h-12 rounded-full flex items-center justify-center  transition-colors"
                    >
                        <Link to='/scanner'>
                            <svg width="56" height="57" viewBox="0 0 56 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M28 38.4523L37.9034 28.5488L28 18.6454L26.1854 20.4599L32.9576 27.2328H17.3507V29.8648H32.9576L26.1854 36.6377L28 38.4523ZM28.0101 56.5488C24.1466 56.5488 20.517 55.8141 17.1212 54.3446C13.726 52.8751 10.759 50.8723 8.22033 48.3363C5.68167 45.7997 3.67707 42.8353 2.20656 39.4432C0.735518 36.051 0 32.4229 0 28.5589C0 24.6872 0.73474 21.0469 2.20422 17.6382C3.6737 14.2299 5.67648 11.265 8.21256 8.74349C10.7491 6.22194 13.7135 4.2259 17.1057 2.75538C20.4978 1.28435 24.1259 0.548828 27.9899 0.548828C31.8617 0.548828 35.5019 1.28357 38.9107 2.75305C42.3189 4.22253 45.2838 6.21675 47.8053 8.73572C50.3269 11.2547 52.3229 14.217 53.7934 17.6226C55.2645 21.0277 56 24.6664 56 28.5387C56 32.4022 55.2653 36.0318 53.7958 39.4276C52.3263 42.8229 50.3321 45.7898 47.8131 48.3285C45.2941 50.8672 42.3319 52.8718 38.9262 54.3423C35.5211 55.8133 31.8824 56.5488 28.0101 56.5488Z" fill="#0078C8" />
                            </svg>
                        </Link>
                    </button>
                </form>
            </div> */}
        </div>
    );
};

export default FinalOutPutScreen;