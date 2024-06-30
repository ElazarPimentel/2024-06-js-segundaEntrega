// Nombre del archivo: js/main.js
// Autor: Alessio Aguirre Pimentel
// Versión: 41

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
    Sábado: "9:00 - 13:00",
    Domingo: "Guardia"
};

let cliente = null;
let mascotas = [];
let turnos = [];

const gestionarLocalStorage = (accion, clave, valor = null) => {
    try {
        switch (accion) {
            case "guardar": {
                const fechaExp = new Date();
                fechaExp.setDate(fechaExp.getDate() + 45);
                localStorage.setItem(clave, JSON.stringify({ valor, fechaExp }));
                break;
            }
            case "cargar": {
                const item = JSON.parse(localStorage.getItem(clave));
                if (item && new Date(item.fechaExp) > new Date()) {
                    return item.valor;
                } else {
                    localStorage.removeItem(clave);
                    return null;
                }
            }
            case "borrar": {
                localStorage.removeItem(clave);
                break;
            }
            case "borrarTodo": {
                localStorage.clear();
                break;
            }
            default: {
                throw new Error("Acción no reconocida");
            }
        }
    } catch (error) {
        console.error(`Error al ${accion} en local storage`, error);
        return null;
    }
};

cliente = gestionarLocalStorage("cargar", "cliente") || null;
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
    actualizarServiciosList();
    actualizarHorariosList();

    document.body.addEventListener("click", (event) => {
        const { id: targetId } = event.target;

        if (targetId === "guardar-cliente") {
            guardarCliente();
        } else if (targetId === "siguiente-mascota") {
            mostrarFormulariosMascotas();
        } else if (targetId === "borrar-datos") {
            borrarTodosDatos();
        } else if (targetId === "guardar-mascotas-turnos") {
            guardarMascotasYTurnos();
        } else if (targetId === "theme-toggle") {
            toggleTema();
        }
    });
    actualizarDOM();
    aplicarTema();
});

const actualizarServiciosList = () => {
    try {
        const serviciosList = document.getElementById("servicios-listado");
        serviciosList.innerHTML = '';
        Object.entries(servicios).forEach(([id, nombre]) => {
            const li = document.createElement("li");
            li.textContent = `${id}. ${nombre}`;
            serviciosList.appendChild(li);
        });
    } catch (error) {
        console.error('Error actualizar lista servicios', error);
    }
};

const actualizarHorariosList = () => {
    try {
        const horariosList = document.getElementById("horarios-listado");
        horariosList.innerHTML = '';
        Object.entries(horarios).forEach(([dia, horas]) => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${dia}</strong>: ${horas}`;
            horariosList.appendChild(li);
        });
    } catch (error) {
        console.error('Error actualizar lista horarios', error);
    }
};

const guardarCliente = () => {
    try {
        const nombre = document.getElementById("cliente-nombre").value;
        const telefono = document.getElementById("cliente-telefono").value;
        cliente = new Cliente(null, nombre, telefono);
        gestionarLocalStorage("guardar", "cliente", cliente);
        document.getElementById("formulario-mascotas-info").style.display = "block";
    } catch (error) {
        console.error('Error guardar cliente', error);
    }
};

const mostrarFormulariosMascotas = () => {
    try {
        const numMascotas = parseInt(document.getElementById("numero-mascotas").value);
        const fecha = document.getElementById("turno-fecha").value;
        const hora = document.getElementById("turno-hora").value;
        const mascotasForm = document.getElementById("mascotas-formulario");
        mascotasForm.innerHTML = '';

        for (let i = 0; i < numMascotas; i++) {
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
    } catch (error) {
        console.error('Error al mostrar formularios de mascotas', error);
    }
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

            const turno = new Turno(null, mascota.mascotaId, fecha, turnoHora.toTimeString().slice(0, 5), servicioId);
            turnos.push(turno);
            turnoHora.setMinutes(turnoHora.getMinutes() + 45);
        }

        gestionarLocalStorage("guardar", "mascotas", mascotas);
        gestionarLocalStorage("guardar", "turnos", turnos);
        actualizarDOM();
        document.getElementById("seccion-salida-datos-dos").style.display = "block";
    } catch (error) {
        console.error('Error al guardar mascotas y turnos', error);
    }
};

const actualizarDOM = () => {
    try {
        const clienteDetalles = document.getElementById('cliente-detalles');
        const mascotaDetalles = document.getElementById('mascota-detalles');

        if (!clienteDetalles || !mascotaDetalles) {
            throw new Error("Elementos requeridos faltantes en el DOM.");
        }

        clienteDetalles.innerHTML = '';
        mascotaDetalles.innerHTML = '';

        if (cliente) {
            clienteDetalles.innerHTML = `<h2>Cliente: ${cliente.clienteNombre}</h2><p><strong>Teléfono</strong>: ${cliente.clienteTelefono}</p>`;
        }

        let fechaPrimeraVezTexto = "";
        turnos.forEach((turno, index) => {
            const mascota = mascotas.find(m => m.mascotaId === turno.turnoForeignMascotaId);
            const servicio = servicios[turno.turnoForeignServicioId];
            const turnoInfo = document.createElement('div');

            if (index === 0) {
                fechaPrimeraVezTexto = `<p><strong>Fecha</strong>: ${turno.turnoFecha}</p>`;
            }

            turnoInfo.innerHTML = `${index === 0 ? fechaPrimeraVezTexto : ""}<p><strong>Hora</strong>: ${turno.turnoHora} <strong>Mascota</strong>: ${mascota.mascotaNombre} (${mascota.mascotaEdad} año/s) <strong>Servicio</strong>: ${servicio}</p>`;
            mascotaDetalles.appendChild(turnoInfo);
        });
    } catch (error) {
        console.error('Error al actualizar el DOM', error);
    }
};

const borrarTodosDatos = () => {
    try {
        gestionarLocalStorage("borrarTodo");
        cliente = null;
        mascotas = [];
        turnos = [];
        actualizarDOM();
        document.getElementById("formulario-cliente").reset();
        document.getElementById("formulario-mascotas-info").style.display = "none";
        document.getElementById("mascotas-formulario").style.display = "none";
        document.getElementById("guardar-mascotas-turnos").style.display = "none";
        document.getElementById("borrar-datos").style.display = "none";
        document.getElementById("seccion-salida-datos-dos").style.display = "none";
    } catch (error) {
        console.error('Error al borrar todos los datos', error);
    }
};

const toggleTema = () => {
    try {
        const tema = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
        document.body.dataset.theme = tema;
        gestionarLocalStorage("guardar", "theme", tema);
    } catch (error) {
        console.error('Error al cambiar el tema', error);
    }
};

const aplicarTema = () => {
    try {
        const temaAlmacenado = gestionarLocalStorage("cargar", "theme") || 'dark';
        document.body.dataset.theme = temaAlmacenado;
    } catch (error) {
        console.error('Error al aplicar el tema', error);
    }
};
