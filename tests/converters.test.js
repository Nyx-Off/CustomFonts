/**
 * Tests pour les convertisseurs de texte
 */

import { FontConverter } from '../src/js/converters/baseConverter.js';
import { fontStyles } from '../src/js/config/fontStyles.js';
import { additionalConverters } from '../src/js/converters/additionalConverters.js';

describe('FontConverter', () => {
    let converter;
    
    beforeEach(() => {
        converter = new FontConverter(fontStyles, additionalConverters);
    });
    
    describe('convertWithMapping', () => {
        it('devrait convertir le texte avec un mapping simple', () => {
            const mapping = {
                'a': 'α',
                'b': 'β',
                'c': 'ς'
            };
            
            const result = converter.convertWithMapping('abc', mapping);
            expect(result).toBe('αβς');
        });
        
        it('devrait préserver les caractères non mappés', () => {
            const mapping = {
                'a': 'α'
            };
            
            const result = converter.convertWithMapping('a1b2c3', mapping);
            expect(result).toBe('α1b2c3');
        });
        
        it('devrait gérer les chaînes vides', () => {
            const mapping = { 'a': 'α' };
            const result = converter.convertWithMapping('', mapping);
            expect(result).toBe('');
        });
    });
    
    describe('convertToStyle', () => {
        it('devrait convertir en style Script', () => {
            const result = converter.convertToStyle('Hello', 'Script');
            expect(result).toBe('𝓗𝓮𝓵𝓵𝓸');
        });
        
        it('devrait convertir en style Fraktur', () => {
            const result = converter.convertToStyle('Test', 'Fraktur');
            expect(result).toBe('𝔗𝔢𝔰𝔱');
        });
        
        it('devrait retourner null pour un style inexistant', () => {
            const result = converter.convertToStyle('Test', 'StyleInexistant');
            expect(result).toBeNull();
        });
    });
    
    describe('convertAll', () => {
        it('devrait retourner toutes les conversions', () => {
            const results = converter.convertAll('Hi');
            
            expect(Array.isArray(results)).toBe(true);
            expect(results.length).toBeGreaterThan(0);
            
            // Vérifier la structure
            results.forEach(result => {
                expect(result).toHaveProperty('name');
                expect(result).toHaveProperty('text');
                expect(result).toHaveProperty('type');
            });
        });
        
        it('devrait inclure les conversions standard et spéciales', () => {
            const results = converter.convertAll('Test');
            
            const standardResults = results.filter(r => r.type === 'standard');
            const specialResults = results.filter(r => r.type === 'special');
            
            expect(standardResults.length).toBeGreaterThan(0);
            expect(specialResults.length).toBeGreaterThan(0);
        });
    });
    
    describe('getAvailableStyles', () => {
        it('devrait retourner tous les styles disponibles', () => {
            const styles = converter.getAvailableStyles();
            
            expect(Array.isArray(styles)).toBe(true);
            expect(styles).toContain('Script');
            expect(styles).toContain('Fraktur');
            expect(styles).toContain('Underline');
            expect(styles).toContain('Leet Speak');
        });
    });
    
    describe('hasStyle', () => {
        it('devrait retourner true pour un style existant', () => {
            expect(converter.hasStyle('Script')).toBe(true);
            expect(converter.hasStyle('Underline')).toBe(true);
        });
        
        it('devrait retourner false pour un style inexistant', () => {
            expect(converter.hasStyle('StyleInexistant')).toBe(false);
        });
    });
});

describe('Additional Converters', () => {
    describe('Underline converter', () => {
        const underlineConverter = additionalConverters.find(c => c.name === 'Underline');
        
        it('devrait ajouter un underline à chaque caractère', () => {
            const result = underlineConverter.convert('Test');
            expect(result).toBe('T̲e̲s̲t̲');
        });
    });
    
    describe('Leet Speak converter', () => {
        const leetConverter = additionalConverters.find(c => c.name === 'Leet Speak');
        
        it('devrait convertir en leet speak', () => {
            const result = leetConverter.convert('LEET');
            expect(result).toBe('|337');
        });
        
        it('devrait préserver les caractères non convertibles', () => {
            const result = leetConverter.convert('xyz');
            expect(result).toBe('xy2');
        });
    });
    
    describe('Reverse converter', () => {
        const reverseConverter = additionalConverters.find(c => c.name === 'Reverse');
        
        it('devrait inverser et retourner le texte', () => {
            const result = reverseConverter.convert('abc');
            // Le texte est inversé et les caractères sont retournés
            expect(result).toBe('ɔqɐ');
        });
    });
    
    describe('Fullwidth converter', () => {
        const fullwidthConverter = additionalConverters.find(c => c.name === 'Fullwidth');
        
        it('devrait convertir en caractères fullwidth', () => {
            const result = fullwidthConverter.convert('ABC123');
            expect(result).toBe('ＡＢＣ１２３');
        });
        
        it('devrait convertir les espaces en espaces fullwidth', () => {
            const result = fullwidthConverter.convert('A B');
            expect(result).toBe('Ａ　Ｂ');
        });
    });
});