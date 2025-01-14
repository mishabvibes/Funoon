// src/utils/notifications.js
export const sendNotification = async (data) => {
    try {
        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${import.meta.env.VITE_ONESIGNAL_REST_API_KEY}` // Add this to your .env file
            },
            body: JSON.stringify({
                app_id: "81f636c5-69ba-44e7-9601-dff39b5dd073", // Your existing OneSignal App ID
                included_segments: ['All'],
                contents: {
                    en: `New Result Added: ${data.studentName} - ${data.programName}`
                },
                headings: {
                    en: "Funoon Fiesta Result Update"
                },
                url: window.location.origin + '/result' // Redirect to results page when notification is clicked
            })
        });
        return response.json();
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};