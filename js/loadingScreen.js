import { body } from './app.js';
import { util } from './utilities.js';

const currentYear = new Date().getFullYear();
const LOADING_INTRO_DATA = {
	header: 
	`<div>JPG.Inventory</div>
	<div>GAMI (Graphical Asset Management Interface)</div>
	<div>Version 2.1.1</div>`,
	copyright:
	`<div class="intro_data--row">Copyright &copy; 2019 - ${currentYear}</div>
	<div>James P. Goatcher dba JPG</div>
	<div>All Rights Reserved</div>`,
	memory: 
	`<div class="intro_data--row">real &nbsp;mem = <span id="Intro_RealMem"></span> TB;</div>
	<div>avail mem = <span id="Intro_AvailMem"></span> TB;</div>`,
	cache: 
	`<div class="intro_data--row">primary data cache : 1.05 TB;</div>
	<div>primary inst.cache : 1.25 TB;</div>
	<div>secondary cache &nbsp;&nbsp;&nbsp;: 53.5 TB;</div>`,
	user:
	`<div class="intro_data--row">username: <span class="hidden" id="Intro_Username"></span></div>`,
	pw:
	`<div>password: <span id="Intro_Password"></span></div>`,
	command: 
	`<div class="intro_data--row">> <span id="Intro_Command"></span></div>`,
	results:
	`<div class="intro_data--row">reading "manifest.log"</div>
	<div class="intro_data--row">loading "jpg.inv.min"</div>
	<div class="intro_data--row intro_data--loading_bar"><div id="Intro_LoadingBar"></div></div>`,
	fns: {
		iterateToLimit: function (el, incSpeed, limit) {
			let init = 0;
			let interval = setInterval(function () {
				el.innerText = init;
				if (init >= limit) clearInterval(interval);
				init += incSpeed;
			}, 1);
		},
		lettersOnInterval: function (el, incSpeed, stringToInterval) {
			let mutatedString = stringToInterval.split('');
			let index = 0;
			let interval = setInterval(function () {
				el.innerText += mutatedString[index];
				if (index >= mutatedString.length - 1) clearInterval(interval);
				index++;
			}, incSpeed);
		}
	}
};

function LOADING_SCREEN_V_2 () {
	const background = document.createElement('div');
	const container = document.createElement('div');
	// Attributes
	background.classList.add('container--intro_anim');
	container.classList.add('intro_anim');
	container.classList.add('v2');
	container.id = 'Intro_Container';
	container.innerHTML = `
	${LOADING_INTRO_DATA.header}
	${LOADING_INTRO_DATA.copyright}
	${LOADING_INTRO_DATA.memory}
	${LOADING_INTRO_DATA.cache}
	${LOADING_INTRO_DATA.user}
	${LOADING_INTRO_DATA.pw}
	${LOADING_INTRO_DATA.command}
	${LOADING_INTRO_DATA.results}`;
	// To DOM
	background.appendChild(container);
	body.appendChild(background);
	body.style.visibility = 'visible';
	// Activate rows
	setTimeout(function () {
		const introChildren = Array.from(document.querySelectorAll('#Intro_Container > div'));
		const introRealMem = document.querySelector('#Intro_RealMem');
		const introAvailMem = document.querySelector('#Intro_AvailMem');
		const introUsername = document.querySelector('#Intro_Username');
		const introPassword = document.querySelector('#Intro_Password');
		const introCommand = document.querySelector('#Intro_Command');
		const introLoadingBar = document.querySelector('#Intro_LoadingBar');
		const randUserNum = util.randomNumberGenerator(87653, 12345);
		// Variables
		introUsername.innerHTML = `guest_${randUserNum}`;
		// Make visible
		introChildren[0].classList.add('visible');
		setTimeout(function () { introChildren[1].classList.add('visible'); }, 100);
		setTimeout(function () { introChildren[2].classList.add('visible'); }, 200);
		setTimeout(function () { introChildren[3].classList.add('visible'); }, 300);
		setTimeout(function () { introChildren[4].classList.add('visible'); }, 500);
		setTimeout(function () { introChildren[5].classList.add('visible'); }, 600);
		setTimeout(function () { // real memory
			introChildren[6].classList.add('visible');
			LOADING_INTRO_DATA.fns.iterateToLimit(introRealMem, 80, 8200);
		}, 800);
		setTimeout(function () { // avail memory
			introChildren[7].classList.add('visible');
			LOADING_INTRO_DATA.fns.iterateToLimit(introAvailMem, 80, 32800);
		}, 1350);
		setTimeout(function () { introChildren[8].classList.add('visible'); }, 3500);
		setTimeout(function () { introChildren[9].classList.add('visible'); }, 3600);
		setTimeout(function () { introChildren[10].classList.add('visible'); }, 3700);
		setTimeout(function () { // username
			introChildren[11].classList.add('visible');
			setTimeout(function () { introUsername.classList.remove('hidden'); }, 600);
		}, 3900);
		setTimeout(function () { // password
			introChildren[12].classList.add('visible');
			setTimeout(function () { LOADING_INTRO_DATA.fns.lettersOnInterval(introPassword, 125, '*********') }, 500);
		}, 4900);
		setTimeout(function () { // command
			introChildren[13].classList.add('visible');
			setTimeout(function () { LOADING_INTRO_DATA.fns.lettersOnInterval(introCommand, 75, 'device -dv | -a') }, 300);
		}, 7200);
		setTimeout(function () { introChildren[14].classList.add('visible'); }, 9400);
		setTimeout(function () { introChildren[15].classList.add('visible'); }, 10600);
		setTimeout(function () { // loading bar
			introChildren[16].classList.add('visible');
			introLoadingBar.classList.add('loadBarTo100');
		}, 10700);
		setTimeout(function () { document.querySelector('.container--intro_anim').remove(); }, 12500); // original intro anim - remove div

	}, 200);
};

export { LOADING_SCREEN_V_2 };