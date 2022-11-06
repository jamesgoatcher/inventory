import { LOADING_SCREEN_V_2 } from './loadingScreen.js';
import { handlePricing, valuations, showValuations } from './pricing.js';
import { util } from './utilities.js';
import { app } from './core.js';

const body = document.querySelector('body');
let data;

/*=================================
=            Initialize           =
=================================*/
function eventListeners () {
	document.querySelector('#header--refresh').addEventListener('click', app.HEADER_BUTTONS.bind(this, 'refresh'), false);
	document.querySelector('#header--title').addEventListener('click', app.HEADER_BUTTONS.bind(this, 'new'), false);
	document.querySelector('#header--close').addEventListener('click', app.HEADER_BUTTONS.bind(this, 'same'), false);
	document.querySelector('#parent_directory').addEventListener('click', app.PARENT_DIRECTORY, false);
	document.querySelector('#theme .name').addEventListener('click', app.COLOR_THEME_MENU, false);
	for (let i = 0; i < document.querySelectorAll('[data-theme]').length; i++) {
		document.querySelectorAll('[data-theme]')[i].addEventListener('click', app.CHANGE_COLOR_THEME.bind(this, document.querySelectorAll('[data-theme]')[i].dataset.theme), false);
	}
	document.querySelector('#valuations').addEventListener('click', showValuations, false);
};

function initFnsRefresh () {
	const navRows = Array.from(document.querySelectorAll('.nav--row'));
	const outputResults = document.querySelector('#output--results');
	const outputLocation = document.querySelector('#output--location');
	for (let i = 1; i < navRows.length; i++) navRows[i].remove();
	outputResults.innerHTML = '';
	outputLocation.innerHTML = '';
	app.MOBILE_OUTPUT_SLIDE_IN('off');
	initFns(false);
};

function initFns (once) {
	if (once) {
		LOADING_SCREEN_V_2();
		eventListeners();
	}
	util.loadJSON('js/data.json').then(res => {
		data = res;
		handlePricing(data);
		writeElsToDom();
	}).catch(error => { console.log('initFns error: ', error) });
};

function writeElsToDom () {
	app.GENERATE_CATEGORY_FOLDER();
	app.IS_MOBILE(); // Apply isMobile class to Aside to compensate for mobile browser footer
};

document.onreadystatechange = function () {
	if (document.readyState == 'complete') initFns(true);
};

export { body, data, initFnsRefresh };