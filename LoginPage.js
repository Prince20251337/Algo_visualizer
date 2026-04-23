    (function() {
      // ---- DYNAMIC TYPEWRITER EFFECT ----
      const subtitleElement = document.getElementById('dynamicSubtitle');
      const originalText = subtitleElement.textContent;
      subtitleElement.textContent = '';
      let charIndex = 0;

      function typeWriter() {
        if (charIndex < originalText.length) {
          subtitleElement.textContent += originalText.charAt(charIndex);
          charIndex++;
          setTimeout(typeWriter, 12);
        }
      }

      // ---- CREATE FLOATING PARTICLES ----
      function createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        
        const particleCount = 55;
        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          particle.classList.add('particle');
          
          const size = Math.random() * 6 + 2;
          const posX = Math.random() * 100;
          const delay = Math.random() * 15;
          const duration = Math.random() * 12 + 12;
          const opacity = Math.random() * 0.5 + 0.2;
          
          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;
          particle.style.left = `${posX}%`;
          particle.style.animationDelay = `${delay}s`;
          particle.style.animationDuration = `${duration}s`;
          particle.style.background = `rgba(34, 240, 255, ${opacity * 0.6})`;
          
          particlesContainer.appendChild(particle);
        }
      }

      // ---- ADD GLOWING CURSOR TRAIL (subtle immersion) ----
      function initGlowTrail() {
        const trailCanvas = document.createElement('canvas');
        trailCanvas.style.position = 'fixed';
        trailCanvas.style.top = '0';
        trailCanvas.style.left = '0';
        trailCanvas.style.width = '100%';
        trailCanvas.style.height = '100%';
        trailCanvas.style.pointerEvents = 'none';
        trailCanvas.style.zIndex = '999';
        trailCanvas.style.opacity = '0.4';
        document.body.appendChild(trailCanvas);
        
        let ctx = trailCanvas.getContext('2d');
        let mouseX = 0, mouseY = 0;
        let particles = [];
        
        function resizeCanvas() {
          trailCanvas.width = window.innerWidth;
          trailCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        document.addEventListener('mousemove', (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          for (let i = 0; i < 3; i++) {
            particles.push({
              x: mouseX + (Math.random() - 0.5) * 6,
              y: mouseY + (Math.random() - 0.5) * 6,
              size: Math.random() * 4 + 2,
              life: 1,
              decay: 0.02 + Math.random() * 0.02
            });
          }
        });
        
        function animateTrail() {
          if (!ctx) return;
          ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
          
          for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(34, 240, 255, ${p.life * 0.7})`;
            ctx.fill();
            p.life -= p.decay;
            p.size *= 0.98;
            if (p.life <= 0.02 || p.size < 0.2) {
              particles.splice(i, 1);
            }
          }
          requestAnimationFrame(animateTrail);
        }
        animateTrail();
      }

      // ---- BUTTON INTERACTION & REDIRECT (NO AUTH CHECK) ----
      const enterBtn = document.getElementById('enterArenaBtn');
      if (enterBtn) {
        enterBtn.addEventListener('click', function(e) {
          e.preventDefault();
          // Add cyberpunk click feedback
          this.style.transform = 'scale(0.96)';
          this.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> INITIALIZING PORTAL...';
          setTimeout(() => {
            this.style.transform = '';
            // Direct navigation to arena (box.html) — no authentication required
            window.location.href = 'MainPage.html';
          }, 400);
        });
      }

      // ---- RANDOM GLITCH TITLE FLICKER (purely cosmetic) ----
      const algovizSpan = document.querySelector('.algoviz');
      if (algovizSpan) {
        setInterval(() => {
          if (Math.random() < 0.03) {
            const original = algovizSpan.textContent;
            algovizSpan.textContent = 'ALGO_VIZ';
            setTimeout(() => {
              algovizSpan.textContent = original;
            }, 80);
          }
        }, 3200);
      }

      // ---- DYNAMIC SUBTITLE LOOP (extra effect) ----
      const quotes = [
        "Watch algorithms come to life. Compare, compete, and master data structures through interactive visual battles. See the invisible logic behind every computation.",
        "Visualize sorting, pathfinding, and graph algorithms in real-time. Battle against the clock or challenge your friends.",
        "Every click reveals the hidden beauty of logic. Step into the arena where data becomes art.",
        "Immersive coding battles. Real-time execution traces. Master algorithms by seeing them move."
      ];
      let quoteIndex = 0;
      function rotateQuotes() {
        if (!subtitleElement) return;
        // smooth fade effect
        subtitleElement.style.transition = 'opacity 0.4s';
        subtitleElement.style.opacity = '0';
        setTimeout(() => {
          quoteIndex = (quoteIndex + 1) % quotes.length;
          subtitleElement.textContent = quotes[quoteIndex];
          subtitleElement.style.opacity = '1';
        }, 300);
      }
      // Rotate quotes every 10 seconds, but only after typewriter finishes
      setTimeout(() => {
        setInterval(rotateQuotes, 10000);
      }, 1800);
      
      // ---- START EFFECTS ----
      createParticles();
      
      // Start typewriter after a short delay for dramatic entrance
      setTimeout(() => {
        typeWriter();
      }, 500);
      
      // Optional: enable mouse trail for extra cyber feel (non-intrusive)
      initGlowTrail();
      
      // ---- DYNAMIC GRID PARALLAX (tiny mouse movement effect on container) ----
      const container = document.querySelector('.container');
      if (container) {
        document.addEventListener('mousemove', (e) => {
          const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
          const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
          container.style.transform = `rotateY(${xAxis * 0.4}deg) rotateX(${yAxis * -0.3}deg)`;
        });
        // reset on mouse leave
        document.addEventListener('mouseleave', () => {
          container.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
      }
      
      // ---- ADD CYBERPUNK SCANLINE EFFECT (subtle) ----
      const scanline = document.createElement('div');
      scanline.style.position = 'fixed';
      scanline.style.top = 0;
      scanline.style.left = 0;
      scanline.style.width = '100%';
      scanline.style.height = '100%';
      scanline.style.pointerEvents = 'none';
      scanline.style.background = 'linear-gradient(to bottom, transparent 50%, rgba(34, 240, 255, 0.02) 50%)';
      scanline.style.backgroundSize = '100% 6px';
      scanline.style.zIndex = '9999';
      scanline.style.opacity = '0.15';
      document.body.appendChild(scanline);
      
      // Animated moving scanline
      let scanPos = 0;
      function moveScanline() {
        scanPos = (scanPos + 0.8) % 100;
        scanline.style.backgroundPosition = `0px ${scanPos}px`;
        requestAnimationFrame(moveScanline);
      }
      moveScanline();
      
      // Add small 'glitch' effect on button occasional hover spark
      if (enterBtn) {
        enterBtn.addEventListener('mouseenter', () => {
          const originalBorder = enterBtn.style.borderColor;
          enterBtn.style.borderColor = '#ff44ee';
          enterBtn.style.boxShadow = '0 0 15px #ff44ee';
          setTimeout(() => {
            enterBtn.style.borderColor = originalBorder;
            enterBtn.style.boxShadow = '';
          }, 200);
        });
      }
      
      // Preload the arena for faster perceived transition (optional)
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = 'MainPage.html';
      document.head.appendChild(link);
      
      // Console greeting (cyber style)
      console.log("%c⚠️ ALGOVIZ ARENA // VISUALIZATION MODULE ACTIVE // NO AUTH REQUIRED", "color: #22f0ff; font-size: 14px; font-family: monospace;");
      console.log("%c➤ ENTER THE ARENA TO UNLEASH ALGORITHMIC COMBAT", "color: #a855f7; font-size: 12px;");
    })();