var prism = require('../3rdparty/prism'),
    colorByTokenType = {
        // Adapted from the default Prism theme:
        comment: '#708090', // slategray
        prolog: '#708090',
        doctype: '#708090',
        cdata: '#708090',

        punctuation: '#999',

        property: '#905',
        tag: '#905',
        boolean: '#905',
        number: '#905',
        constant: '#905',
        symbol: '#905',
        deleted: '#905',

        selector: '#690',
        'attr-name': '#690',
        string: '#690',
        char: '#690',
        builtin: '#690',
        inserted: '#690',

        operator: '#a67f59',
        entity: '#a67f59',
        url: '#a67f59',
        'css:string': '#a67f59',
        variable: '#a67f59',

        atrule: '#07a',
        'attr-value': '#07a',
        keyword: '#07a',

        'function': '#DD4A68',

        regex: '#e90',
        important: '#e90 bold'
    },
    languageMapping = {
        'text/html': 'markup',
        'application/json': 'javascript',
        'text/javascript': 'javascript',
        'application/javascript': 'javascript',
        'text/css': 'css',
        html: 'markup',
        c: 'clike',
        'c++': 'clike',
        'cpp': 'clike',
        'c#': 'clike',
        java: 'clike'
    };

module.exports = function magicPenPrism(magicPen) {
    Object.keys(colorByTokenType).forEach(function (tokenType) {
        magicPen.addStyle('prism:' + tokenType, function (content) {
            this.text(content, colorByTokenType[tokenType]);
        });
    });

    magicPen.addStyle('code', function (sourceText, language) {
        if (language in languageMapping) {
            language = languageMapping[language];
        }
        if (!(language in prism.languages)) {
            return this.text(sourceText);
        }

        sourceText = sourceText.replace(/</g, '&lt;'); // Prismism

        var that = this;

        function printTokens(token, parentStyle) {
            if (Array.isArray(token)) {
                token.forEach(function (subToken) {
                    printTokens(subToken, parentStyle);
                });
            } else if (typeof token === 'string') {
                token = token.replace(/&lt;/g, '<');
                if (that['prism:' + language + ':' + parentStyle]) {
                    that['prism:' + language + ':' + parentStyle](token);
                } else if (that['prism:' + parentStyle]) {
                    that['prism:' + parentStyle](token);
                } else {
                    that.text(token);
                }
            } else {
                printTokens(token.content, token.type);
            }
        }
        printTokens(prism.tokenize(sourceText, prism.languages[language]), 'text');
    }, true);
};
