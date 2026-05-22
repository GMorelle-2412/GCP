/*Bouton annulation*/
function Annulation(bouton_annulation, overlay) {
    bouton_annulation.addEventListener("click", () => {
        overlay.style.display = "none";
        verification_page = 0;
    });
}

/*Bouton d'inscription*/
function Bouton_Inscription(bouton_validation_inscription) {

    Generation_Inscription();

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