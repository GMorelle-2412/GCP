/*Bouton annulation*/
function Annulation(bouton_annulation, overlay) {
    bouton_annulation.addEventListener("click", () => {
        overlay.style.display = "none";
        verification_page = 0;
    });
}

/*Bouton d'inscription*/
function Bouton_Inscription(bouton_validation_inscription) {

    //Génération des élément pour inscription
    Generation_Inscription();

    bouton_validation_inscription.addEventListener("click", () => {

        //Recherche des valeurs
        const nom = document.getElementById("input_nom_inscription").value;
        const mot_de_passe = document.getElementById("input_mot_de_passe_inscription").value;

        //Inscription
        Fetch_Inscription(nom, mot_de_passe);

        //Auto connection après inscription
        Connection(nom, mot_de_passe);
    });

}

/*Bouton de connection*/
function Bouton_Connection(bouton_validation_connection) {

    Generation_Connection();

    bouton_validation_connection.addEventListener("click", () => {

        const nom_connexion = document.getElementById("input_nom_connection").value;
        const mot_de_passe_connexion = document.getElementById("input_mot_de_passe_connection").value;

        Connection(nom_connexion, mot_de_passe_connexion);

    });
}

/*Bouton de déconnection*/
function Bouton_Déconection(bouton_déconection) {

    bouton_déconection.addEventListener("click", () => {
        localStorage.removeItem("id_user");
        location.reload();
    });
}

/*Bouton de création d'un élément*/
function Bouton_Create_Element(bouton_validation, bouton_creer_partie_list) {
    
    /*validation*/
    bouton_validation.addEventListener("click", () => {

        const nom = document.getElementById("input_nom_Create_element").value;
        const description = document.getElementById("textarea_description_Create_element").value;

        Create_Element.Fetch_Post_Element(nom, description);

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

/*Détection de modification de check list*/
function Modif_Check_List(input) {
    input.addEventListener("change", () => {

        if (element[0].id === contenu.id_element) {
            console.log(validation.checked);

            if (contenu.id_liste === liste.id) {
                fetch("/Modif_checkbox", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_liste: liste.id,
                        validation: input.checked
                    })
                })
                    .then(res => res.text())
                    .then(console.log)
                    .catch(console.error);
            }
        }

    });
}

/*Bouton de modification d'un projet*/
function Modif_Projet(bouton_modif, projet) {
    bouton_modif.addEventListener("click", () => {
        Bouton_Modif_Element(projet);
    })
}

/*Bouton de modification d'un élément*/
/*function Bouton_Modif_Element(id_element) {
    if (verification_page == 1) return;

    verification_page = 1;

    //Arrière-plan
    const overlay_Modif_Element = document.getElementById("overlay_Modif_Element");

    Object.assign(overlay_Modif_Element.style, {
        position: "fixed",
        inset: "0",
        backdropFilter: "blur(8px)",
        background: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "999"
    });

    Modification_projets(overlay_Modif_Element, id_element);
}*/