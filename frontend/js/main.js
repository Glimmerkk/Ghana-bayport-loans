// Page 1 logic
document.getElementById('loanForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        fullname: document.getElementById('fullname').value,
        dob: document.getElementById('dob').value,
        loanAmount: document.getElementById('loanAmount').value,
        repaymentPeriod: document.getElementById('repaymentPeriod').value,
        phone: document.getElementById('phone').value,
        referenceId: 'BL' + Date.now().toString(36).toUpperCase()
    };
    
    localStorage.setItem('loanApp', JSON.stringify(formData));
    window.location.href = '/page2';
});