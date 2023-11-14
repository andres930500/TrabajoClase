// Exporta las funciones readFile y writeFile como parte del módulo
module.exports = {
    readFile,
    writeFile
};

// Requiere el módulo 'fs' (sistema de archivos) y el objeto 'error' del módulo 'console'
const { error } = require('console');
const fs = require('fs');

// Función para leer un archivo JSON y devolver sus datos
function readFile(name){
    try {
        // Lee el contenido del archivo de manera sincrónica en formato utf8
        let data = fs.readFileSync(name, 'utf8');
        // Intenta parsear el contenido como JSON
        data = JSON.parse(data);
        // Imprime los datos en la consola (esto podría ser eliminado en producción)
        console.log(data);
        // Retorna los datos
        return data;
    } catch {
        // Si ocurre un error (por ejemplo, si el archivo no existe o no es válido JSON), devuelve un arreglo vacío
        return [];
    }
}




function writeFile(name, data){
    try {
        // Escribe los datos en el archivo en formato JSON
        fs.writeFileSync(name, JSON.stringify(data));
    } catch (error) { // Debes capturar el error y asignarlo a una variable (por ejemplo, 'error')
        // Si ocurre un error al escribir, muestra un mensaje de error en la consola
        console.error(error);
    }
}
