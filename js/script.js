'use strict';

/*==============================
=            GLOBAL            =
==============================*/
let 
body = document.querySelector('body'),
folders = document.getElementById('nav--folders'),
results = document.getElementById('output--results'),
preview = document.getElementById('preview'),
themeCount = 0,
introAnimCount = 1,
rootFolders = ['video_games', 'graphic_novels', 'ec_archives', 'magazines', 'comics', 'magic', 'guitars', 'vinyl', 'misc'],
data; // JSON

const
LOADING_INTRO_DATA = {
	header: 
	`<div>JPG.Inventory</div>
	<div>GAMI (Graphical Asset Management Interface)</div>
	<div>Version 2.0.1</div>`,
	copyright:
	`<div class="intro_data--row">Copyright &copy; 2019, 2020</div>
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
			let 
			mutatedString = stringToInterval.split(''),
			index = 0;
			let interval = setInterval(function () {
				el.innerText += mutatedString[index];
				if (index >= mutatedString.length - 1) clearInterval(interval);
				index++;
			}, incSpeed);
		}
	}
};

/* Loading Screen 2.0 */
function LOADING_SCREEN_V_2 () {
	let
	background = document.createElement('div'),
	container = document.createElement('div');
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
		let
		introChildren = Array.from(document.querySelectorAll('#Intro_Container > div')),
		introRealMem = document.querySelector('#Intro_RealMem'),
		introAvailMem = document.querySelector('#Intro_AvailMem'),
		introUsername = document.querySelector('#Intro_Username'),
		introPassword = document.querySelector('#Intro_Password'),
		introCommand = document.querySelector('#Intro_Command'),
		introLoadingBar = document.querySelector('#Intro_LoadingBar'),
		randUserNum = util.randomNumberGenerator(87653, 12345);
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

/* Cookies */
function setCookie (name, value, days) {
  let 
  expires = '';

  if (days) {
    let
    date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = '; expires=' + date.toUTCString();
  }

  document.cookie = name + '=' + (value || '')  + expires + '; path=/';
};

function getCookie (name) {
  let
  nameEQ = name + '=',
  ca = document.cookie.split(';');

  for(let i = 0; i < ca.length; i++) {
    let
    c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }

  return null;
};

function eraseCookie(name) {   
  document.cookie = name + '=; Max-Age=-99999999;';  
};

/*===================================
=            Application           =
===================================*/
const
app = {
	/* Write categories as folders to nav */
	GENERATE_CATEGORY_FOLDER: () => {
		for (let folder in data.category) {
			let
			row  = document.createElement('div'),
			icon = document.createElement('div'),
			img  = document.createElement('img'),
			link = document.createElement('span');
			// Attributes
			row.classList.add('nav--row');
			row.setAttribute('data-row', folder);
			row.setAttribute('data-bool', false);
			row.setAttribute('tabindex', '0');
			icon.classList.add('icon');
			img.setAttribute('src', 'img/folder.png');
			// Events
			row.addEventListener('click', app.GENERATE_NEW_FOLDER.bind(this, data.category[folder], folder, 1), false);
			row.addEventListener('keypress', function (e) {
				if (e.keyCode === 13 || e.keyCode === 32) {
					app.GENERATE_NEW_FOLDER(data.category[folder], folder, 1);
				}
			}, false);
			// Content
			link.innerHTML = util.formatObjStr(folder);
			// Append to DOM
			icon.appendChild(img);
			row.appendChild(icon);
			row.appendChild(link);
			folders.appendChild(row);
		}
	},
	/* Write sub-categories as folders to nav */
	GENERATE_NEW_FOLDER: (category, parent, multiplier, grandparent) => {
		let
		trigger = document.querySelector(`div[data-row="${parent}"]`) || document.querySelector(`div[data-row="${grandparent}-${parent}"]`);

		if (trigger.dataset.bool == 'false') {
			if (!Array.isArray(category) && typeof category != 'string') {
				for (let folder in category) {
					let
					row  = document.createElement('div'),
					icon = document.createElement('div'),
					img  = document.createElement('img'),
					link = document.createElement('span');
					// Attributes
					row.classList.add('nav--row');
					row.setAttribute('data-row', parent + '-' + folder);
					row.setAttribute('data-bool', false);
					row.setAttribute('tabindex', '0');
					row.style.marginLeft = `${multiplier}rem`;
					icon.classList.add('icon');
					img.setAttribute('src', 'img/folder.png');
					// Events
					row.addEventListener('click', app.GENERATE_NEW_FOLDER.bind(this, category[folder], folder, (multiplier + 1), parent), false);
					row.addEventListener('keypress', function (e) {
						if (e.keyCode === 13 || e.keyCode === 32) {
							app.GENERATE_NEW_FOLDER(category[folder], folder, (multiplier + 1), parent);
						}
					}, false);
					// Content
					link.innerHTML = util.formatObjStr(folder);
					// Append to DOM
					icon.appendChild(img);
					row.appendChild(icon);
					row.appendChild(link);

					if (typeof grandparent != 'string') {
						// Print folder location
						app.PRINT_FOLDER_LOCATION(`${parent}`);
						document.querySelector(`div[data-row="${parent}"]`).parentNode.insertBefore(row, document.querySelector(`div[data-row="${parent}"]`).nextSibling);
					} else {
						// Print folder location
						app.PRINT_FOLDER_LOCATION(`${grandparent}-${parent}`);
						document.querySelector(`div[data-row="${grandparent}-${parent}"]`).parentNode.insertBefore(row, document.querySelector(`div[data-row="${grandparent}-${parent}"]`).nextSibling);
					}
				}
			} else {
				// Send to final row creation
				app.GENERATE_NEW_FILE(category, parent, multiplier, grandparent);
			}
			app.ACTIVE_ROW('expand', parent, grandparent);
			// Data-bool
			trigger.setAttribute('data-bool', true);
		} else {
			// Print folder location
			app.PRINT_FOLDER_LOCATION(`${grandparent}`);
			app.DESTROY_ROW(grandparent, parent);
			app.ACTIVE_ROW('collapse', parent, grandparent);
		}
	},
	/* Write final contents of category */
	GENERATE_NEW_FILE: (category, parent, multiplier, grandparent) => {
		for (let i = (category.length-1); i >= 0; i--) {
			let
			row  = document.createElement('div'),
			icon = document.createElement('div'),
			img  = document.createElement('img'),
			link = document.createElement('span');
			// Attributes
			row.classList.add('nav--row');
			row.setAttribute('data-file', true);
			row.setAttribute('data-origin', grandparent);
			row.setAttribute('data-row', parent + '-' + category[i]);
			row.setAttribute('data-bool', false);
			row.setAttribute('tabindex', '0');
			row.style.marginLeft = `${multiplier}rem`;
			icon.classList.add('icon');
			img.setAttribute('src', 'img/file.gif');
			// Events
			row.addEventListener('click', app.PRINT_FOLDER_RESULTS.bind(this, parent, grandparent, category), false);
			row.addEventListener('keypress', function (e) {
				if (e.keyCode === 13 || e.keyCode === 32) {
					app.PRINT_FOLDER_RESULTS(parent, grandparent, category);
				}
			}, false);
			// Content
			link.innerHTML = util.formatObjStr(category[i]);
			// Append to DOM
			icon.appendChild(img);
			row.appendChild(icon);
			row.appendChild(link);
			// Write to page
			document.querySelector(`div[data-row="${grandparent}-${parent}"]`).parentNode.insertBefore(row, document.querySelector(`div[data-row="${grandparent}-${parent}"]`).nextSibling);
			// Print folder location
			app.PRINT_FOLDER_LOCATION(`${grandparent}-${parent}`);
		}
		// Active folder and destroy other open sibling folders
		app.DESTROY_ROW(grandparent, parent, 'new_row','file_siblings');
	},
	/* Collapse all into parent directory */
	PARENT_DIRECTORY: () => {
		let
		array = document.querySelectorAll(`div.nav--row:not([data-row="video_games"]):not([data-row="graphic_novels"]):not([data-row="ec_archives"]):not([data-row="magazines"]):not([data-row="comics"]):not([data-row="magic"]):not([data-row="guitars"]):not([data-row="vinyl"]):not([data-row="misc"]):not(#parent_directory)`);
		// Remove all opened folders
		for (let i = 0; i < array.length; i++) {
			array[i].remove();
		}
		// Print root details
		app.PRINT_FOLDER_LOCATION('root');
		// Reset boolean
		document.querySelector('[data-row="video_games"]').setAttribute('data-bool', false);
		document.querySelector('[data-row="graphic_novels"]').setAttribute('data-bool', false);
		document.querySelector('[data-row="ec_archives"]').setAttribute('data-bool', false);
		document.querySelector('[data-row="magazines"]').setAttribute('data-bool', false);
		document.querySelector('[data-row="comics"]').setAttribute('data-bool', false);
		document.querySelector('[data-row="magic"]').setAttribute('data-bool', false);
		document.querySelector('[data-row="guitars"]').setAttribute('data-bool', false);
		document.querySelector('[data-row="vinyl"]').setAttribute('data-bool', false);
		document.querySelector('[data-row="misc"]').setAttribute('data-bool', false);

		app.ACTIVE_ROW('collapse', 'root');
		results.innerHTML = '';
		app.ACTIVE_PREVIEW('inactive');
		app.MOBILE_OUTPUT_SLIDE_IN('off');
	},
	/* Prints folder location or server info */
	PRINT_FOLDER_LOCATION: (location) => {
		let
		outputLocation = document.querySelector('#output--location');

		if (location.substring(0,1) != '[') {
			switch (location) {
				case 'root':
					outputLocation.innerHTML = '/';
				break;

				default:
					location = location.split('=').join(':');
					if (!document.querySelector('aside').classList.contains('isMobile')) {
						outputLocation.innerHTML = `/${location.split('-').join('/')}`;
					} else {
						outputLocation.innerHTML = util.truncateString(`/${location.split('-').join('/')}`, 60);
					}
				break;
			}
		} else {
			outputLocation.innerHTML = '/';
		}
	},
	/* Adds class that only does something on mobile */
	MOBILE_OUTPUT_SLIDE_IN: (trigger) => {
		if (trigger == 'on') {
			document.getElementById('output').classList.add('mobile-slide');
			document.getElementById('name').classList.add('mobile-hide');
			document.getElementById('preview').classList.add('mobile-show');
		} else if (trigger == 'off') {
			document.getElementById('output').classList.remove('mobile-slide');
			document.getElementById('name').classList.remove('mobile-hide');
			document.getElementById('preview').classList.remove('mobile-show');
		}
	},
	/* Add bg color to row */
	ACTIVE_ROW: (action, item, parent, optFileRow) => {
		let
		activeArray = document.querySelectorAll('.activeRow');

		switch (action) {
			case 'expand':
				if (optFileRow == 'file' && event.target.classList.contains('activeRow') != true) {
					// Print folder location
					app.PRINT_FOLDER_LOCATION(`${parent}-${item}-${event.target.dataset.row.split('-')[1]}`)
					for (let el in activeArray) {
						try {
							if (activeArray[el].dataset.row.substring(0, parent.length) == parent) {
								activeArray[el].classList.add('parent');
							} else {
								activeArray[el].classList.remove('activeRow');
								activeArray[el].classList.remove('parent');
							}
						} catch (error) {
							continue;
						}
					}
				}
				else {
					if (event.target.classList.contains('activeRow') == true) return;
					if (typeof parent == 'string') {
						for (let el in activeArray) {
							try {
								if (activeArray[el].dataset.row.substring(0, activeArray[el].dataset.row.length) == parent) {
									activeArray[el].classList.add('parent');
								} 
							} catch (error) {
								continue;
							}
						}
						let
						parentArray = document.querySelectorAll('.parent');
						for (let el in parentArray) {
							try {
								if (parentArray[el].dataset.row.substring(0, parent.length + 1) == `${parent}-`) {
									parentArray[el].classList.remove('parent');
								}
							} catch (error) {
								continue;
							}
						}
					} 
					else {
						for (let el in activeArray) {
							try {
								if (activeArray[el].dataset.row.substring(0, activeArray[el].dataset.row.length) != item) {
									activeArray[el].classList.remove('activeRow');
									activeArray[el].classList.remove('parent');
								}
							} catch (error) {
								continue;
							}
						}
					}
					app.DESTROY_ROW(parent, item, 'new_row');
				}
				event.target.classList.add('activeRow');
			break;

			case 'collapse':
				if (item == 'root' && activeArray.length > 0) {
					for (let el in activeArray) {
						try {
							activeArray[el].classList.remove('activeRow');
							activeArray[el].classList.remove('parent');
						} catch (error) {
							continue;
						}
					}
				} 
				else {
					for (let el in activeArray) {
						try {
							if (typeof parent == 'string') {
								if (activeArray[el].dataset.row.substring(0, activeArray[el].dataset.row.length) == item) {
									// activeArray[el].classList.remove('activeRow');
									// activeArray[el].classList.remove('parent');
								}
							} else {
								activeArray[el].classList.remove('activeRow');
								activeArray[el].classList.remove('parent');
							}
						} catch (error) {
							continue;
						}
					}
				}
			break;

			default:
				console.dir('ACTIVE_ROW default evoked');
			break;
		}
	},
	/* Print folder contents to #output--results */
	PRINT_FOLDER_RESULTS: (parentDirectory, grandparentDirectory, array) => {
		// mimic folder preview
		results.innerHTML = '';
		let
		contentCont = document.createElement('div'),
		imgCont = document.createElement('img'),
		name = document.createElement('div'),
		rootCategory = document.createElement('div'),
		description = document.createElement('div'),
		collapseButton = document.createElement('div'),
		file = event.target.dataset.row.split('-')[1];
		// Attributes
		contentCont.classList.add('results--contentContainer');
		imgCont.classList.add('results--img');
		name.classList.add('bolder');
		rootCategory.classList.add('gray');
		description.classList.add('description');
		collapseButton.classList.add('collapse_button');
		collapseButton.setAttribute('tabindex', '0');
		collapseButton.addEventListener('click', app.MOBILE_OUTPUT_SLIDE_IN.bind(this, 'off'), false);
		// Content
		imgCont.src = `./img/photos/${parentDirectory}/${file}.jpg`;
		name.innerHTML = `${util.formatObjStr(file)}`;
		rootCategory.innerHTML = `${util.formatObjStr(grandparentDirectory)} - ${util.formatObjStr(parentDirectory)}`;
		if (data.descriptions[grandparentDirectory + '--' + parentDirectory + '--' + file].notes) {
			description.innerHTML = data.descriptions[grandparentDirectory + '--' + parentDirectory + '--' + file].notes;
		} else {
			description.innerHTML = 'No data yet.';	
		}
		collapseButton.innerHTML = 'Close Details';
		// Append to DOM
		contentCont.appendChild(name);
		contentCont.appendChild(rootCategory);
		contentCont.appendChild(description);
		contentCont.appendChild(collapseButton);

		results.appendChild(imgCont);
		results.appendChild(contentCont);
		// Add parent class
		app.ACTIVE_ROW('expand', parentDirectory, grandparentDirectory, 'file');
		// Add active to preview header
		app.ACTIVE_PREVIEW('active');
		//
		app.MOBILE_OUTPUT_SLIDE_IN('on');
	},
	/* Activate preview header */
	ACTIVE_PREVIEW: (state) => {
		if (state == 'active') {
			preview.classList.add('activePreview');
		} else {
			preview.classList.remove('activePreview');
		}
	},
	/* Destroy row if clicked again */
	DESTROY_ROW: (grandparent, parent, newRow, optFilesSibling) => {
		let
		prefix = document.querySelectorAll(`[data-row*="${parent}-"]`),
		files  = document.querySelectorAll(`[data-file]`);

		if (newRow != 'new_row') {
			if (typeof grandparent != 'string') {
				document.querySelector(`div[data-row="${parent}"]`).dataset.bool = false;		
			} else {
				document.querySelector(`div[data-row="${grandparent}-${parent}"]`).dataset.bool = false;
			}
			// Folders remove
			for (let i = 0; i < prefix.length; i++) {
				prefix[i].remove();
			}
			// Files remove
			for (let i = 0; i < files.length; i++) {
				files[i].remove();
			}
		} 
		else {
			// Collapse previous folder's tree
			let
			variable,
			inactiveChildren = document.querySelectorAll(`[data-row]`),
			datafiles = document.querySelectorAll(`[data-origin]`);
			// File vs Folder
			switch (optFilesSibling) {
				case 'file_siblings': // Files level
					let
					grandparentArray = document.querySelectorAll(`[data-row*="${grandparent}-"]`);
					// ActiveRow removed
					for (let el in grandparentArray) {
						try { 
							if (grandparentArray[el].dataset.row.substring(grandparent.length + 1, grandparent.length + 1 + parent.length) != grandparent) {
								grandparentArray[el].classList.remove('activeRow');
								grandparentArray[el].dataset.bool = false;
							} 
						} catch (error) {
							continue;
						}
					}
					// Destroy children files
					for (let el in files) {
						try {
							if (files[el].dataset.file == 'true' && files[el].dataset.row.substring(0, parent.length) != parent) {
								files[el].remove();
							}
						} catch (error) {
							continue;
						}
					}
				break;

				default: // Folder level
					if (typeof grandparent != 'string') {
						variable = parent;
					} else {
						variable = grandparent;
					}
					//
					for (let el in rootFolders) {
						if (event.target.dataset.row.substring(0, variable.length) != rootFolders[el]) {
							let
							notClickedElementSub = document.querySelectorAll(`[data-row*="${rootFolders[el]}-"]`);

							document.querySelector(`[data-row="${rootFolders[el]}"]`).dataset.bool = false;

							for (let i = 0; i < notClickedElementSub.length; i++) {
								notClickedElementSub[i].remove();
							}
						}
					}
					//
					if (datafiles.length > 0) {
						for (let el in datafiles) {
							try {
								if (event.target.dataset.row.substring(0, variable.length) != datafiles[el].dataset.origin) {
									datafiles[el].remove();
								}
							} catch (error) {
								continue;
							}
						}
					}
				break;
			}
		}
	},
	/* Active theme menu */
	COLOR_THEME_MENU: (menuPass) => {
		let
		dataTheme = document.querySelectorAll('[data-theme]');

		if (event.target.dataset.themebool == 'false') {
			document.querySelector('#theme .menu').classList.add('init');
			for (let el in dataTheme) {
				try {
					dataTheme[el].classList.add('show');
				} catch (error) {
					continue;
				}
			}
			event.target.dataset.themebool = true;
		} else if (menuPass === 'false') {
			document.querySelector('#theme .name').classList.add('flashColorTheme');
			document.querySelector('#theme .menu').classList.add('v-hidden');
			document.querySelector('#theme .menu').classList.remove('init');
			for (let el in dataTheme) {
				try {
					dataTheme[el].classList.remove('show');
				} catch (error) {
					continue;
				}
			}
			document.querySelector('#theme .name').dataset.themebool = false;
			setTimeout(function() {
				document.querySelector('#theme .name').classList.remove('flashColorTheme');
				document.querySelector('#theme .menu').classList.remove('v-hidden');
			}, 500);
		} else {
			document.querySelector('#theme .name').classList.add('flashColorTheme');
			document.querySelector('#theme .menu').classList.add('v-hidden');
			document.querySelector('#theme .menu').classList.remove('init');
			for (let el in dataTheme) {
				try {
					dataTheme[el].classList.remove('show');
				} catch (error) {
					continue;
				}
			}
			event.target.dataset.themebool = false;
			setTimeout(function() {
				document.querySelector('#theme .name').classList.remove('flashColorTheme');
				document.querySelector('#theme .menu').classList.remove('v-hidden');
			}, 500);
		}	
	},
	/* Change the theme */
	CHANGE_COLOR_THEME: (selection) => {
		switch (selection) {
			case 'theme--white': // Little White Dove
				body.style.setProperty('--active_color', '#888');
				body.style.setProperty('--parent_color', '#d8d8d8');
				body.style.setProperty('--bg_color', '#fff');
				body.style.setProperty('--text_color', '#000');
				document.querySelector('#theme .name').innerHTML = 'Theme: Little White Dove';
				break;

			case 'theme--dark': // Urbana's Too Dark
				body.style.setProperty('--active_color', '#d6d5d4');
				body.style.setProperty('--parent_color', '#5a5855');
				body.style.setProperty('--bg_color', '#222');
				body.style.setProperty('--text_color', 'antiquewhite');
				document.querySelector('#theme .name').innerHTML = 'Theme: Urbana&rsquo;s Too Dark';
				break

			case 'theme--bright': // Steal My Sunshine
				body.style.setProperty('--active_color', 'royalblue');
				body.style.setProperty('--parent_color', 'azure');
				body.style.setProperty('--bg_color', '#ffa951');
				body.style.setProperty('--text_color', '#000');
				document.querySelector('#theme .name').innerHTML = 'Theme: Steal My Sunshine';
				break;

			case 'theme--rosy': // Kiss Me, Kiss Me, Kiss Me
				body.style.setProperty('--active_color', '#3a3a3a');
				body.style.setProperty('--parent_color', '#c7dddd');
				body.style.setProperty('--bg_color', 'rosybrown');
				body.style.setProperty('--text_color', '#222');
				document.querySelector('#theme .name').innerHTML = 'Theme: Kiss Me, Kiss Me, Kiss Me';
				break;

			default:
				console.dir('CHANGE_COLOR_THEME default evoked.');
				break;
		}

		app.COLOR_THEME_MENU('false');
	},
	/* If no cookie, display instructions module */
	WELCOME_MODULE: () => {
		let
		curtain = document.createElement('div'),
		welcome = document.createElement('div');
		// Attributes
		curtain.classList.add('welcome_curtain');
		welcome.classList.add('welcome_div');
		body.classList.add('overflow_lock');
		// Content

		// Append to DOM
		curtain.appendChild(welcome);
		body.appendChild(curtain);

		setTimeout(function() {
			welcome.classList.add('init');
		}, 50);
	},
	/* Check if mobile device is used */
	IS_MOBILE: () => {
		if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i)) {
			let ua = navigator.userAgent || navigator.vendor || window.opera;
			let isInstagram = (ua.indexOf('Instagram') > -1) ? true : false;
			if (!isInstagram) {
				document.querySelector('aside').classList.add('isMobile'); // Apply isMobile class to Aside to compensate for mobile browser footer
				document.querySelector('#theme').classList.add('isMobile'); // Do the same to the Theme menu
			}
		}
	},
	/* Header fns*/
	HEADER_BUTTONS: (windowOption) => {
		switch (windowOption) {
			case 'new':
				window.open('http://jamesgoatcher.com', '_blank');
				break;
			case 'same':
				window.open('http://jamesgoatcher.com', '_self');
				break;
			case 'refresh':
				initFnsRefresh();
				break;
			default:
				location.reload();
				break;
		}
	}
};

