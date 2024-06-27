// Nombre del archivo: js/main.js
// Alessio Aguirre Pimentel
// v16

const servicios = {
    1: "Bañado y Peinado",
    2: "Vacunación",
    3: "Chequeo General",
    4: "Quitar pulgas"
};

const horarios = {
    Lunes: "9:00 - 17:00",
    Martes: "9:00 - 17:00",
    Miércoles: "9:00 - 17:00",
    Jueves: "9:00 - 17:00",
    Viernes: "9:00 - 17:00",
    Sábado: "9:00 - 13:00",
    Domingo: "Guardia"
};

class Cliente {
    constructor(clienteId, clienteNombre, clienteTelefono) {
        this.clienteId = clienteId || this.generateId('cliente');
        this.clienteNombre = clienteNombre;
        this.clienteTelefono = clienteTelefono;
    }

    generateId(prefix) {
        return `${prefix}_` + Math.random().toString(36).substr(2, 9);
    }
}

class Mascota {
    constructor(mascotaId, mascotaForeignClienteId, mascotaNombre, mascotaEdad) {
        this.mascotaId = mascotaId || this.generateId('mascota');
        this.mascotaForeignClienteId = mascotaForeignClienteId;
        this.mascotaNombre = mascotaNombre;
        this.mascotaEdad = mascotaEdad;
    }

    generateId(prefix) {
        return `${prefix}_` + Math.random().toString(36).substr(2, 9);
    }
}

class Turno {
    constructor(turnoId, turnoForeignMascotaId, turnoFecha, turnoHora, turnoForeignServicioId) {
        this.turnoId = turnoId || this.generateId('turno');
        this.turnoForeignMascotaId = turnoForeignMascotaId;
        this.turnoFecha = turnoFecha;
        this.turnoHora = turnoHora;
        this.turnoForeignServicioId = turnoForeignServicioId;
    }

    generateId(prefix) {
        return `${prefix}_` + Math.random().toString(36).substr(2, 9);
    }
}

// Variables para el localSotre
let cliente = null;
let mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

// DOM
document.addEventListener("DOMContentLoaded", () => {
    actualizarServiciosList();
    actualizarHorariosList();

    // Event listeners
    document.getElementById("save-cliente").addEventListener("click", guardarCliente);
    document.getElementById("add-mascota").addEventListener("click", agregarMascota);
    document.getElementById("save-turno").addEventListener("click", guardarTurno);
});

// Funciones para populate listas
function actualizarServiciosList() {
    const serviciosList = document.getElementById("servicios-list");
    const serviciosSelect = document.getElementById("servicios-elegidos");
    serviciosList.innerHTML = '';
    serviciosSelect.innerHTML = '';
    Object.entries(servicios).forEach(([id, nombre]) => {
        const li = document.createElement("li");
        li.textContent = `${id}. ${nombre}`;
        serviciosList.appendChild(li);

        const option = document.createElement("option");
        option.value = id;
        option.textContent = nombre;
        serviciosSelect.appendChild(option);
    });
}

function actualizarHorariosList() {
    const horariosList = document.getElementById("horarios-list");
    horariosList.innerHTML = '';
    Object.entries(horarios).forEach(([dia, horas]) => {
        const li = document.createElement("li");
        li.textContent = `${dia}: ${horas}`;
        horariosList.appendChild(li);
    });
}

// Funciones submissions
function guardarCliente() {
    const nombre = document.getElementById("cliente-nombre").value;
    const telefono = document.getElementById("cliente-telefono").value;
    cliente = new Cliente(null, nombre, telefono);
    localStorage.setItem('cliente', JSON.stringify(cliente));
    actualizarDOM();
}

function agregarMascota() {
    const nombre = document.getElementById("mascota-nombre").value;
    const edad = document.getElementById("mascota-edad").value;
    const mascota = new Mascota(null, cliente.clienteId, nombre, edad);
    mascotas.push(mascota);
    localStorage.setItem('mascotas', JSON.stringify(mascotas));
    actualizarDOM();
}

function guardarTurno() {
    const fecha = document.getElementById("turno-fecha").value;
    const hora = document.getElementById("turno-hora").value;
    const servicioId = document.getElementById("servicios-elegidos").value;
    const mascota = mascotas[mascotas.length - 1]; // Assuming the last added mascota is the one for the turno
    const turno = new Turno(null, mascota.mascotaId, fecha, hora, servicioId);
    turnos.push(turno);
    localStorage.setItem('turnos', JSON.stringify(turnos));
    actualizarDOM();
}

function actualizarDOM() {
    // Actualizar detales de cliente
    if (cliente) {
        document.getElementById("cliente-form").style.display = 'none';
        const clienteDetails = document.createElement('div');
        clienteDetails.innerHTML = `<h2>Cliente: ${cliente.clienteNombre}</h2><p>Teléfono: ${cliente.clienteTelefono}</p>`;
        document.body.appendChild(clienteDetails);
    }

    // Actualizar mascotas & turnos
    const mascotaDetails = document.getElementById("mascota-details");
    mascotaDetails.innerHTML = '';
    mascotas.forEach(mascota => {
        const mascotaDiv = document.createElement('div');
        mascotaDiv.innerHTML = `<h3>Mascota: ${mascota.mascotaNombre} (${mascota.mascotaEdad} años)</h3>`;
        const turno = turnos.find(t => t.turnoForeignMascotaId === mascota.mascotaId);
        if (turno) {
            mascotaDiv.innerHTML += `<p>Turno: ${turno.turnoFecha} a las ${turno.turnoHora} - Servicio: ${turno.turnoForeignServicioId}</p>`;
        }
        mascotaDetails.appendChild(mascotaDiv);
    });
}
