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
            '\u001b[37mvar\u001b[39m foo \u001b[34m=\u001b[39m \u001b[30m"bar"\u001b[39m;'
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
            'int main(int argc, char \u001b[34m*\u001b[39m\u001b[34m*\u001b[39margv) {}'
        );
    });
});
