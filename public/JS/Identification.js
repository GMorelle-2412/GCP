const Inscription = {
    Bouton_Page_Inscription(bouton_page_inscription) {
        bouton_page_inscription.addEventListener("click", () => {

            Inscription.Generation_Inscription();

        });
    },

    Generation_Inscription() {
        if (verification_page == 1) return;

        verification_page = 1;

        //Arrière-plan
        const overlay_inscription = document.getElementById("overlay_inscription");

        Object.assign(overlay_inscription.style, {
            position: "fixed",
            inset: "0",
            backdropFilter: "blur(8px)",
            background: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "999"
        });

        //Zone inscription
        const inscription = document.getElementById("inscription");

        inscription.innerHTML = "";

        //Nom
        const text_nom_inscription = document.createElement("p");
        text_nom_inscription.textContent = "Nom";
        inscription.appendChild(text_nom_inscription);

        const input_nom_inscription = document.createElement("input");
        input_nom_inscription.type = "text";
        input_nom_inscription.id = "input_nom_inscription";
        inscription.appendChild(input_nom_inscription);

        //Mot_de_passe
        const text_mot_de_passe_inscription = document.createElement("p");
        text_mot_de_passe_inscription.textContent = "mot de passe";
        inscription.appendChild(text_mot_de_passe_inscription);

        const input_mot_de_passe_inscription = document.createElement("input");
        input_mot_de_passe_inscription.type = "text";
        input_mot_de_passe_inscription.id = "input_mot_de_passe_inscription";
        inscription.appendChild(input_mot_de_passe_inscription);

        //Bouton
        const bouton_validation_inscription = document.createElement("button");
        bouton_validation_inscription.textContent = "Inscription";
        inscription.appendChild(bouton_validation_inscription);

        const bouton_annulation_inscription = document.createElement("button");
        bouton_annulation_inscription.textContent = "Annulation";
        inscription.appendChild(bouton_annulation_inscription);

        //BDD
        Inscription.Bouton_Inscription(bouton_validation_inscription);

        //Annulation
        Annulation(bouton_annulation_inscription, overlay_inscription);
    },

    Bouton_Inscription(bouton_validation_inscription) {
        bouton_validation_inscription.addEventListener("click", async () => {
            const nom = document.getElementById("input_nom_inscription").value;
            const mot_de_passe = document.getElementById("input_mot_de_passe_inscription").value;

            await Inscription.Fetch_Post_Inscription(nom, mot_de_passe);
            Connection.Fetch_Get_Connection(nom, mot_de_passe);
        });
    },

    async Fetch_Post_Inscription(nom, mot_de_passe) {
        const response = await fetch("/Inscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom, mot_de_passe })
        });

        const result = await response.json();

        document.getElementById("overlay_inscription").style.display = "none";
        verification_page = 0;

        return result;
    },
};

