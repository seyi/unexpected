Asserts that the function throws an error when called.

```js
function willThrow() {
  throw new Error('The error message');
}
expect(willThrow, 'to throw');
expect(willThrow, 'to throw error');
expect(willThrow, 'to throw exception');
```

In case of a failing expectation you get the following output:

```js
expect(function willNotThrow() {}, 'to throw');
```

```output
expected function willNotThrow() {} to throw
  did not throw
```

You can assert the error message is a given string if you provide a
string as the second parameter.

```js
expect(() => {
  throw new Error('The error message');
}, 'to throw', 'The error message');
```

In case of a failing expectation you get the following output:

```js#skipPhantom:true
expect(() => {
  throw new Error('The error message!');
}, 'to throw', 'The error message');
```

```output
expected
function () {
  throw new Error('The error message!');
}
to throw 'The error message'
  expected Error('The error message!') to satisfy 'The error message'

  -The error message!
  +The error message
```

By providing a regular expression as the second parameter you can
assert the error message matches the given regular expression.

```js
expect(() => {
  throw new Error('The error message');
}, 'to throw', /error message/);
```

In case of a failing expectation you get the following output:

```js#skipPhantom:true
expect(() => {
  throw new Error('The error message!');
}, 'to throw', /catastrophic failure/);
```

```output
expected
function () {
  throw new Error('The error message!');
}
to throw /catastrophic failure/
  expected Error('The error message!') to satisfy /catastrophic failure/
```

You can also provide a function as the second parameter to do
arbitrary assertions on the error.

```js
expect(() => {
  this.foo.bar();
}, 'to throw', (e) => {
  expect(e, 'to be a', TypeError);
});
```

In case of a failing expectation you get the following output:

```js#skipPhantom:true
expect(() => {
  throw new Error('Another error');
}, 'to throw', (e) => {
  expect(e, 'to be a', TypeError);
});
```

```output
expected
function () {
  throw new Error('Another error');
}
to throw
function (e) {
  expect(e, 'to be a', TypeError);
}
  expected Error('Another error') to be a TypeError
```

Actually what happens is, that the thrown error is checked
[to satisfy](/assertions/any/to-satisfy/) against the second
parameter. That means you could also just supply an error object to
validate against:

```js
expect(() => {
  throw new TypeError('Invalid syntax');
}, 'to throw', new TypeError('Invalid syntax'));
```

In case of a failing expectation you get the following output:

```js#skipPhantom:true
expect(() => {
  throw new Error('Another error');
}, 'to throw', new TypeError('Invalid syntax'));
```

```output
expected
function () {
  throw new Error('Another error');
}
to throw TypeError('Invalid syntax')
  expected Error('Another error') to satisfy TypeError('Invalid syntax')
```

```js
expect(() => {
  // Do some work that should not throw
}, 'not to throw');
```

In case of a failing expectation you get the following output:

```js#skipPhantom:true
expect(() => {
  throw new Error('threw anyway');
}, 'not to throw');
```

```output
expected
function () {
  throw new Error('threw anyway');
}
not to throw
  threw: Error('threw anyway')
```

To test functions that require input wrap the function invocation in an anonymous function:

```js
function willThrow(input) {
  if (input) throw new SyntaxError('The error message');
  return input;
}

expect(() => {
  willThrow('input.here');
}, 'to throw', new SyntaxError('The error message'));
```
