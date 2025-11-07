# Privacy Blur

> **Blur sensitive content locally — no data leaves your browser.**

Privacy Blur is a browser-only tool that lets you blur sensitive areas in images completely offline. Fast, secure, and privacy-first.

---

## ✨ Features

- 🔒 **100% Private** – All processing happens in your browser. No uploads, no tracking, no data collection.
- 📱 **Touch-Enabled** – Works seamlessly on desktop, tablets, and mobile devices with full touch support.
- ⚡ **Performance Optimized** – Sub-100ms feedback, ~1s navigation (per UI/UX performance budgets).
- 🎨 **Empathetic UI** – Minimal, self-explanatory interface with user guide modal.
- ♿ **Accessible** – WCAG AA compliant with ARIA labels, keyboard navigation, and high contrast.
- 🔐 **Secure** – Input sanitization, CSP headers, comprehensive validation.
- 🌙 **Dark Mode** – Built-in theme toggle for comfortable viewing.

---

## 🚀 Quick Start

### Option 1: Direct Use
1. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge)
2. Done! No installation or setup required.

### Option 2: Local Server (Recommended for Development)
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000

# Then open: http://localhost:8000
```

---

## 📖 How to Use

1. **Upload 📸** – Click "Choose Image" or drag & drop your image
   - Supports: PNG, JPG/JPEG
   - Max size: 100MB
   - Max dimensions: 20,000 x 20,000 pixels

2. **Blur Region ✨** – Click "Blur Region" then:
   - **Desktop**: Click and drag to select area
   - **Mobile/Tablet**: Touch and drag to select area

3. **Repeat 🔁** – Blur multiple regions as needed

4. **Download 💾** – Save your privacy-protected image as PNG

5. **Clear All 🗑️** – Start over with a new image

---

## 🗂️ File Structure

```
privacy-blur/
├── index.html      # Main HTML structure
├── styles.css      # UI/UX compliant styles with color psychology
├── script.js       # Touch-enabled JavaScript with performance monitoring
└── README.md       # This file
```

---

## 🎨 UI/UX Guidelines Compliance

This app follows production-ready UI/UX guidelines:

✅ **Self-Explanatory Interface** – Clear labels, emojis, user guide modal  
✅ **Impatient User Optimization** – ~100ms feedback, progress indicators  
✅ **Color Psychology** – Trust (blue), harmony (green), elegance (black)  
✅ **Accessibility** – ARIA labels, keyboard navigation, WCAG AA contrast  
✅ **Touch Support** – Unified pointer events for mouse & touch  
✅ **Security** – CSP headers, input validation, sanitization  
✅ **Performance Monitoring** – Real-time performance logging  

---

## 🔧 Technical Details

### Technologies
- **HTML5 Canvas** – For image rendering and blur operations
- **CSS3** – Modern, responsive design with CSS variables
- **Vanilla JavaScript** – No frameworks, pure ES6+
- **FileReader API** – Secure client-side file handling
- **Canvas Filter API** – GPU-accelerated blur effects

### Browser Support
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Opera 74+

### Performance Budgets
- Input feedback: **< 100ms**
- Navigation: **< 1s**
- Progress indicators for operations > 1s

### Security Features
- Content Security Policy (CSP) headers
- File type validation (PNG, JPG only)
- File size validation (max 100MB)
- Image dimension validation (max 20,000px)
- Filename sanitization
- No external API calls

---

## 🔐 Privacy Guarantee

**Your images never leave your device.** This app:
- ❌ Does **NOT** upload images to any server
- ❌ Does **NOT** use analytics or tracking
- ❌ Does **NOT** collect any user data
- ❌ Does **NOT** require internet after initial load
- ✅ Works **100% offline** in your browser

---

## 🎯 Use Cases

- Blur personal information in screenshots
- Redact sensitive data in documents
- Protect privacy before sharing images
- Quick image editing without software
- Mobile-friendly privacy protection
- GDPR/compliance-friendly image processing

---

## 💡 Tips

- **Multiple Blurs**: Click "Blur Region" multiple times to blur different areas
- **Touch Gestures**: On mobile, use one finger to drag blur regions
- **Performance**: Large images (>50MB) may take a few seconds to load
- **Download Format**: All downloads are saved as PNG for quality
- **Keyboard Shortcuts**:
  - `Escape` – Close user guide modal
  - `Tab` – Navigate between buttons
  - `Enter/Space` – Activate buttons

---

## 🛠️ Customization

### Adjust Blur Intensity
Edit `script.js`, line with `applyGaussianBlur`:
```javascript
applyGaussianBlur(x, y, w, h, 20); // Change 20 to adjust blur radius
```

### Change Max File Size
Edit `script.js`:
```javascript
const MAX_FILE_SIZE = 100 * 1024 * 1024; // Change 100 (MB)
```

### Modify Colors
Edit `styles.css` `:root` variables:
```css
:root {
  --primary: #4B7BFF; /* Your preferred color */
}
```

---

## 🐛 Troubleshooting

**Image won't load?**
- Check file size (max 100MB)
- Verify file type (PNG or JPG only)
- Try a smaller image

**Blur not working on mobile?**
- Ensure you're using a modern browser
- Try clicking "Blur Region" before dragging
- Check if JavaScript is enabled

**Download fails?**
- Some browsers block automatic downloads
- Check browser download settings
- Try right-click > "Save as" on canvas

**Performance issues?**
- Reduce image size before upload
- Close other browser tabs
- Check browser console for warnings

---

## 📊 Performance Monitoring

Enable performance indicators by opening browser console:
```javascript
document.getElementById('perf-indicator').classList.add('show');
```

View detailed timing logs in console (F12):
- Image load & render timing
- Blur operation duration
- UI feedback latency
- Navigation speed

---

## 🤝 Contributing

This is a standalone single-page app designed for privacy and simplicity. Suggestions welcome!

**Ideas for improvement:**
- Additional blur algorithms
- More export formats (JPEG, WebP)
- Adjustable blur intensity slider
- Undo/redo functionality
- Batch processing

---

## 📄 License

This project is open source and available for personal and commercial use.

**No warranty provided.** Use at your own risk.

---

## 🌟 Credits

Built with ❤️ for privacy-conscious users.

**Stack:**
- UI/UX: Apple-inspired minimalist design principles
- Icons: Feather Icons (via inline SVG)
- Fonts: Inter (Google Fonts)
- Color Psychology: Trust, Harmony, Elegance palette

---

## 🔗 Related Projects

Part of **StatelessPlatform.com** – Privacy-first, browser-only tools.

---

## 📞 Support

Found a bug? Have a question?
- Check the **User Guide** (❓ button in app)
- Review **Troubleshooting** section above
- Open an issue in your project repository

---

**Last Updated:** November 2025  
**Version:** 1.0.0  
**Compatibility:** All modern browsers with Canvas API support

---

Made with 🔒 for your privacy.
