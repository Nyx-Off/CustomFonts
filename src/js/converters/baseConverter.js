/**
 * Classe de base pour la conversion de texte
 */
export class FontConverter {
    constructor(fontStyles, additionalConverters = []) {
        this.fontStyles = fontStyles;
        this.additionalConverters = additionalConverters;
    }
    
    /**
     * Convertit le texte dans tous les styles disponibles
     * @param {string} text - Le texte à convertir
     * @returns {Array} Liste des conversions
     */
    convertAll(text) {
        const results = [];
        
        // Conversions standard basées sur les mappings
        for (const [styleName, styleMap] of Object.entries(this.fontStyles)) {
            results.push({
                name: styleName,
                text: this.convertWithMapping(text, styleMap),
                type: 'standard'
            });
        }
        
        // Conversions additionnelles
        for (const converter of this.additionalConverters) {
            results.push({
                name: converter.name,
                text: converter.convert(text),
                type: 'special'
            });
        }
        
        return results;
    }
    
    /**
     * Convertit le texte avec un mapping spécifique
     * @param {string} text - Le texte à convertir
     * @param {Object} mapping - Le mapping de caractères
     * @returns {string} Le texte converti
     */
    convertWithMapping(text, mapping) {
        return text.split('').map(char => mapping[char] || char).join('');
    }
    
    /**
     * Convertit le texte dans un style spécifique
     * @param {string} text - Le texte à convertir
     * @param {string} styleName - Le nom du style
     * @returns {string|null} Le texte converti ou null si le style n'existe pas
     */
    convertToStyle(text, styleName) {
        // Vérifier les styles standard
        if (this.fontStyles[styleName]) {
            return this.convertWithMapping(text, this.fontStyles[styleName]);
        }
        
        // Vérifier les convertisseurs additionnels
        const additionalConverter = this.additionalConverters.find(
            conv => conv.name === styleName
        );
        
        if (additionalConverter) {
            return additionalConverter.convert(text);
        }
        
        return null;
    }
    
    /**
     * Obtient la liste de tous les styles disponibles
     * @returns {Array} Liste des noms de styles
     */
    getAvailableStyles() {
        const standardStyles = Object.keys(this.fontStyles);
        const additionalStyles = this.additionalConverters.map(conv => conv.name);
        return [...standardStyles, ...additionalStyles];
    }
    
    /**
     * Vérifie si un style existe
     * @param {string} styleName - Le nom du style
     * @returns {boolean}
     */
    hasStyle(styleName) {
        return this.getAvailableStyles().includes(styleName);
    }
}