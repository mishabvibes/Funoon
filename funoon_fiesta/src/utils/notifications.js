// src/utils/notifications.js

/**
 * Formats the notification message based on result data
 * @param {Object} data - The result data
 * @returns {Object} Formatted notification content
 */
const formatNotificationContent = (data) => ({
    contents: {
      en: `New Result Added: ${data.studentName} - ${data.programName}`
    },
    headings: {
      en: "Funoon Fiesta Result Update"
    },
    subtitle: {
      en: `${data.category} - ${data.prize}`
    }
  });
  
  /**
   * Validates the required notification data
   * @param {Object} data - The data to validate
   * @returns {boolean} Whether the data is valid
   */
  const validateNotificationData = (data) => {
    const requiredFields = ['studentName', 'programName', 'category', 'prize'];
    return requiredFields.every(field => data[field] && typeof data[field] === 'string');
  };
  
  /**
   * Sends a push notification using OneSignal
   * @param {Object} data - The result data to send in notification
   * @returns {Promise} Result of the notification request
   */
  export const sendNotification = async (data) => {
    // Validate input data
    if (!validateNotificationData(data)) {
      throw new Error('Invalid notification data provided');
    }
  
    const notificationContent = formatNotificationContent(data);
  
    try {
      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${import.meta.env.VITE_ONESIGNAL_REST_API_KEY}`
        },
        body: JSON.stringify({
          app_id: "81f636c5-69ba-44e7-9601-dff39b5dd073",
          included_segments: ['All'],
          ...notificationContent,
          url: `${window.location.origin}/result`,
          chrome_web_icon: `${window.location.origin}/android-chrome-192x192.png`,
          priority: 10,
          ttl: 86400
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0] || 'Failed to send notification');
      }
  
      return response.json();
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error; // Re-throw to handle in the component
    }
  };