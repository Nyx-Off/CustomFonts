/**
 * Composant de saisie de texte
 */
export class TextInput {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            placeholder: 'Écrivez ou collez votre texte ici...',
            maxLength: null,
            autoFocus: true,
            showCharCount: true,
            ...options
        };
        
        this.textarea = null;
        this.charCountElement = null;
        
        this.init();
    }
    
    /**
     * Initialise le composant
     */
    init() {
        this.render();
        this.attachEventListeners();
        
        if (this.options.autoFocus) {
            this.focus();
        }
    }
    
    /**
     * Génère le HTML du composant
     */
    render() {
        const html = `
            <div class="text-input">
                <div class="text-input__header">
                    <label for="text-input-field" class="text-input__label">
                        Votre texte
                    </label>
                    ${this.options.showCharCount ? `
                        <span class="text-input__char-count" id="char-count">
                            <span class="char-count__current">0</span>
                            ${this.options.maxLength ? `/ <span class="char-count__max">${this.options.maxLength}</span>` : ''}
                        </span>
                    ` : ''}
                </div>
                <div class="text-input__wrapper">
                    <textarea
                        id="text-input-field"
                        class="text-input__field"
                        placeholder="${this.options.placeholder}"
                        spellcheck="false"
                        ${this.options.maxLength ? `maxlength="${this.options.maxLength}"` : ''}
                    ></textarea>
                    <div class="text-input__actions">
                        <button class="text-input__clear" title="Effacer le texte" aria-label="Effacer">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        // Références aux éléments
        this.textarea = this.container.querySelector('#text-input-field');
        this.charCountElement = this.container.querySelector('.char-count__current');
        this.clearButton = this.container.querySelector('.text-input__clear');
    }
    
    /**
     * Attache les écouteurs d'événements
     */
    attachEventListeners() {
        // Input event
        this.textarea.addEventListener('input', (e) => {
            this.handleInput(e.target.value);
        });
        
        // Clear button
        this.clearButton.addEventListener('click', () => {
            this.clear();
        });
        
        // Keyboard shortcuts
        this.textarea.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter pour convertir
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.textarea.blur();
            }
            
            // Escape pour clear
            if (e.key === 'Escape') {
                this.clear();
            }
        });
        
        // Auto-resize
        this.textarea.addEventListener('input', () => {
            this.autoResize();
        });
    }
    
    /**
     * Gère l'événement d'input
     * @param {string} value - La valeur du textarea
     */
    handleInput(value) {
        // Mettre à jour le compteur
        if (this.options.showCharCount && this.charCountElement) {
            this.charCountElement.textContent = value.length;
        }
        
        // Afficher/cacher le bouton clear
        this.clearButton.style.display = value.length > 0 ? 'flex' : 'none';
        
        // Callback
        if (this.options.onInput) {
            this.options.onInput(value);
        }
    }
    
    /**
     * Auto-resize du textarea
     */
    autoResize() {
        this.textarea.style.height = 'auto';
        this.textarea.style.height = Math.min(this.textarea.scrollHeight, 400) + 'px';
    }
    
    /**
     * Efface le contenu
     */
    clear() {
        this.textarea.value = '';
        this.handleInput('');
        this.focus();
    }
    
    /**
     * Focus sur le textarea
     */
    focus() {
        this.textarea.focus();
    }
    
    /**
     * Obtient la valeur actuelle
     * @returns {string}
     */
    getValue() {
        return this.textarea.value;
    }
    
    /**
     * Définit la valeur
     * @param {string} value
     */
    setValue(value) {
        this.textarea.value = value;
        this.handleInput(value);
    }
    
    /**
     * Active/désactive le composant
     * @param {boolean} enabled
     */
    setEnabled(enabled) {
        this.textarea.disabled = !enabled;
        this.clearButton.disabled = !enabled;
    }
}