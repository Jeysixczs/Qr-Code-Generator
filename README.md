# QR Code Generator

An elegant, single‑page web app for instantly turning any text or URL into a downloadable **QR code** — complete with dark‑mode support, responsive design, and smooth animations.

---

## ✨ Demo

> Open `index.html` in your browser — no build step or server required.
or
> https://jeysixczs.github.io/Qr-Code-Generator/


---

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)


---

## Features

|                          | Description |
|--------------------------|-------------|
| ⚡ **Instant Generation** | Built on `qrcodejs`. |
| 🎨 **Dark / Light Mode** | System‑aware toggle, persisted in `localStorage`. |
| 🖱️ **One‑Click Download**| Exports the generated QR code as a transparent PNG. |
| 💎 **Modern UI**        | Poppins font, gradient accents, glassmorphism card, subtle 3‑D hover effects. |
| 📱 **Responsive**        | Fully mobile‑friendly down to < 480 px. |
| 🔗 **External Icons & Fonts** | Font Awesome 6.4 + Google Fonts. |

---

## Tech Stack

| Layer            | Library / Spec                | Purpose |
|------------------|--------------------------------|---------|
| **Markup**       | **HTML5**                      | Semantic structure |
| **Styling**      | **CSS3**, Flexbox, CSS vars    | Theme tokens, layout, animations |
| **Logic**        | **Vanilla JS**                 | DOM events, theming, QR download |
| **QR Engine**    | [`qrcodejs` 1.0.0](https://github.com/davidshimjs/qrcodejs) | Generate canvas‑based QR codes |
| **Icons & Fonts**| Font Awesome 6, Google Fonts  | Visual polish |

_No frameworks, compilers, or bundlers — just grab & go._

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/Jeysixczs/Qr-Code-Generator.git
cd premium‑qr‑generator

# 2. run it in local you can use Live Server 🚀
open http://localhost:3000
