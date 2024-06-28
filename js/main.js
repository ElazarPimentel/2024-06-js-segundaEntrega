// Nombre del archivo: js/main.js
// Alessio Aguirre Pimentel
// v24

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
        this.clienteId = clienteId || this.generarId('cliente');
        this.clienteNombre = clienteNombre;
        this.clienteTelefono = clienteTelefono;
    }

    generarId(prefix) {
        return `${prefix}_` + Math.random().toString(36).slice(2, 11);
    }
}

class Mascota {
    constructor(mascotaId, mascotaForeignClienteId, mascotaNombre, mascotaEdad) {
        this.mascotaId = mascotaId || this.generarId('mascota');
        this.mascotaForeignClienteId = mascotaForeignClienteId;
        this.mascotaNombre = mascotaNombre;
        this.mascotaEdad = mascotaEdad;
    }

    generarId(prefix) {
        return `${prefix}_` + Math.random().toString(36).slice(2, 11);
    }
}

class Turno {
    constructor(turnoId, turnoForeignMascotaId, turnoFecha, turnoHora, turnoForeignServicioId) {
        this.turnoId = turnoId || this.generarId('turno');
        this.turnoForeignMascotaId = turnoForeignMascotaId;
        this.turnoFecha = turnoFecha;
        this.turnoHora = turnoHora;
        this.turnoForeignServicioId = turnoForeignServicioId;
    }

    generarId(prefix) {
        return `${prefix}_` + Math.random().toString(36).slice(2, 11);
    }
}

// Variables para el localStorage
let cliente = JSON.parse(localStorage.getItem('cliente')) || null;
let mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

// DOM
document.addEventListener("DOMContentLoaded", () => {
    actualizarServiciosList();
    actualizarHorariosList();

    // Event listeners
    document.getElementById("save-cliente").addEventListener("click", guardarCliente);
    document.getElementById("next-step-pets").addEventListener("click", mostrarFormulariosMascotas);
    document.getElementById("clear-data").addEventListener("click", borrarTodosDatos);

    // Initial DOM update
    actualizarDOM();
});

// Llenar listas
function actualizarServiciosList() {
    const serviciosList = document.getElementById("servicios-list");
    serviciosList.innerHTML = '';
    Object.entries(servicios).forEach(([id, nombre]) => {
        const li = document.createElement("li");
        li.textContent = `${id}. ${nombre}`;
        serviciosList.appendChild(li);
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

// Funciones post / click
function guardarCliente() {
    const nombre = document.getElementById("cliente-nombre").value;
    const telefono = document.getElementById("cliente-telefono").value;
    cliente = new Cliente(null, nombre, telefono);
    localStorage.setItem('cliente', JSON.stringify(cliente));
    document.getElementById("form-pets-info").style.display = "block";
}

function mostrarFormulariosMascotas() {
    const numPets = parseInt(document.getElementById("num-pets").value);
    const fecha = document.getElementById("turno-fecha").value;
    const hora = document.getElementById("turno-hora").value;
    const petsForms = document.getElementById("pets-forms");
    petsForms.innerHTML = '';

    for (let i = 0; i < numPets; i++) {
        const petForm = document.createElement("form");
        petForm.setAttribute("id", `form-mascota-${i}`);
        petForm.innerHTML = `
            <fieldset>
                <legend>Datos de la Mascota ${i + 1}</legend>
                <label for="mascota-nombre-${i}">Nombre de mascota:</label>
                <input type="text" id="mascota-nombre-${i}" name="mascota-nombre-${i}" required aria-label="Nombre de la Mascota ${i + 1}">
                <label for="mascota-edad-${i}">Edad (en años):</label>
                <input type="number" id="mascota-edad-${i}" name="mascota-edad-${i}" required aria-label="Edad de la Mascota ${i + 1}">
                <label for="servicio-${i}">Servicio</label>
                <select id="servicio-${i}" required aria-label="Servicio para la Mascota ${i + 1}">
                    ${Object.entries(servicios).map(([id, nombre]) => `<option value="${id}">${nombre}</option>`).join('')}
                </select>
            </fieldset>
        `;
        petsForms.appendChild(petForm);
    }

    const savePetsButton = document.createElement("button");
    savePetsButton.textContent = "Guardar Mascotas y Turnos";
    savePetsButton.addEventListener("click", () => guardarMascotasYTurnos(numPets, fecha, hora));
    petsForms.appendChild(savePetsButton);

    petsForms.style.display = "block";
}

function guardarMascotasYTurnos(numPets, fecha, hora) {
    let turnoHora = new Date(`${fecha}T${hora}`);
    for (let i = 0; i < numPets; i++) {
        const mascotaNombre = document.getElementById(`mascota-nombre-${i}`).value;
        const mascotaEdad = document.getElementById(`mascota-edad-${i}`).value;
        const servicioId = document.getElementById(`servicio-${i}`).value;
        const mascota = new Mascota(null, cliente.clienteId, mascotaNombre, mascotaEdad);
        mascotas.push(mascota);

        const turno = new Turno(null, mascota.mascotaId, fecha, turnoHora.toTimeString().slice(0, 5), servicioId);
        turnos.push(turno);
        turnoHora.setMinutes(turnoHora.getMinutes() + 45);
    }

    localStorage.setItem('mascotas', JSON.stringify(mascotas));
    localStorage.setItem('turnos', JSON.stringify(turnos));
    actualizarDOM();
}

function actualizarDOM() {
    if (cliente) {
        let clienteDetails = document.getElementById('cliente-detalles');
        if (!clienteDetails) {
            clienteDetails = document.createElement('div');
            clienteDetails.id = 'cliente-detalles';
            document.getElementById("form-cliente").insertAdjacentElement('afterend', clienteDetails);
        }

        clienteDetails.innerHTML = `<h2>Cliente: ${cliente.clienteNombre}</h2><p>Teléfono: ${cliente.clienteTelefono}</p>`;
    }

    let mascotaDetails = document.getElementById("mascota-detalles");
    if (!mascotaDetails) {
        mascotaDetails = document.createElement('div');
        mascotaDetails.id = 'mascota-detalles';
        document.getElementById("seccion-salida-datos").appendChild(mascotaDetails);
    }
    mascotaDetails.innerHTML = '';
    turnos.forEach(turno => {
        const mascota = mascotas.find(m => m.mascotaId === turno.turnoForeignMascotaId);
        const servicio = servicios[turno.turnoForeignServicioId];
        const turnoInfo = document.createElement('div');
        turnoInfo.innerHTML = `
            <h3>Mascota: ${mascota.mascotaNombre} (${mascota.mascotaEdad} años)</h3>
            <p>Fecha: ${turno.turnoFecha}</p>
            <p>Hora: ${turno.turnoHora}</p>
            <p>Servicio: ${servicio}</p>
        `;
        mascotaDetails.appendChild(turnoInfo);
    });
}

// Borrar todo
function borrarTodosDatos() {
    localStorage.clear();
    cliente = null;
    mascotas = [];
    turnos = [];
    actualizarDOM();
}