/*================================
=            Utilities           =
================================*/
const
util = {
	/* Format text */
	formatObjStr: (str) => {
		str = str.split('_').join(' ');
		str = str.split('=').join(':');
		return str;
	},
	/* Clear Interval */
	clearInterval: (fns) => {
	  clearInterval(fns);
	},
	/* Quick sort algorithm */
	quickSort: (input) => {
		// If only 1 piece of data, return that
		if (input.length < 2) {
	  	return input;
		}
		// Declare first value as pivot and the left/right temp arrays
		let 
		pivot = input[0],
	  left  = [],
	  right = [];
		// Lump sort > / < value to pivot
		for (let i = 1; i < input.length; i++) {
			if (input[i] < pivot) {
	    	left.push(input[i]);
			} else {
	    	right.push(input[i]);
			}
		}

	// Recursively sort left of pivot and right of pivot using spread operator
		return [ ...util.quickSort(left), pivot, ...util.quickSort(right) ];
	},
	/* Truncate overflown strings */
	truncateString: (string, stringLength) => {
		if (string.length > stringLength) {
      return string.substring(0, stringLength) + '...';
    } else {
      return string;
    }
	},
	/* AJAX in JSON data */
	loadJSON: () => {
		let 
		xhttp = new XMLHttpRequest();

		xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       data = JSON.parse(xhttp.responseText);
	    }
		};

		xhttp.open('GET', 'js/data.json', true);
		xhttp.send();
	},
	/* Random number generator */
	randomNumberGenerator: (limit, limiter) => {
    // Limiter reverts to zero when array index needed; real nums need one
    return Math.floor( (Math.random() * limit) + (limiter || 0) );
  }
};

