/* Module */
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: __dirname + '/.env' });
const ip = require('ip');

const app = express();

/* Middleware */
app.use(express.static('public'));
app.use(express.json());

/* Port */
const port = process.env.PORT || 3000;

/* Connexion BDD MySQL */
let db;
(async () => {
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        console.log("Connecté à MySQL");
    } catch (err) {
        console.log("Erreur connexion MySQL :", err);
        process.exit(1); // 1 = "sortie avec erreur"
    }
})();

/* Routes */
//Principale
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

///!\ rows = le résultat de ta requête (un tableau d'objets)
///!\ rows = ce que MySQL te renvoie (il est possible de le nommer autrement)

/*--------------------GET--------------------*/
//Connexion
app.get("/connection", async (req, res) => {
    const { nom, mot_de_passe, id_user } = req.query;

    if ((nom && mot_de_passe) && id_user) {
        return res.status(400).json({ error: "Utilisez soit id_user, soit nom + mot_de_passe" });
    }

    try {
        if (nom && mot_de_passe) {
            const [rows] = await db.query(
                "SELECT id, nom FROM users WHERE nom = ? AND mot_de_passe = ?",
                [nom, mot_de_passe]
            );
            return res.json(rows);
        }

        if (id_user) {
            const [rows] = await db.query(
                "SELECT id, nom FROM users WHERE id = ?",
                [id_user]
            );
            return res.json(rows);
        }

        return res.status(400).json({ error: "Fournissez nom + mot_de_passe OU id_user" });

    } catch (err) {
        console.error(err);
        return res.status(500).send("Erreur serveur");
    }
});

//Récupération des listes d'un utilisateur
app.get('/Recup_Liste', async (req, res) => {
    const { id_user } = req.query;
    try {
        const [rows] = await db.query("SELECT * FROM liste WHERE id_user = ?", [id_user]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

//Récupération des contenus
app.get("/get_contenu_liste", async (req, res) => {
    const { id_element, id_liste } = req.query;

    if (id_element && id_liste) {
        return res.status(400).json({ error: "Fournissez soit id_element soit id_liste, pas les deux" });
    }
    if (!id_element && !id_liste) {
        return res.status(400).json({ error: "Fournissez id_element ou id_liste" });
    }

    try {
        if (id_element) {
            const [rows] = await db.query("SELECT * FROM contenu_liste WHERE id_element = ?", [id_element]);
            return res.json(rows);
        }
        if (id_liste) {
            const [rows] = await db.query("SELECT * FROM contenu_liste WHERE id_liste = ?", [id_liste]);
            return res.json(rows);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

//Récupération d'un élément
app.get('/Recup_Element', async (req, res) => {
    const { id_element } = req.query;
    try {
        const [rows] = await db.query("SELECT * FROM element WHERE id = ?", [id_element]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

/*--------------------POST--------------------*/
//Inscription
app.post("/Inscription", async (req, res) => {
    const { nom, mot_de_passe } = req.body;
    try {
        await db.query("INSERT INTO users (nom, mot_de_passe) VALUES (?, ?)", [nom, mot_de_passe]);
        res.json({ message: "Utilisateur ajouté !" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
});

//Liste
app.post("/Liste", async (req, res) => {
    const { contenu, validation, id_user } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO liste (contenu, validation, id_user) VALUES (?, ?, ?)",
            [contenu, validation, id_user]
        );
        res.json({ insertId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
});

//Elément
app.post("/Element", async (req, res) => {
    const { nom, description } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO element (nom, description) VALUES (?, ?)",
            [nom, description]
        );
        res.json({ insertId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
});

//Contenu_liste
app.post("/Contenu_liste", async (req, res) => {
    const { id_element, id_liste } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO contenu_liste (id_element, id_liste) VALUES (?, ?)",
            [id_element, id_liste]
        );
        res.json(result);
    } catch (err) {
        console.error("ERREUR SQL :", err);
        res.status(500).json({ error: err });
    }
});

/*--------------------PUT--------------------*/
//Modifier un élément
app.put('/Modif_element', async (req, res) => {
    const { nom, description, id } = req.body;
    try {
        await db.query("UPDATE element SET nom = ?, description = ? WHERE id = ?", [nom, description, id]);
        res.json({ message: "Projet mis à jour avec succès" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

//Modifier une liste
app.put("/update_liste", async (req, res) => {
    const { id, contenu, validation } = req.body;

    if (!id || validation === undefined) {
        return res.status(400).json({ error: "L'id et la validation sont obligatoires !" });
    }

    try {
        if (!contenu) {
            await db.query("UPDATE liste SET validation = ? WHERE id = ?", [validation, id]);
        } else {
            await db.query("UPDATE liste SET contenu = ?, validation = ? WHERE id = ?", [contenu, validation, id]);
        }
        res.json({ message: "Liste mise à jour avec succès" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

/*--------------------DELETE--------------------*/
app.delete("/delete_contenu_liste", async (req, res) => {
    const { id_liste } = req.body;
    try {
        const [result] = await db.query("DELETE FROM contenu_liste WHERE id_liste = ?", [id_liste]);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

app.delete("/delete_liste", async (req, res) => {
    const { id_liste } = req.body;
    try {
        const [result] = await db.query("DELETE FROM liste WHERE id = ?", [id_liste]);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

/* Lancement */
app.listen(port, () => {
    const Ip = ip.address();
    console.log(`Serveur lancé sur http://${Ip}:${port}`);
});