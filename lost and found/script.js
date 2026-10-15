const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const carouselImages = document.querySelectorAll('.carousel-image');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const reportForm = document.getElementById('reportForm');
const formMessage = document.getElementById('formMessage');
const reportCaseBtn = document.getElementById('reportCaseBtn');
const viewReports = document.getElementById('viewReports');
const STORAGE_KEY = 'lostReports';

let currentSlide = 0;

function showTab(targetId) {
  tabPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === targetId);
  });

  tabButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.target === targetId);
  });
}

tabButtons.forEach((button) => {
  button.addEventListener('click', () => showTab(button.dataset.target));
});

reportCaseBtn?.addEventListener('click', () => {
  showTab('services');
});

function showSlide(index) {
  carouselImages.forEach((img, idx) => {
    img.classList.toggle('active', idx === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % carouselImages.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + carouselImages.length) % carouselImages.length;
  showSlide(currentSlide);
}

function getReports() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Could not read reports:', error);
    return [];
  }
}

function renderReports() {
  if (!viewReports) {
    return;
  }

  const reports = getReports();

  if (!reports.length) {
    viewReports.innerHTML = '<p class="empty-state">No reports saved yet.</p>';
    return;
  }

  viewReports.innerHTML = reports
    .map(
      (report) => `
        <article class="report-card">
          <h3>${report.name}</h3>
          <p><strong>Age:</strong> ${report.age || 'Not provided'}</p>
          <p><strong>Location:</strong> ${report.location}</p>
          <p><strong>Phone:</strong> ${report.phone}</p>
          <p><strong>Description:</strong> ${report.description}</p>
          <p class="report-time">Saved on ${report.createdAt}</p>
        </article>
      `
    )
    .join('');
}

prevBtn?.addEventListener('click', prevSlide);
nextBtn?.addEventListener('click', nextSlide);
setInterval(nextSlide, 4000);

reportForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(reportForm);
  const name = formData.get('name')?.toString().trim();

  if (name) {
    const report = {
      name,
      age: formData.get('age')?.toString().trim(),
      location: formData.get('location')?.toString().trim(),
      phone: formData.get('phone')?.toString().trim(),
      description: formData.get('description')?.toString().trim(),
      createdAt: new Date().toLocaleString()
    };

    const reports = getReports();
    reports.unshift(report);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    renderReports();
    formMessage.textContent = `Thank you, ${name}. Your report has been saved in View.`;
    reportForm.reset();
    showTab('view');
  }
});

renderReports();
