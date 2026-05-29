var nb_liste = 0;
let Id_Liste = 0;
const sauvegarde_ids = [];

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

        ///Zone de création d'une partie d'une list
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

        Creation_Projet.Bouton_Create_Element(bouton_validation_Create_element, bouton_creer_partie_list);
    },

    Bouton_Create_Element(bouton_validation, bouton_creer_partie_list) {

        /*validation*/
        bouton_validation.addEventListener("click", () => {

            if (nb_liste === 0) return alert("Vous devais créer au mininum un liste");

            const nom = document.getElementById("input_nom_Create_element").value;
            const description = document.getElementById("textarea_description_Create_element").value;

            Creation_Projet.Fetch_Post_Element(nom, description);

        });

        /*Créer une partie d'une list*/
        bouton_creer_partie_list.addEventListener("click", () => {
            nb_liste++;

            const liste = document.createElement("div");
            liste.className = "liste";
            const zone_creer_partie_list = document.getElementById("zone_creer_partie_list");

            const partie_list = document.createElement("input");
            partie_list.className = "validation";
            partie_list.type = "checkbox";
            liste.appendChild(partie_list);

            const text_partie_list = document.createElement("input");
            text_partie_list.className = "text_partie_list";
            text_partie_list.type = "text";
            text_partie_list.placeholder = "Nom de la partie";
            liste.appendChild(text_partie_list);

            zone_creer_partie_list.appendChild(liste);
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
            const validations = document.getElementsByClassName("validation");

            await Creation_Projet.Fetch_Post_Liste(contenus, validations, id_user, id_element);

            document.getElementById("overlay_Create_element").style.display = "none";
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

            await Creation_Projet.Fetch_Post_Contenu_Liste(id_element, id_liste);
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

            for (let i = 0; i < data_liste.length; i++) {
                await Affichage_Projets.Recup_Contenu_Liste(data_liste[i]);
            }

        } catch (err) {
            console.error("Erreur :", err);
        }
    },

    async Recup_Contenu_Liste(data_liste) {
        const res = await fetch("/get_contenu_liste?id_liste=" + data_liste.id);
        const data = await res.json();

        for (let j = 0; j < data.length; j++) {
            await Affichage_Projets.Recup_Element(data[j], data_liste);
        }
    },

    async Recup_Element(contenu, data_liste) {
        const res = await fetch("/Recup_Element?id_element=" + contenu.id_element);
        const data_element = await res.json();

        Affichage_Projets.Generation_Affichage_Projets(data_liste, data_element, contenu);
    },

    Generation_Affichage_Projets(liste, element, contenu) {

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
        validation.className = "validation";
        validation.id = "validation_" + liste.id;
        validation.checked = Boolean(Number(liste.validation));
        validation.type = "checkbox";

        Modification_Projet_interface.Modif_Check_List(validation, element, liste, contenu);

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

            Modification_Projet_interface.Bouton_Modif_Projet(bouton_modif, element[0]);
        }
    },
};

