/**
 * Custom Fonts - Application principale
 * @author Samy - Nyx
 * @license MIT
 */

import { TextInput } from './components/TextInput.js';
import { OutputDisplay } from './components/OutputDisplay.js';
import { Notification } from './components/Notification.js';
import { FontConverter } from './converters/baseConverter.js';
import { additionalConverters } from './converters/additionalConverters.js';
import { fontStyles } from './config/fontStyles.js';

class CustomFontsApp {
    constructor() {
        this.container = document.getElementById('app');
        this.converter = new FontConverter(fontStyles, additionalConverters);
        this.notification = new Notification();
        
        this.init();
    }
    
    /**
     * Initialise l'application
     */
    init() {
        this.render();
        this.setupComponents();
        this.attachEventListeners();
    }
    
    /**
     * Génère la structure HTML de base
     */
    render() {
        this.container.innerHTML = `
            <header class="app-header">
                <h1 class="app-title">
                    <span class="app-title__icon">✨</span>
                    Custom Fonts
                </h1>
                <p class="app-subtitle">Convertisseur de texte pour BG !</p>
            </header>
            
            <main class="app-main">
                <div class="container">
                    <section class="input-section" id="input-section">
                        <!-- TextInput component -->
                    </section>
                    
                    <section class="output-section" id="output-section">
                        <!-- OutputDisplay component -->
                    </section>
                </div>
            </main>
            
            <footer class="app-footer">
                <p>© 2025 <a href="https://github.com/Nyx-Off" target="_blank" rel="noopener">Samy - Nyx</a> | MIT License</p>
            </footer>
        `;
    }
    
    /**
     * Initialise les composants
     */
    setupComponents() {
        // Initialiser le composant de saisie
        this.textInput = new TextInput('input-section', {
            placeholder: 'Écrivez ou collez votre texte ici...',
            onInput: (text) => this.handleTextChange(text)
        });
        
        // Initialiser le composant d'affichage
        this.outputDisplay = new OutputDisplay('output-section', {
            onCopy: (text) => this.handleCopy(text)
        });
        
        // Convertir le texte initial (si présent)
        this.handleTextChange('');
    }
    
    /**
     * Attache les écouteurs d'événements globaux
     */
    attachEventListeners() {
        // Raccourcis clavier
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K pour focus sur l'input
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.textInput.focus();
            }
        });
        
        // Gestion du thème (si implémenté)
        this.setupThemeToggle();
    }
    
    /**
     * Gère le changement de texte
     * @param {string} text - Le texte à convertir
     */
    handleTextChange(text) {
        const results = this.converter.convertAll(text);
        this.outputDisplay.updateResults(results);
    }
    
    /**
     * Gère la copie de texte
     * @param {string} text - Le texte à copier
     */
    handleCopy(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                this.notification.show('✓ Texte copié !', 'success');
            })
            .catch(() => {
                // Fallback pour les navigateurs plus anciens
                this.fallbackCopy(text);
            });
    }
    
    /**
     * Méthode de copie alternative
     * @param {string} text - Le texte à copier
     */
    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            this.notification.show('✓ Texte copié !', 'success');
        } catch (err) {
            this.notification.show('❌ Erreur lors de la copie', 'error');
        } finally {
            document.body.removeChild(textarea);
        }
    }
    
    /**
     * Configure le toggle de thème (clair/sombre)
     */
    setupThemeToggle() {
        // Vérifier la préférence système
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
        } else if (prefersDark) {
            document.body.setAttribute('data-theme', 'dark');
        }
        
        // Écouter les changements de préférence système
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                document.body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }
}

// Démarrer l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new CustomFontsApp();
});