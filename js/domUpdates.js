// Nombre del archivo: js/domUpdates.js
// Autor: Alessio Aguirre Pimentel
// Versión: 48

export const actualizarServiciosList = (servicios) => {
    try {
        const serviciosList = document.getElementById("servicios-listado");
        serviciosList.innerHTML = '';
        Object.entries(servicios).forEach(([id, nombre]) => {
            const li = document.createElement("li");
            li.textContent = `${id}. ${nombre}`;
            serviciosList.appendChild(li);
        });
    } catch (error) {
        console.error('Error actualizar lista servicios', error); //Versiones futuras manejo complejo
    }
};

export const actualizarHorariosList = (horarios) => {
    try {
        const horariosList = document.getElementById("horarios-listado");
        horariosList.innerHTML = '';
        Object.entries(horarios).forEach(([dia, horas]) => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${dia}</strong>: ${horas}`;
            horariosList.appendChild(li);
        });
    } catch (error) {
        console.error('Error actualizar lista horarios', error);//Versiones futuras manejo complejo
    }
};

export const actualizarDOM = (cliente, mascotas, turnos, servicios) => {
    try {
        const clienteDetalles = document.getElementById('cliente-detalles');
        const mascotaDetalles = document.getElementById('mascota-detalles');

        if (!clienteDetalles || !mascotaDetalles) {
            throw new Error("Elementos requeridos faltantes en el DOM.");
        }

        clienteDetalles.innerHTML = '';
        mascotaDetalles.innerHTML = '';

        if (cliente) {
            clienteDetalles.innerHTML = `<h2>Cliente: ${cliente.clienteNombre}</h2><p><strong>Teléfono</strong>: ${cliente.clienteTelefono}</p>`;//Versiones futuras clase en vez de h2
        }

        let fechaPrimeraVezTexto = ""; //Para que ponga la fecha una sola vez
        turnos.forEach((turno, index) => {
            const mascota = mascotas.find(m => m.mascotaId === turno.turnoForeignMascotaId);
            const servicio = servicios[turno.turnoForeignServicioId];
            const turnoInfo = document.createElement('div');

            if (index === 0) { // Si primera vez que ponga fecha
                fechaPrimeraVezTexto = `<p><strong>Fecha</strong>: ${turno.turnoFecha}</p>`;
            }

            turnoInfo.innerHTML = `${index === 0 ? fechaPrimeraVezTexto : ""}<p><strong>Hora</strong>: ${turno.turnoHora} <strong>Mascota</strong>: ${mascota.mascotaNombre} (${mascota.mascotaEdad} año/s) <strong>Servicio</strong>: ${servicio}</p>`;
            mascotaDetalles.appendChild(turnoInfo);
        });
    } catch (error) {
        console.error('Error al actualizar el DOM', error);//Versiones futuras manejo complejo
    }
};
