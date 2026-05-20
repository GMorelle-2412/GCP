/*----------Variables----------*/

let verification_page = 0;

/*----------Fonctions----------*/

/*Bouton d'inscription*/
function Bouton_Inscription() {
    if (verification_page == 1) return;

    verification_page = 1;

    /*Arrière-plan*/
    //Floutage de l'arrière-plan
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

    const inscription = document.getElementById("inscription");

    inscription.innerHTML = "";

    // Nom
    const text_nom_inscription = document.createElement("p");
    text_nom_inscription.textContent = "Nom";
    inscription.appendChild(text_nom_inscription);

    const input_nom_inscription = document.createElement("input");
    input_nom_inscription.type = "text";
    input_nom_inscription.id = "input_nom_inscription";
    inscription.appendChild(input_nom_inscription);

    // mot_de_passe
    const text_mot_de_passe_inscription = document.createElement("p");
    text_mot_de_passe_inscription.textContent = "mot de passe";
    inscription.appendChild(text_mot_de_passe_inscription);

    const input_mot_de_passe_inscription = document.createElement("input");
    input_mot_de_passe_inscription.type = "text";
    input_mot_de_passe_inscription.id = "input_mot_de_passe_inscription";
    inscription.appendChild(input_mot_de_passe_inscription);

    // Bouton
    const bouton_validation_inscription = document.createElement("button");
    bouton_validation_inscription.textContent = "Inscription";
    inscription.appendChild(bouton_validation_inscription);

    const bouton_annulation_inscription = document.createElement("button");
    bouton_annulation_inscription.textContent = "Annulation";
    inscription.appendChild(bouton_annulation_inscription);

    //BDD
    bouton_validation_inscription.addEventListener("click", () => {

        const nom = document.getElementById("input_nom_inscription").value;

        const mot_de_passe = document.getElementById("input_mot_de_passe_inscription").value;

        fetch("/Inscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nom: nom,
                mot_de_passe: mot_de_passe,
            })
        })
            .then(response => response.json())

            .then(result => {
                overlay_inscription.style.display = "none";
                verification_page = 0;
            })

        //Auto connection après inscription
        Connection(nom, mot_de_passe);
    });

    //Annulation
    bouton_annulation_inscription.addEventListener("click", () => {
        overlay_inscription.style.display = "none";
        verification_page = 0;
    });
}

/*Bouton de connection*/
function Bouton_Connection() {
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

    // NOM
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

    bouton_validation_connection.addEventListener("click", () => {

        const nom_connexion = document.getElementById("input_nom_connection").value;
        const mot_de_passe_connexion = document.getElementById("input_mot_de_passe_connection").value;

        Connection(nom_connexion, mot_de_passe_connexion);

    });

    /* ANNULATION */
    bouton_annulation_connection.addEventListener("click", () => {
        overlay_connection.style.display = "none";
        verification_page = 0;
    });
}

/*Bouton de création d'un élément*/
function Bouton_Create_Element() {

    if (verification_page == 1) return;

    verification_page = 1;

    const overlay_Create_element = document.getElementById("overlay_Create_element");

    Object.assign(overlay_Create_element.style, {
        position: "fixed",
        inset: "0",
        backdropFilter: "blur(8px)",
        background: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "999"
    });

    const Create_element = document.getElementById("create_element");
    Create_element.innerHTML = "";

    //Nom
    const text_nom_Create_element = document.createElement("p");
    text_nom_Create_element.textContent = "Nom de l'élément";
    Create_element.appendChild(text_nom_Create_element);

    const input_nom_Create_element = document.createElement("input");
    input_nom_Create_element.type = "text";
    input_nom_Create_element.id = "input_nom_Create_element";
    Create_element.appendChild(input_nom_Create_element);

    //Description
    const text_description_Create_element = document.createElement("p");
    text_description_Create_element.textContent = "Description de l'élément";
    Create_element.appendChild(text_description_Create_element);

    const textarea_description_Create_element = document.createElement("textarea");
    textarea_description_Create_element.id = "textarea_description_Create_element";
    Create_element.appendChild(textarea_description_Create_element);

    //Bouton créer une partie d'une list
    const bouton_creer_partie_list = document.createElement("button");
    bouton_creer_partie_list.textContent = "Créer une partie";
    Create_element.appendChild(bouton_creer_partie_list);

    //Zone de création d'une partie d'une list
    const zone_creer_partie_list = document.createElement("div");
    zone_creer_partie_list.id = "zone_creer_partie_list";
    Create_element.appendChild(zone_creer_partie_list);

    //Bouton validation
    const bouton_validation_Create_element = document.createElement("button");
    bouton_validation_Create_element.textContent = "Créer";
    Create_element.appendChild(bouton_validation_Create_element);

    // Bouton annulation
    const bouton_annulation_Create_element = document.createElement("button");
    bouton_annulation_Create_element.textContent = "Annulation";
    Create_element.appendChild(bouton_annulation_Create_element);

    /*annulation*/
    bouton_annulation_Create_element.addEventListener("click", () => {
        overlay_Create_element.style.display = "none";
        verification_page = 0;
    });

    /*validation*/
    bouton_validation_Create_element.addEventListener("click", () => {

        const contenus = document.getElementsByClassName("text_partie_list");
        const validations = document.getElementsByClassName("partie_list");
        const id_user = localStorage.getItem("id_user");

        // Créer l’élément
        const nom = document.getElementById("input_nom_Create_element").value;
        const description = document.getElementById("textarea_description_Create_element").value;

        fetch("/Element", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nom: nom,
                description: description
            })
        })
            .then(res => res.json())
            .then(data => {

                const id_element = data.insertId;
                console.log("Élément créé :", id_element);

                //Créer toutes les listes et les lier à l’élément
                for (let i = 0; i < contenus.length; i++) {

                    fetch("/Liste", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contenu: contenus[i].value,
                            validation: validations[i].checked,
                            id_user: id_user
                        })
                    })
                        .then(res => res.json())
                        .then(data => {

                            const id_liste = data.insertId;
                            console.log("Liste créée :", id_liste);

                            // Lier l’élément à la liste
                            fetch("/Contenu_liste", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    id_element: id_element,
                                    id_liste: id_liste
                                })
                            });
                        });
                }

                // FIN
                overlay_Create_element.style.display = "none";
                overlay_inscription.style.display = "none";
                verification_page = 0;
            });

    });

    /*Créer une partie d'une list*/
    bouton_creer_partie_list.addEventListener("click", () => {
        const liste = document.createElement("div");
        liste.className = "liste";
        zone_creer_partie_list.appendChild(liste);

        const partie_list = document.createElement("input");
        partie_list.className = "partie_list";
        partie_list.type = "checkbox";
        liste.appendChild(partie_list);

        const text_partie_list = document.createElement("input");
        text_partie_list.className = "text_partie_list";
        text_partie_list.type = "text";
        text_partie_list.placeholder = "Nom de la partie";
        liste.appendChild(text_partie_list);
    });

}

