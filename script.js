document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const generateModeBtn = document.getElementById('generate-mode');
  const decodeModeBtn = document.getElementById('decode-mode');
  const generateContainer = document.getElementById('generate-container');
  const decodeContainer = document.getElementById('decode-container');
  const textInput = document.getElementById("text");
  const generateBtn = document.getElementById("generate");
  const downloadBtn = document.getElementById("download");
  const clearBtn = document.getElementById("clear");
  const qrcodeDiv = document.getElementById("qrcode");
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const cameraBtn = document.getElementById('camera-btn');
  const uploadBtn = document.getElementById('upload-btn');
  const stopCameraBtn = document.getElementById('stop-camera');
  const cameraContainer = document.getElementById('camera-container');
  const imageContainer = document.getElementById('image-container');
  const imageUpload = document.getElementById('image-upload');
  const cameraPreview = document.getElementById('camera-preview');
  const imageCanvas = document.getElementById('image-canvas');
  const decoderResult = document.getElementById('decoder-result');
  const decodedText = document.getElementById('decoded-text');
  const copyBtn = document.getElementById('copy-btn');
  const clearDecodedBtn = document.getElementById('clear-decoded');

  let qrcode = null;
  let cameraStream = null;
  let scannerInterval = null;

  // Initialize mode
  generateModeBtn.classList.add('active');
  decodeModeBtn.classList.remove('active');
  generateContainer.classList.remove('hidden');
  decodeContainer.classList.add('hidden');

  // Mode switching
  generateModeBtn.addEventListener('click', () => {
    generateContainer.classList.remove('hidden');
    decodeContainer.classList.add('hidden');
    generateModeBtn.classList.add('active');
    decodeModeBtn.classList.remove('active');
    stopCamera();
  });

  decodeModeBtn.addEventListener('click', () => {
    generateContainer.classList.add('hidden');
    decodeContainer.classList.remove('hidden');
    decodeModeBtn.classList.add('active');
    generateModeBtn.classList.remove('active');
  });

  // Theme management
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
    body.classList.add("dark-mode");
    themeToggle.checked = true;
  }

  themeToggle.addEventListener("change", () => {
    body.classList.toggle("dark-mode", themeToggle.checked);
    localStorage.setItem("theme", themeToggle.checked ? "dark" : "light");
  });

  // QR Code Generation
  const generateQRCode = () => {
    const text = textInput.value.trim();
    if (!text) {
      alert("Please enter some text or URL");
      return;
    }

    if (qrcode) {
      qrcode.clear();
      qrcodeDiv.innerHTML = "";
    }

    qrcode = new QRCode(qrcodeDiv, {
      text,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    downloadBtn.disabled = false;
  };

  generateBtn.addEventListener("click", generateQRCode);
  textInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") generateQRCode();
  });

  downloadBtn.addEventListener("click", () => {
    if (!qrcode) {
      alert("No QR code to download");
      return;
    }
    const canvas = qrcodeDiv.querySelector("canvas");
    const url = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  clearBtn.addEventListener("click", () => {
    if (qrcode) {
      qrcode.clear();
      qrcodeDiv.innerHTML = "";
      qrcode = null;
      textInput.value = "";
      downloadBtn.disabled = true;
    }
  });

  // QR Decoding
  cameraBtn.addEventListener('click', async () => {
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      cameraPreview.srcObject = cameraStream;
      cameraContainer.classList.remove('hidden');
      imageContainer.classList.add('hidden');
      decoderResult.classList.add('hidden');

      startScanner();
    } catch (err) {
      alert(`Camera error: ${err.message}`);
    }
  });

  stopCameraBtn.addEventListener('click', stopCamera);

  uploadBtn.addEventListener('click', () => {
    imageContainer.classList.remove('hidden');
    cameraContainer.classList.add('hidden');
    decoderResult.classList.add('hidden');
    imageUpload.value = '';
  });

  imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.onload = function() {
        imageCanvas.width = img.width;
        imageCanvas.height = img.height;
        const ctx = imageCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        scanQRFromImage(imageCanvas);
      };
      img.src = URL.createObjectURL(file);
    }
  });

  copyBtn.addEventListener('click', () => {
    decodedText.select();
    document.execCommand('copy');
    alert('Copied to clipboard!');
  });

  clearDecodedBtn.addEventListener('click', () => {
    decodedText.value = '';
    decoderResult.classList.add('hidden');
  });

  // Scanner functions
  function startScanner() {
    scannerInterval = setInterval(() => {
      if (cameraPreview.readyState === cameraPreview.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement('canvas');
        canvas.width = cameraPreview.videoWidth;
        canvas.height = cameraPreview.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          decodedText.value = code.data;
          decoderResult.classList.remove('hidden');
          stopCamera();
        }
      }
    }, 200);
  }

  function scanQRFromImage(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      decodedText.value = code.data;
      decoderResult.classList.remove('hidden');
    } else {
      alert('No QR code found in the image');
    }
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    if (scannerInterval) {
      clearInterval(scannerInterval);
      scannerInterval = null;
    }
    cameraContainer.classList.add('hidden');
  }
});