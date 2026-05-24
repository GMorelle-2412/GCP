function Generation_Démarage() {

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
        document.getElementById("CetI").appendChild(bouton_connection);

        const bouton_inscription = document.createElement("button");
        bouton_inscription.id = "Bouton_Inscription";
        bouton_inscription.textContent = "Inscription";
        document.getElementById("CetI").appendChild(bouton_inscription);

        Bouton_Page_Connection(bouton_connection);
        Bouton_Page_Inscription(bouton_inscription);


    } else {
        Generation_Déconection();

        Fetch_Get_Auto_Connection(id_user, nom_user);

        Affichage_projets.Recup_Liste(id_user);
    }
}

function Generation_Inscription() {
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

    // Nom
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
    Bouton_Inscription(bouton_validation_inscription);

    //Annulation
    Annulation(bouton_annulation_inscription, overlay_inscription);
}

function Generation_Connection() {

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

    Bouton_Connection(bouton_validation_connection);

    Annulation(bouton_annulation_connection, overlay_connection);
}

function Generation_Déconection() {

    const remplacement = document.getElementById("CetI");

    const bouton_déconection = document.createElement("button");
    bouton_déconection.id = "bouton_déconection";
    bouton_déconection.textContent = "Déconnexion";

    if (localStorage.getItem("id_user") > 0) {
        remplacement.textContent = "";
        remplacement.appendChild(bouton_déconection);
    }

    Bouton_Déconection(bouton_déconection);
}

function Generation_Create_Element() {
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

    //Annulation
    Annulation(bouton_annulation_Create_element, overlay_Create_element);

    Bouton_Create_Element(bouton_validation_Create_element, bouton_creer_partie_list);
}

function Generation_Affichage_Projets(liste, element, contenu) {

    // Sécurité : vérifier que element[0] existe
    if (!element || !element[0]) {
        console.error("Erreur : élément vide", element);
        return;
    }

    let div_element = document.getElementById("element_" + element[0].id);

    if (!div_element) {
        div_element = document.createElement("div");
        div_element.className = "element";
        div_element.id = "element_" + element[0].id;

        const h3 = document.createElement("h3");
        h3.textContent = element[0].nom;
        div_element.appendChild(h3);

        const p = document.createElement("p");
        p.textContent = element[0].description;
        div_element.appendChild(p);

        const div_listes = document.createElement("div");
        div_listes.id = "listes_" + element[0].id;
        div_element.appendChild(div_listes);

        document.getElementById("contenu_page").appendChild(div_element);
    }

    const div_listes = document.getElementById("listes_" + element[0].id);

    const validation = document.createElement("input");
    validation.className = "partie_list";
    validation.id = "validation_" + liste.id;
    validation.checked = liste.validation;
    validation.type = "checkbox";

    Modif_Check_List(validation, element, liste, contenu);

    div_listes.appendChild(validation);

    const pListe = document.createElement("p");
    pListe.textContent = liste.contenu;
    div_listes.appendChild(pListe);

    if (!document.getElementById("bouton_modif_" + element[0].id)) {
        const bouton_modif = document.createElement("button");
        bouton_modif.className = "bouton_modif";
        bouton_modif.id = "bouton_modif_" + element[0].id;
        bouton_modif.textContent = "Modifier";

        div_element.appendChild(bouton_modif);

        Modif_Projet(bouton_modif, element[0]);
    }
}