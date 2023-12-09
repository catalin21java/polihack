// Import required modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create an instance of Express app
const app = express();
const port = 3000;

// Connect to the SQLite database
const db = new sqlite3.Database('./date.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Endpoint to fetch data from the 'Rutina' table
app.get('/rutina', (req, res) => {
  db.all('SELECT Ora, Luni, Marti, Miercuri, Joi, Vineri FROM Rutina', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(rows);
  });
});
app.get('/chat', (req, res) => {
  db.all('SELECT Mesaj FROM Chat', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(rows);
  });
});
// Endpoint to add data to the 'Rutina' table
app.post('/addRutina', express.json(), (req, res) => {
  console.log('Received POST request at /addRutina'); // Check if this log appears in the server console
  const { Ora, Luni, Marti, Miercuri, Joi, Vineri } = req.body;

  if (!Ora || !Luni || !Marti || !Miercuri || !Joi || !Vineri) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const sql = 'INSERT INTO Rutina (Ora, Luni, Marti, Miercuri, Joi, Vineri) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(sql, [Ora, Luni, Marti, Miercuri, Joi, Vineri], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      Ora: Ora,
      Luni: Luni,
      Marti: Marti,
      Miercuri: Miercuri,
      Joi: Joi,
      Vineri: Vineri
    });
  });
  console.log('Completed handling POST request'); // Check if this log appears after data processing
});
// Endpoint to add data to the 'Rutina' table
app.post('/addchat', express.json(), (req, res) => {
  console.log('Received POST request at /addchat'); // Check if this log appears in the server console
  const {sent} = req.body;

  if (!sent) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const sql = 'INSERT INTO Chat (Mesaj) VALUES (?)';
  db.run(sql, [sent], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      sent: sent 
    });
  });
  console.log('Completed handling POST request'); // Check if this log appears after data processing
});
// Serve the index.html file
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
