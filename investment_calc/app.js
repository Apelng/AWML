// Common functions and variables
let fdRate = parseFloat(localStorage.getItem('fdRate')) || 5.0;
const daysInPeriod = {
  weekly: 7,
  monthly: 30,
  'semi-annual': 180,
  annual: 365
};

// User Page Specific Code
if (document.getElementById('user-interface')) {
  // Initialize Chart
  const ctx = document.getElementById('growth-chart').getContext('2d');
  let growthChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Principal Amount',
          data: [],
          borderColor: '#107b5f',
          tension: 0.1,
        },
        {
          label: 'Total Interest',
          data: [],
          borderColor: '#ff6384',
          tension: 0.1,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { title: { display: true, text: 'Amount (₦)' } },
        x: { title: { display: true, text: 'Days' } }
      }
    }
  });

  document.getElementById('rate').value = fdRate;

  // Calculate Gross Interest
  function calculateFD(principal, time, period) {
    const totalDays = time * daysInPeriod[period];
    return (principal * fdRate * totalDays) / 365;
  }

  // Update Chart
  function updateChart(principal, time, period) {
    const totalDays = time * daysInPeriod[period];
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);
    const interest = calculateFD(principal, time, period);

    const principalData = days.map(() => principal);
    const interestData = days.map(day => (interest * day / totalDays));

    growthChart.data.labels = days.map(d => `Day ${d}`);
    growthChart.data.datasets[0].data = principalData;
    growthChart.data.datasets[1].data = interestData;
    growthChart.update();
  }

  // Handle Form Input
  function handleFormInput() {
    const principal = parseFloat(document.getElementById('principal').value);
    const time = parseFloat(document.getElementById('time').value);
    const period = document.getElementById('time-period').value;

    if (principal && time) {
      const grossInterest = calculateFD(principal, time, period);
      document.getElementById('gross-interest').textContent = grossInterest.toFixed(2);
      updateChart(principal, time, period);
    }
  }

  // Event listeners for user page
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('principal').addEventListener('input', handleFormInput);
    document.getElementById('time').addEventListener('input', handleFormInput);
    document.getElementById('time-period').addEventListener('change', handleFormInput);
    document.getElementById('currency').addEventListener('change', (e) => {
      const symbol = e.target.value === 'naira' ? '₦' : '$';
      document.querySelectorAll('#currency-symbol, #currency-symbol-result').forEach(el => {
        el.textContent = symbol;
      });
      handleFormInput();
    });
  });
}

// Admin Page Specific Code
if (document.getElementById('admin-interface')) {
  document.getElementById('current-rate').textContent = fdRate;

  document.getElementById('rate-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newRate = parseFloat(document.getElementById('new-rate').value);

    if (!isNaN(newRate) && newRate > 0) {
      fdRate = newRate;
      localStorage.setItem('fdRate', fdRate);
      document.getElementById('current-rate').textContent = fdRate;
      document.getElementById('new-rate').value = '';
      alert('Rate updated successfully!');
      window.location.href = 'invest.html'; // Redirect back to user page
    }
  });
}