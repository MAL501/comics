const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mal:mal1234@almacen.1zegl.mongodb.net/?retryWrites=true&w=majority&appName=almacen')
  .then(() => console.log('Connected!'));

//definimos el esquema del documento
const comicSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  artista: { type: String, required: true },
  precio: { type: Number, required: true },
});

// Creamos el modelo de cómic
const Comic = mongoose.model('Comic', comicSchema, 'comics');

// Busca el primer cómic
const buscaPrimero = () => {
  return Comic.findOne()
    .then((comic) => {
      if (comic) {
        console.log('Primer cómic encontrado:', comic);
      } else {
        console.log('No se encontró ningún registro');
      }
    })
    .catch((err) => console.error('Error al obtener el cómic:', err));
};

// Exportamos la función y el modelo
module.exports = { buscaPrimero, Comic };