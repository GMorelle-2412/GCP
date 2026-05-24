/*Connection*/
function Fetch_Get_Connection(nom, mot_de_passe) {
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

/*Auto connection*/
function Fetch_Get_Auto_Connection(id_user, nom_user) {
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
}

/*Inscription*/
function Fetch_Post_Inscription(nom, mot_de_passe) {
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

}

/*Affichage projets*/
const Affichage_projets = {

    async Recup_Liste(id_user) {
        try {
            const res = await fetch("/Recup_Liste?id_user=" + id_user);
            const data_liste = await res.json();

            //const id_liste = data.map(item => item.id_liste);

            for (let i = 0; i < data_liste.length; i++) {
                await Affichage_projets.Recup_Contenu_Liste(data_liste[i]);
            }

        } catch (err) {
            console.error("Erreur :", err);
        }
    },

    async Recup_Contenu_Liste(data_liste) {
        const res = await fetch("/Recup_contenu_liste?id_liste=" + data_liste.id);
        const data = await res.json();

        const contenu = data;

        for (let j = 0; j < contenu.length; j++) {
            await Affichage_projets.Recup_Element(contenu[j], data_liste);
        }
    },

    async Recup_Element(contenu, data_liste) {
        const res = await fetch("/Recup_Element?id_element=" + contenu.id_element);
        const data_element = await res.json();

        Generation_Affichage_Projets(data_liste, data_element, contenu);
    }
}

/*Création d'élément*/
const Create_Element = {

    async Fetch_Post_Element(nom, description) {
        try {
            const res = await fetch("/Element", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nom, description })
            });

            const data = await res.json();
            const id_element = data.insertId;

            const id_user = localStorage.getItem("id_user");
            const contenus = document.getElementsByClassName("text_partie_list");
            const validations = document.getElementsByClassName("partie_list");

            // 🔥 Correction ici
            await Create_Element.Fetch_Post_Liste(contenus, validations, id_user, id_element);

            overlay_Create_element.style.display = "none";
            overlay_inscription.style.display = "none";
            verification_page = 0;
            location.reload();

        } catch (err) {
            console.error("Erreur :", err);
        }
    },

    async Fetch_Post_Liste(contenus, validations, id_user, id_element) {
        for (let i = 0; i < contenus.length; i++) {

            const res = await fetch("/Liste", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contenu: contenus[i].value,
                    validation: validations[i].checked,
                    id_user
                })
            });

            const data = await res.json();
            const id_liste = data.insertId;

            // 🔥 Correction ici
            await Create_Element.Fetch_Post_Contenu_Liste(id_element, id_liste);
        }
    },

    async Fetch_Post_Contenu_Liste(id_element, id_liste) {
        await fetch("/Contenu_liste", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_element, id_liste })
        });
    }
};

/*Modification projets*/
/*function Modification_projets(overlay_Modif_Element, id_element) {
    const get = (url) => fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } }).then(res => res.json());

    //Récupération des listes 
    //(id_user -> id_liste)
    const id_user = localStorage.getItem("id_user");

    let bloc = 0;

    get("/Recup_Liste?id_user=" + id_user)
        .then(listes => {

            listes.forEach((liste, index) => {

                get("/Recup_contenu_liste?id_liste=" + liste.id)
                    .then(contenus => {

                        contenus.forEach(contenu => {

                            get("/Recup_Element?id_element=" + contenu.id_element)
                                .then(element => {

                                    if (bloc === 0) {
                                        if (id_element === element[0].id) {

                                            const Modif_Element = document.getElementById("Modif_Element");
                                            overlay_Modif_Element.appendChild(Modif_Element);
                                            Modif_Element.innerHTML = "";

                                            //Nom
                                            const text_nom_Modif_Element = document.createElement("p");
                                            text_nom_Modif_Element.textContent = "Nom";
                                            Modif_Element.appendChild(text_nom_Modif_Element);

                                            const input_nom_Modif_Element = document.createElement("input");
                                            input_nom_Modif_Element.type = "text"
                                            input_nom_Modif_Element.value = element[0].nom;
                                            input_nom_Modif_Element.id = "input_nom_Modif_Element";
                                            Modif_Element.appendChild(input_nom_Modif_Element);

                                            //Déscription
                                            const text_mot_de_passe_Modif_Element = document.createElement("p");
                                            text_mot_de_passe_Modif_Element.textContent = "Déscription";
                                            Modif_Element.appendChild(text_mot_de_passe_Modif_Element);

                                            const input_mot_de_passe_Modif_Element = document.createElement("input");
                                            input_mot_de_passe_Modif_Element.type = "text";
                                            input_mot_de_passe_Modif_Element.value = element[0].description;
                                            input_mot_de_passe_Modif_Element.id = "input_mot_de_passe_Modif_Element";
                                            Modif_Element.appendChild(input_mot_de_passe_Modif_Element);

                                            bloc = 1;

                                        }
                                    }

                                    if (contenu.id_element === id_element) {
                                        const div_listes_modif = document.getElementById("Modif_Element");

                                        const validation_modif = document.createElement("input");
                                        validation_modif.className = "partie_list";
                                        validation_modif.id = "validation_" + element[0].id;
                                        validation_modif.checked = liste.validation === "1";
                                        validation_modif.type = "checkbox";

                                        const pListe_modif = document.createElement("p");
                                        pListe_modif.textContent = liste.contenu;
                                        pListe_modif.id = "pListe_" + element[0].id;

                                        div_listes_modif.appendChild(pListe_modif);
                                        div_listes_modif.appendChild(validation_modif);
                                    }

                                    if (index === listes.length - 1) {

                                        //Bouton validation
                                        const bouton_validation_Modif_Element = document.createElement("button");
                                        bouton_validation_Modif_Element.textContent = "Modifier";
                                        document.getElementById("Modif_Element").appendChild(bouton_validation_Modif_Element);

                                        //Bouton annulation
                                        const bouton_annulation_Modif_Element = document.createElement("button");
                                        bouton_annulation_Modif_Element.textContent = "Annulation";
                                        document.getElementById("Modif_Element").appendChild(bouton_annulation_Modif_Element);

                                        //Validation
                                        bouton_validation_Modif_Element.addEventListener("click", () => {

                                            const nom_connexion = document.getElementById("input_nom_Modif_Element").value;
                                            const mot_de_passe_connexion = document.getElementById("input_mot_de_passe_Modif_Element").value;

                                        });

                                        //Annulation
                                        bouton_annulation_Modif_Element.addEventListener("click", () => {
                                            overlay_Modif_Element.style.display = "none";
                                            verification_page = 0;
                                            bloc = 0;
                                        });
                                    }
                                });
                        });
                    });
            });
        })
        .catch(console.log);
}*/