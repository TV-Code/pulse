export const getLocation = async () => {
    try {
      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        return {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      }
    } catch (error) {
      console.warn('Browser geolocation failed, falling back to IP geolocation');
    }
  
    // Fallback
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      lat: data.latitude,
      lng: data.longitude
    };
  };
  