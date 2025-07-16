// import React, { useEffect, useState } from 'react';
// import useSocket from '.'; // Your custom socket hook
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";

// const DeviceGridWithTabs = () => {
//     const [selectedTab, setSelectedTab] = useState(null);
//     const [tabStatus, setTabStatus] = useState({
//         1: { active: false, lastActivity: null },
//         2: { active: false, lastActivity: null },
//         3: { active: false, lastActivity: null }
//     });

//     // Socket hook
//     const {
//         isConnected,
//         lastMessage,
//         error,
//         socketId,
//         sendMessage,
//         listenToEvent,
//         removeEventListener
//     } = useSocket('https://tagglabsapi.logarithm.co.in');

//     const navigate = useNavigate();

//     // Update socket API with different socket IDs for each tab
//     const updateSocketAPI = async (socketId, tabNumber) => {
//         try {
//             const response = await axios.put('https://tagglabsapi.logarithm.co.in/TagglabsServer1api/socket/update-socket', {
//                 socketName: `Social-Table-${tabNumber}`,
//                 socketId: socketId,
//                 tabNumber: tabNumber,
//                 status: 'active'
//             }, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//             console.log(`Socket updated successfully for Tab ${tabNumber}:`, response.data);

//             // Update local tab status
//             setTabStatus(prev => ({
//                 ...prev,
//                 [tabNumber]: {
//                     active: true,
//                     lastActivity: new Date().toISOString()
//                 }
//             }));

//             return response.data;
//         } catch (error) {
//             console.error(`Error updating socket for Tab ${tabNumber}:`, error);
//             throw error;
//         }
//     };

//     // Handle tab selection with enhanced functionality
//     const handleTabClick = async (tabNumber) => {
//         try {
//             setSelectedTab(tabNumber);

//             if (socketId) {
//                 // Update socket API
//                 await updateSocketAPI(socketId, tabNumber);

//                 // Send detailed message to socket
//                 sendMessage('tabSelected', {
//                     tabNumber: tabNumber,
//                     socketId: socketId,
//                     timestamp: new Date().toISOString(),
//                     action: 'tab_selection',
//                     deviceType: 'tablet'
//                 });

//                 // Send heartbeat to keep connection alive
//                 sendMessage('heartbeat', {
//                     tabNumber: tabNumber,
//                     socketId: socketId,
//                     timestamp: new Date().toISOString()
//                 });
//             }

//             // Store tab information in localStorage
//             localStorage.setItem('tabNumber', tabNumber);
//             localStorage.setItem('socketId', socketId);
//             localStorage.setItem('lastTabActivity', new Date().toISOString());

//         } catch (error) {
//             console.error('Error handling tab click:', error);
//             // You can show an error message to the user here
//         }
//     };

//     // Enhanced socket event listeners
//     useEffect(() => {
//         if (isConnected) {
//             // Listen for general messages
//             listenToEvent('message', (data) => {
//                 console.log('Received message:', data);
//             });

//             // Listen for tab-specific updates
//             listenToEvent('tabUpdate', (data) => {
//                 console.log('Tab update received:', data);
//                 if (data.tabNumber) {
//                     setTabStatus(prev => ({
//                         ...prev,
//                         [data.tabNumber]: {
//                             active: data.status === 'active',
//                             lastActivity: data.timestamp
//                         }
//                     }));
//                 }
//             });

//             // Listen for connection status updates
//             listenToEvent('connectionStatus', (data) => {
//                 console.log('Connection status update:', data);
//             });

//             // Listen for error messages
//             listenToEvent('error', (data) => {
//                 console.error('Socket error received:', data);
//             });

//             // Cleanup function
//             return () => {
//                 removeEventListener('message');
//                 removeEventListener('tabUpdate');
//                 removeEventListener('connectionStatus');
//                 removeEventListener('error');
//             };
//         }
//     }, [isConnected, listenToEvent, removeEventListener]);

//     // Auto-select tab 1 when socket connects
//     useEffect(() => {
//         if (isConnected && socketId && !selectedTab) {
//             console.log('Socket connected with ID:', socketId);
//             handleTabClick(1); // Default to tab 1
//         }
//     }, [isConnected, socketId]);

//     // Periodic heartbeat to keep connection alive
//     useEffect(() => {
//         if (isConnected && selectedTab) {
//             const heartbeatInterval = setInterval(() => {
//                 sendMessage('heartbeat', {
//                     tabNumber: selectedTab,
//                     socketId: socketId,
//                     timestamp: new Date().toISOString()
//                 });
//             }, 30000); // Send heartbeat every 30 seconds

//             return () => clearInterval(heartbeatInterval);
//         }
//     }, [isConnected, selectedTab, socketId, sendMessage]);

//     return (
//         <>
//             <div
//                 className="min-h-screen flex flex-col items-center text-center px-4 sm:px-6 lg:px-8"
//                 style={{
//                     backgroundImage: "url('/bg.png')",
//                     backgroundSize: "cover",
//                     backgroundPosition: "center",
//                 }}
//             >
//                 <div className="mt-[20px] sm:mt-[35px] lg:mt-[40px] md:mt-[94px]">
//                     <img
//                         src="/logo.png"
//                         className="md:w-[450px] md:h-[165px] w-[180px] h-[78px]"
//                         alt="Logo"
//                     />
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-[100px]">
//                     {[1, 2, 3].map((tab) => (
//                         <div
//                             key={tab}
//                             className="bg-white rounded-xl shadow-md p-6 hover:bg-yellow-200 transition-all duration-300 cursor-pointer text-center h-[150px] w-[150px] flex justify-center items-center"
//                             onClick={() => handleTabClick(tab)}
//                         >
//                             <h2 className="font-bold text-lg">Tab {tab}</h2>
//                         </div>
//                     ))}
//                 </div>
//                 {/* Connection Status */}
//                 <div className="connection-status">
//                     <div className="flex items-center justify-center gap-2 mb-2">
//                         <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
//                         <span className="text-sm font-medium">
//                             {isConnected ? 'Connected' : 'Disconnected'}
//                         </span>
//                     </div>
//                     {socketId && <p className="text-xs text-gray-300">Socket ID: {socketId.substring(0, 8)}...</p>}
//                     {error && <p className="text-xs text-red-400 mt-1">Error: {error}</p>}
//                 </div>

//                 {/* Selected Tab Display */}
//                 {selectedTab && (
//                     <div className="selected-tab">
//                         <h3>Selected Tab: {selectedTab}</h3>
//                         <p>Socket ID: {socketId}</p>
//                     </div>
//                 )}

//                 {/* Last Message Display */}
//                 {lastMessage && (
//                     <div className="last-message">
//                         <h4>Last Message:</h4>
//                         <p>Event: {lastMessage.event}</p>
//                         <p>Data: {JSON.stringify(lastMessage.data)}</p>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// };

// export default DeviceGridWithTabs;
