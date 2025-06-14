document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text');
    const generateBtn = document.getElementById('generate');
    const downloadBtn = document.getElementById('download');
    const clearBtn = document.getElementById('clear');
    const qrcodeDiv = document.getElementById('qrcode');
    
    let qrcode = null;
    
    // Generate QR Code
    generateBtn.addEventListener('click', function() {
        const text = textInput.value.trim();
        
        if (!text) {
            alert('Please enter some text or URL');
            return;
        }
        
        // Clear previous QR code if exists
        if (qrcode) {
            qrcode.clear();
            qrcodeDiv.innerHTML = '';
        }
        
        // Generate new QR code
        qrcode = new QRCode(qrcodeDiv, {
            text: text,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // Enable download button
        downloadBtn.disabled = false;
    });
    
    // Download QR Code
    downloadBtn.addEventListener('click', function() {
        if (!qrcode) {
            alert('No QR code to download');
            return;
        }
        
        const canvas = qrcodeDiv.querySelector('canvas');
        const url = canvas.toDataURL('image/png');
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qrcode.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
    
    // Clear QR Code
    clearBtn.addEventListener('click', function() {
        if (qrcode) {
            qrcode.clear();
            qrcodeDiv.innerHTML = '';
            qrcode = null;
            textInput.value = '';
            downloadBtn.disabled = true;
        }
    });
    
    // Allow generating QR code by pressing Enter
    textInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });
});