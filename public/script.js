const API_URL = '/api/users';
const form = document.getElementById('userForm');
const tbody = document.querySelector('#usersTable tbody');
let editingId = null;

// Cargar usuarios al iniciar
async function loadUsers() {
  const res = await fetch(API_URL);
  const users = await res.json();
  tbody.innerHTML = '';
  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.nombre}</td>
      <td>${user.email}</td>
      <td>${user.edad}</td>
      <td>${user.telefono || '-'}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editUser('${user._id}')">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Enviar formulario (Crear o Actualizar)
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userData = {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    edad: parseInt(document.getElementById('edad').value),
    telefono: document.getElementById('telefono').value
  };

  if (editingId) {
    await fetch(`${API_URL}/${editingId}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(userData) });
    editingId = null;
    document.getElementById('btnSubmit').textContent = 'Agregar Usuario';
  } else {
    await fetch(API_URL, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(userData) });
  }

  form.reset();
  loadUsers();
});

// Editar usuario
async function editUser(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const user = await res.json();
  document.getElementById('userId').value = user._id;
  document.getElementById('nombre').value = user.nombre;
  document.getElementById('email').value = user.email;
  document.getElementById('edad').value = user.edad;
  document.getElementById('telefono').value = user.telefono || '';
  editingId = id;
  document.getElementById('btnSubmit').textContent = 'Actualizar Usuario';
}

// Eliminar usuario
async function deleteUser(id) {
  if (confirm('¿Estás seguro de eliminar este usuario?')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadUsers();
  }
}

// Cargar usuarios al iniciar
loadUsers();
