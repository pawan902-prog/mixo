import React, { useEffect, useState } from 'react';
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    PDFDownloadLink,
    Font
} from '@react-pdf/renderer';
Font.register({
    family: 'TestNational2Bold',
    src: "/TestNational2-Bold.ttf",
});

Font.register({
    family: 'TestNational2Regular',
    src: "/TestNational2-Regular.ttf",
});

Font.register({
    family: 'TestNational2Medium',
    src: "/TestNational2-Medium.ttf",
});

Font.register({
    family: 'TestNational2Condensed',
    src: "/TestNational2Condensed-Bold.ttf",
});

// Styles
const styles = StyleSheet.create({
    page: {
        paddingTop:
            20,
    },
    headerContainer: {
        backgroundColor: '#1e3752',
        paddingTop: 40,
        paddingBottom: 40,
        paddingHorizontal: 20,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
    },
    headerTitle: {
        fontSize: "39px",
        fontWeight: 'bold',
        color: '#ffffff',
        fontFamily: "TestNational2Bold",
        marginBottom: 12,
    },
    headerSubtitle: {
        fontSize: "20px",
        color: '#ffffff',
        fontFamily: "TestNational2Regular",
        lineHeight: 1.5,
        maxWidth: '80%',
        margin: '0 auto',
    },
    logo: {
        height: 'auto',
        width: "550.9px",
        height: "119px",
        marginBottom: 20,
        alignSelf: 'center',
    },
    agendaContainer: {
        marginTop: 30,
        display: 'flex',
        flexDirection: 'row',
        // flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingLeft: 40,
        paddingRight: 40,
        gap: 20,
    },
    dayBox: {
        // width: '47%',
        padding: 15,
        width: '100%',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#d9f5fc',
        marginBottom: 20,
    },
    dayTitle: {
        color: '#12B5EB',
        fontFamily: "TestNational2Bold",
        fontSize: "24px",
        marginBottom: 30,
    },
    sessionTime: {
        fontSize: "16px",
        color: '#213B55',
        marginBottom: 4,
        fontFamily: 'TestNational2Medium'
    },
    sessionLocation: {
        fontSize: "16px",
        color: '#213B55',
        marginBottom: 10,
        fontFamily: 'TestNational2Medium'

    },
    sessionTitle: {
        fontSize: "20px",
        marginBottom: 4,
        fontFamily: 'TestNational2Bold'
    },
    sessionDescription: {
        fontSize: '16px',
        lineHeight: 1.4,
        display: 'flex',
        color: "#213B55",
        fontFamily: "TestNational2Regular"
    },
    sessionCard: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 6,
    },
    sessionContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    containerbottom: {
        flexDirection: 'column',
        display: "flex", justifyContent: 'center', alignItems: 'center'
    },
    containerbottomTextA: {
        color: '#213B55',
        fontSize: 16, // No quotes — React-PDF expects numbers
        marginBottom: 4,
    },
    containerbottomTextB: {
        fontFamily: 'TestNational2Bold',
        color: '#213B55',
        cursor: "pointer",
        fontSize: 16,
        marginTop: '18px',
        borderBottomWidth: 3,
        borderBottomColor: '#1BB1E7',
        borderBottomStyle: 'solid'
    },

    footerImageWrapper: {
        backgroundColor: '#EFF1F3', // light gray background
        width: '100%',
        height: "75px",
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },

    footerImage: {
        width: '100%',
        position: 'relative',
        bottom: '20px',
        height: 50, // Set a fixed height (React-PDF requires explicit height)
        objectFit: 'contain',
    },
});
const getAgendaData = () => {
    try {
        const storedData = sessionStorage.getItem('agendaData');
        console.log('FinalOutputScreen - Raw localStorage data:', storedData);

        if (storedData) {
            const rawAgenda = JSON.parse(storedData);
            console.log('FinalOutputScreen - Parsed agenda data:', rawAgenda);

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

            console.log('FinalOutputScreen - Final formatted data:', result);
            return result;
        }
    } catch (error) {
        console.error('Error parsing agenda data:', error);
    }

    // Fallback to default data if no stored data
    return [];
};

