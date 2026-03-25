const API_URL = '/api/users';
const form = document.getElementById('userForm');
const tbody = document.querySelector('#usersTable tbody');
let editingId = null;

// Cargar todos los usuarios
async function loadUsers() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al cargar usuarios');
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
          <button class="btn btn-sm btn-warning me-2" onclick="editUser(${user.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error cargando usuarios:', err);
    alert('No se pudieron cargar los usuarios. Revisa la consola.');
  }
}

// Enviar formulario (Crear o Actualizar)
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userData = {
    nombre: document.getElementById('nombre').value.trim(),
    email: document.getElementById('email').value.trim(),
    edad: parseInt(document.getElementById('edad').value),
    telefono: document.getElementById('telefono').value.trim()
  };

  try {
    if (editingId) {
      // Actualizar
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!res.ok) throw new Error('Error al actualizar');
      editingId = null;
      document.getElementById('btnSubmit').textContent = 'Agregar Usuario';
    } else {
      // Crear
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!res.ok) throw new Error('Error al crear usuario');
    }

    form.reset();
    loadUsers();
  } catch (err) {
    console.error(err);
    alert('Ocurrió un error: ' + err.message);
  }
});

// Editar usuario
async function editUser(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Usuario no encontrado');
    const user = await res.json();

    document.getElementById('nombre').value = user.nombre;
    document.getElementById('email').value = user.email;
    document.getElementById('edad').value = user.edad;
    document.getElementById('telefono').value = user.telefono || '';

    editingId = id;
    document.getElementById('btnSubmit').textContent = 'Actualizar Usuario';
  } catch (err) {
    console.error(err);
    alert('No se pudo cargar el usuario para editar');
  }
}

// Eliminar usuario
async function deleteUser(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar');
    loadUsers();
  } catch (err) {
    console.error(err);
    alert('No se pudo eliminar el usuario');
  }
}

// Cargar usuarios al iniciar la página
loadUsers();
