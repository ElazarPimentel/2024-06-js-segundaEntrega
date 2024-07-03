// Nombre del archivo: js/main.js
// Autor: Alessio Aguirre Pimentel
// Versión: 49

import { gestionarLocalStorage } from './localStorage.js';
import { mostrarError, limpiarError, validarNombre, validarTelefono, validarNumeroMascotas, validarFecha, validarDiaAbierto, validarHora, validarEdadMascota } from './validaciones.js';
import { actualizarServiciosList, actualizarHorariosList, actualizarDOM } from './domUpdates.js';

// Variables y constantes globales
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
    Sábado: "Cerrado",
    Domingo: "Cerrado"
};

let cliente = null;
let mascotas = [];
let turnos = [];

cliente = gestionarLocalStorage("cargar", "cliente") || null; //Null para objetos
mascotas = gestionarLocalStorage("cargar", "mascotas") || [];
turnos = gestionarLocalStorage("cargar", "turnos") || [];

class Cliente {
    constructor(clienteId, clienteNombre, clienteTelefono) {
        this.clienteId = clienteId || Cliente.generarId('cliente');
        this.clienteNombre = clienteNombre;
        this.clienteTelefono = clienteTelefono;
    }

    static generarId(prefix) {
        return `${prefix}_` + Math.random().toString(36).slice(2, 11);
    }
}

class Mascota {
    constructor(mascotaId, mascotaForeignClienteId, mascotaNombre, mascotaEdad) {
        this.mascotaId = mascotaId || Mascota.generarId('mascota');
        this.mascotaForeignClienteId = mascotaForeignClienteId;
        this.mascotaNombre = mascotaNombre;
        this.mascotaEdad = mascotaEdad;
    }

    static generarId(prefix) {
        return `${prefix}_` + Math.random().toString(36).slice(2, 11);
    }
}

class Turno {
    constructor(turnoId, turnoForeignMascotaId, turnoFecha, turnoHora, turnoForeignServicioId) {
        this.turnoId = turnoId || Turno.generarId('turno');
        this.turnoForeignMascotaId = turnoForeignMascotaId;
        this.turnoFecha = turnoFecha;
        this.turnoHora = turnoHora;
        this.turnoForeignServicioId = turnoForeignServicioId;
    }

    static generarId(prefix) {
        return `${prefix}_` + Math.random().toString(36).slice(2, 11);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarServiciosList(servicios);
    actualizarHorariosList(horarios);

    document.body.addEventListener("click", (event) => {
        const { id: targetId } = event.target;

        if (targetId === "guardar-cliente") {
            guardarCliente();
        } else if (targetId === "siguiente-mascota") {
            mostrarFormulariosMascotas();
        } else if (targetId === "borrar-datos") {
            comenzarDeNuevo();
        } else if (targetId === "guardar-mascotas-turnos") {
            guardarMascotasYTurnos();
            // } else if (targetId === "theme-toggle") { Versiones futuras
            //     toggleTema();
        }
    });

    actualizarDOM(cliente, mascotas, turnos, servicios);
    aplicarTema();
    controlarBotonGuardar();
});

const guardarCliente = () => {
    const nombre = document.getElementById("cliente-nombre");
    const telefono = document.getElementById("cliente-telefono");

    limpiarError(nombre);
    limpiarError(telefono);


    if (!validarNombre(nombre.value)) {
        mostrarError(nombre, "El nombre debe contener entre 2 y 25 letras del alfabeto latino.");
        return;
    }


    if (!validarTelefono(telefono.value)) {
        mostrarError(telefono, "El teléfono debe contener solo números, signos +, -, (, ), y espacios, con un máximo de 20 caracteres.");
        return;
    }

    cliente = new Cliente(null, nombre.value, telefono.value);
    gestionarLocalStorage("guardar", "cliente", cliente);
    document.getElementById("formulario-mascotas-info").style.display = "block";
};

