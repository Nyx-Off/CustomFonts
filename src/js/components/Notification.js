/**
 * Composant de notification
 */
export class Notification {
    constructor() {
        this.container = null;
        this.queue = [];
        this.isShowing = false;
        this.init();
    }
    
    /**
     * Initialise le composant
     */
    init() {
        // Créer le conteneur de notifications
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.setAttribute('aria-live', 'polite');
        this.container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(this.container);
    }
    
    /**
     * Affiche une notification
     * @param {string} message - Le message à afficher
     * @param {string} type - Le type de notification (success, error, warning, info)
     * @param {number} duration - La durée d'affichage en ms
     */
    show(message, type = 'info', duration = 3000) {
        const notification = {
            message,
            type,
            duration
        };
        
        this.queue.push(notification);
        
        if (!this.isShowing) {
            this.processQueue();
        }
    }
    
    /**
     * Traite la file d'attente des notifications
     */
    processQueue() {
        if (this.queue.length === 0) {
            this.isShowing = false;
            return;
        }
        
        this.isShowing = true;
        const notification = this.queue.shift();
        this.displayNotification(notification);
    }
    
    /**
     * Affiche une notification individuelle
     * @param {Object} notification
     */
    displayNotification(notification) {
        const element = this.createNotificationElement(notification);
        this.container.appendChild(element);
        
        // Animation d'entrée
        requestAnimationFrame(() => {
            element.classList.add('show');
        });
        
        // Retirer après la durée spécifiée
        setTimeout(() => {
            this.removeNotification(element);
        }, notification.duration);
    }
    
    /**
     * Crée l'élément DOM de la notification
     * @param {Object} notification
     * @returns {HTMLElement}
     */
    createNotificationElement(notification) {
        const element = document.createElement('div');
        element.className = `notification notification--${notification.type}`;
        element.setAttribute('role', 'alert');
        
        const icon = this.getIcon(notification.type);
        
        element.innerHTML = `
            <span class="notification__icon">${icon}</span>
            <span class="notification__message">${notification.message}</span>
            <button class="notification__close" aria-label="Fermer la notification">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
            </button>
        `;
        
        // Fermeture manuelle
        const closeBtn = element.querySelector('.notification__close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(element);
        });
        
        return element;
    }
    
    /**
     * Obtient l'icône selon le type de notification
     * @param {string} type
     * @returns {string}
     */
    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ⓘ'
        };
        
        return icons[type] || icons.info;
    }
    
    /**
     * Retire une notification
     * @param {HTMLElement} element
     */
    removeNotification(element) {
        element.classList.remove('show');
        element.classList.add('hide');
        
        // Retirer après l'animation
        element.addEventListener('transitionend', () => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            
            // Traiter la notification suivante
            this.processQueue();
        }, { once: true });
    }
    
    /**
     * Affiche une notification de succès
     * @param {string} message
     * @param {number} duration
     */
    success(message, duration) {
        this.show(message, 'success', duration);
    }
    
    /**
     * Affiche une notification d'erreur
     * @param {string} message
     * @param {number} duration
     */
    error(message, duration) {
        this.show(message, 'error', duration);
    }
    
    /**
     * Affiche une notification d'avertissement
     * @param {string} message
     * @param {number} duration
     */
    warning(message, duration) {
        this.show(message, 'warning', duration);
    }
    
    /**
     * Affiche une notification d'information
     * @param {string} message
     * @param {number} duration
     */
    info(message, duration) {
        this.show(message, 'info', duration);
    }
    
    /**
     * Vide la file d'attente
     */
    clear() {
        this.queue = [];
        const notifications = this.container.querySelectorAll('.notification');
        notifications.forEach(notification => {
            this.removeNotification(notification);
        });
    }
}