  (function() {
    // ========= RED BACK BUTTON NAVIGATION =========
    const backBtn = document.getElementById('globalBackBtn');
    if (backBtn) {
      backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.style.transition = 'opacity 0.25s ease';
        document.body.style.opacity = '0.6';
        setTimeout(() => {
          window.location.href = 'MainPage.html';
        }, 200);
      });
      backBtn.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.97)';
      });
      backBtn.addEventListener('touchend', function() {
        this.style.transform = '';
      });
    }

    // ========= TIME COMPLEXITY CHART LOGIC =========
    const canvas = document.getElementById('complexityChart');
    const sizeInput = document.getElementById('maxNSize');
    let chartInstance = null;

    const EXP_CAP = 16;   // 2^16 = 65536

    function generateDatasets(maxN) {
      const labels = [];
      const constant = [];
      const logn = [];
      const linear = [];
      const nlogn = [];
      const quadratic = [];
      const exponential = [];

      for (let i = 1; i <= maxN; i++) {
        labels.push(i);
        constant.push(1);
        logn.push(Math.log2(i));
        linear.push(i);
        nlogn.push(i * Math.log2(i));
        quadratic.push(i * i);
        let expVal = Math.pow(2, Math.min(i, EXP_CAP));
        exponential.push(expVal);
      }
      return { labels, constant, logn, linear, nlogn, quadratic, exponential };
    }

    function renderChart(maxN) {
      let safeN = Math.min(2000, Math.max(5, Math.floor(maxN)));
      if (safeN !== maxN) sizeInput.value = safeN;
      
      const { labels, constant, logn, linear, nlogn, quadratic, exponential } = generateDatasets(safeN);
      
      const datasets = [
        { label: 'O(1) — constant', data: constant, borderColor: '#4ade80', borderWidth: 2.5, tension: 0.1, fill: false, pointRadius: 0, pointHoverRadius: 3 },
        { label: 'O(log n) — logarithmic', data: logn, borderColor: '#38bdf8', borderWidth: 2.5, tension: 0.2, fill: false, pointRadius: 0 },
        { label: 'O(n) — linear', data: linear, borderColor: '#facc15', borderWidth: 2.5, tension: 0.1, fill: false, pointRadius: 0 },
        { label: 'O(n log n) — linearithmic', data: nlogn, borderColor: '#c084fc', borderWidth: 2.5, tension: 0.1, fill: false, pointRadius: 0 },
        { label: 'O(n²) — quadratic', data: quadratic, borderColor: '#f97316', borderWidth: 2.5, tension: 0.1, fill: false, pointRadius: 0 },
        { label: 'O(2ⁿ) — exponential (capped at 2¹⁶)', data: exponential, borderColor: '#fb7185', borderWidth: 2.5, tension: 0.1, fill: false, pointRadius: 0 }
      ];
      
      const config = {
        type: 'line',
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: '#1e293b',
              titleColor: '#f1f5f9',
              bodyColor: '#cbd5e6',
              borderColor: '#475569',
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  let val = context.raw;
                  if (context.dataset.label.includes('exponential')) return `${label}: ${val.toFixed(0)} (capped)`;
                  if (context.dataset.label.includes('logarithmic')) return `${label}: ${val.toFixed(2)}`;
                  if (context.dataset.label.includes('linearithmic')) return `${label}: ${val.toFixed(1)}`;
                  if (context.dataset.label.includes('quadratic')) return `${label}: ${val.toLocaleString()}`;
                  return `${label}: ${val}`;
                }
              }
            },
            legend: {
              position: 'top',
              labels: {
                color: '#cbd5e6',
                font: { size: 11, weight: '500' },
                boxWidth: 12,
                padding: 12,
                usePointStyle: true
              }
            }
          },
          scales: {
            x: {
              title: { display: true, text: 'Input size (n)', color: '#94a3b8', font: { weight: '500' } },
              ticks: { color: '#cbd5e6', autoSkip: true, maxTicksLimit: 12 },
              grid: { color: '#334155', borderDash: [4, 4] }
            },
            y: {
              title: { display: true, text: 'Operations / Time', color: '#94a3b8', font: { weight: '500' } },
              ticks: { 
                color: '#cbd5e6', 
                callback: function(value) {
                  if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
                  if (value >= 1e3) return (value / 1e3).toFixed(0) + 'k';
                  return value;
                }
              },
              grid: { color: '#334155' },
              beginAtZero: true
            }
          },
          elements: {
            line: { borderJoin: 'round' }
          },
          interaction: { mode: 'nearest', axis: 'x', intersect: false }
        }
      };
      
      if (chartInstance) chartInstance.destroy();
      chartInstance = new Chart(canvas, config);
    }
    
    function onSizeChange() {
      let raw = parseInt(sizeInput.value, 10);
      if (isNaN(raw)) raw = 500;
      let clamped = Math.min(2000, Math.max(5, raw));
      if (clamped !== raw) sizeInput.value = clamped;
      renderChart(clamped);
    }
    
    sizeInput.addEventListener('change', onSizeChange);
    
    function init() {
      sizeInput.value = 500;
      renderChart(500);
    }
    init();
  })();