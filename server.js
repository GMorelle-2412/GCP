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

    const nom = req.query.nom;
    const mot_de_passe = req.query.mot_de_passe;

    const sql = "SELECT id, nom FROM users WHERE nom = ? AND mot_de_passe = ?";

    db.query(sql, [nom, mot_de_passe], (err, result) => {

        if (err) {
            console.log(err);
            res.status(500).send('Erreur serveur');
        } else {
            res.json(result);
        }

    });

});

//auto connection
app.get('/auto_connection', (req, res) => {

    const id_user = req.query.id_user;

    const sql = "SELECT id, nom FROM users WHERE id = ?";

    db.query(sql, [id_user], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Erreur serveur');
        } else {
            res.json(result);
        }
    });
});

//liste
app.post("/Liste", (req, res) => {
    const { contenu, validation, id_user } = req.body;

    const sql = "INSERT INTO liste (contenu, validation, id_user) VALUES (?, ?, ?)";

    db.query(sql, [contenu, validation, id_user], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ insertId: result.insertId });
    });
});

//Elément
app.post("/Element", (req, res) => {
    const { nom, description, id_liste } = req.body;

    // 1. Créer l’élément
    const sqlElement = "INSERT INTO element (nom, description) VALUES (?, ?)";

    db.query(sqlElement, [nom, description], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ insertId: result.insertId });
    });
});

//Contenu_liste
app.post("/Contenu_liste", (req, res) => {
    const id_element = req.body.id_element;
    const id_liste = req.body.id_liste;

    const sql = "INSERT INTO contenu_liste (id_element, id_liste) VALUES(?, ?)";

    db.query(sql, [id_element, id_liste], (err, result) => {
        if (err) {
            console.error("ERREUR SQL :", err);
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

//Réupération des listes d’un utilisateur
app.get('/Recup_Liste', (req, res) => {

    const id_user = req.query.id_user;

    const sql = `SELECT * FROM liste WHERE id_user = ?`;

    db.query(sql, [id_user], (err, result) => {
        if (err) return res.status(500).send("Erreur serveur");
        res.json(result);
    });
});

//Réupération des contenus d’une liste par raport a l'élément
app.get("/Recup_contenu_liste", (req, res) => {

    const id_liste = req.query.id_liste;
    
    const sql = `SELECT * FROM contenu_liste WHERE id_liste = ?`;

    db.query(sql, [id_liste], (err, result) => {
        if (err) return res.status(500).send("Erreur serveur");
        res.json(result);
    });
});

//Réupération des éléments d’une liste
app.get('/Recup_Element', (req, res) => {

    const id_element = req.query.id_element;

    const sql = `SELECT * FROM element WHERE id = ?`;

    db.query(sql, [id_element], (err, result) => {
        if (err) return res.status(500).send("Erreur serveur");
        res.json(result);
    });
});

//Modification des checkbox
app.post("/Modif_checkbox", (req, res) => {
    const validation = req.body.validation;
    const id_liste = req.body.id_liste;

    const sql = "UPDATE liste SET validation = ? WHERE id = ?";

    db.query(sql, [validation, id_liste], (err, result) => {
        if (err) {
            console.error("ERREUR SQL :", err);
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});


/* Lancement */
app.listen(port, () => {
    let Ip = ip.address();
    console.log(`Serveur lancé sur http://${Ip}:${port}`);
});