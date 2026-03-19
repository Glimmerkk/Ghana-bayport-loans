// Page 3 logic - polls backend for updates
const API_URL = 'http://localhost:5000/api';
let lastUpdateId = 0;

async function checkUpdates() {
    const response = await fetch(`${API_URL}/get-updates/${lastUpdateId}`);
    const data = await response.json();
    // Process updates...
}