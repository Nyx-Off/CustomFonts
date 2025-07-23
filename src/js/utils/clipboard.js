/**
 * Utilitaires pour la gestion du presse-papier
 */

/**
 * Copie du texte dans le presse-papier
 * @param {string} text - Le texte à copier
 * @returns {Promise<boolean>} - Promesse résolue avec true si succès
 */
export async function copyToClipboard(text) {
    // Vérifier si l'API Clipboard est disponible
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Erreur lors de la copie avec l\'API Clipboard:', err);
            return fallbackCopyToClipboard(text);
        }
    } else {
        // Utiliser la méthode de fallback
        return fallbackCopyToClipboard(text);
    }
}

/**
 * Méthode de fallback pour copier dans le presse-papier
 * @param {string} text - Le texte à copier
 * @returns {boolean} - true si succès
 */
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Rendre le textarea invisible
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    let success = false;
    try {
        success = document.execCommand('copy');
    } catch (err) {
        console.error('Erreur lors de la copie avec execCommand:', err);
    }
    
    document.body.removeChild(textArea);
    return success;
}

/**
 * Lit le contenu du presse-papier
 * @returns {Promise<string>} - Le contenu du presse-papier
 */
export async function readFromClipboard() {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            const text = await navigator.clipboard.readText();
            return text;
        } catch (err) {
            console.error('Erreur lors de la lecture du presse-papier:', err);
            throw new Error('Impossible de lire le presse-papier');
        }
    } else {
        throw new Error('API Clipboard non disponible');
    }
}

/**
 * Vérifie si l'API Clipboard est disponible
 * @returns {boolean}
 */
export function isClipboardAvailable() {
    return !!(navigator.clipboard && window.isSecureContext);
}

/**
 * Copie du HTML formaté dans le presse-papier
 * @param {string} html - Le HTML à copier
 * @param {string} plainText - Le texte brut alternatif
 * @returns {Promise<boolean>}
 */
export async function copyHTMLToClipboard(html, plainText) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            const blob = new Blob([html], { type: 'text/html' });
            const richTextBlob = new Blob([plainText], { type: 'text/plain' });
            
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': blob,
                    'text/plain': richTextBlob
                })
            ]);
            return true;
        } catch (err) {
            console.error('Erreur lors de la copie HTML:', err);
            // Fallback vers la copie de texte simple
            return copyToClipboard(plainText);
        }
    } else {
        return copyToClipboard(plainText);
    }
}

/**
 * Gestionnaire de copie avec retry
 * @param {string} text - Le texte à copier
 * @param {number} maxRetries - Nombre maximum de tentatives
 * @returns {Promise<boolean>}
 */
export async function copyWithRetry(text, maxRetries = 3) {
    let attempts = 0;
    
    while (attempts < maxRetries) {
        try {
            const success = await copyToClipboard(text);
            if (success) return true;
        } catch (err) {
            console.error(`Tentative ${attempts + 1} échouée:`, err);
        }
        
        attempts++;
        if (attempts < maxRetries) {
            // Attendre un peu avant de réessayer
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    return false;
}