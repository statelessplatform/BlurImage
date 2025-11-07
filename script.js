// Privacy Blur - JavaScript
// Touch & Mouse Support | Performance Monitored | UI/UX Guidelines Compliant

// Performance Monitoring (per guidelines: ~100ms feedback, ~1s navigation)
const perfLog = (label, startTime) => {
  const elapsed = performance.now() - startTime;
  console.log(`⏱️ ${label}: ${elapsed.toFixed(2)}ms`);

  // Show warning if exceeds budgets
  if (label.includes('feedback') && elapsed > 100) {
    console.warn(`⚠️ Feedback exceeded 100ms budget: ${elapsed.toFixed(2)}ms`);
  } else if (label.includes('navigation') && elapsed > 1000) {
    console.warn(`⚠️ Navigation exceeded 1s budget: ${elapsed.toFixed(2)}ms`);
  }

  // Update perf indicator (optional dev mode)
  const perfEl = document.getElementById('perf-indicator');
  if (perfEl && elapsed > 100) {
    perfEl.textContent = `${label}: ${elapsed.toFixed(0)}ms`;
    perfEl.classList.add('show');
    setTimeout(() => perfEl.classList.remove('show'), 2000);
  }
};

// DOM Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const blurBtn = document.getElementById('blur-btn');
const downloadBtn = document.getElementById('download-btn');
const clearBtn = document.getElementById('clear-btn');
const canvasContainer = document.getElementById('canvas-container');
const canvas = document.getElementById('workspace-canvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const toast = document.getElementById('toast');
const progress = document.getElementById('progress');
const themeBtn = document.getElementById('theme-btn');
const guideBtn = document.getElementById('guide-btn');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.querySelector('.modal-close');

// State
let originalImage = null;
let isBlurring = false;
let selectionStart = null;
let selectionEnd = null;
let isDarkMode = false;

// Constants
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_DIMENSION = 20000; // Max image dimension (pixels)

// Utility: Show toast with type
function showToast(message, type = 'error') {
  const startTime = performance.now();

  toast.textContent = message;
  toast.className = 'toast show ' + type;
  setTimeout(() => toast.classList.remove('show'), 3000);

  perfLog('Toast feedback', startTime);
}

// Utility: Show/hide progress
function showProgress(message = 'Processing...') {
  progress.querySelector('.progress-text').textContent = message;
  progress.classList.add('show');
}

function hideProgress() {
  progress.classList.remove('show');
}

// Convert pointer coords to canvas bitmap coords (unified for mouse/touch)
function getCanvasCoords(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

// Utility: Download canvas as PNG
function downloadCanvas() {
  const startTime = performance.now();

  try {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `privacy-blur-${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Image downloaded successfully! 🎉', 'success');
    perfLog('Download operation', startTime);
  } catch (e) {
    console.error('Download error:', e);
    showToast('Download failed. Please try again.', 'error');
  }
}

// Apply blur using canvas filter (optimized)
function applyGaussianBlur(x, y, w, h, radius = 20) {
  if (w <= 5 || h <= 5) return;

  const startTime = performance.now();

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.filter = `blur(${radius}px)`;
  ctx.drawImage(originalImage, 0, 0);
  ctx.restore();

  perfLog('Blur operation', startTime);
}

// Input sanitization: Validate file
function validateFile(file) {
  // Type check
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    return { valid: false, error: 'Only PNG and JPG images are supported' };
  }

  // Size check (100MB)
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large (max 100MB)' };
  }

  // Name check (prevent malicious filenames)
  if (file.name && /[<>:"|?*]/.test(file.name)) {
    return { valid: false, error: 'Invalid filename' };
  }

  return { valid: true };
}

// Format file size for display
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Handle file selection with security & progress
function handleFile(file) {
  const startTime = performance.now();

  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    showToast(validation.error, 'error');
    return;
  }

  showProgress(`Loading image (${formatFileSize(file.size)})...`);

  const reader = new FileReader();

  reader.onerror = () => {
    hideProgress();
    showToast('Failed to read file. Please try again.', 'error');
  };

  reader.onload = e => {
    const img = new Image();

    img.onerror = () => {
      hideProgress();
      showToast('Invalid image file. Please try another.', 'error');
    };

    img.onload = () => {
      // Security: Validate image dimensions
      if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
        hideProgress();
        showToast(`Image too large (max ${MAX_DIMENSION}x${MAX_DIMENSION}px)`, 'error');
        return;
      }

      originalImage = img;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvasContainer.style.display = 'block';
      dropZone.style.display = 'none';

      blurBtn.classList.remove('hidden');
      clearBtn.classList.remove('hidden');

      hideProgress();
      showToast(`Image loaded! (${img.width}x${img.height}) ✨`, 'success');
      perfLog('Image load & render', startTime);
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

// Unified pointer event handlers (mouse + touch support)
function getPointerCoords(e) {
  // Handle both mouse and touch events
  if (e.touches && e.touches.length > 0) {
    return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
  } else if (e.changedTouches && e.changedTouches.length > 0) {
    return { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY };
  } else {
    return { clientX: e.clientX, clientY: e.clientY };
  }
}

function handlePointerStart(e) {
  if (!isBlurring) return;

  e.preventDefault(); // Prevent default touch behaviors
  const startTime = performance.now();

  const { clientX, clientY } = getPointerCoords(e);
  const coords = getCanvasCoords(clientX, clientY);
  selectionStart = { x: coords.x, y: coords.y };
  selectionEnd = { ...selectionStart };

  perfLog('Pointer start feedback', startTime);
}

function handlePointerMove(e) {
  if (!isBlurring || !selectionStart) return;

  e.preventDefault();
  const { clientX, clientY } = getPointerCoords(e);
  const coords = getCanvasCoords(clientX, clientY);
  selectionEnd = { x: coords.x, y: coords.y };

  // Redraw with selection preview
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(originalImage, 0, 0);
  ctx.strokeStyle = '#4B7BFF';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 4]);

  const x = Math.min(selectionStart.x, selectionEnd.x);
  const y = Math.min(selectionStart.y, selectionEnd.y);
  const w = Math.abs(selectionEnd.x - selectionStart.x);
  const h = Math.abs(selectionEnd.y - selectionStart.y);

  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
}

function handlePointerEnd(e) {
  if (!isBlurring || !selectionStart) return;

  e.preventDefault();
  const startTime = performance.now();

  const x = Math.min(selectionStart.x, selectionEnd.x);
  const y = Math.min(selectionStart.y, selectionEnd.y);
  const w = Math.abs(selectionEnd.x - selectionStart.x);
  const h = Math.abs(selectionEnd.y - selectionStart.y);

  // Redraw original
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(originalImage, 0, 0);

  // Apply blur
  if (w > 10 && h > 10) {
    showProgress('Applying blur...');

    // Use setTimeout to allow progress to render
    setTimeout(() => {
      applyGaussianBlur(x, y, w, h, 20);
      hideProgress();
      showToast('Region blurred! ✨', 'success');
    }, 50);
  }

  selectionStart = null;
  selectionEnd = null;
  isBlurring = false;
  overlay.classList.add('hidden');
  blurBtn.disabled = false;
  downloadBtn.classList.remove('hidden');

  perfLog('Blur complete operation', startTime);
}

// Event Listeners - File Upload
uploadBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', e => {
  if (e.target.files.length) handleFile(e.target.files[0]);
});

// Drop zone events
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fileInput.click();
  }
});

dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('active');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('active');
});

dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('active');
  if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});

// Blur button
blurBtn.addEventListener('click', () => {
  const startTime = performance.now();
  isBlurring = true;
  overlay.classList.remove('hidden');
  blurBtn.disabled = true;
  showToast('Drag to select area to blur 🎯', 'success');
  perfLog('Blur mode activation feedback', startTime);
});

// Touch + Mouse support for overlay
overlay.addEventListener('mousedown', handlePointerStart);
overlay.addEventListener('mousemove', handlePointerMove);
overlay.addEventListener('mouseup', handlePointerEnd);

overlay.addEventListener('touchstart', handlePointerStart, { passive: false });
overlay.addEventListener('touchmove', handlePointerMove, { passive: false });
overlay.addEventListener('touchend', handlePointerEnd, { passive: false });

// Download & Clear
downloadBtn.addEventListener('click', downloadCanvas);

clearBtn.addEventListener('click', () => {
  const startTime = performance.now();

  originalImage = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvasContainer.style.display = 'none';
  dropZone.style.display = 'block';
  blurBtn.classList.add('hidden');
  downloadBtn.classList.add('hidden');
  clearBtn.classList.add('hidden');
  overlay.classList.add('hidden');
  isBlurring = false;
  selectionStart = null;
  selectionEnd = null;
  fileInput.value = '';

  showToast('Cleared! Upload a new image. 🔄', 'success');
  perfLog('Clear operation', startTime);
});

// Theme Toggle
themeBtn.addEventListener('click', () => {
  const startTime = performance.now();
  isDarkMode = !isDarkMode;

  if (isDarkMode) {
    document.body.style.background = '#1A1A1A';
    document.body.style.color = '#FFFFFF';
    themeBtn.textContent = '☀️';
    themeBtn.setAttribute('aria-label', 'Switch to light mode');
  } else {
    document.body.style.background = '#FFFFFF';
    document.body.style.color = '#1A1A1A';
    themeBtn.textContent = '🌙';
    themeBtn.setAttribute('aria-label', 'Switch to dark mode');
  }

  perfLog('Theme toggle feedback', startTime);
});

// User Guide Modal
guideBtn.addEventListener('click', () => {
  const startTime = performance.now();
  modalOverlay.classList.add('show');
  modalClose.focus();
  perfLog('Modal open feedback', startTime);
});

modalClose.addEventListener('click', () => {
  modalOverlay.classList.remove('show');
  guideBtn.focus();
});

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('show');
  }
});

// Keyboard accessibility for modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('show')) {
    modalOverlay.classList.remove('show');
    guideBtn.focus();
  }
});

// Auto-show guide on first visit
if (!localStorage.getItem('privacy-blur-visited')) {
  setTimeout(() => {
    modalOverlay.classList.add('show');
    localStorage.setItem('privacy-blur-visited', 'true');
  }, 500);
}

// Log app ready
console.log('✅ Privacy Blur loaded - Touch & Mouse enabled | Max file size: 100MB');
console.log(`📊 Performance budgets: ~100ms feedback, ~1s navigation`);