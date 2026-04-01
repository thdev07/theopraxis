
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
    throw new Error(err.message || `Erro ${response.status}`);
  }

  return response.json();
}


let allRecords = [];

const form = document.getElementById('form');
const fieldNome = document.getElementById('nome');
const fieldEmail = document.getElementById('email');
const fieldTelefone = document.getElementById('telefone');

const tableBody = document.getElementById('table-body');
const tableLoader = document.getElementById('loading');
const tableEmpty = document.getElementById('empty');
const recordCountBadge = document.getElementById('record-count');
const connStatus = document.getElementById('connection-status');
const searchInput = document.getElementById('search');
const btnRefresh = document.getElementById('refresh');
const toast = document.getElementById('toast');


function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.className = 'toast', 3000);
}



async function addPatient(nome, email, telefone) {
  return apiFetch('/pacientes', 'POST', { nome, email, telefone });
}

async function loadRecords() {
  tableLoader.classList.remove('hidden');
  tableBody.innerHTML = '';
  tableEmpty.classList.add('hidden');

  try {
    const data = await apiFetch('/pacientes');
    allRecords = data.data || data;

    connStatus.classList.replace('offline', 'online');
    connStatus.querySelector('.conn-label').textContent = 'online';

    renderTable(allRecords);
  } catch (err) {
    console.error(err);
    showToast('Erro ao conectar com a API', 'error');

    connStatus.classList.replace('online', 'offline');
    connStatus.querySelector('.conn-label').textContent = 'offline';
  } finally {
    tableLoader.classList.add('hidden');
  }
}

function renderTable(records) {
  tableBody.innerHTML = '';
  recordCountBadge.textContent = `${records.length} paciente(s)`;

  if (!records.length) {
    tableEmpty.classList.remove('hidden');
    return;
  }

  records.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${p.telefone || '-'}</td>
      <td>${p.email || '-'}</td>
      <td>
        <button class="btn btn-ghost btn-delete" data-id="${p.id}">
          🗑️
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deletePatient(btn.dataset.id));
  });
}

async function deletePatient(id) {
  if (!confirm('Deseja realmente excluir este paciente?')) return;

  try {
    await apiFetch(`/pacientes/${id}`, 'DELETE');
    showToast('Paciente removido com sucesso!', 'success');
    loadRecords();
  } catch (err) {
    showToast(err.message, 'error');
  }
}



form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = fieldNome.value.trim();
  const email = fieldEmail.value.trim();
  const telefone = fieldTelefone.value.trim();

  if (!nome) return showToast('Preencha o nome', 'error');

  try {
    await addPatient(nome, email, telefone);
    showToast('Paciente cadastrado com sucesso!', 'success');
    form.reset();
    loadRecords();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase();
  const filtered = allRecords.filter(p =>
    p.nome.toLowerCase().includes(q) ||
    (p.email && p.email.toLowerCase().includes(q))
  );
  renderTable(filtered);
});

btnRefresh.addEventListener('click', loadRecords);


loadRecords();