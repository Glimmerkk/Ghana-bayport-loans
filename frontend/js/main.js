// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Bayport Loans - Page 1 loaded');
    
    const loanForm = document.getElementById('loanForm');
    
    if (loanForm) {
        loanForm.addEventListener('submit', function(e) {
            e.preventDefault(); // CRITICAL - prevents page refresh
            console.log('📝 Form submitted');
            
            // Get form values
            const fullname = document.getElementById('fullname').value.trim();
            const dob = document.getElementById('dob').value;
            const loanAmount = document.getElementById('loanAmount').value;
            const repaymentPeriod = document.getElementById('repaymentPeriod').value;
            const phone = document.getElementById('phone').value.trim();
            const terms = document.getElementById('terms').checked;
            
            // Validate all fields
            if (!fullname || !dob || !loanAmount || !repaymentPeriod || !phone) {
                alert('Please fill all fields');
                return;
            }
            
            if (!terms) {
                alert('You must accept the Terms and Conditions');
                return;
            }
            
            if (phone.length !== 10) {
                alert('Please enter a valid 10-digit phone number');
                return;
            }
            
            // Generate unique reference ID
            const timestamp = Date.now().toString(36).toUpperCase();
            const random = Math.random().toString(36).substring(2, 6).toUpperCase();
            const referenceId = 'BL' + timestamp + random;
            
            // Create data object
            const formData = {
                fullname: fullname,
                dob: dob,
                loanAmount: loanAmount,
                repaymentPeriod: repaymentPeriod,
                phone: phone,
                referenceId: referenceId,
                timestamp: new Date().toISOString()
            };
            
            console.log('📦 Saving data:', formData);
            
            // Save to localStorage
            localStorage.setItem('loanApp', JSON.stringify(formData));
            
            // Verify it saved
            const saved = localStorage.getItem('loanApp');
            if (saved) {
                console.log('✅ Data saved successfully');
                console.log('➡️ Redirecting to page2.html');
                window.location.href = 'page2.html';
            } else {
                alert('Error saving data. Please try again.');
            }
        });
    } else {
        console.error('❌ Form not found! Check ID: loanForm');
    }
    
    // Phone number validation - only numbers
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        });
    }
});