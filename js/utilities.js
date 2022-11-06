/*================================
=            Utilities           =
================================*/
const util = {
	/* Format text */
	formatObjStr: (str) => {
		str = str.split('_').join(' ');
		str = str.split('=').join(':');
		return str;
	},
	/* Clear Interval */
	clearInterval: (fns) => clearInterval(fns),
	/* Quick sort arrays */
	quickSort: (input) => {
		if (input.length < 2) return input;
		let pivot = input[0];
	  let left  = [];
	  let right = [];
		for (let i = 1; i < input.length; i++) {
			if (input[i] < pivot) left.push(input[i]);
			else right.push(input[i]);
		}
		return [...util.quickSort(left), pivot, ...util.quickSort(right)];
	},
	/* Truncate overflown strings */
	truncateString: (string, stringLength) => {
		if (string.length > stringLength) return string.substring(0, stringLength) + '...';
    return string;
	},
	/* Fetch data */
	loadJSON: async (path) => {
		const res = await fetch(path);
		const json = await res.json();
		return json;
	},
	/* Random number generator */
	randomNumberGenerator: (limit, limiter) => Math.floor((Math.random() * limit) + (limiter || 0))
};

export { util };