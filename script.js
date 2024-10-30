// Fonction principale de conversion du texte
function convertText() {
    const inputText = document.getElementById("inputText").value;
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    // Conversion pour chaque style standard
    Object.entries(styles).forEach(([styleName, styleMap]) => {
        const convertedText = convertWithStyle(inputText, styleMap);
        addOutputDiv(styleName, convertedText, resultsDiv);
    });

    // Conversion pour les styles additionnels
    additionalConverters.forEach(converter => {
        const convertedText = converter.convert(inputText);
        addOutputDiv(converter.name, convertedText, resultsDiv);
    });
}

// Fonction utilitaire pour convertir le texte avec un style
function convertWithStyle(text, styleMap) {
    return text.split('').map(char => styleMap[char] || char).join('');
}

// Fonction utilitaire pour ajouter une div de sortie
function addOutputDiv(styleName, text, container) {
    const outputDiv = document.createElement("div");
    outputDiv.className = "output";
    outputDiv.innerHTML = `
        <div class="output-text">
            <strong>${styleName}:</strong><br>
            ${text}
        </div>
        <button class="copy-button" onclick="copyToClipboard('${text}')">
            Copier
        </button>
    `;
    container.appendChild(outputDiv);
}

// Fonction de copie dans le presse-papier avec notification
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => showNotification())
        .catch(() => {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            showNotification();
        });
}

// Fonction pour afficher la notification
function showNotification() {
    const notification = document.createElement("div");
    notification.className = "copy-notification";
    notification.textContent = "✓ Texte copié !";
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', convertText);