const mostrarFormulariosMascotas = () => {
    const numMascotas = document.getElementById("numero-mascotas");
    const fecha = document.getElementById("turno-fecha");
    const hora = document.getElementById("turno-hora");

    limpiarError(numMascotas);
    limpiarError(fecha);
    limpiarError(hora);


    if (!validarNumeroMascotas(numMascotas.value)) {
        mostrarError(numMascotas, "El número de mascotas debe estar entre 1 y 3. Si tiene más de tres mascotas, por favor haga otro turno para las otras mascotas.");
        return;
    }


    if (!validarFecha(fecha.value)) {
        mostrarError(fecha, "La fecha del turno debe ser un día que la veterinaria esté abierta y dentro de los próximos 45 días.");
        return;
    }


    if (!validarDiaAbierto(fecha.value)) {
        mostrarError(fecha, "La veterinaria está cerrada ese día. Por favor elija otro día.");
        return;
    }


    if (!validarHora(fecha.value, hora.value, horarios, numMascotas.value)) {
        mostrarError(hora, "La hora del turno debe estar dentro del horario de atención y al menos una hora después de la hora actual.");
        return;
    }

    const mascotasForm = document.getElementById("mascotas-formulario");
    mascotasForm.innerHTML = '';

    for (let i = 0; i < numMascotas.value; i++) {
        const petForm = document.createElement("form");
        petForm.setAttribute("id", `form-mascota-${i}`);
        petForm.innerHTML = `
            <fieldset>
                <legend>Datos de la Mascota ${i + 1}</legend>
                <label for="mascota-nombre-${i}">Nombre de mascota:</label>
                <input type="text" id="mascota-nombre-${i}" name="mascota-nombre-${i}" required aria-label="Nombre de la Mascota ${i + 1}">
                <label for="mascota-edad-${i}">Edad (años):</label>
                <input type="text" id="mascota-edad-${i}" name="mascota-edad-${i}" required aria-label="Edad de la Mascota ${i + 1}">
                <label for="servicio-${i}">Servicio</label>
                <select id="servicio-${i}" required aria-label="Servicio para la Mascota ${i + 1}">
                    ${Object.entries(servicios).map(([id, nombre]) => `<option value="${id}">${nombre}</option>`).join('')}
                </select>
            </fieldset>
        `;
        mascotasForm.appendChild(petForm);
    }

    mascotasForm.style.display = "block";
    document.getElementById("guardar-mascotas-turnos").style.display = "inline-block";
    document.getElementById("borrar-datos").style.display = "inline-block";
};

const guardarMascotasYTurnos = () => {
    try {
        const numMascotas = parseInt(document.getElementById("numero-mascotas").value);
        const fecha = document.getElementById("turno-fecha").value;
        const hora = document.getElementById("turno-hora").value;
        let turnoHora = new Date(`${fecha}T${hora}`);

        for (let i = 0; i < numMascotas; i++) {
            const mascotaNombre = document.getElementById(`mascota-nombre-${i}`).value;
            const mascotaEdad = document.getElementById(`mascota-edad-${i}`).value;
            const servicioId = document.getElementById(`servicio-${i}`).value;
            const mascota = new Mascota(null, cliente.clienteId, mascotaNombre, mascotaEdad);
            mascotas.push(mascota);

            if (!validarNombre(mascotaNombre)) {
                mostrarError(document.getElementById(`mascota-nombre-${i}`), "El nombre de la mascota debe contener entre 2 y 25 letras del alfabeto latino.");
                return;
            }

            if (!validarEdadMascota(mascotaEdad)) {
                mostrarError(document.getElementById(`mascota-edad-${i}`), "La edad de la mascota debe ser un número entre 0 y 40 años.");
                return;
            }

            const turno = new Turno(null, mascota.mascotaId, fecha, turnoHora.toTimeString().slice(0, 5), servicioId);
            turnos.push(turno);
            turnoHora.setMinutes(turnoHora.getMinutes() + 45);
        }

        gestionarLocalStorage("guardar", "mascotas", mascotas);
        gestionarLocalStorage("guardar", "turnos", turnos);
        actualizarDOM(cliente, mascotas, turnos, servicios);
        document.getElementById("seccion-salida-datos-dos").style.display = "block";
        document.getElementById("guardar-mascotas-turnos").style.display = "none"; // Ocultar el botón
    } catch (error) {
        console.error('Error al guardar mascotas y turnos', error); // Elavorar en futuras versiones
    }
};

const borrarTodosDatos = () => {
    try {
        gestionarLocalStorage("borrarTodo");
        cliente = null;
        mascotas = [];
        turnos = [];
        actualizarDOM(cliente, mascotas, turnos, servicios);
        document.getElementById("formulario-cliente").reset();
        document.getElementById("formulario-mascotas-info").style.display = "none";
        document.getElementById("mascotas-formulario").style.display = "none";
        document.getElementById("guardar-mascotas-turnos").style.display = "none";
        document.getElementById("borrar-datos").style.display = "none";
        document.getElementById("seccion-salida-datos-dos").style.display = "none";
    } catch (error) {
        console.error('Error al borrar todos los datos', error); //Elaborar en futuras versiones
    }
};

const comenzarDeNuevo = () => {
    borrarTodosDatos();
    const guardarBtn = document.getElementById("guardar-mascotas-turnos");
    if (guardarBtn) {
        guardarBtn.style.display = "inline-block"; // Mostrar el botón
    }
};

// const toggleTema = () => { Versiones futuras
//     try {
//         const tema = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
//         document.body.dataset.theme = tema;
//         gestionarLocalStorage("guardar", "theme", tema);
//     } catch (error) {
//         console.error('Error al cambiar el tema', error);
//     }
// };

const aplicarTema = () => {
    try {
        const temaAlmacenado = gestionarLocalStorage("cargar", "theme") || 'dark';
        document.body.dataset.theme = temaAlmacenado;
    } catch (error) {
        console.error('Error al aplicar el tema', error); // Elaborar en futuras versiones 
    }
};

const controlarBotonGuardar = () => {
    const guardarBtn = document.getElementById("guardar-mascotas-turnos");
    if (guardarBtn) {
        guardarBtn.style.display = 'none'; // Ocultar botón
    }
};
