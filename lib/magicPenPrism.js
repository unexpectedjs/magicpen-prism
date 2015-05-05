var prism = require('../3rdparty/prism'),
    defaultTheme = {
        // Adapted from the default Prism theme:
        'prism:comment': '#708090', // slategray
        'prism:prolog': 'prism:comment',
        'prism:doctype': 'prism:comment',
        'prism:cdata': 'prism:comment',

        'prism:punctuation': '#999',

        'prism:symbol': '#905',
        'prism:property': 'prism:symbol',
        'prism:tag': 'prism:symbol',
        'prism:boolean': 'prism:symbol',
        'prism:number': 'prism:symbol',
        'prism:constant': 'prism:symbol',
        'prism:deleted': 'prism:symbol',

        'prism:string': '#690',
        'prism:selector': 'prism:string',
        'prism:attr-name': 'prism:string',
        'prism:char': 'prism:string',
        'prism:builtin': 'prism:string',
        'prism:inserted': 'prism:string',

        'prism:operator': '#a67f59',
        'prism:variable': 'prism:operator',
        'prism:entity': 'prism:operator',
        'prism:url': 'prism:operator',
        'prism:css:string': 'prism:operator',

        'prism:keyword': '#07a',
        'prism:atrule': 'prism:keyword',
        'prism:attr-value': 'prism:keyword',

        'prism:function': '#DD4A68',

        'prism:regex': '#e90',
        'prism:important': ['#e90', 'bold']
    },
    languageMapping = {
        'text/html': 'markup',
        'application/xml': 'markup',
        'text/xml': 'markup',
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

module.exports = {
    name: 'magicpen-prism',
    installInto: function (magicPen) {
        magicPen.installTheme(defaultTheme);

        magicPen.addStyle('code', function (sourceText, language) {
            if (language in languageMapping) {
                language = languageMapping[language];
            } else if (/\+xml\b/.test(language)) {
                language = 'markup';
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
    }
};
