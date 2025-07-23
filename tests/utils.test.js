/**
 * Tests pour les utilitaires
 */

import * as clipboard from '../src/js/utils/clipboard.js';
import * as dom from '../src/js/utils/domHelpers.js';

// Mock du navigator.clipboard
global.navigator.clipboard = {
    writeText: jest.fn(),
    readText: jest.fn(),
    write: jest.fn()
};

// Mock de window.isSecureContext
Object.defineProperty(window, 'isSecureContext', {
    writable: true,
    value: true
});

describe('Clipboard Utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = '';
    });
    
    describe('copyToClipboard', () => {
        it('devrait copier du texte avec l\'API moderne', async () => {
            navigator.clipboard.writeText.mockResolvedValueOnce();
            
            const result = await clipboard.copyToClipboard('Test text');
            
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test text');
            expect(result).toBe(true);
        });
        
        it('devrait utiliser le fallback si l\'API moderne échoue', async () => {
            navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Failed'));
            document.execCommand = jest.fn().mockReturnValue(true);
            
            const result = await clipboard.copyToClipboard('Test text');
            
            expect(document.execCommand).toHaveBeenCalledWith('copy');
            expect(result).toBe(true);
        });
        
        it('devrait retourner false si toutes les méthodes échouent', async () => {
            navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Failed'));
            document.execCommand = jest.fn().mockReturnValue(false);
            
            const result = await clipboard.copyToClipboard('Test text');
            
            expect(result).toBe(false);
        });
    });
    
    describe('readFromClipboard', () => {
        it('devrait lire le contenu du presse-papier', async () => {
            const mockText = 'Clipboard content';
            navigator.clipboard.readText.mockResolvedValueOnce(mockText);
            
            const result = await clipboard.readFromClipboard();
            
            expect(result).toBe(mockText);
        });
        
        it('devrait lancer une erreur si la lecture échoue', async () => {
            navigator.clipboard.readText.mockRejectedValueOnce(new Error('Permission denied'));
            
            await expect(clipboard.readFromClipboard()).rejects.toThrow('Impossible de lire le presse-papier');
        });
    });
    
    describe('isClipboardAvailable', () => {
        it('devrait retourner true si l\'API est disponible', () => {
            expect(clipboard.isClipboardAvailable()).toBe(true);
        });
        
        it('devrait retourner false si l\'API n\'est pas disponible', () => {
            const originalClipboard = navigator.clipboard;
            delete navigator.clipboard;
            
            expect(clipboard.isClipboardAvailable()).toBe(false);
            
            navigator.clipboard = originalClipboard;
        });
    });
    
    describe('copyWithRetry', () => {
        it('devrait réessayer en cas d\'échec', async () => {
            navigator.clipboard.writeText
                .mockRejectedValueOnce(new Error('Failed'))
                .mockResolvedValueOnce();
            
            const result = await clipboard.copyWithRetry('Test', 3);
            
            expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(2);
            expect(result).toBe(true);
        });
        
        it('devrait retourner false après toutes les tentatives', async () => {
            navigator.clipboard.writeText.mockRejectedValue(new Error('Failed'));
            document.execCommand = jest.fn().mockReturnValue(false);
            
            const result = await clipboard.copyWithRetry('Test', 2);
            
            expect(result).toBe(false);
        });
    });
});

