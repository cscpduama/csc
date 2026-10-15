(function () {
  'use strict';

  var form = document.getElementById('gate-form');
  var input = document.getElementById('passphrase-input');
  var button = document.getElementById('unlock-btn');
  var statusArea = document.getElementById('status-area');
  var hintArea = document.getElementById('hint-area');
  var qrModal = document.getElementById('qr-modal');
  var qrWrapper = document.getElementById('qr-wrapper');
  var rickVideo = document.getElementById('rickroll-video');

  var failedAttempts = 0;
  var dismissTimer = null;

  function setStatus(message, type) {
    statusArea.textContent = message;
    if (type === 'error') {
      statusArea.className = 'status-area status-error';
    } else if (type === 'wait') {
      statusArea.className = 'status-area status-wait';
    } else {
      statusArea.className = 'status-area';
    }
  }

  function setBusy(busy) {
    button.disabled = busy;
    input.disabled = busy;
    var btnText = button.querySelector('.btn-text');
    if (busy) {
      if (btnText) btnText.textContent = '⏳ COMPILING CODE (O(N!) COMPLEXITY)...';
    } else {
      if (btnText) btnText.textContent = '🚀 RUN sudo unlock 🚀';
    }
  }

  function closeQrModal() {
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }
    if (rickVideo) {
      try {
        rickVideo.pause();
        rickVideo.currentTime = 0;
      } catch (e) {}
    }
    qrModal.classList.add('hidden');

    // Remove the entire input form from the DOM permanently
    if (form) {
      form.remove();
    }

    setStatus('🛑 SESSION TERMINATED: 9-Second QR Window Expired. Token Burned!', 'error');
  }

  function playRickrollVideoWithSound() {
    if (!rickVideo) return;
    try {
      rickVideo.currentTime = 0;
      rickVideo.volume = 1.0;
      rickVideo.muted = false;

      var playPromise = rickVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          // If browser policy requires muted first, unmute immediately
          rickVideo.muted = false;
          rickVideo.play().catch(function () {});
        });
      }
    } catch (err) {
      console.warn('Video playback warning:', err);
    }
  }

  function renderSuccess(data) {
    setStatus('');
    hintArea.textContent = '';
    hintArea.classList.add('hidden');

    // Generate only the Wi-Fi QR code
    qrWrapper.innerHTML = '';
    if (typeof qrcode === 'function' && data.wifi) {
      try {
        var qr = qrcode(0, 'M');
        qr.addData(data.wifi);
        qr.make();
        qrWrapper.innerHTML = qr.createSvgTag({ cellSize: 7, margin: 4 });
      } catch (e) {
        qrWrapper.textContent = 'Error rendering Wi-Fi QR code.';
      }
    }

    // Reveal pop-out modal with QR code & play video (with its native sound)
    qrModal.classList.remove('hidden');
    playRickrollVideoWithSound();

    // Close the QR code when the video ends or exactly after 9 seconds
    if (rickVideo) {
      rickVideo.onended = function () {
        closeQrModal();
      };
    }

    if (dismissTimer) clearTimeout(dismissTimer);
    dismissTimer = setTimeout(function () {
      closeQrModal();
    }, 9000);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var val = input.value.trim();
    if (!val) {
      setStatus('⚠️ ERROR: NullPointerException: Token cannot be null.', 'error');
      return;
    }

    setBusy(true);
    setStatus('CHECKING COMPILER STACK TRACE...', 'wait');

    fetch('/api/unlock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key: val })
    })
      .then(function (response) {
        if (response.status === 401) {
          failedAttempts++;
          setStatus('❌ 401 UNAUTHORIZED: Access denied by Department Firewall.', 'error');
          if (failedAttempts >= 3) {
            hintArea.textContent = '💡 HINT: Base64... then a famous Roman shift.';
            hintArea.classList.remove('hidden');
          }
          setBusy(false);
          input.focus();
          return null;
        }

        if (!response.ok) {
          setStatus('⚠️ 500 INTERNAL SERVER ERROR: Stack overflow occurred.', 'error');
          setBusy(false);
          return null;
        }

        return response.json();
      })
      .then(function (data) {
        if (!data) return;
        if (data.ok) {
          renderSuccess(data);
        } else {
          failedAttempts++;
          setStatus('❌ 401 UNAUTHORIZED: Access denied by Department Firewall.', 'error');
          if (failedAttempts >= 3) {
            hintArea.textContent = '💡 HINT: Base64... then a famous Roman shift.';
            hintArea.classList.remove('hidden');
          }
          setBusy(false);
        }
      })
      .catch(function () {
        setStatus('⚠️ CONNECTION TIMEOUT: Host unreachable or packet dropped.', 'error');
        setBusy(false);
      });
  });
})();
