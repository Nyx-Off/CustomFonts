/**
 * Convertisseurs additionnels pour des styles spéciaux
 */

export const additionalConverters = [
    {
        name: "Underline",
        convert: (text) => {
            return text.split('').join('̲') + '̲';
        }
    },
    
    {
        name: "Strikethrough",
        convert: (text) => {
            return text.split('').join('̶') + '̶';
        }
    },
    
    {
        name: "Double Underline",
        convert: (text) => {
            return text.split('').join('̳') + '̳';
        }
    },
    
    {
        name: "Overline",
        convert: (text) => {
            return text.split('').join('̅') + '̅';
        }
    },
    
    {
        name: "Leet Speak",
        convert: (text) => {
            const leetMap = {
                'a': '4', 'A': '4',
                'e': '3', 'E': '3',
                'i': '1', 'I': '1',
                'o': '0', 'O': '0',
                'u': '(_)', 'U': '(_)',
                'l': '|', 'L': '|',
                's': '5', 'S': '5',
                't': '7', 'T': '7',
                'g': '9', 'G': '9',
                'b': '8', 'B': '8',
                'z': '2', 'Z': '2'
            };
            
            return text.split('').map(char => leetMap[char] || char).join('');
        }
    },
    
    {
        name: "Reverse",
        convert: (text) => {
            const reverseMap = {
                'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
                'i': 'ı', 'j': 'ɾ', 'k': 'ʞ', 'l': 'ן', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
                'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
                'y': 'ʎ', 'z': 'z',
                'A': '∀', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': '⅁',
                'H': 'H', 'I': 'I', 'J': 'ſ', 'K': '⋊', 'L': '⅂', 'M': 'W', 'N': 'N',
                'O': 'O', 'P': 'Ԁ', 'Q': 'Ό', 'R': 'ᴚ', 'S': 'S', 'T': '⊥', 'U': '∩',
                'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z'
            };
            
            return text.split('').map(char => reverseMap[char] || char).reverse().join('');
        }
    },
    
    {
        name: "Bubble Text",
        convert: (text) => {
            const bubbleMap = {
                'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ',
                'h': 'ⓗ', 'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ',
                'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ',
                'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ',
                'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ',
                'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ',
                'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ',
                'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ',
                '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④',
                '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
            };
            
            return text.split('').map(char => bubbleMap[char] || char).join('');
        }
    },
    
    {
        name: "Fullwidth",
        convert: (text) => {
            return text.split('').map(char => {
                const code = char.charCodeAt(0);
                // Convertir les caractères ASCII en fullwidth
                if (code >= 33 && code <= 126) {
                    return String.fromCharCode(code + 0xFEE0);
                }
                // Espace
                if (code === 32) {
                    return String.fromCharCode(0x3000);
                }
                return char;
            }).join('');
        }
    },
    
    {
        name: "Zalgo",
        convert: (text) => {
            const zalgoUp = ['̍', '̎', '̄', '̅', '̿', '̑', '̆', '̐', '͒', '͗', '͑', '̇', '̈', '̊', '͂', '̓', '̈́', '͊', '͋', '͌', '̃', '̂', '̌', '͐', '̀', '́', '̋', '̏', '̒', '̓', '̔', '̽', '̉', 'ͣ', 'ͤ', 'ͥ', 'ͦ', 'ͧ', 'ͨ', 'ͩ', 'ͪ', 'ͫ', 'ͬ', 'ͭ', 'ͮ', 'ͯ', '̾', '͛', '͆', '̚'];
            const zalgoDown = ['̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬', '̭', '̮', '̯', '̰', '̱', '̲', '̳', '̹', '̺', '̻', '̼', 'ͅ', '͇', '͈', '͉', '͍', '͎', '͓', '͔', '͕', '͖', '͙', '͚', '̣'];
            const zalgoMid = ['̕', '̛', '̀', '́', '͘', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '͜', '͝', '͞', '͟', '͠', '͢', '̸', '̷', '͡'];
            
            return text.split('').map(char => {
                if (char === ' ') return char;
                
                let result = char;
                const intensity = 3; // Intensité du zalgo (1-10)
                
                // Ajouter des caractères zalgo aléatoires
                for (let i = 0; i < intensity; i++) {
                    if (Math.random() < 0.5) {
                        result += zalgoUp[Math.floor(Math.random() * zalgoUp.length)];
                    }
                    if (Math.random() < 0.5) {
                        result += zalgoDown[Math.floor(Math.random() * zalgoDown.length)];
                    }
                    if (Math.random() < 0.5) {
                        result += zalgoMid[Math.floor(Math.random() * zalgoMid.length)];
                    }
                }
                
                return result;
            }).join('');
        }
    },
    
    {
        name: "Square",
        convert: (text) => {
            const squareMap = {
                'a': '🄰', 'b': '🄱', 'c': '🄲', 'd': '🄳', 'e': '🄴', 'f': '🄵', 'g': '🄶',
                'h': '🄷', 'i': '🄸', 'j': '🄹', 'k': '🄺', 'l': '🄻', 'm': '🄼', 'n': '🄽',
                'o': '🄾', 'p': '🄿', 'q': '🅀', 'r': '🅁', 's': '🅂', 't': '🅃', 'u': '🅄',
                'v': '🅅', 'w': '🅆', 'x': '🅇', 'y': '🅈', 'z': '🅉',
                'A': '🄰', 'B': '🄱', 'C': '🄲', 'D': '🄳', 'E': '🄴', 'F': '🄵', 'G': '🄶',
                'H': '🄷', 'I': '🄸', 'J': '🄹', 'K': '🄺', 'L': '🄻', 'M': '🄼', 'N': '🄽',
                'O': '🄾', 'P': '🄿', 'Q': '🅀', 'R': '🅁', 'S': '🅂', 'T': '🅃', 'U': '🅄',
                'V': '🅅', 'W': '🅆', 'X': '🅇', 'Y': '🅈', 'Z': '🅉'
            };
            
            return text.split('').map(char => squareMap[char] || char).join('');
        }
    }
];