const Connection = {
    Bouton_Page_Connection(bouton_page_connection) {

        bouton_page_connection.addEventListener("click", () => {

            Connection.Generation_Connection();

        });
    },

    Generation_Connection() {

        if (verification_page == 1) return;

        verification_page = 1;

        /* Arrière-plan */
        const overlay_connection = document.getElementById("overlay_connection");

        Object.assign(overlay_connection.style, {
            position: "fixed",
            inset: "0",
            backdropFilter: "blur(8px)",
            background: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "999"
        });

        const connection = document.getElementById("connection");
        connection.innerHTML = "";

        //Nom
        const text_nom_connection = document.createElement("p");
        text_nom_connection.textContent = "Nom";
        connection.appendChild(text_nom_connection);

        const input_nom_connection = document.createElement("input");
        input_nom_connection.type = "text";
        input_nom_connection.id = "input_nom_connection";
        connection.appendChild(input_nom_connection);

        //Mot de passe
        const text_mot_de_passe_connection = document.createElement("p");
        text_mot_de_passe_connection.textContent = "Mot de passe";
        connection.appendChild(text_mot_de_passe_connection);

        const input_mot_de_passe_connection = document.createElement("input");
        input_mot_de_passe_connection.type = "password"; // ✔ correction importante
        input_mot_de_passe_connection.id = "input_mot_de_passe_connection";
        connection.appendChild(input_mot_de_passe_connection);

        //Bouton validation
        const bouton_validation_connection = document.createElement("button");
        bouton_validation_connection.textContent = "Connexion";
        connection.appendChild(bouton_validation_connection);

        //Bouton annulation
        const bouton_annulation_connection = document.createElement("button");
        bouton_annulation_connection.textContent = "Annulation";
        connection.appendChild(bouton_annulation_connection);

        Connection.Bouton_Connection(bouton_validation_connection);

        Annulation(bouton_annulation_connection, overlay_connection);
    },

    Bouton_Connection(bouton_validation_connection) {

        bouton_validation_connection.addEventListener("click", () => {
            const nom_connexion = document.getElementById("input_nom_connection").value;
            const mot_de_passe_connexion = document.getElementById("input_mot_de_passe_connection").value;

            Connection.Fetch_Get_Connection(nom_connexion, mot_de_passe_connexion);
        });
    },

    Fetch_Get_Connection(nom, mot_de_passe) {
        fetch("/connection?nom=" + nom + "&mot_de_passe=" + mot_de_passe, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(data => {

                console.log(data);

                if (data.length > 0) {
                    overlay_connection.style.display = "none";
                    verification_page = 0;
                    localStorage.setItem("id_user", data[0].id);
                    location.reload();

                } else {
                    const text_connection_erreur = document.createElement("p");
                    text_connection_erreur.textContent = "Nom ou mot de passe incorrect";
                    text_connection_erreur.className = "text_erreur";
                    connection.appendChild(text_connection_erreur);
                }

            })
            .catch(error => {
                console.log(error);
            });
    },

    Fetch_Get_Auto_Connection(id_user, nom_user) {
        fetch("/connection?id_user=" + id_user, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(data => {

                if (data.length > 0) {

                    const recup_nom = data[0].nom;

                    console.log("Nom récupéré :", recup_nom);

                    nom_user.textContent = recup_nom;

                    document.getElementById("text_par_defaut").textContent = " ";


                } else {
                    nom_user.textContent = "Utilisateur inconnu";
                }
            })
            .catch(error => {
                console.log(error);
                nom_user.textContent = "Erreur";
            });
    },
};

const Déconnection = {
    Generation_Déconection() {

        const remplacement = document.getElementById("CetI");

        const bouton_déconection = document.createElement("button");
        bouton_déconection.id = "bouton_déconection";
        bouton_déconection.textContent = "Déconnexion";

        if (localStorage.getItem("id_user") > 0) {
            remplacement.appendChild(bouton_déconection);
        }

        Déconnection.Bouton_Déconection(bouton_déconection);
    },

    Bouton_Déconection(bouton_déconection) {

        bouton_déconection.addEventListener("click", () => {
            localStorage.removeItem("id_user");
            location.reload();
        });
    },
};

const Modification_User = {
    Generation_Bouton_Modif_user() {
        const zone_bouton = document.getElementById("CetI");

        const bouton_modif_user = document.createElement("button");
        bouton_modif_user.id = "bouton_modif_user";
        bouton_modif_user.textContent = "bouton_modif_user";

        zone_bouton.appendChild(bouton_modif_user);

        Modification_User.bouton_modif_user(bouton_modif_user);
    },

    bouton_modif_user(bouton_modif_user) {
        bouton_modif_user.addEventListener("click", () => {
            Modification_User.Generation_Modif_user();
        });
    },

    Generation_Modif_user(){
        if (verification_page == 1) return;

        verification_page = 1;

        /* Arrière-plan */
        const overlay_modif_user = document.getElementById("overlay_modif_user");

        Object.assign(overlay_modif_user.style, {
            position: "fixed",
            inset: "0",
            backdropFilter: "blur(8px)",
            background: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "999"
        });

        const modif_user = document.createElement("modif_user");
        modif_user.id = "modif_user";
        overlay_modif_user.appendChild(modif_user);

        modif_user.innerHTML = "";

        //Nom
        const text_nom_modif_user = document.createElement("p");
        text_nom_modif_user.textContent = "Nom";
        modif_user.appendChild(text_nom_modif_user);

        const input_nom_modif_user = document.createElement("input");
        input_nom_modif_user.type = "text";
        input_nom_modif_user.id = "input_nom_modif_user";
        modif_user.appendChild(input_nom_modif_user);

        //Mot de passe
        const text_mot_de_passe_modif_user = document.createElement("p");
        text_mot_de_passe_modif_user.textContent = "Mot de passe";
        modif_user.appendChild(text_mot_de_passe_modif_user);

        const input_mot_de_passe_modif_user = document.createElement("input");
        input_mot_de_passe_modif_user.type = "password"; // ✔ correction importante
        input_mot_de_passe_modif_user.id = "input_mot_de_passe_modif_user";
        modif_user.appendChild(input_mot_de_passe_modif_user);

        //Bouton put
        const bouton_put_modif_user = document.createElement("button");
        bouton_put_modif_user.textContent = "Modifier";
        modif_user.appendChild(bouton_put_modif_user);

        //Bouton annulation
        const bouton_annulation_modif_user = document.createElement("button");
        bouton_annulation_modif_user.textContent = "Annulation";
        modif_user.appendChild(bouton_annulation_modif_user);

        //Connection.Bouton_Connection(bouton_validation_connection);

        //Annulation(bouton_annulation_connection, overlay_connection);
    }
};