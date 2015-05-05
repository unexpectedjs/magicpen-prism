var expect = require('unexpected'),
    magicPenPrism = require('../lib/magicPenPrism'),
    MagicPen = require('magicpen');

describe('magicpen-prism', function () {
    var magicPen;
    beforeEach(function () {
        magicPen = new MagicPen().installPlugin(magicPenPrism);
    });

    it('should highlight JavaScript', function () {
        expect(
            magicPen.code('var foo = "bar";', 'javascript').toString('ansi'),
            'to equal',
            '\u001b[90m\u001b[38;5;74mvar\u001b[39m foo \u001b[90m\u001b[38;5;180m=\u001b[39m \u001b[32m\u001b[38;5;112m"bar"\u001b[39m\u001b[90m\u001b[38;5;247m;\u001b[39m'
        );
    });

    it('should format a multiline JavaScript chunk', function () {
        expect(
            magicPen.code('var foo = "bar",\n    quux = "baz";', 'javascript').toString(),
            'to equal',
            'var foo = "bar",\n    quux = "baz";'
        );
    });

    it('should highlight a language containing "+xml" as markup', function () {
        expect(
            magicPen.code(
                '<?xml version="1.0"?>\n' +
                '<svg width="120" height="120" viewBox="0 0 120 120"\n' +
                '     xmlns="http://www.w3.org/2000/svg" version="1.1"\n' +
                '     xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
                '    <circle cx="60" cy="60" r="50" />\n' +
                '</svg>',
                'image/svg+xml').toString('ansi'),
            'to equal',
                '\u001b[90m\u001b[38;5;110m<?xml version="1.0"?>\u001b[39m\n' +
                '\u001b[90m\u001b[38;5;247m<\u001b[39m\u001b[34m\u001b[38;5;162msvg \u001b[39m\u001b[32m\u001b[38;5;112mwidth\u001b[39m\u001b[90m\u001b[38;5;247m="\u001b[39m\u001b[90m\u001b[38;5;74m120\u001b[39m\u001b[90m\u001b[38;5;247m"\u001b[39m\u001b[34m\u001b[38;5;162m \u001b[39m\u001b[32m\u001b[38;5;112mheight\u001b[39m\u001b[90m\u001b[38;5;247m="\u001b[39m\u001b[90m\u001b[38;5;74m120\u001b[39m\u001b[90m\u001b[38;5;247m"\u001b[39m\u001b[34m\u001b[38;5;162m \u001b[39m\u001b[32m\u001b[38;5;112mviewBox\u001b[39m\u001b[90m\u001b[38;5;247m="\u001b[39m\u001b[90m\u001b[38;5;74m0 0 120 120\u001b[39m\u001b[90m\u001b[38;5;247m"\u001b[39m\n' +
                '\u001b[34m\u001b[38;5;162m     \u001b[39m\u001b[32m\u001b[38;5;112mxmlns\u001b[39m\u001b[90m\u001b[38;5;247m="\u001b[39m\u001b[90m\u001b[38;5;74mhttp://www.w3.org/2000/svg\u001b[39m\u001b[90m\u001b[38;5;247m"\u001b[39m\u001b[34m\u001b[38;5;162m \u001b[39m\u001b[32m\u001b[38;5;112mversion\u001b[39m\u001b[90m\u001b[38;5;247m="\u001b[39m\u001b[90m\u001b[38;5;74m1.1\u001b[39m\u001b[90m\u001b[38;5;247m"\u001b[39m\n' +
                '\u001b[34m\u001b[38;5;162m     \u001b[39mxmlns:\u001b[32m\u001b[38;5;112mxlink\u001b[39m\u001b[90m\u001b[38;5;247m="\u001b[39m\u001b[90m\u001b[38;5;74mhttp://www.w3.org/1999/xlink\u001b[39m\u001b[90m\u001b[38;5;247m">\u001b[39m\n' +
                '    \u001b[90m\u001b[38;5;247m<\u001b[39m\u001b[34m\u001b[38;5;162mcircle \u001b[39m\u001b[32m\u001b[38;5;112mcx\u001b[39m\u001b[90m\u001b[38;5;247m="\u001b[39m\u001b[90m\u001b[38;5;74m60\u001b[39m\u001b[90m\u001b[38;5;247m"\u001b[39m\u001b[34m\u001b[38;5;162m \u001b[39m\u001b[32m\u001b[38;5;112mcy\u001b[39m\u001b[90m\u001b[38;5;247m="\u001b[39m\u001b[90m\u001b[38;5;74m60\u001b[39m\u001b[90m\u001b[38;5;247m"\u001b[39m\u001b[34m\u001b[38;5;162m \u001b[39m\u001b[32m\u001b[38;5;112mr\u001b[39m\u001b[90m\u001b[38;5;247m="\u001b[39m\u001b[90m\u001b[38;5;74m50\u001b[39m\u001b[90m\u001b[38;5;247m"\u001b[39m\u001b[34m\u001b[38;5;162m \u001b[39m\u001b[90m\u001b[38;5;247m/>\u001b[39m\n\u001b[90m\u001b[38;5;247m</\u001b[39m\u001b[34m\u001b[38;5;162msvg\u001b[39m\u001b[90m\u001b[38;5;247m>\u001b[39m'
        );
    });

    it('should not touch an unsupported language', function () {
        expect(
            magicPen.code('var foo = "bar";', 'foobar').toString('ansi'),
            'to equal',
            'var foo = "bar";'
        );
    });

    it('should highlight C code (using internal mapping)', function () {
        expect(
            magicPen.code('int main(int argc, char **argv) {}', 'c').toString('ansi'),
            'to equal',
            'int \u001b[31m\u001b[38;5;204mmain\u001b[39m\u001b[90m\u001b[38;5;247m(\u001b[39mint argc\u001b[90m\u001b[38;5;247m,\u001b[39m char \u001b[90m\u001b[38;5;180m**\u001b[39margv\u001b[90m\u001b[38;5;247m)\u001b[39m \u001b[90m\u001b[38;5;247m{}\u001b[39m'
        );
    });
});
