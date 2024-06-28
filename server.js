const express = require('express');
const path = require('path');

const app = express();

// Servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Ruta para el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running on port http://localhost:3000/');
});
