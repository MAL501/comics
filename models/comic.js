// Using Node.js `require()`
const mongoose = require('mongoose');

// Definimos el esquema del documento
const comicSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  artista: { type: String, required: true },
  precio: { type: Number, required: true },
});

// Creamos el modelo
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

// Busca todos los cómics
const buscaTodos = () => {
  return Comic.find()
    .then((comics) => {
      if (comics.length > 0) {
        return comics;
      } else {
        console.log('No se encontró ningún registro');
        return null;
      }
    })
    .catch((err) => {
      console.error('Error al obtener los cómics:', err);
      throw err;
    });
};

// Busca un cómic por su ID
const buscaPorId = (id) => {
  return Comic.findById(id)
    .then((comic) => {
      if (comic) {
        return comic;
      } else {
        console.log('No se encontró ningún registro con el id ' + id);
        return null;
      }
    })
    .catch((err) => {
      console.error('Error al obtener el cómic con id ' + id, err);
      throw err;
    });
};

// Busca cómics con precio mayor a un valor dado
const buscaPrecioMayor = (precioMinimo) => {
  return Comic.find({ precio: { $gt: precioMinimo } })
    .then((comics) => {
      if (comics.length > 0) {
        console.log('Cómics encontrados con precio mayor a ' + precioMinimo, comics);
      } else {
        console.log('No se encontró ningún registro');
      }
    })
    .catch((err) => console.error('Error al obtener los cómics:', err));
};

// Crea un nuevo cómic
const creaNuevoComic = (titulo, autor, artista, precio) => {
  const nuevoComic = new Comic({
    titulo,
    autor,
    artista,
    precio,
  });

  return nuevoComic
    .save()
    .then((comic) => {
      console.log('Cómic guardado:', comic);
      return comic;
    })
    .catch((err) => {
      console.error('Error al guardar el cómic:', err);
      throw err;
    });
};

// Crea un nuevo cómic usando un objeto general
const creaNuevoComicGeneral = (comic) => {
  const nuevoComic = new Comic(comic);

  return nuevoComic
    .save()
    .then((comic) => {
      console.log('Cómic guardado:', comic);
      return comic;
    })
    .catch((err) => {
      console.error('Error al guardar el cómic:', err);
      throw err;
    });
};

// Actualiza el precio de un cómic
const actualizaPrecio = (idComic, nuevoPrecio) => {
  return Comic.findByIdAndUpdate(idComic, { precio: nuevoPrecio }, { new: true })
    .then((comicActualizado) => {
      if (comicActualizado) {
        console.log('Cómic actualizado:', comicActualizado);
        return comicActualizado;
      } else {
        console.log('No se encontró ningún cómic con ese ID.');
        return null;
      }
    })
    .catch((err) => console.error('Error al actualizar el cómic:', err));
};

// Actualiza un cómic completo
const actualizaComic = (idComic, comicActualizar) => {
  return Comic.findByIdAndUpdate(idComic, comicActualizar, { new: true })
    .then((comicActualizado) => {
      if (comicActualizado) {
        console.log('Cómic actualizado:', comicActualizado);
        return comicActualizado;
      } else {
        console.log('No se encontró ningún cómic con ese ID.');
        return null;
      }
    })
    .catch((err) => console.error('Error al actualizar el cómic:', err));
};

// Borra un cómic
const borraComic = (idComicParaBorrar) => {
  return Comic.findByIdAndDelete(idComicParaBorrar)
    .then((comicEliminado) => {
      if (comicEliminado) {
        console.log('Cómic eliminado:', comicEliminado);
        return comicEliminado;
      } else {
        console.log('No se encontró ningún cómic con ese ID.');
        return null;
      }
    })
    .catch((err) => {
      console.error('Error al eliminar el cómic:', err);
      throw err;
    });
};

// Exportamos las funciones y el modelo
module.exports = {
  buscaPrimero,
  buscaTodos,
  buscaPorId,
  buscaPrecioMayor,
  creaNuevoComic,
  creaNuevoComicGeneral,
  actualizaPrecio,
  actualizaComic,
  borraComic,
  Comic,
};