/*Inscription*/
let verification_page_inscription = 0;
function inscription() {
    if (verification_page_inscription == 1 || verification_page_connection == 1) return;

    verification_page_inscription = 1;

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
                verification_page_inscription = 0;
            })
    });

    //Annulation
    bouton_annulation_inscription.addEventListener("click", () => {
        overlay_inscription.style.display = "none";
        verification_page_inscription = 0;
    });
}

/*Connection*/
let verification_page_connection = 0;
function connection() {
    if (verification_page_inscription == 1 || verification_page_connection == 1) return;

    verification_page_connection = 1;

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

    // MOT DE PASSE
    const text_mot_de_passe_connection = document.createElement("p");
    text_mot_de_passe_connection.textContent = "Mot de passe";
    connection.appendChild(text_mot_de_passe_connection);

    const input_mot_de_passe_connection = document.createElement("input");
    input_mot_de_passe_connection.type = "password"; // ✔ correction importante
    input_mot_de_passe_connection.id = "input_mot_de_passe_connection";
    connection.appendChild(input_mot_de_passe_connection);

    // BOUTON VALIDATION
    const bouton_validation_connection = document.createElement("button");
    bouton_validation_connection.textContent = "Connexion";
    connection.appendChild(bouton_validation_connection);

    // BOUTON ANNULATION
    const bouton_annulation_connection = document.createElement("button");
    bouton_annulation_connection.textContent = "Annulation";
    connection.appendChild(bouton_annulation_connection);

    /* =======================
       CONNEXION BDD
    ======================= */
    bouton_validation_connection.addEventListener("click", () => {

        const nom_connexion = document.getElementById("input_nom_connection").value;
        const mot_de_passe_connexion = document.getElementById("input_mot_de_passe_connection").value;

        fetch("/connection?nom=" + nom_connexion + "&mot_de_passe=" + mot_de_passe_connexion, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(data => {

                console.log(data);

                if (data.length > 0) {
                    overlay_connection.style.display = "none";
                    verification_page_connection = 0;
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

    });

    /* ANNULATION */
    bouton_annulation_connection.addEventListener("click", () => {
        overlay_connection.style.display = "none";
        verification_page_connection = 0;
    });
}

/*Créer un élément*/
function Create_element(){

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
    
    //description
    const text_description_Create_element = document.createElement("p");
    text_description_Create_element.textContent = "Description de l'élément";
    Create_element.appendChild(text_description_Create_element);

    const textarea_description_Create_element = document.createElement("textarea");
    textarea_description_Create_element.id = "textarea_description_Create_element";
    Create_element.appendChild(textarea_description_Create_element);
    
    // BOUTON VALIDATION
    const bouton_validation_Create_element = document.createElement("button");
    bouton_validation_Create_element.textContent = "Connexion";
    Create_element.appendChild(bouton_validation_Create_element);

    // BOUTON ANNULATION
    const bouton_annulation_Create_element = document.createElement("button");
    bouton_annulation_Create_element.textContent = "Annulation";
    Create_element.appendChild(bouton_annulation_Create_element);
    /*

    // NOM
    const text_nom_connection = document.createElement("p");
    text_nom_connection.textContent = "Nom";
    connection.appendChild(text_nom_connection);

    const input_nom_connection = document.createElement("input");
    input_nom_connection.type = "text";
    input_nom_connection.id = "input_nom_connection";
    connection.appendChild(input_nom_connection);

    // MOT DE PASSE
    const text_mot_de_passe_connection = document.createElement("p");
    text_mot_de_passe_connection.textContent = "Mot de passe";
    connection.appendChild(text_mot_de_passe_connection);

    const input_mot_de_passe_connection = document.createElement("input");
    input_mot_de_passe_connection.type = "password"; // ✔ correction importante
    input_mot_de_passe_connection.id = "input_mot_de_passe_connection";
    connection.appendChild(input_mot_de_passe_connection);

    // BOUTON VALIDATION
    const bouton_validation_connection = document.createElement("button");
    bouton_validation_connection.textContent = "Connexion";
    connection.appendChild(bouton_validation_connection);

    // BOUTON ANNULATION
    const bouton_annulation_connection = document.createElement("button");
    bouton_annulation_connection.textContent = "Annulation";
    connection.appendChild(bouton_annulation_connection);

       //CONNEXION BDD
    bouton_validation_connection.addEventListener("click", () => {

        const nom_connexion = document.getElementById("input_nom_connection").value;
        const mot_de_passe_connexion = document.getElementById("input_mot_de_passe_connection").value;

        fetch("/connection?nom=" + nom_connexion + "&mot_de_passe=" + mot_de_passe_connexion, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(data => {

                console.log(data);

                if (data.length > 0) {
                    overlay_connection.style.display = "none";
                    verification_page_connection = 0;
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

    });

    //ANNULATION 
    bouton_annulation_connection.addEventListener("click", () => {
        overlay_connection.style.display = "none";
        verification_page_connection = 0;
    });*/
}