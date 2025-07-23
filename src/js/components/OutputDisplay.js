/**
 * Composant d'affichage des résultats
 */
export class OutputDisplay {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            onCopy: null,
            enableSearch: true,
            enableFilter: true,
            ...options
        };
        
        this.results = [];
        this.filteredResults = [];
        this.searchTerm = '';
        this.activeFilter = 'all';
        
        this.init();
    }
    
    /**
     * Initialise le composant
     */
    init() {
        this.render();
        this.attachEventListeners();
    }
    
    /**
     * Génère le HTML du composant
     */
    render() {
        const html = `
            <div class="output-display">
                <div class="output-display__header">
                    <h2 class="output-display__title">Styles disponibles</h2>
                    <div class="output-display__controls">
                        ${this.options.enableSearch ? `
                            <div class="output-search">
                                <input 
                                    type="text" 
                                    class="output-search__input" 
                                    placeholder="Rechercher un style..."
                                    aria-label="Rechercher un style"
                                >
                                <svg class="output-search__icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                </svg>
                            </div>
                        ` : ''}
                        
                        ${this.options.enableFilter ? `
                            <div class="output-filter">
                                <button class="output-filter__btn active" data-filter="all">
                                    Tous
                                </button>
                                <button class="output-filter__btn" data-filter="standard">
                                    Standard
                                </button>
                                <button class="output-filter__btn" data-filter="special">
                                    Spécial
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="output-display__content">
                    <div class="output-list" id="output-list">
                        <!-- Les résultats seront affichés ici -->
                    </div>
                </div>
                
                <div class="output-display__footer">
                    <p class="output-display__count">
                        <span id="result-count">0</span> styles affichés
                    </p>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        // Références aux éléments
        this.listElement = this.container.querySelector('#output-list');
        this.countElement = this.container.querySelector('#result-count');
        this.searchInput = this.container.querySelector('.output-search__input');
        this.filterButtons = this.container.querySelectorAll('.output-filter__btn');
    }
    
    /**
     * Attache les écouteurs d'événements
     */
    attachEventListeners() {
        // Recherche
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterAndDisplay();
            });
        }
        
        // Filtres
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Mettre à jour l'état actif
                this.filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.activeFilter = e.target.dataset.filter;
                this.filterAndDisplay();
            });
        });
        
        // Délégation d'événements pour les boutons de copie
        this.listElement.addEventListener('click', (e) => {
            const copyBtn = e.target.closest('.output-item__copy');
            if (copyBtn) {
                const text = copyBtn.dataset.text;
                if (this.options.onCopy) {
                    this.options.onCopy(text);
                }
                
                // Animation du bouton
                this.animateCopyButton(copyBtn);
            }
        });
    }
    
    /**
     * Met à jour les résultats
     * @param {Array} results - Les nouveaux résultats
     */
    updateResults(results) {
        this.results = results;
        this.filterAndDisplay();
    }
    
    /**
     * Filtre et affiche les résultats
     */
    filterAndDisplay() {
        // Filtrer par type
        let filtered = this.results;
        
        if (this.activeFilter !== 'all') {
            filtered = filtered.filter(result => result.type === this.activeFilter);
        }
        
        // Filtrer par recherche
        if (this.searchTerm) {
            filtered = filtered.filter(result => 
                result.name.toLowerCase().includes(this.searchTerm) ||
                result.text.toLowerCase().includes(this.searchTerm)
            );
        }
        
        this.filteredResults = filtered;
        this.displayResults();
    }
    
    /**
     * Affiche les résultats filtrés
     */
    displayResults() {
        if (this.filteredResults.length === 0) {
            this.listElement.innerHTML = `
                <div class="output-empty">
                    <p class="output-empty__text">
                        ${this.searchTerm ? 'Aucun style trouvé' : 'Entrez du texte pour voir les conversions'}
                    </p>
                </div>
            `;
        } else {
            this.listElement.innerHTML = this.filteredResults.map(result => `
                <div class="output-item" data-type="${result.type}">
                    <div class="output-item__content">
                        <h3 class="output-item__title">${result.name}</h3>
                        <p class="output-item__text">${this.escapeHtml(result.text) || '<span class="text-muted">Texte vide</span>'}</p>
                    </div>
                    <button 
                        class="output-item__copy" 
                        data-text="${this.escapeHtml(result.text)}"
                        title="Copier le texte"
                        aria-label="Copier ${result.name}"
                        ${!result.text ? 'disabled' : ''}
                    >
                        <svg class="copy-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                        </svg>
                        <svg class="check-icon" style="display: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>
                        <span class="copy-text">Copier</span>
                    </button>
                </div>
            `).join('');
        }
        
        // Mettre à jour le compteur
        this.countElement.textContent = this.filteredResults.length;
    }
    
    /**
     * Anime le bouton de copie
     * @param {HTMLElement} button - Le bouton à animer
     */
    animateCopyButton(button) {
        const copyIcon = button.querySelector('.copy-icon');
        const checkIcon = button.querySelector('.check-icon');
        const copyText = button.querySelector('.copy-text');
        
        // Afficher l'icône de validation
        copyIcon.style.display = 'none';
        checkIcon.style.display = 'block';
        copyText.textContent = 'Copié !';
        button.classList.add('copied');
        
        // Réinitialiser après 2 secondes
        setTimeout(() => {
            copyIcon.style.display = 'block';
            checkIcon.style.display = 'none';
            copyText.textContent = 'Copier';
            button.classList.remove('copied');
        }, 2000);
    }
    
    /**
     * Échappe le HTML pour éviter les injections
     * @param {string} text - Le texte à échapper
     * @returns {string}
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}