// Nombre del archivo: js/validaciones.js
// Autor: Alessio Aguirre Pimentel
// Versión: 56

// Validación
export const mostrarError = (elemento, mensaje) => {
    let error = elemento.nextElementSibling;
    if (!error || !error.classList.contains('error')) {
        error = document.createElement('div');
        error.classList.add('error');
        elemento.parentNode.insertBefore(error, elemento.nextSibling);
    }
    error.textContent = mensaje;
};

export const limpiarError = (elemento) => {
    let error = elemento.nextElementSibling;
    if (error && error.classList.contains('error')) {
        error.remove();
    }
};

export const validarNombre = (nombre) => /^[a-zA-Z\s]{2,25}$/.test(nombre);
export const validarTelefono = (telefono) => /^[0-9+\-().\s]{7,20}$/.test(telefono);
export const validarNumeroMascotas = (num) => /^[1-3]$/.test(num);

// Turno dentro de los próximos 45 días
export const validarFecha = (fecha) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Resetear la hora a medianoche
    const fechaTurno = new Date(fecha + "T00:00:00"); // Asegurarse de que se parsee solo la fecha
    const diff = (fechaTurno - now) / (1000 * 60 * 60 * 24);
    return fechaTurno >= now && diff <= 45;
};

// En versiones futuras se va a verificar contra array horarios[]
export const validarDiaAbierto = (fecha) => {
    const dia = new Date(fecha + "T00:00:00").getDay(); // Asegurarse de que se parsee solo la fecha
    return dia >= 1 && dia <= 5; // 1=Lunes, 5=Viernes
};

// Hora del turno sea válida y esté dentro del horario de atención
export const validarHora = (fecha, hora, horarios, numeroDeMascotas) => {
    const dia = new Date(fecha + "T00:00:00").getDay(); // Asegurarse de que se parsee solo la fecha
    const horario = horarios[Object.keys(horarios)[dia - 1]];
    if (!horario || horario === 'Cerrado') return false;

    const [horaInicio, horaFin] = horario.split(' - ');

    const parseTime = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date(fecha + "T00:00:00");
        date.setHours(hours, minutes);
        return date;
    };

    const turnoHora = parseTime(hora);
    const inicio = parseTime(horaInicio);
    const fin = parseTime(horaFin);

    // Número de mascotas sea un número
    const numeroDeMascotasParsed = parseInt(numeroDeMascotas, 10);
    if (isNaN(numeroDeMascotasParsed)) {
        console.error("Número de mascotas inválido:", numeroDeMascotas); // Versión futura más elaborada
        return false; // Si
    }

    // Hora de finalización del último turno 45 mins antes
    const turnoHoraFinal = new Date(turnoHora.getTime() + 45 * 60000 * numeroDeMascotasParsed);
    // console.log(turnoHoraFinal) // Debug para problema intermitente

    const currentTimePlusOneHour = new Date();
    currentTimePlusOneHour.setHours(currentTimePlusOneHour.getHours() + 1);

    return turnoHora >= currentTimePlusOneHour && turnoHora >= inicio && turnoHoraFinal <= fin;
};

// Edad mascota rango permitido
export const validarEdadMascota = (edad) => {
    const edadParsed = parseInt(edad, 10);

    const isValid = Number.isInteger(edadParsed) && edadParsed >= 0 && edadParsed <= 40;

    return isValid;
};
