/**
 * Utilitaires pour la manipulation du DOM
 */

/**
 * Sélectionne un élément du DOM
 * @param {string} selector - Le sélecteur CSS
 * @param {Element} parent - L'élément parent (optionnel)
 * @returns {Element|null}
 */
export function $(selector, parent = document) {
    return parent.querySelector(selector);
}

/**
 * Sélectionne tous les éléments correspondants
 * @param {string} selector - Le sélecteur CSS
 * @param {Element} parent - L'élément parent (optionnel)
 * @returns {NodeList}
 */
export function $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
}

/**
 * Crée un élément avec des attributs et du contenu
 * @param {string} tag - Le nom de la balise
 * @param {Object} attributes - Les attributs de l'élément
 * @param {string|Element|Array} children - Le contenu de l'élément
 * @returns {Element}
 */
export function createElement(tag, attributes = {}, children = null) {
    const element = document.createElement(tag);
    
    // Ajouter les attributs
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else if (key.startsWith('on')) {
            const eventName = key.substring(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Ajouter les enfants
    if (children) {
        if (typeof children === 'string') {
            element.textContent = children;
        } else if (Array.isArray(children)) {
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else {
                    element.appendChild(child);
                }
            });
        } else {
            element.appendChild(children);
        }
    }
    
    return element;
}

/**
 * Ajoute une classe à un élément
 * @param {Element} element
 * @param {...string} classNames
 */
export function addClass(element, ...classNames) {
    element.classList.add(...classNames);
}

/**
 * Retire une classe d'un élément
 * @param {Element} element
 * @param {...string} classNames
 */
export function removeClass(element, ...classNames) {
    element.classList.remove(...classNames);
}

/**
 * Bascule une classe sur un élément
 * @param {Element} element
 * @param {string} className
 * @param {boolean} force - Force l'ajout ou la suppression
 * @returns {boolean}
 */
export function toggleClass(element, className, force) {
    return element.classList.toggle(className, force);
}

/**
 * Vérifie si un élément a une classe
 * @param {Element} element
 * @param {string} className
 * @returns {boolean}
 */
export function hasClass(element, className) {
    return element.classList.contains(className);
}

/**
 * Affiche un élément
 * @param {Element} element
 * @param {string} displayType - Le type de display (par défaut 'block')
 */
export function show(element, displayType = 'block') {
    element.style.display = displayType;
}

/**
 * Cache un élément
 * @param {Element} element
 */
export function hide(element) {
    element.style.display = 'none';
}

/**
 * Bascule la visibilité d'un élément
 * @param {Element} element
 * @param {string} displayType
 */
export function toggle(element, displayType = 'block') {
    if (element.style.display === 'none') {
        show(element, displayType);
    } else {
        hide(element);
    }
}

/**
 * Attache un écouteur d'événement avec délégation
 * @param {Element} parent - L'élément parent
 * @param {string} eventType - Le type d'événement
 * @param {string} selector - Le sélecteur des éléments cibles
 * @param {Function} handler - Le gestionnaire d'événement
 */
export function delegate(parent, eventType, selector, handler) {
    parent.addEventListener(eventType, (event) => {
        const target = event.target.closest(selector);
        if (target && parent.contains(target)) {
            handler.call(target, event);
        }
    });
}

/**
 * Attend que le DOM soit chargé
 * @param {Function} callback
 */
export function ready(callback) {
    if (document.readyState !== 'loading') {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
}

/**
 * Anime un élément avec une transition
 * @param {Element} element
 * @param {Object} properties - Les propriétés CSS à animer
 * @param {number} duration - La durée en ms
 * @returns {Promise}
 */
export function animate(element, properties, duration = 300) {
    return new Promise((resolve) => {
        element.style.transition = `all ${duration}ms ease-in-out`;
        
        Object.entries(properties).forEach(([prop, value]) => {
            element.style[prop] = value;
        });
        
        setTimeout(() => {
            element.style.transition = '';
            resolve();
        }, duration);
    });
}

/**
 * Fait défiler jusqu'à un élément
 * @param {Element} element
 * @param {Object} options - Options de défilement
 */
export function scrollToElement(element, options = {}) {
    const defaultOptions = {
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
    };
    
    element.scrollIntoView({ ...defaultOptions, ...options });
}

/**
 * Obtient la position d'un élément
 * @param {Element} element
 * @returns {Object} - {top, left, bottom, right, width, height}
 */
export function getPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        bottom: rect.bottom + window.scrollY,
        right: rect.right + window.scrollX,
        width: rect.width,
        height: rect.height
    };
}

/**
 * Vide le contenu d'un élément
 * @param {Element} element
 */
export function empty(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Clone un élément en profondeur
 * @param {Element} element
 * @param {boolean} deep - Clone profond
 * @returns {Element}
 */
export function clone(element, deep = true) {
    return element.cloneNode(deep);
}