/*=================================
=            Initialize           =
=================================*/
const
/* DOM events */
eventListeners = () => {
	document.querySelector('#header--refresh').addEventListener('click', app.HEADER_BUTTONS.bind(this, 'refresh'), false);
	document.querySelector('#header--title').addEventListener('click', app.HEADER_BUTTONS.bind(this, 'new'), false);
	document.querySelector('#header--close').addEventListener('click', app.HEADER_BUTTONS.bind(this, 'same'), false);
	document.querySelector('#parent_directory').addEventListener('click', app.PARENT_DIRECTORY, false);
	document.querySelector('#theme .name').addEventListener('click', app.COLOR_THEME_MENU, false);
	for (let i = 0; i < document.querySelectorAll('[data-theme]').length; i++) {
		document.querySelectorAll('[data-theme]')[i].addEventListener('click', app.CHANGE_COLOR_THEME.bind(this, document.querySelectorAll('[data-theme]')[i].dataset.theme), false);
	}
},
initFnsRefresh = () => {
	// Remove all categories
	let 
	navRows = Array.from(document.querySelectorAll('.nav--row')),
	outputResults = document.querySelector('#output--results'),
	outputLocation = document.querySelector('#output--location');
	for (let i = 1; i < navRows.length; i++) {
		navRows[i].remove();
	}
	outputResults.innerHTML = '';
	outputLocation.innerHTML = '';
	// Reload elements
	util.loadJSON();
	setTimeout(function () {
		app.GENERATE_CATEGORY_FOLDER();
		app.IS_MOBILE(); // Apply isMobile class to Aside to compensate for mobile browser footer
	}, 1500);
},
/* Initialze */
initFns = () => {
	LOADING_SCREEN_V_2(); // intro screen 2.0
	eventListeners();
	util.loadJSON();

	setTimeout(function () {
		app.GENERATE_CATEGORY_FOLDER();
	//  app.WELCOME_MODULE();
	// 	setCookie('inventory_cookie','visited', 30);
	// 	let 
	// 	x = getCookie('inventory_cookie');
	// 	if (x) {
	// 		app.WELCOME_MODULE();
	// 	}
		app.IS_MOBILE(); // Apply isMobile class to Aside to compensate for mobile browser footer
	}, 1500);
};
/* Load script.js */
document.onreadystatechange = function () {
	if (document.readyState == 'complete') {
		initFns();
	}
};