# tqdm

tqdm for node

Wrap an iterable in tqdm, and it will render the progress bar to stdout as it iterates.

Installation:
```shell
npm install tqdm
```


Usage:
```javascript
const tqdm = require(`tqdm`);

const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
for(let i of tqdm(array))
	// long calculations...
```


For infinite iterables, you need to specify a total number of iteations to complete. If no total is specified, tqdm will render
appropriate indefinite progress bar:

```javascript
for(let i of tqdm(generator(), {total: 50}))
	// long calculations...
```

This version also supports async generators:

```javascript
for await (let i of tqdm(asyncGenerator(), {total: 50}))
	// long calculations...
```

Normally, tqdm updates the same line, and assumes nothing else is written to stdout, you can set `sameLine` option to `false` to suppress
this behaviour:

```javascript
for(let i of tqdm(generator(), {total: 50, sameLine: true})) {
	// long calculations...
	console.log("Did something");
}
```

Options to pass to tqdm:

* `total` — number of iterations before halting;
* `sameLine` — boolean, outputs progress bar on the same line if `true`;
* `minIter` — the minimum number of iterations  between progress bar renders;
* `minInterval` — the minimal interval of time between progress bar renders;
* `render` — custom render function, accepts arguments:
	* `n` — number of completed iterations;
	* `total` — number of iterations to complete, `null` if infinite range;
	* `elapsed` — elapsed time in millyseconds.