// PDF content
const PDFGenerator = ({ agendaData }) => (

    <Document>
        <Page size="A2" style={styles.page}>
            <Image src="/pdflogo.png" style={styles.logo} />
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Your AI Agenda</Text>
                <Text style={styles.headerSubtitle}>
                    Your custom Xerocon schedule is here! Get ready to discover everything tailored for your best event yet.
                </Text>
            </View>


            <View style={styles.agendaContainer}>
                {Array.isArray(agendaData) && agendaData.map((dayGroup, index) => {
                    const isThursday = dayGroup.day.toLowerCase().includes("thursday"); // Adjust as needed

                    return (
                        <View key={index} style={{ marginBottom: 30, width: '100%' }}>
                            {/* Day Header */}
                            <Text
                                style={{
                                    ...styles.dayTitle,
                                    color: isThursday ? '#0078C8' : styles.dayTitle.color,
                                }}
                            >
                                {dayGroup.day}
                            </Text>

                            {/* 2-column Grid of Events */}
                            <View style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                gap: 20,
                                justifyContent: 'space-between'
                            }}>
                                {dayGroup.events && dayGroup.events.map((event, idx) => (
                                    <View key={idx} wrap={false} style={{
                                        ...styles.dayBox,
                                        backgroundColor: isThursday ? 'rgba(9, 128, 198, 0.2)' : styles.dayBox.backgroundColor,
                                    }}>

                                        <View style={styles.sessionContainer}>
                                            {/* Time */}
                                            <View style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
                                                <Image src="/schedule.png" style={{ height: '20px', width: '20px' }} />
                                                <Text style={styles.sessionTime}>{event.time}</Text>
                                            </View>

                                            {/* Location */}
                                            <View style={{ display: 'flex', flexDirection: 'row', gap: 0, marginTop: 5 }}>
                                                <Image src="/location.png" style={{ height: '23px', width: '25px', marginRight: '5px' }} />
                                                <Text style={styles.sessionLocation}>{event.location} {event?.stageNumber}</Text>
                                            </View>

                                            <View style={styles.sessionCard}>
                                                {
                                                    !event.title ? (
                                                        <>
                                                            <Text style={styles.sessionTitle}>{event.appPartner}</Text>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Text style={styles.sessionTitle}>{event.title}</Text>
                                                            <Text style={styles.sessionDescription}>{event.description}</Text>
                                                        </>
                                                    )
                                                }

                                                <Text style={{
                                                    color: '#213B55',
                                                    fontSize: 10,
                                                    marginTop: 10,
                                                    fontFamily: "TestNational2Regular"
                                                }}>
                                                    *Agenda subject to change
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    );
                })}


            </View>

            {/* Exhibitor Booths Section - Only show if data exists */}
            {(() => {
                const exhibitorBooth = sessionStorage.getItem('exhibitorBooth');
                if (exhibitorBooth) {
                    try {
                        const exhibitors = JSON.parse(exhibitorBooth);
                        if (Array.isArray(exhibitors) && exhibitors.length > 0) {
                            return (
                                <>

                                    <View wrap={false} style={{
                                        width: "53%",
                                        marginTop: 30,
                                        paddingLeft: 40,
                                        paddingRight: 40,
                                        marginBottom: 30
                                    }}>
                                        <View>
                                            <Text style={{ color: "black", fontSize: "20px", fontFamily: "TestNational2Regular" }}>
                                                Our Exhibitor picks for you
                                            </Text>
                                        </View>
                                        <Text style={{
                                            color: '#12B5EB',
                                            fontFamily: "TestNational2Bold",
                                            fontSize: "24px",
                                            marginTop: 20,
                                            marginBottom: 20,
                                        }}>
                                            Exhibitor Booths
                                        </Text>

                                        <View style={{
                                            backgroundColor: '#d9f5fc',
                                            padding: 20,
                                            borderRadius: 8,
                                        }}>
                                            <View style={{
                                                backgroundColor: '#ffffff',
                                                padding: 20,
                                                borderRadius: 6,
                                            }}>
                                                {exhibitors.map((exhibitor, index) => (
                                                    <Text key={index} style={{
                                                        fontSize: 16,
                                                        color: '#213B55',
                                                        fontFamily: 'TestNational2Regular',
                                                        marginBottom: 8,
                                                        paddingLeft: 20,
                                                    }}>
                                                        • {exhibitor.appDisplayName}
                                                    </Text>
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                </>
                            );
                        }
                    } catch (error) {
                        console.error('Error parsing exhibitor booth data:', error);
                    }
                }
                return null; // Don't render anything if no data
            })()}

            <View style={styles?.containerbottom}>
                <Text style={styles?.containerbottomTextA}>
                    Not exactly right for you?
                </Text>
                <Text style={styles?.containerbottomTextB}
                    href="https://resilient-nougat-322809.netlify.app/QuestionScreen"
                >
                    Start over
                </Text>
            </View>
            <View style={styles.footerImageWrapper}>
                <Image src="./bottom.png" style={styles.footerImage} />
            </View>
        </Page>
    </Document>
);

// Final Component with Download Button
const AgendaPDFDownloader = () => {
    const [agendaData, setAgendaData] = useState(getAgendaData());

    // Refresh agenda data when component mounts
    useEffect(() => {
        const refreshData = () => {
            const newData = getAgendaData();
            console.log('FinalOutputScreen - Agenda data loaded:', newData);
            setAgendaData(newData);
        };

        refreshData();
    }, []);

    return (
        <div>
            <PDFGenerator agendaData={agendaData} />


            <PDFDownloadLink document={<PDFGenerator agendaData={agendaData} />} fileName="xerocon-agenda.pdf">
                {({ loading }) => (
                    <button
                        disabled={loading}
                        className="bg-[#50DCAA] rounded-[87px] pl-[31px] py-[26px] pr-[31px] hover:bg-[#45C89A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="flex text-[24px] gap-[10px] items-center TestNational2Bold text-[#213B55]">
                            {loading ? '⏳ Preparing PDF...' : ' Download Agenda'}
                            <svg width="24" height="24" viewBox="0 0 24 24" color='#213B55' fill="none" xmlns="http://www.w3.org/2000/svg" className='text-[#213B55]'>
                                <path d="M10.8333 0.333008V2.66634H13.1667V0.333008H10.8333ZM10.8333 4.99967V15.0166L6.99155 11.1748L5.34181 12.8245L12 19.4827L18.6582 12.8245L17.0085 11.1748L13.1667 15.0166V4.99967H10.8333ZM0.333344 17.833V23.6663H23.6667V17.833H21.3333V21.333H2.66668V17.833H0.333344Z" fill="#213B55" />
                            </svg>
                        </span>
                    </button>
                )}
            </PDFDownloadLink>
        </div>
    );
}

// Function to convert agenda data from FinalOutputScreen format to PDF format
export const convertAgendaDataForPDF = (agendaData) => {
    if (!agendaData || !Array.isArray(agendaData)) {
        return [];
    }

    return agendaData.map((dayData, index) => ({
        date: dayData.day || `Day ${index + 1}`,
        time: dayData.events?.[0]?.time || '9:00 AM',
        location: dayData.events?.[0]?.location || 'Main Stage',
        title: dayData.events?.[0]?.title || 'Session',
        description: dayData.events?.[0]?.description || 'Description not available',
        backgroundColor: index % 2 === 0 ? '#d9f5fc' : '#d0e7f8'
    }));
};

export { AgendaPDFDownloader, PDFGenerator };
export default AgendaPDFDownloader;
