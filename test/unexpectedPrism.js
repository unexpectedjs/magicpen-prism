var unexpected = require('unexpected'),
    unexpectedPrism = require('../lib/unexpectedPrism');

describe('unexpected-prism', function () {
    var expect = unexpected.clone().installPlugin(unexpectedPrism),
        output;

    beforeEach(function () {
        output = expect.output.clone();
    });

    it('should highlight JavaScript', function () {
        output.code('var foo = "bar";', 'javascript');
        expect(output.toString('ansi'), 'to equal', '\u001b[37mvar\u001b[39m foo \u001b[34m=\u001b[39m \u001b[30m"bar"\u001b[39m;');
    });

    it('should not touch an unsupported language', function () {
        output.code('var foo = "bar";', 'foobar');
        expect(output.toString('ansi'), 'to equal', 'var foo = "bar";');
    });

    it('should highlight C code (using internal mapping)', function () {
        output.code('int main(int argc, char **argv) {}', 'c');
        expect(output.toString('ansi'), 'to equal', 'int main(int argc, char \u001b[34m*\u001b[39m\u001b[34m*\u001b[39margv) {}');
    });
});
