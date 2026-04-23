  (function() {
    const backBtn = document.getElementById('globalBackBtn');
    let scrollTimeout;

    function toggleBackButton() {
      if (!backBtn) return;
      // Show button only when at the very top (scrollY <= 10px)
      if (window.scrollY <= 10) {
        backBtn.classList.remove('hidden');
      } else {
        backBtn.classList.add('hidden');
      }
    }

    // Initial check
    toggleBackButton();

    // Listen to scroll events with throttling for performance
    window.addEventListener('scroll', function() {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(toggleBackButton, 10);
    });

    // Also on resize (just in case)
    window.addEventListener('resize', toggleBackButton);

    // Back button click navigation
    backBtn.addEventListener('click', function(e) {
      e.preventDefault();
      document.body.style.transition = 'opacity 0.25s ease';
      document.body.style.opacity = '0.6';
      setTimeout(() => {
        window.location.href = 'MainPage.html';
      }, 200);
    });

    // Touch feedback
    backBtn.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.97)';
    });
    backBtn.addEventListener('touchend', function() {
      this.style.transform = '';
    });
  })();