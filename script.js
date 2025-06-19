
    document.addEventListener("DOMContentLoaded", () => {
      /* ---------- DOM Caching ---------- */
      const textInput   = document.getElementById("text");
      const generateBtn = document.getElementById("generate");
      const downloadBtn = document.getElementById("download");
      const clearBtn    = document.getElementById("clear");
      const qrcodeDiv   = document.getElementById("qrcode");
      const container   = document.querySelector('.container');
      const features    = document.querySelector('.features');

      /* ---------- Theme Toggle ---------- */
      const themeToggle = document.getElementById("theme-toggle");
      const body        = document.body;
      const storedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      // Initialise theme
      if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
        body.classList.add("dark-mode");
        themeToggle.checked = true;
      }

      themeToggle.addEventListener("change", () => {
        body.classList.toggle("dark-mode", themeToggle.checked);
        localStorage.setItem("theme", themeToggle.checked ? "dark" : "light");
      });

      /* ---------- Animations on load ---------- */
      setTimeout(() => {
        container.style.animation = 'pulse 1.5s ease';
        features.style.animation = 'fadeIn 0.8s ease';
      }, 300);
      
      container.addEventListener('animationend', () => {
        container.style.animation = '';
      });

      /* ---------- QR‑Code Generation Logic ---------- */
      let qrcode = null;

      const generateQRCode = () => {
        const text = textInput.value.trim();
        if (!text) {
          alert("Please enter some text or URL");
          return;
        }

        // Clear previous QR code
        if (qrcode) {
          qrcode.clear();
          qrcodeDiv.innerHTML = "";
        }

        // Generate new QR code
        qrcode = new QRCode(qrcodeDiv, {
          text,
          width: 200,
          height: 200,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });

        // Animate QR code appearance
        qrcodeDiv.style.animation = 'fadeIn 0.6s ease';
        downloadBtn.disabled = false;
        
        // Pulse animation
        setTimeout(() => {
          qrcodeDiv.style.animation = 'pulse 1s ease';
          setTimeout(() => {
            qrcodeDiv.style.animation = '';
          }, 1000);
        }, 600);
      };

      generateBtn.addEventListener("click", generateQRCode);

      // Allow Enter key to generate
      textInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") generateQRCode();
      });

      // Download QR‑Code
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

      // Clear everything
      clearBtn.addEventListener("click", () => {
        if (qrcode) {
          qrcode.clear();
          qrcodeDiv.innerHTML = "";
          qrcode = null;
          textInput.value = "";
          downloadBtn.disabled = true;
        }
      });
    });
