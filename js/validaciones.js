// Nombre del archivo: js/validaciones.js
// Autor: Alessio Aguirre Pimentel
// Versión: 47

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

// Tunrno dentro de los próximos 45 dias
export const validarFecha = (fecha) => {
    const now = new Date();
    const fechaTurno = new Date(fecha + "T00:00:00"); // Asegurarse de que se parsee solo la fecha
    const diff = (fechaTurno - now) / (1000 * 60 * 60 * 24);
    return fechaTurno > now && diff <= 45;
};

// En versiones verificar contra array horarios[]
export const validarDiaAbierto = (fecha) => {
    const dia = new Date(fecha + "T00:00:00").getDay(); // Asegurarse de que se parsee solo la fecha
    return dia >= 1 && dia <= 5; // 1=Lunes, 5=Viernes
};

// Hora del turno sea válida y esté dentro del horario de atención
export const validarHora = (fecha, hora, horarios, numeroDeMascotas) => {
    const dia = new Date(fecha + "T00:00:00").getDay(); 
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
    const fin = parseTime(horaFin); //Que sea antes del horario de cierre

    // numeroDeMascotas sea un numreo
    const numeroDeMascotasParsed = parseInt(numeroDeMascotas, 10);
    if (isNaN(numeroDeMascotasParsed)) {
        console.error("Número de mascotas inválido:", numeroDeMascotas);

        return false;//Si
    }

    // Hora de finalización del último turno 45 mins antes
    const turnoHoraFinal = new Date(turnoHora.getTime() + 45 * 60000 * numeroDeMascotasParsed);
    //console.log(turnoHoraFinal)


    return turnoHora >= new Date(Date.now() + 3600000) && turnoHora >= inicio && turnoHoraFinal <= fin;

};

// Edad mascota rango permitido
export const validarEdadMascota = (edad) => {
    const edadParsed = parseInt(edad, 10);

        const isValid = Number.isInteger(edadParsed) && edadParsed >= 0 && edadParsed <= 40;



    return isValid;
};
