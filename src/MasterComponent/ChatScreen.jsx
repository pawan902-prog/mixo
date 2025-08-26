import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ChatScreen = () => {
    const suggestedPrompt = [
        'Do you want to tell me more about the session?',
        'Show me other sessions that are similar to this?',
        "I'd like to know more about the Exhibitors at Xerocon 2025!",
        "When's the keynote?",
        "Want to know more about this speaker's session? Tell me more.",
        "I am ready to have my agenda built now. Let's go!",
        "I am ready to have my agenda built now."
    ];


    const navigate = useNavigate();
    const contentRef = useRef()
    const [message, setMessage] = useState("");
    const [showQuickReplies, setShowQuickReplies] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [showInitialButtons, setShowInitialButtons] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [showTellmeMsg, setShowTellme] = useState(false);
    const [agendaCreationTriggered, setAgendaCreationTriggered] = useState(false);
    // Get user responses from localStorage instead of navigation state

    const [userResponses, setUserResponses] = useState(() => {
        const saved = localStorage.getItem('userResponses');
        return saved ? JSON.parse(saved) : {
            businessType: '',
            products: [],
            location: '',
            XeroconsAttended: ''
        };
    });
    const [activeSection, setActiveSection] = useState(1);
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Add smooth scroll if you want
    }, [showLoading]);


    // WebSocket states
    const [isConnected, setIsConnected] = useState(false);
    const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [hasReceivedInitialMessage, setHasReceivedInitialMessage] = useState(false);
    const [initialSpinnerFinished, setInitialSpinnerFinished] = useState(false);
    const [showReadyMessage, setShowReadyMessage] = useState(false);

    // Frontend state to control button visibility
    // Note: Buttons are now controlled by message-specific properties
    // No need for global state variables

    const wsRef = useRef(null);
    const messagesEndRef = useRef(null);
    const timeoutRef = useRef(null);

    const [messages, setMessages] = useState([
        {
            id: Date.now(),
            type: "ai",
            content: "Thinking.",
            timestamp: new Date()
        }
    ]);

    // Add message about agenda being built if coming from QuestionWithOption
    useEffect(() => {
        // Check if user came from QuestionWithOption (has userResponses)
        if (userResponses.businessType && userResponses.products && userResponses.location && userResponses.XeroconsAttended) {
            setMessages(prev => [...prev, {
                id: Date.now() + Math.random(),
                type: "ai",
                content: "Great! I'm ready to help you with your Xerocon experience. You can ask me anything about the event, or click 'Create my agenda' to build your personalized schedule!",
                timestamp: new Date()
            }]);
        }
    }, [userResponses]);

    // Function to clean duplicate words from backend content
    const cleanContent = (content) => {
        if (!content) return content;

        // Split content into words and remove consecutive duplicates
        const words = content.split(' ');
        const cleanedWords = [];

        for (let i = 0; i < words.length; i++) {
            if (i === 0 || words[i] !== words[i - 1]) {
                cleanedWords.push(words[i]);
            }
        }

        return cleanedWords.join(' ');
    };

    // Function to check if backend message contains any suggested prompts
    const checkForSuggestedPrompts = (messageContent) => {
        if (!messageContent) return [];

        const foundPrompts = [];
        const content = messageContent.toLowerCase();

        suggestedPrompt.forEach(prompt => {
            // Clean the prompt text for comparison and make it more flexible
            let cleanPrompt = prompt.replace(/[⁠ ]/g, '').trim().toLowerCase();

            // Remove punctuation for more flexible matching
            cleanPrompt = cleanPrompt.replace(/[.!?]/g, '');
            const cleanContent = content.replace(/[.!?]/g, '');

            // Check if the cleaned prompt is contained in the cleaned content
            if (cleanContent.includes(cleanPrompt)) {
                foundPrompts.push(prompt);
            }
        });

        return foundPrompts;
    };

    // Function to handle suggested prompt button clicks
    const handleSuggestedPromptClick = (prompt) => {
        // Add user message to chat
        setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            type: "user",
            content: prompt,
            timestamp: new Date()
        }]);

        // Send message via WebSocket
        if (isConnected && wsRef.current) {
            try {
                wsRef.current.send(JSON.stringify({
                    message: prompt
                }));
            } catch (error) {
                console.error('Error sending suggested prompt:', error);
            }
        }

        // Special handling for agenda building prompts
        if (prompt.toLowerCase().includes('agenda built') ||
            prompt.toLowerCase().includes("let's go")) {
            createAgenda();
        }
    };

    // Function to normalize boolean properties from backend
    const normalizeBoolean = (value) => {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
            return value.toLowerCase() === 'true' || value === '1';
        }
        return false;
    };

    // Function to send user data to WebSocket server
    const sendUserDataToServer = () => {
        if (!isConnected || !wsRef.current) return;

        try {
            const dataToSend = {
                type: 'user_data',
                data: {
                    businessType: userResponses.businessType,
                    products: userResponses.products,
                    location: userResponses.location,
                    keyTakeaway: userResponses.XeroconsAttended
                }
            };

            wsRef.current.send(JSON.stringify(dataToSend));
        } catch (error) {
            console.error('Error sending user data:', error);
        }
    };

    // Function to get agenda data from sessionStorage (same as in FinalOutputScreen)
    const getAgendaDataFromSessionStorage = () => {
        try {
            const storedData = sessionStorage.getItem('agendaData');
            const exhibitorBooth = sessionStorage.getItem('exhibitorBooth');

            if (storedData) {
                const rawAgenda = JSON.parse(storedData);
                const rawExhibitorBooth = exhibitorBooth ? JSON.parse(exhibitorBooth) : null;

                // Group agenda items by day
                const groupedByDay = {};

                rawAgenda.forEach(item => {
                    const day = item.day;
                    if (!groupedByDay[day]) {
                        groupedByDay[day] = [];
                    }
                    groupedByDay[day].push({
                        time: item.time,
                        location: item.stage,
                        stageNumber: item?.stageNumber,
                        title: item.title,
                        appPartner: item?.appPartner,
                        description: item.description,
                        status: "add",
                        speaker: {
                            name: item.xeroPresenters,
                            role: "Speaker",
                            image: null
                        }
                    });
                });

                // Convert to the format expected by the component
                const result = Object.keys(groupedByDay).map(day => ({
                    day: day,
                    events: groupedByDay[day]
                }));

                // Add exhibitorBooth data at the root level
                if (rawExhibitorBooth && Array.isArray(rawExhibitorBooth)) {
                    result.exhibitorBooth = rawExhibitorBooth;
                }

                return result;
            }
        } catch (error) {
            console.error('Error parsing agenda data:', error);
        }
        return [];
    };



    // Function to clear localStorage and sessionStorage and start over
    const handleStartOver = () => {
        localStorage.removeItem('agendaData');
        localStorage.removeItem('userResponses');
        sessionStorage.removeItem('agendaData');
        sessionStorage.removeItem('exhibitorBooth');
        sessionStorage.removeItem('apiDataReceived');
        sessionStorage.removeItem('apiError');
        sessionStorage.removeItem('apiStatus');
        sessionStorage.removeItem('pdfUploadInProgress');

        setUserResponses({
            businessType: '',
            products: [],
            location: '',
            XeroconsAttended: ''
        });
        setAgendaCreationTriggered(false);
        navigate('/QuestionScreen');
    };

    // Function to generate PDF blob and upload to server
    const uploadPDFToServer = async () => {
        try {
            // Get agenda data from sessionStorage
            const agendaData = getAgendaDataFromSessionStorage();

            // Import PDFGenerator and generate PDF blob
            const { PDFGenerator } = await import('./PDFGenerator');
            const { pdf } = await import('@react-pdf/renderer');

            // Generate PDF blob
            const pdfBlob = await pdf(<PDFGenerator agendaData={agendaData} />).toBlob();

            // Create FormData with the actual PDF file
            const formData = new FormData();
            formData.append('pdf', pdfBlob, 'xerocon-agenda.pdf');

            // Upload PDF file to server
            const uploadResponse = await axios.post('https://xeroapi.logarithm.dev/upload-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Store PDF location for QR code in both localStorage and sessionStorage
            if (uploadResponse.data && uploadResponse.data.data && uploadResponse.data.data.Location) {
                let pdfLocation = uploadResponse.data.data.Location;

                // Ensure the URL has proper protocol
                if (!pdfLocation.startsWith('http://') && !pdfLocation.startsWith('https://')) {
                    pdfLocation = 'https://' + pdfLocation;
                }

                localStorage.setItem('pdfLocation', pdfLocation);
                sessionStorage.setItem('pdfLocation', pdfLocation);
                sessionStorage.removeItem('pdfUploadInProgress'); // Clear upload progress flag
            }

        } catch (error) {
            console.error('Error generating or uploading PDF:', error);
        }
    };

    // Function to call agenda API and create agenda
    const callAgendaAPI = async () => {
        try {
            // Get user responses from localStorage
            const userResponses = JSON.parse(localStorage.getItem('userResponses') || '{}');

            if (!userResponses.businessType || !userResponses.products || !userResponses.location || !userResponses.XeroconsAttended) {
                throw new Error('Missing required user response data');
            }

            const response = await axios.post("https://xeroapi.logarithm.dev/create-agenda", {
                businessType: userResponses.businessType,
                products: userResponses.products,
                location: userResponses.location,
                keyTakeaway: userResponses.XeroconsAttended
            });

            // Store agenda data in sessionStorage
            if (response.data.agenda) {
                sessionStorage.setItem('agendaData', JSON.stringify(response.data.agenda));
                sessionStorage.setItem('exhibitorBooth', JSON.stringify(response.data.exhibitorBooth));
                sessionStorage.setItem('apiDataReceived', 'true');

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

    console.log(currentStreamingMessage, 'currentStreamingMessage')


    // Function to create agenda - handles both API running and API completed scenarios
    const createAgenda = async () => {
        try {
            const agendaData = sessionStorage.getItem('agendaData');
            const apiDataReceived = sessionStorage.getItem('apiDataReceived');

            // Prevent multiple calls to createAgenda
            if (showLoading) {
                return;
            }

            setAgendaCreationTriggered(true);
            setShowLoading(true);

            // Check if API is still running or already completed
            if (apiDataReceived === 'true' && agendaData) {
                // Scenario 2: API already fulfilled, data available
                setLoadingText("Preparing your agenda...");

                setTimeout(() => {
                    setShowLoading(false);
                    navigate('/FinalOutPutScreen');
                }, 3000);

            } else {
                // Scenario 1: API needs to be called, call it first then show loading
                setLoadingText("Building your agenda...");

                // Call the API first
                await callAgendaAPI();

                // Array of loading messages to cycle through
                const loadingMessages = [
                    "Building your agenda...",
                    "Finding your perfect sessions…",
                    "Just a few more minutes...",
                    "Busy making your schedule..",
                    "Hang tight…"
                ];

                let currentMessageIndex = 0;

                // Set up interval to cycle through loading messages
                const loadingInterval = setInterval(() => {
                    currentMessageIndex = (currentMessageIndex + 1) % loadingMessages.length;
                    setLoadingText(loadingMessages[currentMessageIndex]);
                }, 5000); // Change message every 5 seconds

                // Check sessionStorage every 2 seconds for data arrival
                const checkDataInterval = setInterval(() => {
                    const apiDataReceived = sessionStorage.getItem('apiDataReceived');
                    const apiError = sessionStorage.getItem('apiError');

                    if (apiDataReceived === 'true') {
                        clearInterval(loadingInterval);
                        clearInterval(checkDataInterval);

                        // Wait a bit more for PDF upload to complete, then navigate
                        setTimeout(() => {
                            setShowLoading(false);
                            navigate('/FinalOutPutScreen');
                        }, 2000); // Wait 2 more seconds for PDF upload
                    }

                    if (apiError === 'true') {
                        clearInterval(loadingInterval);
                        clearInterval(checkDataInterval);
                        setShowLoading(false);

                        // Show error message
                        setMessages(prev => [...prev, {
                            id: Date.now() + Math.random(),
                            type: "ai",
                            content: "Sorry, there was an error creating your agenda. Please try again.",
                            timestamp: new Date(),
                            isError: true
                        }]);
                    }
                }, 2000);
            }

        } catch (error) {
            console.error('Error in createAgenda:', error);
            setShowLoading(false);
        }
    };



    // WebSocket connection
    useEffect(() => {
        const connectWebSocket = () => {
            try {
                wsRef.current = new WebSocket('wss://xeroapi.logarithm.dev');

                wsRef.current.onopen = () => {
                    setIsConnected(true);
                    sendUserDataToServer(); // Send user data when connection is established
                };

                wsRef.current.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);

                        switch (data.type) {
                            case 'message':
                                // Only add bot messages, not user messages (to prevent echo)
                                if (data.isBot && data.content && data.content.trim() !== '') {
                                    // Check if this is not just an echo of the user's message
                                    const userMessage = messages[messages.length - 1];
                                    if (userMessage && userMessage.type === 'user' &&
                                        userMessage.content.toLowerCase() === data.content.toLowerCase()) {
                                        break;
                                    }

                                    // Clear any pending timeout since we received a response
                                    if (timeoutRef.current) {
                                        clearTimeout(timeoutRef.current);
                                        timeoutRef.current = null;
                                    }

                                    // Handle initial message specially
                                    if (!hasReceivedInitialMessage && data.isBot) {
                                        setHasReceivedInitialMessage(true);

                                        // Check if initial message is about showing Tell Me More button
                                        const isInitialTellMeMoreMessage = data.content && data.content.toLowerCase().includes('tell me more') || false;

                                        // Check if initial message is about showing Build Agenda button
                                        const isInitialBuildAgendaMessage = data.content && data.content.toLowerCase().includes('build agenda');

                                        // Create initial message with backend properties
                                        const initialMessage = {
                                            id: Date.now() + Math.random(),
                                            content: cleanContent(data.content),
                                            isBot: data.isBot,
                                            timestamp: new Date(),
                                            type: 'ai',
                                            // Use backend properties with normalization
                                            bulletPoints: data.bulletPoints,
                                            showButtons: normalizeBoolean(data.showButtons),
                                            textYes: data.textYes,
                                            // Show Tell Me More button only for keynote-related messages
                                            showTellMeMore: false,
                                            // Show Build Agenda button only for agenda-related messages
                                            showBuildAgenda: isInitialBuildAgendaMessage
                                        };

                                        setMessages([initialMessage]);
                                        setShowInitialButtons(true);
                                    } else {
                                        // Check for special commands in the message
                                        if (data.content && (
                                            data.content.toLowerCase().includes('create agenda') ||
                                            data.content.toLowerCase().includes('build agenda') ||
                                            data.content.toLowerCase().includes('navigate to agenda') ||
                                            data.content.toLowerCase().includes('i\'m ready to have my agenda built') ||
                                            data.content.toLowerCase().includes('let\'s build that agenda')
                                        )) {
                                            // Only call createAgenda if user hasn't already triggered it
                                            if (!agendaCreationTriggered) {
                                                // User already triggered it
                                            } else {
                                                // Call API to create agenda
                                                createAgenda();
                                            }
                                        }

                                        // Check if backend wants to show build agenda button
                                        if (normalizeBoolean(data.showBuildAgenda)) {
                                            // Only auto-trigger if user hasn't already clicked agenda creation
                                            if (!agendaCreationTriggered) {
                                                // Automatically call API to create agenda after a short delay
                                                setTimeout(() => {
                                                    createAgenda();
                                                }, 2000); // 2 second delay to show the button
                                            }
                                        }

                                        // Check if this message is about showing Tell Me More button
                                        const isTellMeMoreMessage = data.content && data.content.toLowerCase().includes('tell me more');

                                        // Check if this message is about showing Build Agenda button
                                        const isBuildAgendaMessage = data.content && data.content.toLowerCase().includes('build agenda');

                                        setMessages(prev => {
                                            const lastMessage = prev[prev.length - 1];

                                            // Don't add duplicate messages
                                            if (lastMessage && lastMessage.content === data.content && lastMessage.isBot === data.isBot) {
                                                return prev;
                                            }

                                            // Don't add Tell Me More messages if we already have one
                                            if (isTellMeMoreMessage) {
                                                const hasTellMeMoreMessage = prev.some(msg =>
                                                    msg.content && msg.content.toLowerCase().includes('tell me more')
                                                );
                                                if (hasTellMeMoreMessage) {
                                                    return prev;
                                                }
                                            }

                                            // Don't add Build Agenda messages if we already have one
                                            if (isBuildAgendaMessage) {
                                                const hasBuildAgendaMessage = prev.some(msg =>
                                                    msg.content && msg.content.toLowerCase().includes('build agenda')
                                                );
                                                if (hasBuildAgendaMessage) {
                                                    return prev;
                                                }
                                            }

                                            // If this is a generic bot message without specific content, 
                                            // check if we need to preserve button states from the previous message
                                            if (data.isBot && !isTellMeMoreMessage && !isBuildAgendaMessage) {
                                                // Find the last message that has button states
                                                let lastMessageWithButtons = null;
                                                for (let i = prev.length - 1; i >= 0; i--) {
                                                    if (prev[i].showBuildAgenda || prev[i].showTellMeMore) {
                                                        lastMessageWithButtons = prev[i];
                                                        break;
                                                    }
                                                }


                                                if (lastMessageWithButtons && lastMessageWithButtons.showBuildAgenda) {
                                                    // Preserve the Build Agenda button state for this message
                                                    data.showBuildAgenda = true;
                                                    data.showTellMeMore = false;
                                                } else if (lastMessageWithButtons && lastMessageWithButtons.showTellMeMore) {
                                                    // Preserve the Tell Me More button state for this message
                                                    data.showTellMeMore = true;
                                                    data.showBuildAgenda = false;
                                                }
                                            }

                                            // Create message object with backend properties
                                            const messageObj = {
                                                id: Date.now() + Math.random(),
                                                content: cleanContent(data.content),
                                                isBot: data.isBot,
                                                timestamp: new Date(),
                                                type: 'ai',
                                                // Use backend properties directly
                                                bulletPoints: data.bulletPoints,
                                                showButtons: data.showButtons,
                                                textYes: data.textYes,
                                                // Use preserved button states or default to false
                                                showTellMeMore: data.showTellMeMore || false,
                                                showBuildAgenda: data.showBuildAgenda || false
                                            };

                                            return [...prev, messageObj];
                                        });
                                    }
                                }
                                break;

                            case 'stream_start':
                                // Clear any pending timeout since streaming started
                                if (timeoutRef.current) {
                                    clearTimeout(timeoutRef.current);
                                    timeoutRef.current = null;
                                }

                                setIsStreaming(true);
                                setCurrentStreamingMessage('');
                                // Add empty bot message that will be filled with streaming content
                                setMessages(prev => [...prev, {
                                    id: Date.now() + Math.random(),
                                    content: '',
                                    isBot: true,
                                    timestamp: new Date(),
                                    isStreaming: true,
                                    type: 'ai'
                                }]);
                                break;

                            case 'stream':
                                console.log(data.content, 'data.content')
                                setCurrentStreamingMessage(prev => {
                                    const updatedContent = prev + data.content;

                                    // Update messages at the same time using the correct updated content
                                    setMessages(prev => {
                                        const newMessages = [...prev];
                                        const lastMessage = newMessages[newMessages.length - 1];
                                        if (lastMessage && lastMessage.isStreaming) {
                                            lastMessage.content = updatedContent;
                                        }
                                        return newMessages;
                                    });

                                    return updatedContent;
                                });

                                break;

                            case 'stream_end':
                                setIsStreaming(false);
                                setCurrentStreamingMessage('');
                                // Mark the last message as no longer streaming
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    const lastMessage = newMessages[newMessages.length - 1];
                                    if (lastMessage && lastMessage.isStreaming) {
                                        lastMessage.isStreaming = false;
                                    }
                                    return newMessages;
                                });
                                break;

                            case 'error':
                                setMessages(prev => [...prev, {
                                    id: Date.now() + Math.random(),
                                    content: data.content,
                                    isBot: true,
                                    timestamp: new Date(),
                                    isError: true,
                                    type: 'ai'
                                }]);
                                break;

                            default:
                                console.log('Unknown message type:', data.type);
                                break;
                        }
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                };

                wsRef.current.onclose = () => {
                    setIsConnected(false);
                    // Try to reconnect after 3 seconds
                    setTimeout(connectWebSocket, 3000);
                };

                wsRef.current.onerror = (error) => {
                    setIsConnected(false);
                };
            } catch (error) {
                setIsConnected(false);
            }
        };

        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    // Send user data when WebSocket connects
    useEffect(() => {
        if (isConnected && wsRef.current) {
            sendUserDataToServer();
        }
    }, [isConnected]);




    // Set initial spinner as finished after 4 seconds (matches CSS animation duration)
    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialSpinnerFinished(true);
            // Show ready message briefly
            setShowReadyMessage(true);
            setTimeout(() => setShowReadyMessage(false), 2000); // Hide after 2 seconds
        }, 5000); // 4 seconds to match CSS animation

        return () => clearTimeout(timer);
    }, []);

    // Auto-scroll to bottom (only after initial spinner finishes and there are actual messages)
    useEffect(() => {
        if (initialSpinnerFinished && messages.length > 1) { // Only scroll if spinner finished and we have more than just the initial "Thinking." message
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, currentStreamingMessage, initialSpinnerFinished]);

    // Debug messages state changes


    const sendMessage = () => {
        if (!message.trim() || !isConnected || isStreaming) return;

        try {
            // Send message to WebSocket
            wsRef.current.send(JSON.stringify({
                message: message.trim()
            }));

            // Clear input and hide quick replies
            setMessage("");
            setShowQuickReplies(false);
            setShowInitialButtons(false);

            console.log('Message sent via WebSocket:', message.trim());

            // Set a timeout to handle cases where no response is received
            timeoutRef.current = setTimeout(() => {
                console.log('No response received from WebSocket, showing fallback message');
                handleLocalMessage();
            }, 10000); // 10 second timeout

        } catch (error) {
            console.error('Error sending message:', error);
            // Fallback to local handling if WebSocket fails
            handleLocalMessage();
        }
    };

    const handleLocalMessage = () => {
        // Fallback logic when WebSocket is not available
        setMessage("");
        setShowQuickReplies(false);
        setShowInitialButtons(false);

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + Math.random(),
                type: "ai",
                content: "I'm sorry, I'm having trouble connecting to the server right now. Please try again later or use the quick reply buttons below.",
                timestamp: new Date()
            }]);
        }, 1000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            // Add user message
            setMessages(prev => [...prev, {
                id: Date.now() + Math.random(),
                type: "user",
                content: message,
                timestamp: new Date()
            }]);

            // Send via WebSocket if connected
            if (isConnected) {
                sendMessage();
            } else {
                // Fallback to simple error message if WebSocket not connected
                setMessage("");
                setShowQuickReplies(false);
                setShowInitialButtons(false);

                // Show connection error message
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: Date.now() + Math.random(),
                        type: "ai",
                        content: "I'm sorry, I'm having trouble connecting to the server right now. Please try again later.",
                        timestamp: new Date()
                    }]);
                }, 1000);
            }
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setMessage(value);

        // Show quick replies when user starts typing
        if (value.trim().length > 0) {
            setShowQuickReplies(true);
        } else {
            setShowQuickReplies(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleQuickReply = (response) => {
        // Add user's quick reply as a message
        setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            type: "user",
            content: response,
            timestamp: new Date()
        }]);
        setShowQuickReplies(false);
        setShowInitialButtons(false);

        // Special handling for Create my agenda button - call API
        if (response === "Create my agenda.") {
            createAgenda();
            return;
        }

        // Special handling for "Yes. Let's build the agenda!" - call API
        if (response === "Yes. Let's build the agenda!") {
            createAgenda();
            return;
        }

        // Special handling for "I'm ready to have my agenda built now. Let's build that agenda!" - call API
        if (response === "I'm ready to have my agenda built now. Let's build that agenda!") {
            createAgenda();
            return;
        }

        // Send message via WebSocket if connected
        if (isConnected && wsRef.current) {
            try {
                // Send the quick reply to backend
                wsRef.current.send(JSON.stringify({
                    message: response
                }));

                // Set a timeout to handle cases where no response is received
                timeoutRef.current = setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: Date.now() + Math.random(),
                        type: "ai",
                        content: "I'm sorry, I'm having trouble connecting to the server right now. Please try again later.",
                        timestamp: new Date()
                    }]);
                }, 10000); // 10 second timeout

            } catch (error) {
                // Show error message if WebSocket fails
                setMessages(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    type: "ai",
                    content: "I'm sorry, there was an error sending your message. Please try again.",
                    timestamp: new Date()
                }]);
            }
        } else {
            console.log('WebSocket not connected, cannot send quick reply');
            // Show connection error message
            setMessages(prev => [...prev, {
                id: Date.now() + Math.random(),
                type: "ai",
                content: "I'm sorry, I'm not connected to the server right now. Please try again later.",
                timestamp: new Date()
            }]);
        }
    };

    useEffect(() => {

        console.log(messages, 'messages')
    }, [messages]);
    // Loading Screen
    if (showLoading) {
        return (
            <>
                <style>
                    {`
                        @keyframes spin {
                            from {
                                transform: rotate(0deg);
                            }
                            to {
                                transform: rotate(360deg);
                            }
                        }
                    `}
                </style>
                <div className="min-h-screen bg-[#BBF3FD] flex flex-col items-center justify-center px-6 overflow-y-auto'">
                    {/* Header with Logo */}
                    <div className="absolute top-0 left-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-[163px] md:w-[341px] h-[33px] sm:w-[161px] sm:h-[33px] z-50   pt-[75px] sm:pt-8 md:pt-[66px]  md:ml-[69px]">
                                <Link to='/'>
                                    <img
                                        src="./Bne25.png"

                                        className="w-full h-auto object-cover md:hidden block"
                                        alt="Bne25 Logo"
                                    />
                                </Link>
                                <Link to='/' className=" md:block hidden">
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
                            <div className="flex items-baseline">

                            </div>
                        </div>
                    </div >

                    {/* Rotating Loading Image */}
                    < div className="mb-8" >
                        <div className="relative w-32 h-32">
                            <img
                                src="./loading.png"
                                className="w-full h-auto object-contain"
                                style={{
                                    animation: 'spin 2s linear infinite'
                                }}
                                alt="Loading"
                            />
                        </div>
                    </div >

                    {/* Loading Text */}
                    < div className="text-center" >
                        <p className="text-[#213B55] text-[20px] font-bold TestNational2Medium">
                            {loadingText}
                        </p>
                    </div >
                </div >
            </>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto md:max-w-none overflow-y-auto" >
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 max-w-md mx-auto bg-white z-50 md:max-w-none ">
                <div className="flex items-center justify-between px-6  mt-[75px] md:mt-[64px] md:mx-[90px]">

                    <svg width="29" height="33" viewBox="0 0 29 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_1463_718)">
                            <g clip-path="url(#clip1_1463_718)">
                                <path d="M13.7613 16.7103C15.4548 16.7103 16.8227 15.3391 16.8227 13.6704C16.8227 12.0016 15.4418 10.6304 13.7613 10.6304C12.0809 10.6304 10.7 11.9887 10.7 13.6704C10.7 15.352 12.0809 16.7103 13.7613 16.7103Z" fill="#12B5EB" />
                                <path d="M13.7613 21.6001C9.35823 21.6001 5.77582 18.0426 5.77582 13.6702C5.77582 9.29782 9.35823 5.7404 13.7613 5.7404C18.1644 5.7404 21.7469 9.29782 21.7469 13.6702C21.7469 18.0426 18.1644 21.6001 13.7613 21.6001ZM23.4925 4.00696C18.1123 -1.33565 9.39731 -1.33565 4.03021 4.00696C-1.33689 9.34957 -1.34992 18.0038 4.03021 23.3335L13.7613 32.9968L23.4925 23.3335C28.8726 17.9909 28.8726 9.33663 23.4925 4.00696Z" fill="#12B5EB" />
                                <path d="M13.7613 16.7103C15.4548 16.7103 16.8227 15.3391 16.8227 13.6704C16.8227 12.0016 15.4418 10.6304 13.7613 10.6304C12.0809 10.6304 10.7 11.9887 10.7 13.6704C10.7 15.352 12.0809 16.7103 13.7613 16.7103Z" fill="#12B5EB" />
                                <path d="M13.7613 21.6001C9.35823 21.6001 5.77582 18.0426 5.77582 13.6702C5.77582 9.29782 9.35823 5.7404 13.7613 5.7404C18.1644 5.7404 21.7469 9.29782 21.7469 13.6702C21.7469 18.0426 18.1644 21.6001 13.7613 21.6001ZM23.4925 4.00696C18.1123 -1.33565 9.39731 -1.33565 4.03021 4.00696C-1.33689 9.34957 -1.34992 18.0038 4.03021 23.3335L13.7613 32.9968L23.4925 23.3335C28.8726 17.9909 28.8726 9.33663 23.4925 4.00696Z" fill="#12B5EB" />
                            </g>
                        </g>
                        <defs>
                            <clipPath id="clip0_1463_718">
                                <rect width="29" height="33" fill="white" />
                            </clipPath>
                            <clipPath id="clip1_1463_718">
                                <rect width="161" height="33" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>


                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-bold TestNational2Bold text-[#213B55]">Chat</h1>
                    </div>

                    <h1 className="text-[16px] border-b-3 border-[#1BB1E7] TestNational2Bold text-[#213B55] cursor-pointer" onClick={handleStartOver}>
                        Start Over
                    </h1>
                </div>
            </div>

            {/* Scrollable Main Content - Bottom margin accounts for fixed bottom elements */}
            {/* Button container: 80px + 20px margin = 100px */}
            {/* Input container: 100px + 18px margin = 118px */}
            {/* Total needed: 100px + 118px + 22px safety = 240px */}
            <style>
                {`
 @keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(720deg); } /* 2 full spins */
}

.spin {
  animation: spin 4s linear forwards; /* Takes 4s to complete 2 spins */
  transform-origin: center;
}

/* Smooth transition when spinner stops */
img {
  transition: all 0.3s ease;
}

`}


            </style>
            <div className="flex-1 px-6  overflow-y-auto pt-[135px] mb-[180px] md:max-w-[768px] md:mx-auto ">
                {/* Logo Section */}
                <div className="flex justify-center mb-8 relative right-[20px]  ">
                    <div className=" w-[80px] h-[80px]">
                        <img
                            className={`object-cover w-full h-full ${!initialSpinnerFinished ? 'spin' : ''}`}
                            src="./loading.png"
                        >
                        </img>
                    </div>


                </div>

                {/* Messages */}
                <div className="space-y-4">
                    {messages.map((msg, index) => {
                        // Debug: Log message properties during rendering


                        return (
                            <div key={msg.id} className={`${msg.type === 'user' ? 'flex justify-end' : ''}`}>
                                {msg.type === 'user' ? (
                                    <div className="bg-gray-200 rounded-lg px-4 py-2 max-w-xs">
                                        <p className="text-[#213B55] TestNational2Regular">{msg.content}</p>
                                    </div>
                                ) : msg.type === 'ai' ? (
                                    <div className="">
                                        <p className="text-[#213B55] mb-3 TestNational2Regular whitespace-pre-line">
                                            {(() => {
                                                if (msg.isStreaming) {
                                                    return (
                                                        <span>
                                                            {msg.content}
                                                            <span className="animate-pulse">|</span>
                                                        </span>
                                                    );
                                                }

                                                if (!msg.showBuildAgenda && !msg.showTellMeMore && !msg.showButtons) {
                                                    const content = msg.content;

                                                    const suggestedPrompts = [
                                                        'Do you want to tell me more about the session?',
                                                        'Show me other sessions that are similar to this?',
                                                        "I'd like to know more about the Exhibitors at Xerocon 2025!",
                                                        "When's the keynote?",
                                                        "Want to know more about this speaker's session? Tell me more.",
                                                        "I am ready to have my agenda built now. Let's go!",
                                                        "I am ready to have my agenda built now."
                                                    ];

                                                    const sortedPrompts = [...suggestedPrompts].sort((a, b) => b.length - a.length);

                                                    for (const prompt of sortedPrompts) {
                                                        const cleanPrompt = prompt
                                                            .replace(/[.!?]/g, '')
                                                            .replace(/['"\\]/g, '')
                                                            .toLowerCase();

                                                        const cleanContent = content
                                                            .replace(/[.!?]/g, '')
                                                            .replace(/['"\\]/g, '')
                                                            .toLowerCase();

                                                        const startIndex = cleanContent.indexOf(cleanPrompt);

                                                        if (startIndex !== -1) {
                                                            // Instead of trying to find again in the original, we map character-by-character
                                                            let charCount = 0;
                                                            let originalStart = -1;
                                                            let originalEnd = -1;

                                                            for (let i = 0; i < content.length; i++) {
                                                                const ch = content[i];
                                                                if (!/[.!?'"\\]/.test(ch)) {
                                                                    if (charCount === startIndex) {
                                                                        originalStart = i;
                                                                    }
                                                                    if (charCount === startIndex + cleanPrompt.length - 1) {
                                                                        originalEnd = i + 1;
                                                                        break;
                                                                    }
                                                                    charCount++;
                                                                }
                                                            }

                                                            if (originalStart !== -1 && originalEnd !== -1) {
                                                                const before = content.slice(0, originalStart);
                                                                const match = content.slice(originalStart, originalEnd);
                                                                const after = content.slice(originalEnd);

                                                                return (
                                                                    <>
                                                                        {before}
                                                                        <button
                                                                            onClick={() => handleSuggestedPromptClick(prompt)}
                                                                            className="inline bg-gray-200 hover:bg-gray-300 text-[#213B55] py-2 TestNational2Bold rounded-lg px-1 text-[16px] mx-1 text-left"
                                                                        >
                                                                            {match}{after}
                                                                        </button>


                                                                    </>
                                                                );
                                                            }
                                                        }
                                                    }
                                                }

                                                // Fallback
                                                return msg.content;
                                            })()}

                                        </p>


                                        {/* Bullet Points with Border */}
                                        {msg.bulletPoints && (
                                            <div className=" rounded-lg p-4 mb-4 bg-gray-50">
                                                <ul className="list-disc list-inside text-[#213B55] space-y-2">
                                                    {msg.bulletPoints.map((point, i) => (
                                                        <li key={i} className="TestNational2Regular">{point}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Text and Buttons after Bullet Points */}
                                        {msg.showButtons && (
                                            <div className="space-y-4">
                                                <p className="text-[#213B55] TestNational2Regular text-justify">
                                                    {msg.textYes || "Are you interested in answering some of my questions so I can build the perfect agenda for you? Yes or no?"}
                                                </p>
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => {
                                                            // Add user message to chat
                                                            setMessages(prev => [...prev, {
                                                                id: Date.now() + Math.random(),
                                                                type: "user",
                                                                content: "Yes. Let's build the agenda!",
                                                                timestamp: new Date()
                                                            }]);

                                                            // Send message via WebSocket
                                                            if (isConnected && wsRef.current) {
                                                                try {
                                                                    wsRef.current.send(JSON.stringify({
                                                                        message: "Yes. Let's build the agenda!"
                                                                    }));
                                                                    console.log('Yes response sent via WebSocket');
                                                                } catch (error) {
                                                                    console.error('Error sending yes response:', error);
                                                                }
                                                            }

                                                            // Call API to create agenda
                                                            createAgenda();
                                                        }}
                                                        className="bg-gray-200 rounded-lg px-4 py-2 text-[#213B55] hover:bg-gray-300 transition-colors"
                                                    >
                                                        <span className="font-bold">Yes.</span> Let's build the agenda!
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            // Add user message to chat
                                                            setMessages(prev => [...prev, {
                                                                id: Date.now() + Math.random(),
                                                                type: "user",
                                                                content: "No. I'm enjoying this chat",
                                                                timestamp: new Date()
                                                            }]);

                                                            // Send message via WebSocket
                                                            if (isConnected && wsRef.current) {
                                                                try {
                                                                    wsRef.current.send(JSON.stringify({
                                                                        message: "No. I'm enjoying this chat"
                                                                    }));
                                                                    console.log('No response sent via WebSocket');
                                                                } catch (error) {
                                                                    console.error('Error sending no response:', error);
                                                                }
                                                            }

                                                            // Note: Buttons are now controlled by message properties
                                                            // No need to set global state
                                                        }}
                                                        className="bg-gray-200 rounded-lg px-4 py-2 text-[#213B55] hover:bg-gray-300 transition-colors"
                                                    >
                                                        <span className="font-bold">No.</span> I'm enjoying this chat
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Tell me more button */}


                                        {/* Build Agenda button */}
                                        {msg.showBuildAgenda && !isStreaming && (
                                            <div className="mt-4">
                                                <button
                                                    onClick={() => {
                                                        // Add user message to chat
                                                        setMessages(prev => [...prev, {
                                                            id: Date.now() + Math.random(),
                                                            type: "user",
                                                            content: "I'm ready to have my agenda built now. Let's build that agenda!",
                                                            timestamp: new Date()
                                                        }]);

                                                        // Send message via WebSocket
                                                        if (isConnected && wsRef.current) {
                                                            try {
                                                                wsRef.current.send(JSON.stringify({
                                                                    message: "I'm ready to have my agenda built now. Let's build that agenda!"
                                                                }));
                                                                console.log('Build agenda message sent via WebSocket');
                                                            } catch (error) {
                                                                console.error('Error sending build agenda message:', error);
                                                            }
                                                        }

                                                        // Call API to create agenda
                                                        createAgenda();
                                                    }}
                                                    className="bg-gray-200  text-justify rounded-lg px-4 py-2 text-[#213B55]  font-bold hover:bg-gray-300 transition-colors md:w-full"
                                                >
                                                    <span className="text-left text-[16px] leading-[20px] text-[#213B55] flex-none order-0 grow">
                                                        I'm ready to have my agenda built now. Let's build that agenda!
                                                    </span>

                                                </button>
                                            </div>
                                        )}

                                        {/* Suggested Prompt Buttons - Show when backend message contains any suggested prompts */}

                                    </div>
                                ) : (
                                    <div className="bg-white">
                                        <p className="text-[#213B55] mb-3">
                                            {msg.content.split('**').map((part, i) =>
                                                i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                                            )}
                                        </p>
                                        {msg.examples && (
                                            <ul className="TestNational2Regular">
                                                {msg.examples.map((example, i) => (
                                                    <li key={i}> {example}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {msg.callToAction && (
                                            <p className="text-[#213B55]">
                                                {msg.callToAction.split("'").map((part, i) =>
                                                    i % 2 === 0 ? part : <span key={i} className="TestNational2Regular ">'{part}'</span>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}



                    {/* Status indicator for agenda building */}


                    {/* Scroll to bottom reference */}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Fixed Bottom Input Field */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md md:max-w-[768px] mx-auto bg-white z-50">
                {/* Button Container - Fixed height to prevent content collapse */}
                <div className="px-6 mb-[20px] h-[40px] flex items-center transition-all duration-300 ease-in-out">
                    {/* Initially show both buttons side by side */}
                    {showInitialButtons && !isStreaming ? (
                        <div className="flex space-x-3 w-full transition-opacity duration-300 ease-in-out">
                            <button
                                onClick={() => {
                                    // Add user message to chat
                                    setMessages(prev => [...prev, {
                                        id: Date.now() + Math.random(),
                                        type: "user",
                                        content: "Create my agenda.",
                                        timestamp: new Date()
                                    }]);

                                    // Send message via WebSocket
                                    if (isConnected && wsRef.current) {
                                        try {
                                            wsRef.current.send(JSON.stringify({
                                                message: "Create my agenda."
                                            }));
                                            console.log('Create agenda message sent via WebSocket');
                                        } catch (error) {
                                            console.error('Error sending create agenda message:', error);
                                        }
                                    }

                                    // Hide the initial buttons
                                    setShowInitialButtons(false);

                                    // Call API to create agenda
                                    createAgenda();
                                }}
                                className="bg-gray-200 leading-[20px] text-left rounded-[10px] px-4 py-2 text-[#213B55] hover:bg-gray-300 transition-colors flex-1 md:py-[16px]"
                            >
                                <span className="text-[16px] TestNational2Bold">Create my agenda.</span>
                            </button>
                            <button
                                onClick={() => {
                                    // Add user message to chat
                                    setMessages(prev => [...prev, {
                                        id: Date.now() + Math.random(),
                                        type: "user",
                                        content: "When's the keynote?",
                                        timestamp: new Date()
                                    }]);

                                    // Send message via WebSocket
                                    if (isConnected && wsRef.current) {
                                        try {
                                            wsRef.current.send(JSON.stringify({
                                                message: "When's the keynote?"
                                            }));
                                            console.log('Keynote question sent via WebSocket');
                                        } catch (error) {
                                            console.error('Error sending keynote question:', error);
                                        }
                                    }

                                    // Hide the initial buttons
                                    setShowInitialButtons(false);

                                    // Add a message with "Tell me more" button after user clicks "When's the keynote?"
                                    const tellMeMoreMessage = {
                                        id: Date.now() + Math.random(),
                                        // content: "The opening keynote kicks off on Main Stage at 9:30am. Make sure to grab a good seat — it's the perfect way to set the tone for your day at Xerocon!",
                                        isBot: true,
                                        timestamp: new Date(),
                                        type: 'ai',
                                        showTellMeMore: true
                                    };
                                    setMessages(prev => [...prev, tellMeMoreMessage]);
                                }}
                                className="bg-gray-200 text-left rounded-[10px] px-4 py-2 text-[#213B55] hover:bg-gray-300 transition-colors flex-1"
                            >
                                <div className="leading-[20px]">
                                    <span className="text-[16px] TestNational2Bold">
                                        When's the keynote?</span>
                                </div>
                            </button>
                        </div>
                    ) : (
                        /* When chatting starts, show only "Create my agenda" button on the right */
                        <div className="flex justify-end w-full transition-opacity duration-300 ease-in-out">
                            <button
                                onClick={() => {
                                    // Add user message to chat
                                    setMessages(prev => [...prev, {
                                        id: Date.now() + Math.random(),
                                        type: "user",
                                        content: "Create my agenda.",
                                        timestamp: new Date()
                                    }]);

                                    // Send message via WebSocket
                                    if (isConnected && wsRef.current) {
                                        try {
                                            wsRef.current.send(JSON.stringify({
                                                message: "Create my agenda."
                                            }));
                                            console.log('Create agenda message sent via WebSocket');
                                        } catch (error) {
                                            console.error('Error sending create agenda message:', error);
                                        }
                                    }

                                    // Call API to create agenda
                                    createAgenda();
                                }}
                                className="bg-gray-200 leading-[20px] text-left rounded-[10px] px-4 py-2 text-[#213B55] hover:bg-gray-300 transition-colors md:py-[16px] w-auto min-w-[180px] shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300"
                            >
                                <span className="text-[16px] TestNational2Bold">Create my agenda.</span>
                            </button>
                        </div>
                    )}
                </div>
                <div className="px-6 py-2 h-[100px] bg-[#E9EBEE] rounded-[10px] mx-6 mb-[18px]">
                    <form onSubmit={handleSubmit} className="flex items-start space-x-3">
                        <textarea
                            value={message}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder={isStreaming ? "AI is typing..." : "Ask anything..."}
                            disabled={isStreaming || !isConnected}
                            rows={1}
                            className={`flex-1 TestNational2Regular px-4 py-2 text-[#213B55] placeholder-gray-500 focus:outline-none resize-none overflow-hidden ${isStreaming || !isConnected ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            style={{
                                minHeight: '40px',
                                maxHeight: '80px',
                                lineHeight: '1.2'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={isStreaming || !isConnected || !message.trim()}
                            className={`p-2 rounded-lg transition-colors mt-1 ${isStreaming || !isConnected || !message.trim()
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-gray-200'
                                }`}
                        >
                            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.598 13L13 8.40197L8.40197 13L9.24444 13.8425L12.389 10.6983V17.9443H13.611V10.6983L16.7556 13.8425L17.598 13ZM26 12.9953C26 14.7891 25.6589 16.4742 24.9766 18.0509C24.2944 19.6272 23.3645 21.0047 22.187 22.1834C21.0093 23.3621 19.633 24.2928 18.0581 24.9755C16.4832 25.6585 14.7987 26 13.0047 26C11.2071 26 9.51696 25.6589 7.93433 24.9766C6.35194 24.2944 4.97539 23.3645 3.80467 22.187C2.63394 21.0093 1.70721 19.633 1.02447 18.0581C0.341491 16.4832 0 14.7987 0 13.0047C0 11.2071 0.341131 9.51696 1.02339 7.93433C1.70565 6.35194 2.63154 4.97539 3.80106 3.80467C4.97057 2.63394 6.34593 1.70721 7.92711 1.02447C9.50806 0.341492 11.1975 0 12.9953 0C14.7891 0 16.4743 0.341131 18.0509 1.02339C19.6272 1.70565 21.0047 2.63154 22.1834 3.80106C23.3621 4.97057 24.2928 6.34593 24.9755 7.92711C25.6585 9.50806 26 11.1975 26 12.9953Z" fill="#213B55" />
                            </svg>

                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatScreen; 