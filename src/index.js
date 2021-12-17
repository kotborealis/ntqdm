/**
 * renders progress to stdout
 * @private 
 * @param {Number} n - iterations completed
 * @param {Number} total - total iterations to do
 * @param {Number} elapsed - time taken so far in ms
 * @param {Boolean} sameLine - render on the same line
 */
function _render(n, total, elapsed, sameLine) {

	const cent = Math.floor( n / total * 100 );
	const est = ( 100 - ( cent + 0.000001 ) ) / ( cent + 0.0000001 ) * elapsed;
	const ips = n / ( ( elapsed + 0.000001 ) / 1000 );

	let out = "|";

	for (let i = 0; i < 10; i++) {
		if(total)
			out += i >= Math.round( cent / 10 ) ? "-" : "#";
		else
			out += (n - i) % 10 === 0 ? `/` : `-`;
	}

	out += `| ${n}`;

	if(total)
		out += `/${total} ${cent}%`

	out += ` [`;
	out += `elapsed: ${_formatter(elapsed)},`;

	if(total)
		out += ` left: ${_formatter(est)},`;

	out += ` ${ips.toFixed(2)} iters/s]\n`;

	if(sameLine && n !== 0)
		process.stdout.write("\u001b[1F\u001b[2K");

	process.stdout.write(out);
}


/**
 * Formats a time in ms to HH:MM:SS, or MM:SS if the time is less than an hour
 * @private 
 * @param {Number} msec
 * @return {string} out
 */
function _formatter(msec) {

	let out = "";
	let sec = Math.floor(msec / 1000);
	let min = Math.floor(sec / 60);
	let hour = Math.floor(min / 60);
	
	sec = sec - min * 60;
	min = min - hour * 60;
	
	if(hour > 0) {
		if(hour < 10) {
			out = "0"
		}
		out = out + hour.toString() + ":";
	}
	
	if(min < 10) {
		out = out + "0";
	}
	
	out = out + min.toString() +":";
	
	if(sec < 10) {
		out = out + "0";
	}
	
	out = out + sec.toString();

	return out;
}

/**
 * Adds a timed progress bar to iterables
 * @param {Iterable} iter
 * @param {Object} params - The optional parameters
 * @param {Number} params.total - The number of iterations to complete, needed for infinite iterables
 * @param {Number} params.minIter - The minimum number of iterations between progress bar updates
 * @param {Number} params.minInterval - The minimum amount of time between progress bar updates
 * @param {Boolean} params.sameLine - Output progress bars on new lines
 * @param {Function} params.render - Render function to overwrite default one
 */
function tqdm (iter, {
		minIter = 1,
		minInterval = 500,
		sameLine = true,
		render = _render,
		total = null
	} = {}) {
	
	const start = Date.now();
	const now = start;
	let lastn = 0;
	let lastElapsed  = 0;

	total = iter.hasOwnProperty(`length`) ? iter.length : total;

	// put an initial bar out
	render(0, total, 0);

	let n = 0;

	const boundHandler = () => {
		n++;
		
		const elapsed = Date.now() - start;
		
		if(n - lastn >= minIter && elapsed - lastElapsed >= minInterval) {			
			lastn = n;
			lastElapsed = elapsed;
			render(n, total, elapsed, sameLine);
		}
		
		return total == null || n < total;
	}

	const handledIterator = iter[Symbol.toStringTag] === `AsyncGenerator`
		? async function*() {
			for await (const i of iter) {
				yield i;
				if(!boundHandler())
					return;
			}
		}
		: function*() {
			for (const i of iter) {
				yield i;
				if(!boundHandler())
					return;
			}
		}

	return handledIterator();
}

module.exports = tqdm;