describe('DOM Helpers', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="container">
                <p class="text">Paragraph 1</p>
                <p class="text">Paragraph 2</p>
                <button id="btn">Click me</button>
            </div>
        `;
    });
    
    describe('$ and $$', () => {
        it('devrait sélectionner un élément unique', () => {
            const element = dom.$('#btn');
            expect(element).toBeTruthy();
            expect(element.textContent).toBe('Click me');
        });
        
        it('devrait sélectionner plusieurs éléments', () => {
            const elements = dom.$$('.text');
            expect(elements.length).toBe(2);
            expect(elements[0].textContent).toBe('Paragraph 1');
        });
        
        it('devrait chercher dans un parent spécifique', () => {
            const container = document.getElementById('container');
            const element = dom.$('.text', container);
            expect(element.textContent).toBe('Paragraph 1');
        });
    });
    
    describe('createElement', () => {
        it('devrait créer un élément avec des attributs', () => {
            const div = dom.createElement('div', {
                id: 'test-div',
                className: 'test-class',
                'data-value': '123'
            });
            
            expect(div.id).toBe('test-div');
            expect(div.className).toBe('test-class');
            expect(div.getAttribute('data-value')).toBe('123');
        });
        
        it('devrait créer un élément avec du texte', () => {
            const p = dom.createElement('p', {}, 'Hello World');
            expect(p.textContent).toBe('Hello World');
        });
        
        it('devrait créer un élément avec des enfants', () => {
            const child1 = dom.createElement('span', {}, 'Child 1');
            const child2 = dom.createElement('span', {}, 'Child 2');
            const parent = dom.createElement('div', {}, [child1, 'Text', child2]);
            
            expect(parent.children.length).toBe(2);
            expect(parent.textContent).toBe('Child 1TextChild 2');
        });
        
        it('devrait ajouter des écouteurs d\'événements', () => {
            const onClick = jest.fn();
            const button = dom.createElement('button', {
                onClick: onClick
            }, 'Click');
            
            button.click();
            expect(onClick).toHaveBeenCalled();
        });
    });
    
    describe('Class manipulation', () => {
        let element;
        
        beforeEach(() => {
            element = document.createElement('div');
        });
        
        it('devrait ajouter des classes', () => {
            dom.addClass(element, 'class1', 'class2');
            expect(element.className).toBe('class1 class2');
        });
        
        it('devrait retirer des classes', () => {
            element.className = 'class1 class2 class3';
            dom.removeClass(element, 'class2', 'class3');
            expect(element.className).toBe('class1');
        });
        
        it('devrait basculer une classe', () => {
            dom.toggleClass(element, 'active');
            expect(element.classList.contains('active')).toBe(true);
            
            dom.toggleClass(element, 'active');
            expect(element.classList.contains('active')).toBe(false);
        });
        
        it('devrait vérifier la présence d\'une classe', () => {
            element.className = 'test-class';
            expect(dom.hasClass(element, 'test-class')).toBe(true);
            expect(dom.hasClass(element, 'other-class')).toBe(false);
        });
    });
    
    describe('Visibility', () => {
        let element;
        
        beforeEach(() => {
            element = document.createElement('div');
        });
        
        it('devrait afficher un élément', () => {
            element.style.display = 'none';
            dom.show(element);
            expect(element.style.display).toBe('block');
        });
        
        it('devrait cacher un élément', () => {
            dom.hide(element);
            expect(element.style.display).toBe('none');
        });
        
        it('devrait basculer la visibilité', () => {
            dom.toggle(element);
            expect(element.style.display).toBe('none');
            
            dom.toggle(element);
            expect(element.style.display).toBe('block');
        });
    });
    
    describe('Event delegation', () => {
        it('devrait déléguer des événements', () => {
            const container = document.getElementById('container');
            const handler = jest.fn();
            
            dom.delegate(container, 'click', '.text', handler);
            
            const paragraph = container.querySelector('.text');
            paragraph.click();
            
            expect(handler).toHaveBeenCalled();
            expect(handler.mock.instances[0]).toBe(paragraph);
        });
    });
    
    describe('DOM ready', () => {
        it('devrait exécuter le callback immédiatement si le DOM est prêt', () => {
            const callback = jest.fn();
            dom.ready(callback);
            expect(callback).toHaveBeenCalled();
        });
    });
    
    describe('Animation', () => {
        it('devrait animer un élément', async () => {
            const element = document.createElement('div');
            element.style.opacity = '1';
            
            const promise = dom.animate(element, { opacity: '0' }, 100);
            
            expect(element.style.transition).toContain('100ms');
            
            await promise;
            expect(element.style.opacity).toBe('0');
        });
    });
    
    describe('Position', () => {
        it('devrait obtenir la position d\'un élément', () => {
            const element = document.createElement('div');
            document.body.appendChild(element);
            
            // Mock getBoundingClientRect
            element.getBoundingClientRect = jest.fn().mockReturnValue({
                top: 100,
                left: 50,
                bottom: 200,
                right: 150,
                width: 100,
                height: 100
            });
            
            const position = dom.getPosition(element);
            
            expect(position.top).toBe(100);
            expect(position.left).toBe(50);
            expect(position.width).toBe(100);
            expect(position.height).toBe(100);
        });
    });
    
    describe('empty', () => {
        it('devrait vider le contenu d\'un élément', () => {
            const element = document.getElementById('container');
            expect(element.children.length).toBeGreaterThan(0);
            
            dom.empty(element);
            expect(element.children.length).toBe(0);
        });
    });
});