let verification_page = 0;

function Annulation(bouton_annulation, overlay) {
    bouton_annulation.addEventListener("click", () => {
        overlay.style.display = "none";
        verification_page = 0;
    });
}

function Generation_Démarage() {

    const nom_user = document.createElement("p");
    nom_user.id = "nom_user";
    nom_user.textContent = "Chargement...";
    document.getElementById("user_name").appendChild(nom_user);

    const id_user = localStorage.getItem("id_user");

    if (!id_user) {

        nom_user.textContent = "Utilisateur non connecté";

        document.getElementById("Create_element").style.display = "none";

        const bouton_connection = document.createElement("button");
        bouton_connection.id = "Bouton_Connection";
        bouton_connection.textContent = "Connection";
        document.getElementById("CetI").appendChild(bouton_connection);

        const bouton_inscription = document.createElement("button");
        bouton_inscription.id = "Bouton_Inscription";
        bouton_inscription.textContent = "Inscription";
        document.getElementById("CetI").appendChild(bouton_inscription);

        Connection.Bouton_Page_Connection(bouton_connection);
        Inscription.Bouton_Page_Inscription(bouton_inscription);

    } else {
        Modification_User.Generation_Bouton_Modif_user();

        Déconnection.Generation_Déconection();

        Connection.Fetch_Get_Auto_Connection(id_user, nom_user);

        Affichage_Projets.Recup_Liste(id_user);
    }
}

Generation_Démarage();