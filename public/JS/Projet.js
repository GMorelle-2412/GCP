const Creation_Projet = {
    Generation_Create_Element() {
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
    },

    Bouton_Create_Element(bouton_validation, bouton_creer_partie_list) {

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
    },

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
    },
};

const Affichage_Projets = {
    async Recup_Liste(id_user) {
        try {
            const res = await fetch("/Recup_Liste?id_user=" + id_user);
            const data_liste = await res.json();

            //const id_liste = data.map(item => item.id_liste);

            for (let i = 0; i < data_liste.length; i++) {
                await Affichage_Projets.Recup_Contenu_Liste(data_liste[i]);
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
            await Affichage_Projets.Recup_Element(contenu[j], data_liste);
        }
    },

    async Recup_Element(contenu, data_liste) {
        const res = await fetch("/Recup_Element?id_element=" + contenu.id_element);
        const data_element = await res.json();

        Affichage_Projets.Generation_Affichage_Projets(data_liste, data_element, contenu);
    },

    Generation_Affichage_Projets(liste, element, contenu) {

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

        Modification_Projet.Modif_Check_List(validation, element, liste, contenu);

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

            //Modification_Projet.Modif_Projet(bouton_modif, element[0]);
        }
    },
};

const Modification_Projet = {
    Modif_Check_List(input, element, liste, contenu) {
        input.addEventListener("change", () => {

            if (element[0].id === contenu.id_element) {
                console.log(input.checked);

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
    },

    Bouton_Modif_Projet(bouton_modif, projet) {
        bouton_modif.addEventListener("click", () => {
            Modif_Projet(projet);
        })
    },

    Modif_Projet(id_element) {
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

        Modification_Projet.Modification_projets(overlay_Modif_Element, id_element);
    },

    /*Modification_projets(overlay_Modif_Element, id_element) {
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
};