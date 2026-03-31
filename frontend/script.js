const API_URL = '/api';

async function apiFetch(path, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `HTTP Error ${response.status}`);
  }

  return response.json();
}

let allRecords = [];


const form = document.getElementById('main-form');
const btnSubmit = document.getElementById('btn-submit');
const btnLoader = document.getElementById('btn-loader');
const btnLabel = document.getElementById('btn-submit-label');

const fieldName = document.getElementById('field-nome');
const fieldEmail = document.getElementById('field-email');
const fieldTelefone = document.getElementById('field-telefone'); 


const tableBody = document.getElementById('table-body');
const tableLoader = document.getElementById('table-loader');
const tableEmpty = document.getElementById('table-empty');
const tableWrapper = document.getElementById('table-wrapper');


const searchInput = document.getElementById('search-input');
const btnRefresh = document.getElementById('btn-refresh');
const toast = document.getElementById('toast');
const recordCountBadge = document.getElementById('record-count');
const connStatus = document.getElementById('connection-status');



async function loadRecords() {
  tableLoader.classList.remove('hidden');
  tableWrapper.classList.add('hidden');
  tableEmpty.classList.add('hidden');

  try {
    const data = await apiFetch('/users');
    allRecords = data.data || data;

    connStatus.classList.replace('offline', 'online');
    connStatus.querySelector('.conn-label').textContent = 'online';

    renderTable(allRecords);
  } catch (err) {
    console.error(err);
    showToast('Erro ao conectar com a API', 'error');

    tableLoader.classList.add('hidden');
    connStatus.classList.replace('online', 'offline');
    connStatus.querySelector('.conn-label').textContent = 'offline';
  }
}


function renderTable(records) {
  tableBody.innerHTML = '';
  tableLoader.classList.add('hidden');

  recordCountBadge.textContent = `${records.length} registro(s)`;

  if (records.length === 0) {
    tableWrapper.classList.add('hidden');
    tableEmpty.classList.remove('hidden');
    return;
  }

  tableWrapper.classList.remove('hidden');
  tableEmpty.classList.add('hidden');

  records.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.nome}</td>
      <td>${user.email}</td>
      <td>${user.telefone}</td>
    `;
    tableBody.appendChild(tr);
  });
}


form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = fieldName.value.trim();
  const email = fieldEmail.value.trim();
  const telefone = fieldTelefone.value.trim();

  if (!nome || !email || !telefone) {
    return showToast('Preencha todos os campos obrigatórios', 'error');
  }

  btnSubmit.disabled = true;
  btnLoader.classList.remove('hidden');
  btnLabel.textContent = 'Salvando...';

  try {
    await apiFetch('/users', 'POST', { nome, email, telefone });
    showToast('Paciente cadastrado com sucesso!', 'success');

    form.reset();
    await loadRecords();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btnSubmit.disabled = false;
    btnLoader.classList.add('hidden');
    btnLabel.textContent = 'Salvar';
  }
});


searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase();

  const filtered = allRecords.filter(u =>
    u.nome.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q)
  );

  renderTable(filtered);
});


btnRefresh.addEventListener('click', loadRecords);


function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}


loadRecords();