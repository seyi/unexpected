Asserts that a promise is rejected.

```js#async:true
var promiseThatWillBeRejected = new Promise(function(resolve, reject) {
  setTimeout(reject, 1);
});

return expect(promiseThatWillBeRejected, 'to be rejected');
```

If the promise is fulfilled, the assertion will fail with the following output:

```js#async:true
var fulfilledPromise = new Promise(function(resolve, reject) {
  setTimeout(resolve, 1);
});

return expect(fulfilledPromise, 'to be rejected');
```

```output
expected Promise to be rejected
  Promise unexpectedly fulfilled
```
