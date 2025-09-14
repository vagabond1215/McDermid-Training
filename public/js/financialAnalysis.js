const analysisFields = [
  { id: 'income', label: 'Monthly Income' },
  { id: 'housing', label: 'Housing' },
  { id: 'utilities', label: 'Utilities' },
  { id: 'transportation', label: 'Transportation' },
  { id: 'food', label: 'Food' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'personal', label: 'Personal' },
  { id: 'debt', label: 'Debt' },
  { id: 'savings', label: 'Savings' }
];

document.addEventListener('DOMContentLoaded', () => {
  const beginBtn = document.getElementById('begin-financial-analysis');
  const modal = document.getElementById('financialAnalysisModal');
  const fieldsContainer = document.getElementById('faFields');
  let currentUser = window.loggedInUser || 'unknown';

  if (fieldsContainer) {
    analysisFields.forEach(f => {
      const wrapper = document.createElement('div');
      wrapper.className = 'fa-field';
      const label = document.createElement('label');
      label.textContent = f.label;
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `fa-${f.id}`;
      label.appendChild(input);
      wrapper.appendChild(label);
      fieldsContainer.appendChild(wrapper);
    });
  }

  function openModal() {
    document.getElementById('faUser').textContent = `User: ${currentUser}`;
    const override = document.getElementById('faUserOverride');
    if (override && window.allowedUsers && window.allowedUsers.includes(window.loggedInUser)) {
      override.classList.remove('hidden');
      override.value = currentUser;
      override.addEventListener('change', () => {
        currentUser = override.value.trim() || window.loggedInUser || 'unknown';
        document.getElementById('faUser').textContent = `User: ${currentUser}`;
        loadData();
      });
    }
    modal.classList.remove('hidden');
    loadData();
  }

  function closeModal() {
    modal.classList.add('hidden');
  }

  function loadData() {
    const key = `financialAnalysis_${currentUser}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const obj = JSON.parse(saved);
      document.getElementById('faDate').value = obj.dateCompleted || new Date().toISOString().split('T')[0];
      analysisFields.forEach(f => {
        document.getElementById(`fa-${f.id}`).value = obj.fields[f.id] || '';
      });
    } else {
      document.getElementById('faDate').value = new Date().toISOString().split('T')[0];
      analysisFields.forEach(f => {
        document.getElementById(`fa-${f.id}`).value = '';
      });
    }
  }

  function saveData() {
    const dateVal = document.getElementById('faDate').value;
    const d = dateVal ? new Date(dateVal) : new Date();
    const data = {
      userId: currentUser,
      dateCompleted: dateVal,
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      fields: {}
    };
    analysisFields.forEach(f => {
      data.fields[f.id] = document.getElementById(`fa-${f.id}`).value;
    });
    localStorage.setItem(`financialAnalysis_${currentUser}`, JSON.stringify(data));
    closeModal();
  }

  function generatePdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    doc.text(`Financial Analysis - ${document.getElementById('faDate').value}`, 10, y);
    y += 10;
    analysisFields.forEach(f => {
      const val = document.getElementById(`fa-${f.id}`).value;
      doc.text(`${f.label}: ${val}`, 10, y);
      y += 10;
    });
    doc.save('financial_analysis.pdf');
  }

  const closeBtn = document.getElementById('faClose');
  const saveBtn = document.getElementById('faSave');
  const pdfBtn = document.getElementById('faPdf');

  if (beginBtn) beginBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (saveBtn) saveBtn.addEventListener('click', saveData);
  if (pdfBtn) pdfBtn.addEventListener('click', generatePdf);
});
