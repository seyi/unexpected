/*global expect*/
describe('Error type', () => {
  it('should inspect the constructor name correctly', () => {
    expect(new TypeError('foo'), 'to inspect as', "TypeError('foo')");
  });

  it('should inspect correctly when the message is not set and there are no other properties', () => {
    expect(new Error(), 'to inspect as', 'Error()');
  });

  it('should inspect correctly when the message is set and there are no other properties', () => {
    expect(new Error('foo'), 'to inspect as', "Error('foo')");
  });

  it('should inspect correctly when the message is set and there are other properties', () => {
    var err = new Error('foo');
    err.bar = 123;
    expect(err, 'to inspect as', "Error({ message: 'foo', bar: 123 })");
  });

  it('should inspect correctly when the message is not set and there are other properties', () => {
    var err = new Error();
    err.bar = 123;
    expect(err, 'to inspect as', "Error({ message: '', bar: 123 })");
  });

  it('should diff instances with unwrapped values that do not produce a diff', () => {
    var clonedExpect = expect.clone().addType({
      name: 'numericalError',
      base: 'Error',
      identify(obj) {
        return this.baseType.identify(obj) && /^\d+$/.test(obj.message);
      },
      inspect(err, depth, output) {
        output.text(`Error#${err.message}`);
      },
      unwrap(obj) {
        return parseInt(obj.message, 10);
      }
    });
    expect(
      function() {
        clonedExpect(new Error('1'), 'to equal', new Error('2'));
      },
      'to throw',
      'expected Error#1 to equal Error#2'
    );
  });

  describe('with a custom Error class inheriting from Error', () => {
    function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }

    function MyError(message) {
      Error.call(this);
      this.message = message;
    }

    inherits(MyError, Error);

    it('should consider identical instances to be identical', () => {
      expect(new MyError('foo'), 'to equal', new MyError('foo'));
    });

    it('should consider an instance of the custom error different from an otherwise identical Error instance', () => {
      expect(
        function() {
          expect(new MyError('foo'), 'to equal', new Error('foo'));
        },
        'to throw',
        "expected MyError('foo') to equal Error('foo')\n" +
          '\n' +
          'Mismatching constructors MyError should be Error'
      );
    });

    it('should instances of the custom error different to be different when they have different messages', () => {
      expect(
        function() {
          expect(new MyError('foo'), 'to equal', new MyError('bar'));
        },
        'to throw',
        "expected MyError('foo') to equal MyError('bar')\n" +
          '\n' +
          'MyError({\n' +
          "  message: 'foo' // should equal 'bar'\n" +
          '                 //\n' +
          '                 // -foo\n' +
          '                 // +bar\n' +
          '})'
      );
    });

    describe('when the custom error has a "name" property', () => {
      var myError = new MyError('foo');
      myError.name = 'SomethingElse';

      it('should use the "name" property when inspecting instances', () => {
        expect(myError, 'to inspect as', "SomethingElse('foo')");
      });

      it('should use the "name" property when reporting mismatching constructors', () => {
        expect(
          function() {
            expect(myError, 'to equal', new Error('foo'));
          },
          'to throw',
          "expected SomethingElse('foo') to equal Error('foo')\n" +
            '\n' +
            'Mismatching constructors SomethingElse should be Error'
        );
      });

      it('should use the "name" property when diffing', () => {
        expect(
          function() {
            var otherMyError = new MyError('bar');
            otherMyError.name = 'SomethingElse';
            expect(myError, 'to equal', otherMyError);
          },
          'to throw',
          "expected SomethingElse('foo') to equal SomethingElse('bar')\n" +
            '\n' +
            'SomethingElse({\n' +
            "  message: 'foo' // should equal 'bar'\n" +
            '                 //\n' +
            '                 // -foo\n' +
            '                 // +bar\n' +
            '})'
        );
      });
    });
  });
});
