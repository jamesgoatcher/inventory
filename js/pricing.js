const valuationsUpdatedDate = '09/20/2022';
let valuations;

function handlePricing (dataset) {
	const categories = Object.entries(dataset.descriptions);
	const pricingObj = {
		'Super Nintendo': categorySum(categories, 'video_games--super_nintendo--'),
		'Gameboy':        categorySum(categories, 'video_games--gameboy--'),
		'Playstation':    categorySum(categories, 'video_games--playstation--'),
		'Nintendo 64':    categorySum(categories, 'video_games--nintendo_64--'),
		'Dreamcast':      categorySum(categories, 'video_games--dreamcast--'),
		'Playstation 2':  categorySum(categories, 'video_games--playstation_2--'),
		'Gamecube':       categorySum(categories, 'video_games--gamecube--'),
		'Arcade 1Up':     categorySum(categories, 'video_games--arcade1Up--'),
		'Graphic Novels': categorySum(categories, 'graphic_novels--'),
		'EC Archives':    categorySum(categories, 'ec_archives--'),
		'EGM':            batchSum(dataset.category.magazines.electronic_gaming_monthly.length, 12),
		'Mad':            batchSum(dataset.category.magazines.mad.length, 10),
		'Total 64':       batchSum(dataset.category.magazines.total_64.length, 12),
		'Comics':         categorySum(categories, 'comics--'),
		'Magic':          batchSum(18, 75),
		'Guitars':        categorySum(categories, 'guitars--'),
		'Vinyl':          categorySum(categories, 'vinyl--'),
		'Rolex':          categorySum(categories, 'misc--watches--')
	};
	pricingObj['Total Value'] = sumValuations(pricingObj);
	valuations = pricingObj;
	logValuations({valuationsUpdatedDate, pricingObj, categories});
};

function logValuations (logs) {
	console.log('%cAPPROXIMATE INVENTORY VALUATIONS', 'font-size: 1rem;');
	console.log(`%cas of ${logs.valuationsUpdatedDate}`, 'font-size: 1rem;');
	console.table(logs.pricingObj);
	console.log(`%c${logs.categories.length} items valued at:`, 'font-size: 1rem;');
	console.log(`%c${logs.pricingObj['Total Value']}`, 'font-size: 1rem; color: #bc0037');
};

function showValuations () {
	const body = document.querySelector('body');
	const container = document.createElement('div');
	const title = document.createElement('h2');
	const close = document.createElement('button');
	container.classList.add('valuations--container');
	title.innerText = 'Selected Valuations';
	close.innerText = 'Close';
	close.addEventListener('click', function () {
		document.querySelector('.valuations--container').remove();
	}, false);
	container.appendChild(title);
	for (let value in valuations) {
		const el = document.createElement('p');
		if (value === 'Total Value') el.classList.add('uppercase', 'bolder');
		el.innerText = `${value.split('_').join(' ')}: ${valuations[value]}`;
		container.appendChild(el);
	}
	container.appendChild(close);
	body.appendChild(container);
};

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});

const categorySum = (categories, label) => formatter.format(evalCategoryPricing(categories, label));

const batchSum = (len, mult) => formatter.format(len * mult);

const sumValuations = (obj) => {
	const sumArr = [];
	Object.values(obj).forEach(entry => {
		const split = entry.split(',');
		const noComma = split[0].split('$')[1] + split[1];
		sumArr.push(parseFloat(noComma));
	});
	return formatter.format(sumArr.reduce((acc, inc) => acc + inc));
};

const evalCategoryPricing = (categories, name) => {
	const tempArr = [];
	categories.forEach(category => category[0].includes(name) ? tempArr.push(category[1].price) : null);
	return tempArr.reduce((acc, inc) => acc + inc);
};

export { handlePricing, valuations, showValuations };