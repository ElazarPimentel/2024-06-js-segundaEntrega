// Nombre del archivo: main.js
// Alessio Aguirre Pimentel
// v9

const usuarios = [], mascotas = [], turnos = [];
const servicios = ['Baño y Peinado', 'Vacunación', 'Eliminación de Pulgas'];
let idCounter = 0, idTurnoCounter = 0;

// Inicialización variables de texto
let nombreUsuario = '', telefonoUsuario = '';

// Función mensaje despedida
const mensajeDespedida = () => alert('🖐️ Gracias y hasta luego 🖐️');

// Función que genera ID's unívocos
const generarID = () => idCounter++;
const generarTurnoID = () => idTurnoCounter++;

// Populando lista de servicios
const serviciosList = document.getElementById('serviciosList');
const servicioSelect = document.getElementById('servicio');
servicios.forEach(servicio => {
    const li = document.createElement('li');
    li.textContent = servicio;
    serviciosList.appendChild(li);

    const option = document.createElement('option');
    option.value = servicio;
    option.textContent = servicio;
    servicioSelect.appendChild(option);
});

// Función para registrar datos de usuario
document.getElementById('usuarioForm').addEventListener('submit', function (e) {
    e.preventDefault();
    nombreUsuario = document.getElementById('nombreUsuario').value;
    telefonoUsuario = document.getElementById('telefonoUsuario').value;
    const usuario = { id: generarID(), nombreUsuario, telefonoUsuario };
    usuarios.push(usuario);

    document.getElementById('mascotaTurnoForm').style.display = 'block';
    document.getElementById('usuarioForm').style.display = 'none';
});

// Función para registrar mascotas y turnos
document.getElementById('mascotaTurnoForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const idUsuario = usuarios[usuarios.length - 1].id;
    const nombreMascota = document.getElementById('nombreMascota').value;
    const edadMascota = document.getElementById('edadMascota').value;
    const fechaTurno = document.getElementById('fechaTurno').value;
    const horaTurno = document.getElementById('horaTurno').value;
    const servicio = document.getElementById('servicio').value;

    const mascota = { id: generarID(), idUsuario, nombreMascota, edadMascota };
    mascotas.push(mascota);

    const turno = { id: generarTurnoID(), idMascota: mascota.id, fechaTurno, horaTurno, servicio };
    turnos.push(turno);

    document.getElementById('mascotaTurnoForm').reset();
    document.getElementById('turnosContainer').style.display = 'block';
    mostrarTurnos();
});

// Función para mostrar turnos
const mostrarTurnos = () => {
    const turnosList = document.getElementById('turnosList');
    turnosList.innerHTML = '';
    turnos.forEach(turno => {
        const mascota = mascotas.find(mascota => mascota.id === turno.idMascota);
        const turnoItem = document.createElement('li');
        turnoItem.textContent = `Mascota: ${mascota.nombreMascota}, Turno: ${turno.fechaTurno} ${turno.horaTurno}, Servicio: ${turno.servicio}`;
        turnosList.appendChild(turnoItem);
    });
};
