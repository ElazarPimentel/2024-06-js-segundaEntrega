// Nombre del archivo: js/localStorage.js
// Autor: Alessio Aguirre Pimentel
// Versión: 47

export const gestionarLocalStorage = (accion, clave, valor = null) => { //Una sola función para todo con parametro accion
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
            case "borrarTodo": { //ver DOM a veces no funciona, raro que sea errático
                localStorage.clear();
                break;
            }
            default: {
                throw new Error("Acción no reconocida");//Versiones futuras manejo complejo
            }
        }
    } catch (error) {
        console.error(`Error al ${accion} en local storage`, error);//Versiones futuras manejo complejo
        return null;
    }
};
