var prism = require('../3rdparty/prism'),
    colorByTokenType = {
        tag: '#ddd',
        'attr-name': 'green',
        'attr-value': 'cyan',
        string: '#123',
        punctuation: 'bold green',
        comment: 'gray',
        doctype: 'blue',
        keyword: '#abc',
        operator: '#919'
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
                var styleName = 'prism:' + parentStyle;
                styleName = that[styleName] ? styleName : 'text';
                that.write(styleName, token);
            } else {
                printTokens(token.content, token.type);
            }
        }
        printTokens(prism.tokenize(sourceText, prism.languages[language]), 'text');
    }, true);
};
