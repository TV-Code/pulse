Global Heartbeat
An interactive 3D visualization where people around the world can share their heartbeats, creating a living, breathing representation of our global human connection.
Show Image
What is it?
Global Heartbeat is an interactive web experience that allows visitors to contribute their heartbeat to a living, breathing visualization of human connection. Each pulse on the globe represents someone's actual heartbeat, recorded and shared in real-time.
How it works

Visit the site and click "Share Your Heartbeat"
Tap your screen or click your mouse in rhythm with your heartbeat for 15 seconds
Your heartbeat's rhythm is calculated and added to the globe at your location
Watch as your pulse joins others from around the world

Technology
Built with modern web technologies:

React + TypeScript
Three.js with React Three Fiber
Firebase Realtime Database
Custom WebGL shaders
Geolocation API with IP fallback

Development
Prerequisites

Node.js (v18 or higher)
npm
A Firebase project

Setup

Clone the repository:

```bash 
git clone https://github.com/TV-Code/pulse.git
cd pulse
```
Install dependencies:
 
```bash 
npm install
```

Create a .env file with your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Start the development server:

```bash 
npm run dev
```

Building
To create a production build:
```bash 
npm run build
```

Deployment
The project is set up for automatic deployment to Firebase Hosting via GitHub Actions. Every push to the main branch triggers a deployment.
Manual deployment:
```bash 
npm run build
firebase deploy
Firebase Configuration
```
The project uses Firebase Realtime Database with the following security rules:

```json 
{
  "rules": {
    "pulses": {
      ".read": true,
      ".write": true,
      "$pulse_id": {
        ".validate": "newData.hasChildren(['lat', 'lng', 'timestamp', 'bpm']) &&
                     newData.child('lat').isNumber() &&
                     newData.child('lng').isNumber() &&
                     newData.child('bpm').isNumber() &&
                     newData.child('timestamp').isNumber() &&
                     newData.child('lat').val() >= -90 &&
                     newData.child('lat').val() <= 90 &&
                     newData.child('lng').val() >= -180 &&
                     newData.child('lng').val() <= 180 &&
                     newData.child('bpm').val() >= 30 &&
                     newData.child('bpm').val() <= 220"
      }
    }
  }
}
```
Privacy

Location data is approximate and users can contribute without sharing precise location
No personal information is collected
IP-based geolocation is used as a fallback when precise location isn't available
Pulses are automatically removed after 24 hours

Contributing
Contributions are welcome! Please read our Contributing Guide for details on our code of conduct and the process for submitting pull requests.
License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

3D Earth model: Low Poly Planet Earth
Built with React Three Fiber
Hosted on Firebase