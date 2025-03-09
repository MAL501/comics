const express = require("express");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express();
const port = 3000;

require('dotenv').config();

mongoose.connect(process.env.CADENA)
  .then(() => console.log('Connected to MongoDB!'));

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());
app.use(express.static('public'));
app.use('/fotos', express.static('uploads'));
app.set('view engine', 'ejs');
app.set('views', './views');

// Importar el modelo de cómic
const modeloComic = require('./models/comic');
const User = require("./models/User");

// Ruta para renderizar la vista de actualización de un cómic
app.get('/update_comic', (req, res) => {
  const id = req.query.id;
  modeloComic.buscaPorId(id)
    .then(comic => res.render('actualiza', { comic }))
    .catch(err => res.status(500).send("Error al buscar el cómic"));
});

// Ruta para actualizar un cómic
app.post('/update_comic', (req, res) => {
  const { id, titulo, autor, artista, precio } = req.body;
  modeloComic.buscaPorId(id)
    .then(comic => {
      if (comic) {
        comic.titulo = titulo;
        comic.autor = autor;
        comic.artista = artista;
        comic.precio = precio;
        comic.save()
          .then(comic => res.redirect('/'))
          .catch(err => res.status(500).send("Error al guardar el cómic"));
      } else {
        res.status(404).send('Cómic no encontrado');
      }
    });
});

// Ruta para subir archivos
app.post('/subir', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se ha subido ningún archivo' });
  }
  res.json({ message: 'Archivo subido correctamente', file: req.file });
});

// Ruta para obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(error => res.status(500).json({ mensaje: error }));
});

// Ruta para obtener un usuario por ID
app.get('/usuario/:id', (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then(user => res.render('usuario', { user }))
    .catch(error => res.status(500).json({ mensaje: error }));
});

// Ruta para registrar un usuario
app.post('/registro', upload.single('foto'), (req, res) => {
  const { name, email, password } = req.body;

  // Encriptar contraseña
  bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
      // Crear usuario
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        foto: req.file.filename
      });

      // Guardar usuario
      return newUser.save();
    })
    .then(() => {
      res.json({ message: 'Usuario registrado correctamente' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error al registrar usuario' });
    });
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Buscar usuario
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }

      // Comparar contraseñas
      return bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
          }

          res.json({ message: 'Usuario autenticado correctamente' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    });
});

// Obtener todos los cómics
app.get("/comics", (req, res) => {
  modeloComic.buscaTodos()
    .then(comics => res.status(200).json(comics))
    .catch(err => res.status(500).send("Error al obtener los cómics"));
});

// Obtener un cómic por ID
app.get("/comics/:id", (req, res) => {
  const comicId = req.params.id;
  modeloComic.buscaPorId(comicId)
    .then(comic => res.status(200).json(comic))
    .catch(err => res.status(500).send("Error al obtener el cómic"));
});

// Crear un nuevo cómic
app.post("/comics", (req, res) => {
  const { titulo, autor, artista, precio } = req.body;
  modeloComic.creaNuevoComic(titulo, autor, artista, precio)
    .then(comic => res.status(200).json(comic))
    .catch(err => res.status(500).send("Error al crear el cómic"));
});

// Actualizar un cómic existente
app.put("/comics/:id", (req, res) => {
  const comicId = req.params.id;
  const comicData = req.body;
  modeloComic.actualizaComic(comicId, comicData)
    .then(comicActualizado => res.status(200).json(comicActualizado))
    .catch(err => res.status(500).send("Error al actualizar el cómic"));
});

// Eliminar un cómic
app.delete("/comics/:id", (req, res) => {
  const comicId = req.params.id;
  modeloComic.borraComic(comicId)
    .then(comic => res.status(200).json(comic))
    .catch(err => res.status(500).send("Error al eliminar el cómic"));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});