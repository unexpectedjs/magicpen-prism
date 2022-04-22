const oldPrismGlobal = global.Prism;
const prism = (global.Prism = require('prismjs'));
require('prismjs/components/prism-graphql.js');
require('prismjs/components/prism-csp.js');
require('prismjs/components/prism-jsx.js');
global.Prism = oldPrismGlobal || prism;

const defaultTheme = {
  // Adapted from the default Prism theme:
  prismComment: '#708090', // slategray
  prismProlog: 'prismComment',
  prismDoctype: 'prismComment',
  prismCdata: 'prismComment',

  prismPunctuation: '#999',

  prismSymbol: '#905',
  prismProperty: 'prismSymbol',
  prismTag: 'prismSymbol',
  prismBoolean: 'prismSymbol',
  prismNumber: 'prismSymbol',
  prismConstant: 'prismSymbol',
  prismDeleted: 'prismSymbol',

  prismString: '#690',
  prismSelector: 'prismString',
  prismAttrName: 'prismString',
  prismChar: 'prismString',
  prismBuiltin: 'prismString',
  prismInserted: 'prismString',

  prismOperator: '#a67f59',
  prismVariable: 'prismOperator',
  prismEntity: 'prismOperator',
  prismUrl: 'prismOperator',
  prismCssString: 'prismOperator',

  prismKeyword: '#07a',
  prismAtrule: 'prismKeyword',
  prismAttrValue: 'prismKeyword',

  prismFunction: '#DD4A68',

  prismRegex: '#e90',
  prismImportant: ['#e90', 'bold'],
};

const languageMapping = {
  'text/html': 'markup',
  'application/xml': 'markup',
  'text/xml': 'markup',
  'application/json': 'javascript',
  'text/javascript': 'javascript',
  'application/javascript': 'javascript',
  'text/css': 'css',
  html: 'markup',
  xml: 'markup',
  c: 'clike',
  'c++': 'clike',
  cpp: 'clike',
  'c#': 'clike',
  java: 'clike',
  'application/graphql': 'graphql',
  jsx: 'jsx',
};

function upperCamelCase(str) {
  return str.replace(/(?:^|-)([a-z])/g, function ($0, ch) {
    return ch.toUpperCase();
  });
}

module.exports = {
  name: 'magicpen-prism',
  version: require('../package.json').version,
  installInto: function (magicPen) {
    magicPen.installTheme(defaultTheme);

    magicPen.addStyle(
      'code',
      function (sourceText, language) {
        if (language in languageMapping) {
          language = languageMapping[language];
        } else if (/\+xml\b/.test(language)) {
          language = 'markup';
        }
        if (!(language in prism.languages)) {
          return this.text(sourceText);
        }
        const that = this;
        const capitalizedLanguage = upperCamelCase(language);
        const languageDefinition = prism.languages[language];

        function printTokens(token, parentStyle) {
          if (Array.isArray(token)) {
            token.forEach(function (subToken) {
              printTokens(subToken, parentStyle);
            });
          } else if (typeof token === 'string') {
            const upperCamelCasedParentStyle = upperCamelCase(parentStyle);
            token = token.replace(/&lt;/g, '<');
            if (
              that['prism' + capitalizedLanguage + upperCamelCasedParentStyle]
            ) {
              that['prism' + capitalizedLanguage + upperCamelCasedParentStyle](
                token
              );
            } else if (that['prism' + upperCamelCasedParentStyle]) {
              that['prism' + upperCamelCasedParentStyle](token);
            } else if (
              languageDefinition[parentStyle] &&
              languageDefinition[parentStyle].alias
            ) {
              printTokens(token, languageDefinition[parentStyle].alias);
            } else {
              that.text(token);
            }
          } else {
            printTokens(token.content, token.type);
          }
        }
        printTokens(
          prism.tokenize(sourceText, prism.languages[language]),
          'text'
        );
      },
      true
    );
  },
};
