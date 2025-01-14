import { useState, useEffect } from 'react';
import { BellIcon, BellOffIcon } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

const NotificationManager = () => {
  const [permission, setPermission] = useState('default');
  const [showPrompt, setShowPrompt] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if OneSignal is available
    if (window.OneSignal) {
      window.OneSignal.push(() => {
        checkPermissionStatus();
      });
    }
  }, []);

  const checkPermissionStatus = async () => {
    try {
      const state = await window.OneSignal.getNotificationPermission();
      setPermission(state);
      // Show prompt if permission is not granted
      setShowPrompt(state === 'default');
    } catch (err) {
      console.error('Error checking notification permission:', err);
      setError('Unable to check notification permission status');
    }
  };

  const handleEnableNotifications = async () => {
    try {
      setError(null);
      const result = await window.OneSignal.showNativePrompt();
      
      if (result) {
        setPermission('granted');
        setShowPrompt(false);
      }
    } catch (err) {
      console.error('Error enabling notifications:', err);
      setError('Failed to enable notifications. Please try again.');
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg p-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-full">
          <BellIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">Stay Updated</h3>
          <p className="text-sm text-gray-600">Get notified about new results and updates</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleEnableNotifications}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Enable Notifications
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
        >
          Later
        </button>
      </div>
    </div>
  );
};

export default NotificationManager;