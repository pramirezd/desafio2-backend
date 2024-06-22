const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware para parsear el body de las peticiones
app.use(express.json());

// Ruta para servir el archivo index.html y los archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para agregar una nueva canción
app.post('/canciones', (req, res) => {
    const newSong = req.body;

    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo' });
        }

        const repertorio = JSON.parse(data);
        repertorio.push(newSong);

        fs.writeFile('repertorio.json', JSON.stringify(repertorio, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al escribir el archivo' });
            }
            res.status(201).json(newSong);
        });
    });
});

// Ruta para obtener todas las canciones
app.get('/canciones', (req, res) => {
    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo' });
        }

        const repertorio = JSON.parse(data);
        res.json(repertorio);
    });
});

// Ruta para editar una canción
app.put('/canciones/:id', (req, res) => {
    const songId = parseInt(req.params.id);
    const { titulo, artista, tono } = req.body;
    const updatedSong = { id: songId, titulo, artista, tono };



    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo' });
        }

        let repertorio = JSON.parse(data);
        const songIndex = repertorio.findIndex(song => song.id == songId);

        if (songIndex === -1) {
            return res.status(404).json({ error: 'Canción no encontrada' });
        }

        repertorio[songIndex] = updatedSong;

        fs.writeFile('repertorio.json', JSON.stringify(repertorio, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al escribir el archivo' });
            }
            res.json(updatedSong);
        });
    });
});

// Ruta para eliminar una canción
app.delete('/canciones/:id', (req, res) => {
    const songId = req.params.id;

    fs.readFile('repertorio.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo' });
        }

        let repertorio = JSON.parse(data);
        const songIndex = repertorio.findIndex(song => song.id == songId);

        if (songIndex === -1) {
            return res.status(404).json({ error: 'Canción no encontrada' });
        }

        repertorio.splice(songIndex, 1);

        fs.writeFile('repertorio.json', JSON.stringify(repertorio, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al escribir el archivo' });
            }
            res.status(204).send();
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    console.log(`Acceso al servidor: http://localhost:${PORT}`);
});
