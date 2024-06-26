// Nombre del archivo: js/main.js
// Alessio Aguirre Pimentel
// v13

// Variables almacenamiento
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
let mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

// Referencias del DOM
const userForm = document.getElementById('user-form');
const petForm = document.getElementById('pet-form');
const appointmentForm = document.getElementById('appointment-form');
const themeToggle = document.getElementById('theme-toggle');
const userSection = document.getElementById('user-section');
const petSection = document.getElementById('pet-section');
const appointmentSection = document.getElementById('appointment-section');
const appointmentsList = document.getElementById('appointments-list');

// Manejo temas
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

// Funciones ayuda
const guardarEnLocalStorage = (clave, valor) => localStorage.setItem(clave, JSON.stringify(valor));

// Funciones generadoras ID con random para evitar choques
const generarUsuarioID = () => 'user_' + Math.random().toString(36).substr(2, 9);
const generarMascotaID = () => 'pet_' + Math.random().toString(36).substr(2, 9);
const generarTurnoID = () => 'turn_' + Math.random().toString(36).substr(2, 9);

// Registro usuario
userForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nombre = document.getElementById('username').value;
    const telefono = document.getElementById('phone').value;
    const nuevoUsuario = { id: generarUsuarioID(), nombre, telefono };
    usuarios.push(nuevoUsuario);
    guardarEnLocalStorage('usuarios', usuarios);
    userForm.reset();
    userSection.classList.add('hidden');
    petSection.classList.remove('hidden');
});

// Registro mascota
petForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nombre = document.getElementById('pet-name').value;
    const edad = document.getElementById('pet-age').value;
    const idUsuario = usuarios[usuarios.length - 1].id;
    const nuevaMascota = { id: generarMascotaID(), idUsuario, nombre, edad };
    mascotas.push(nuevaMascota);
    guardarEnLocalStorage('mascotas', mascotas);
    petForm.reset();
    petSection.classList.add('hidden');
    appointmentSection.classList.remove('hidden');
});

// Solicitud turno
appointmentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const fecha = document.getElementById('appointment-date').value;
    const hora = document.getElementById('appointment-time').value;
    const servicio = document.getElementById('service-select').value;
    const idMascota = mascotas[mascotas.length - 1].id;
    const nuevoTurno = { id: generarTurnoID(), idMascota, fecha, hora, servicio };
    turnos.push(nuevoTurno);
    guardarEnLocalStorage('turnos', turnos);
    appointmentForm.reset();
    mostrarTurnos();
});

// Mostrar turnos
const mostrarTurnos = () => {
    appointmentsList.innerHTML = '';
    turnos.forEach(turno => {
        const mascota = mascotas.find(m => m.id === turno.idMascota);
        const usuario = usuarios.find(u => u.id === mascota.idUsuario);
        const turnoElemento = document.createElement('div');
        turnoElemento.textContent = `Turno para ${mascota.nombre} (dueño: ${usuario.nombre}) el ${turno.fecha} a las ${turno.hora} para ${turno.servicio}`;

        // Botón para eliminar el turno
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => eliminarTurno(turno.id));
        turnoElemento.appendChild(deleteButton);

        appointmentsList.appendChild(turnoElemento);
    });
};

// Eliminar turno
const eliminarTurno = (idTurno) => {
    turnos = turnos.filter(turno => turno.id !== idTurno);
    guardarEnLocalStorage('turnos', turnos);
    mostrarTurnos();
};

// Inicio, viejo y querido main
document.addEventListener('DOMContentLoaded', mostrarTurnos);
