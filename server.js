/* Module */
const express = require('express');
const mysql = require('mysql2');
require('dotenv').config(__dirname, '.env');
const ip = require('ip')

const app = express();

/* Middleware */
app.use(express.static('public'));
app.use(express.json());

/* Port */
const port = process.env.PORT || 3000;

/* Connexion BDD MySQL */
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

/* Test connexion */
db.connect((err) => {
    if (err) {
        console.log("Erreur connexion MySQL :", err);
    } else {
        console.log("Connecté à MySQL");
    }
});

/* Routes */
//Principale
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

//Inscription
app.post("/Inscription", (req, res) => {
    const nom = req.body.nom;
    const mot_de_passe = req.body.mot_de_passe;

    const sql = "INSERT INTO users (nom, mot_de_passe) VALUES(?, ?)";

    db.query(sql, [nom, mot_de_passe], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ message: "Étudiant ajouté !" });
    });
});

//Connection
app.get('/connection', (req, res) => {

    // Récupération des paramètres GET
    const nom = req.query.input_nom_connection;
    const mot_de_passe = req.query.input_mot_de_passe_connection;

    // Vérification si les champs existent
    if (!nom || !mot_de_passe) {
        return res.send('Champs manquants');
    }

    // Requête SQL sécurisée
    const sql = `
        SELECT * 
        FROM users 
        WHERE nom = ? AND mot_de_passe = ?
    `;

    connection.query(sql, [nom, mot_de_passe], (err, results) => {

        if (err) {
            console.log(err);
            return res.send('Erreur SQL');
        }

        // Vérifie si un utilisateur existe
        if (results.length > 0) {
            res.send('Connexion réussie');
        } else {
            res.send('Nom ou mot de passe incorrect');
        }
    });
});

/* Lancement */
app.listen(port, () => {
    let Ip = ip.address();
    console.log(`Serveur lancé sur http://${Ip}:${port}`);
});