const Modification_Projet_interface = {

    Modif_Check_List(input, element, liste, contenu) {
        input.addEventListener("change", () => {

            if (element[0].id === contenu.id_element) {

                if (contenu.id_liste === liste.id) {
                    fetch("/update_liste", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id: liste.id,
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
            Modification_Projet_interface.Modif_Projet(projet);
        });
    },

    Modif_Projet(projet) {
        if (verification_page == 1) return;

        verification_page = 1;

        Id_Liste = 0;
        sauvegarde_ids.length = 0;

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

        Modification_Projet_interface.Recup_Liste(projet);
    },

    async Recup_Liste(projet) {
        const id_user = localStorage.getItem("id_user");
        const res = await fetch("/Recup_Liste?id_user=" + id_user);
        const data_liste = await res.json();

        for (let i = 0; i < data_liste.length; i++) {
            await Modification_Projet_interface.Recup_contenu_liste(data_liste[i], projet, i);
        }
    },

    async Recup_contenu_liste(data_liste, projet, i) {
        const res = await fetch("/get_contenu_liste?id_liste=" + data_liste.id);
        const data_contenu = await res.json();

        for (let j = 0; j < data_contenu.length; j++) {
            await Modification_Projet_interface.Recup_Element(data_contenu[j].id_element, projet, data_contenu, data_liste, i);
        }
    },

    async Recup_Element(id_element, projet, data_contenu, data_liste, i) {
        const res = await fetch("/Recup_Element?id_element=" + id_element);
        const data_element = await res.json();

        Modification_Projet_interface.Affichage_modif_projet(data_element, projet, data_contenu, data_liste, i);
    },

    Affichage_modif_projet(data_element, projet, data_contenu, data_liste, i) {
        Modification_Projet_interface.Generation_modif_projet_element(data_element, projet, data_liste);
        Modification_Projet_interface.Generation_modif_projet_liste(data_element, projet, data_contenu, data_liste, i);
    },

    Generation_modif_projet_element(data_element, projet, data_liste) {
        if (!document.getElementById("bouton_annulation_Modif_Element") && !document.getElementById("bouton_validation_Modif_Element")) {

            if (projet.id === data_element[0].id) {

                const Modif_Element = document.getElementById("Modif_Element");
                Modif_Element.innerHTML = "";

                //Nom
                const text_nom_Modif_Element = document.createElement("p");
                text_nom_Modif_Element.textContent = "Nom";
                Modif_Element.appendChild(text_nom_Modif_Element);

                const input_nom_Modif_Element = document.createElement("input");
                input_nom_Modif_Element.type = "text";
                input_nom_Modif_Element.value = data_element[0].nom;
                input_nom_Modif_Element.id = "input_nom_Modif_Element";
                Modif_Element.appendChild(input_nom_Modif_Element);

                //Description
                const text_description_Modif_Element = document.createElement("p");
                text_description_Modif_Element.textContent = "Description";
                Modif_Element.appendChild(text_description_Modif_Element);

                const input_description_Modif_Element = document.createElement("input");
                input_description_Modif_Element.type = "text";
                input_description_Modif_Element.value = data_element[0].description;
                input_description_Modif_Element.id = "input_mot_de_passe_Modif_Element";
                Modif_Element.appendChild(input_description_Modif_Element);

                const zone_liste = document.createElement("div");
                zone_liste.id = "zone_liste";
                Modif_Element.appendChild(zone_liste);

                Modification_Projet_interface.Generation_Boutons_modif_projet();

                Modification_Projet.Bouton_Delete_liste_modif_projet();

                Modification_Projet.Bouton_Liste_Modif_Projet();

                Modification_Projet.Boutons_validation_modif_projet(data_element[0].id);

                Modification_Projet.Boutons_annulation_modif_projet();

                Modification_Projet.Bouton_Sup_Element(data_element[0].id, data_liste);
            }
        }
    },

    Generation_modif_projet_liste(data_element, projet, data_contenu, data_liste, i) {
        if (data_contenu[0].id_element === projet.id) {

            const zone_liste = document.getElementById("zone_liste");

            const div_liste = document.createElement("div");
            div_liste.className = "div_liste";
            div_liste.dataset.id = data_liste.id;

            const validation_modif = document.createElement("input");
            validation_modif.type = "checkbox";
            validation_modif.className = "validation";
            validation_modif.checked = Boolean(Number(data_liste.validation));
            validation_modif.dataset.id = data_liste.id;

            const Input_Liste_modif = document.createElement("input");
            Input_Liste_modif.type = "text";
            Input_Liste_modif.value = data_liste.contenu;
            Input_Liste_modif.className = "Input_Liste_modif";
            Input_Liste_modif.dataset.id = data_liste.id;

            const Bouton_Delete_liste = document.createElement("button");
            Bouton_Delete_liste.textContent = "Résilier";
            Bouton_Delete_liste.className = "Bouton_Delete_liste";
            Bouton_Delete_liste.dataset.id = data_liste.id;

            div_liste.appendChild(Bouton_Delete_liste);
            div_liste.appendChild(Input_Liste_modif);
            div_liste.appendChild(validation_modif);

            zone_liste.appendChild(div_liste);

            sauvegarde_ids[Id_Liste] = data_liste.id;
            Id_Liste++;
        }
    },

    Generation_Boutons_modif_projet() {
        const Modif_Element = document.getElementById("Modif_Element");

        //Bouton Ajoute
        const bouton_liste_Modif_Element = document.createElement("button");
        bouton_liste_Modif_Element.textContent = "Ajouter";
        bouton_liste_Modif_Element.id = "bouton_liste_Modif_Element";
        Modif_Element.appendChild(bouton_liste_Modif_Element);

        //Bouton validation
        const bouton_validation_Modif_Element = document.createElement("button");
        bouton_validation_Modif_Element.textContent = "Modifier";
        bouton_validation_Modif_Element.id = "bouton_validation_Modif_Element";
        Modif_Element.appendChild(bouton_validation_Modif_Element);

        //Bouton annulation
        const bouton_annulation_Modif_Element = document.createElement("button");
        bouton_annulation_Modif_Element.textContent = "Annulation";
        bouton_annulation_Modif_Element.id = "bouton_annulation_Modif_Element";
        Modif_Element.appendChild(bouton_annulation_Modif_Element);

        //Bouton sup élement
        const bouton_Sup_Element = document.createElement("button");
        bouton_Sup_Element.textContent = "Supprimer l'élément";
        bouton_Sup_Element.id = "bouton_Sup_Element";
        Modif_Element.appendChild(bouton_Sup_Element);


    },

}

const Modification_Projet = {
    Bouton_Liste_Modif_Projet() {
        const bouton_liste_Modif_Element = document.getElementById("bouton_liste_Modif_Element");

        bouton_liste_Modif_Element.addEventListener("click", () => {

            const validation_modif = document.createElement("input");
            validation_modif.className = "validation";
            validation_modif.type = "checkbox";

            const Input_Liste_modif = document.createElement("input");
            Input_Liste_modif.type = "text";
            Input_Liste_modif.className = "Input_Liste_modif";

            const Bouton_Delete_liste = document.createElement("button");
            Bouton_Delete_liste.textContent = "Résilier";
            Bouton_Delete_liste.className = "Bouton_Delete_liste";
            Bouton_Delete_liste.id = Id_Liste;

            const zone_liste = document.getElementById("zone_liste");
            const div_liste = document.createElement("div");
            div_liste.className = "div_liste";

            Id_Liste++;

            div_liste.appendChild(Bouton_Delete_liste);
            div_liste.appendChild(Input_Liste_modif);
            div_liste.appendChild(validation_modif);
            zone_liste.appendChild(div_liste);

        });
    },

    Boutons_validation_modif_projet(id_element) {
        const bouton_validation_Modif_Element = document.getElementById("bouton_validation_Modif_Element");

        bouton_validation_Modif_Element.addEventListener("click", async () => {
            await Modification_Projet.Fetch_Modif_element(id_element);

            const data_contenue_liste = await Modification_Projet.Fetch_Recherche_liste(id_element);

            const NB_Liste = document.querySelectorAll(".div_liste").length;

            if (data_contenue_liste.length === NB_Liste) {
                await Modification_Projet.Fetch_Update_Liste(data_contenue_liste.length, sauvegarde_ids);
            }

            if (data_contenue_liste.length < NB_Liste) {
                const reste = NB_Liste - data_contenue_liste.length;

                await Modification_Projet.Fetch_Update_Liste(data_contenue_liste.length, sauvegarde_ids);

                const id_user = localStorage.getItem("id_user");
                const lignes = document.querySelectorAll(".div_liste");
                const data_contenue_liste_length = data_contenue_liste.length;
                const contenus = [];
                const validations = [];

                for (let m = 0; m < reste; m++) {
                    const ligne = lignes[data_contenue_liste_length + m];
                    contenus[m] = ligne.querySelector(".Input_Liste_modif");
                    validations[m] = ligne.querySelector(".validation");
                }

                await Creation_Projet.Fetch_Post_Liste(contenus, validations, id_user, id_element);
            }

            if (data_contenue_liste.length > NB_Liste) {
                await Modification_Projet.Fetch_Update_Liste(NB_Liste, sauvegarde_ids);

                const reste = data_contenue_liste.length - NB_Liste;

                for (let s = 0; s < reste; s++) {
                    const id_liste = data_contenue_liste[NB_Liste + s].id_liste;
                    await Modification_Projet.Fetch_Delete_liste(id_liste);
                }
            }

            document.getElementById("overlay_Modif_Element").style.display = "none";
            verification_page = 0;
            location.reload();
        });
    },

    async Fetch_Modif_element(id_element) {
        const nom = document.getElementById("input_nom_Modif_Element").value;
        const description = document.getElementById("input_mot_de_passe_Modif_Element").value;

        await fetch("/Modif_element", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom, description, id: id_element })
        });
    },

    async Fetch_Recherche_liste(id_element) {
        const res = await fetch("/get_contenu_liste?id_element=" + id_element);
        return await res.json();
    },

    async Fetch_Update_Liste(max, sauvegarde_ids) {
        const lignes = document.querySelectorAll(".div_liste");

        for (let j = 0; j < max; j++) {
            const ligne = lignes[j];
            const contenuInput = ligne.querySelector(".Input_Liste_modif");
            const validationCheckbox = ligne.querySelector(".validation");
            const id = sauvegarde_ids[j];

            await fetch("/update_liste", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contenu: contenuInput.value,
                    validation: validationCheckbox.checked,
                    id
                })
            });
        }
    },

    async Fetch_Delete_liste(id_liste) {
        await fetch("/delete_contenu_liste", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_liste })
        });

        await fetch("/delete_liste", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_liste })
        });
    },

    Boutons_annulation_modif_projet() {
        const bouton_annulation_Modif_Element = document.getElementById("bouton_annulation_Modif_Element");

        bouton_annulation_Modif_Element.addEventListener("click", () => {
            document.getElementById("Modif_Element").innerHTML = "";
            document.getElementById("overlay_Modif_Element").style.display = "none";
            verification_page = 0;
        });
    },

    Bouton_Delete_liste_modif_projet() {
        const zoneListe = document.getElementById("zone_liste");

        zoneListe.addEventListener("click", function (event) {

            const all_liste = document.querySelector("#zone_liste").children.length;

            if (all_liste === 1) return alert("Votre élément doit avoir au minimum une liste");

            if (event.target.classList.contains("Bouton_Delete_liste")) {
                const element = event.target.closest(".div_liste");
                element.remove();
            }
        });
    },

    Bouton_Sup_Element(id_element, data_liste) {
        const bouton_Sup_Element = document.getElementById("bouton_Sup_Element");

        bouton_Sup_Element.addEventListener("click", async () => {

            const all_contenue_liste = await Modification_Projet.Fetch_Recherche_liste(id_element);
            const NB_Listes = document.querySelectorAll(".div_liste").length;

            for (let s = 0; s < NB_Listes.length; s++) {
                const id_liste = all_contenue_liste[s].id_liste;

                await Modification_Projet.Fetch_Delete_liste(id_liste);
            }

            await Modification_Projet.Fetch_Delete_Element(id_element);

            location.reload();
        });
    },

    async Fetch_Delete_Element(id_element) {
        await fetch("/delete_element", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_element: id_element })
        });
    }
};