  // Home button navigation
  document.getElementById('homeBtn').addEventListener('click', function(e) {
    e.preventDefault();
    document.body.style.opacity = '0.7';
    document.body.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      window.location.href = 'LoginPage.html';
    }, 300);
  });

  // Existing realm redirections
  document.getElementById('sortingRealm').addEventListener('click', () => window.location.href = 'sorting.html');
  document.getElementById('searchingRealm').addEventListener('click', () => window.location.href = 'searching.html');
  document.getElementById('graphRealm').addEventListener('click', () => window.location.href = 'shortestpath.html');
  document.getElementById('timeRealm').addEventListener('click', () => window.location.href = 'ComplexityQuiz.html');
  document.getElementById('notationsRealm').addEventListener('click', () => window.location.href = 'Notations.html');
  document.getElementById('pseudocodeRealm').addEventListener('click', () => window.location.href = 'Pseudocode.html');
  document.getElementById('practiceRealm').addEventListener('click', () => window.location.href = 'Practice.html');
  document.getElementById('knowledgeRealm').addEventListener('click', () => window.location.href = 'knowledgeTest.html');

  // Smooth hover transitions
  const cards = document.querySelectorAll('.realm');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.25s ease, box-shadow 0.3s ease';
    });
  });

  // Keyboard ESC returns to LoginPage.html
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.location.href = 'LoginPage.html';
  });
