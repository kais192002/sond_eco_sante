// Liste des questions
const questions = [
    "Avez-vous déjà utilisé un ordinateur personnel ?",
    "Avez-vous accès à un ordinateur personnel ?",
    "Avez-vous un ordinateur personnel à la maison ?",
    "Utilisez-vous régulièrement un ordinateur pour étudier ?",
    "Disposez-vous d'une connexion internet stable à la maison ?",
    "Savez-vous créer, renommer ou supprimer des fichiers et des dossiers sous Windows ?",
    "Avez-vous déjà installé une application sur votre ordinateur ?",
    "Utilisez-vous régulièrement Internet ?",
    "Avez-vous déjà cherché des informations sur Internet ?",
    "Avez-vous déjà utilisé un éditeur de texte (Notepad, Sublime Text, etc.) ?",
    "Connaissez-vous qu’est-ce qu’un terminal ou une ligne de commande ?",
    "Avez-vous déjà utilisé un terminal ou une ligne de commande ?",
    "Aimez-vous résoudre des problèmes logiques ou des énigmes ?",
    "Êtes-vous intéressé par le fonctionnement des ordinateurs ?",
    "Aimeriez-vous créer vos propres applications ou jeux vidéo ?",
    "Êtes-vous patient et persévérant ?",
    "Êtes-vous prêt à apprendre de nouvelles choses ?",
    "Aimez-vous travailler de manière autonome ?",
    "Êtes-vous à l'aise avec les mathématiques ?",
    "Avez-vous déjà essayé d'apprendre un langage de programmation ?",
];

// Variables globales
let currentQuestion = 0;
const answers = [];
let score = 0;

// Sélecteurs
const userInfo = document.getElementById("user-info");
const quizSection = document.getElementById("quiz-section");
const questionElement = document.getElementById("question");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const progressElement = document.getElementById("progress");
const startButton = document.getElementById("startButton");
const nameInput = document.getElementById("name");
const surnameInput = document.getElementById("surname");
const emailInput = document.getElementById("email");

// Commencer le quiz
startButton.addEventListener("click", () => {
    if (nameInput.value && surnameInput.value && emailInput.value) {
        userInfo.style.display = "none";
        quizSection.style.display = "block";
        displayQuestion();
    } else {
        alert("Veuillez remplir tous les champs.");
    }
});

// Afficher la question actuelle
function displayQuestion() {
    questionElement.textContent = questions[currentQuestion];
    progressElement.textContent = `Question ${currentQuestion + 1}/${questions.length}`;
}

// Gérer les réponses
function handleAnswer(isCorrect) {
    answers.push({
        question: questions[currentQuestion],
        answer: isCorrect ? "Oui (Correct)" : "Non (Incorrect)",
    });

    if (isCorrect) score++;
    currentQuestion++;

    if (currentQuestion < questions.length) {
        displayQuestion();
    } else {
        showSaveOption();
    }
}

// Afficher l'option d'enregistrement
function showSaveOption() {
    quizSection.innerHTML = `
        <h2>Quiz terminé !</h2>
        <p>Votre score est de ${score}/20.</p>
        <p>Souhaitez-vous enregistrer vos résultats dans Google Sheets ?</p>
        <button id="saveButton">Enregistrer</button>
        <button id="cancelButton">Annuler</button>
    `;

    const saveButton = document.getElementById("saveButton");
    const cancelButton = document.getElementById("cancelButton");

    // Désactiver le bouton après le premier clic
    saveButton.addEventListener("click", () => saveResults(saveButton, cancelButton));
    cancelButton.addEventListener("click", () => {
    quizSection.innerHTML = `<h2>Merci d'avoir participé au quiz !</h2>`;
    });
}
// Enregistrer les résultats dans Google Sheets
const scriptURL = "https://script.google.com/macros/s/AKfycbyHPPpb67krWs7GYZ6m_s07XRLzWRw6uVhfAgwQ1pDnqT0q1o1-shRZcGyyuRgv22TpAg/exec";

function saveResults(saveButton, cancelButton) {
    // Désactiver le bouton "Enregistrer" pour éviter plusieurs clics
    saveButton.disabled = true;
    saveButton.textContent = "Enregistrement en cours...";
        fetch(scriptURL, {
        method: "POST",
        mode: "no-cors", // Désactiver les restrictions CORS
        body: JSON.stringify({
            name: nameInput.value,
            surname: surnameInput.value,
            email: emailInput.value,
            score: score,
            answers: answers.map(a => a.answer),
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(() => {
        // Confirmation de l'enregistrement
        quizSection.innerHTML = `
            <h2>Merci d'avoir participé au quiz !</h2>
            <p>Vos résultats ont été enregistrés avec succès.</p>
        `;
    })
    .catch(error => {
        console.error("Erreur :", error);
        quizSection.innerHTML = `
            <h2>Erreur lors de l'enregistrement des résultats.</h2>
            <p>Veuillez réessayer plus tard.</p>
        `;
    });
}
// Boutons Oui / Non
yesButton.addEventListener("click", () => handleAnswer(true));
noButton.addEventListener("click", () => handleAnswer(false));

// Ajouter une section pour le graphique
function showSaveOption() {
    quizSection.innerHTML = `
        <h2>Quiz terminé !</h2>
        <p>Votre score est de ${score}/20.</p>
        <p>Souhaitez-vous enregistrer vos résultats dans Google Sheets ?</p>
        <button id="saveButton">Enregistrer</button>
        <button id="cancelButton">Annuler</button>
        <canvas id="resultsChart" width="400" height="200"></canvas>
    `;

    const saveButton = document.getElementById("saveButton");
    const cancelButton = document.getElementById("cancelButton");

    // Afficher le graphique
    renderChart();

    saveButton.addEventListener("click", () => saveResults(saveButton, cancelButton));
    cancelButton.addEventListener("click", () => {
        quizSection.innerHTML = `<h2>Merci d'avoir participé au quiz !</h2>`;
    });
}

// Fonction pour afficher le graphique des résultats
function renderChart() {
    const ctx = document.getElementById("resultsChart").getContext("2d");

    // Calcul des données
    const correctAnswers = score;
    const incorrectAnswers = questions.length - score;

    // Ajouter le score au centre avec un plugin
    const centerTextPlugin = {
        id: "centerText",
        beforeDraw(chart) {
            const { width } = chart;
            const { height } = chart;
            const { ctx } = chart;
            const fontSize = (height / 100) * 7;

            ctx.save();
            ctx.font = `${fontSize}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#000";
            ctx.fillText(`${score}/${questions.length}`, width / 2, height / 2);
            ctx.restore();
        },
    };

    // Initialisation du graphique
    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Correctes", "Incorrectes"],
            datasets: [
                {
                    label: "Répartition des réponses",
                    data: [correctAnswers, incorrectAnswers],
                    backgroundColor: [
                        "rgba(75, 192, 192, 0.6)", // Vert clair
                        "rgba(255, 99, 132, 0.6)", // Rouge clair
                    ],
                    borderColor: [
                        "rgba(75, 192, 192, 1)",
                        "rgba(255, 99, 132, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                },
            },
        },
        plugins: [centerTextPlugin], // Ajouter le plugin ici
    });
}