/*Bouton de déconnection*/
function Bouton_Déconection() {

    const remplacement = document.getElementById("CetI");

    const bouton_déconection = document.createElement("button");
    bouton_déconection.id = bouton_déconection;
    bouton_déconection.textContent = "Déconection";

    if (localStorage.getItem("id_user") > 0) {

        remplacement.textContent = "";
        remplacement.appendChild(bouton_déconection);
    }

    bouton_déconection.addEventListener("click", () => {
        localStorage.removeItem("id_user");
        location.reload();
    });
}


/*Connection*/
function Connection(nom, mot_de_passe) {

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
                localStorage.setItem("id_user", data[0].id); // Stockage de l'id de l'utilisateur dans le localStorage
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

}

/*Auto_connection*/
function Auto_connection() {

    const nom_user = document.createElement("p");
    nom_user.id = "nom_user";
    nom_user.textContent = "Chargement...";
    document.getElementById("user_name").appendChild(nom_user);

    const id_user = localStorage.getItem("id_user");

    if (!id_user) {
        nom_user.textContent = "Utilisateur non connecté";

        const bouton_connection = document.createElement("button");
        bouton_connection.id = "Bouton_Connection";
        bouton_connection.textContent = "Connection";
        bouton_connection.onclick = Bouton_Connection;
        document.getElementById("CetI").appendChild(bouton_connection);

        const bouton_inscription = document.createElement("button");
        bouton_inscription.id = "Bouton_Inscription";
        bouton_inscription.textContent = "Inscription";
        bouton_inscription.onclick = Bouton_Inscription;
        document.getElementById("CetI").appendChild(bouton_inscription);

        return;

    } else {
        Bouton_Déconection();
    }

    fetch("/auto_connection?id_user=" + id_user, {
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

    fetch("/Contenue?id_user=" + id_user, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
        .then(res => res.json())
        .then(data => {

            console.log("Éléments récupérés :", data);

            // Création du conteneur principal
            const div_contenue = document.createElement("div");
            div_contenue.id = "contenue";
            document.getElementById("contenu_page").appendChild(div_contenue);

            // Si aucune liste
            if (data.length === 0) {
                div_contenue.textContent = "Aucune liste trouvée";
                return;
            }

            // Parcours des listes
            // Regrouper par élément
            const elementsMap = {};

            data.forEach(item => {

                if (
                    !item.liste ||
                    !item.contenu_liste ||
                    item.contenu_liste.length === 0 ||
                    !item.elements ||
                    item.elements.length === 0
                ) {
                    return;
                }

                const element = item.elements[0];
                const id = element.id;

                if (!elementsMap[id]) {
                    elementsMap[id] = {
                        nom: element.nom,
                        description: element.description,
                        parties: []
                    };
                }

                item.contenu_liste.forEach(partie => {
                    elementsMap[id].parties.push({
                        nom: partie.nom || "Partie sans nom",
                        validation: partie.validation
                    });
                });
            });

            // Maintenant afficher chaque élément unique
            Object.values(elementsMap).forEach(el => {

                const div_element = document.createElement("div");
                div_element.className = "element";
                div_contenue.appendChild(div_element);

                const titre_element = document.createElement("h2");
                titre_element.textContent = el.nom;
                div_element.appendChild(titre_element);

                const description_element = document.createElement("p");
                description_element.textContent = el.description;
                div_element.appendChild(description_element);

                const zone_parties = document.createElement("div");
                zone_parties.className = "zone_parties";
                div_element.appendChild(zone_parties);

                const titre_parties = document.createElement("h3");
                titre_parties.textContent = "Liste des parties :";
                zone_parties.appendChild(titre_parties);

                const conteneur_parties = document.createElement("div");
                conteneur_parties.className = "conteneur_parties";
                zone_parties.appendChild(conteneur_parties);

                el.parties.forEach(partie => {

                    const bloc_partie = document.createElement("div");
                    bloc_partie.className = "bloc_partie";
                    conteneur_parties.appendChild(bloc_partie);

                    const check = document.createElement("input");
                    check.type = "checkbox";
                    check.className = "partie_list";
                    check.checked = partie.validation === "1";
                    bloc_partie.appendChild(check);

                    const texte = document.createElement("span");
                    texte.className = "text_partie_list";
                    texte.textContent = partie.nom;
                    bloc_partie.appendChild(texte);
                });
            });

        })
        .catch(error => {
            console.log(error);
        });


}

/*----------Main----------*/
Auto_connection();
