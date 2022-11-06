import { body, data, initFnsRefresh } from './app.js';
import { util } from './utilities.js';

const folders = document.getElementById('nav--folders');
const results = document.getElementById('output--results');
const preview = document.getElementById('preview');
const rootFolders = ['video_games', 'graphic_novels', 'ec_archives', 'magazines', 'comics', 'magic', 'guitars', 'vinyl', 'misc'];
let isMobileDevice = false;

/*===================================
=            Application           =
===================================*/
const app = {
	/* Write categories as folders to nav */
	GENERATE_CATEGORY_FOLDER: () => {
		for (let folder in data.category) {
			const row  = document.createElement('div');
			const icon = document.createElement('div');
			const img  = document.createElement('img');
			const link = document.createElement('span');
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
				if (e.keyCode === 13 || e.keyCode === 32) app.GENERATE_NEW_FOLDER(data.category[folder], folder, 1);
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
		const trigger = document.querySelector(`div[data-row="${parent}"]`) || document.querySelector(`div[data-row="${grandparent}-${parent}"]`);

		if (trigger.dataset.bool == 'false') {
			if (!Array.isArray(category) && typeof category !== 'string') {
				for (let folder in category) {
					const row  = document.createElement('div');
					const icon = document.createElement('div');
					const img  = document.createElement('img');
					const link = document.createElement('span');
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

					if (typeof grandparent !== 'string') {
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
				app.ACTIVE_ROW_FILE_COUNT({category: category, parent: parent, grandparent: grandparent, action: 'expand'});
			}
			app.ACTIVE_ROW('expand', parent, grandparent);
			// Data-bool
			trigger.setAttribute('data-bool', true);
		} else {
			// Print folder location
			app.PRINT_FOLDER_LOCATION(`${grandparent}`);
			app.DESTROY_ROW(grandparent, parent);
			app.ACTIVE_ROW('collapse', parent, grandparent);
			if (typeof grandparent === 'string') app.ACTIVE_ROW_FILE_COUNT({category: category, parent: parent, grandparent: grandparent, action: 'collapse'});
		}
	},
	/* Write final contents of category */
	GENERATE_NEW_FILE: (category, parent, multiplier, grandparent) => {
		// Add each file
		for (let i = (category.length-1); i >= 0; i--) {
			const row  = document.createElement('div');
			const icon = document.createElement('div');
			const img  = document.createElement('img');
			const link = document.createElement('span');
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
				if (e.keyCode === 13 || e.keyCode === 32) app.PRINT_FOLDER_RESULTS(parent, grandparent, category);
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
		const array = document.querySelectorAll(`div.nav--row:not([data-row="video_games"]):not([data-row="graphic_novels"]):not([data-row="ec_archives"]):not([data-row="magazines"]):not([data-row="comics"]):not([data-row="magic"]):not([data-row="guitars"]):not([data-row="vinyl"]):not([data-row="misc"]):not(#parent_directory)`);
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
		const outputLocation = document.querySelector('#output--location');

		if (location.substring(0,1) !== '[') {
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
		} else 
			outputLocation.innerHTML = '/';
	},
	/* Adds class that only does something on mobile */
	MOBILE_OUTPUT_SLIDE_IN: (trigger) => {
		if (trigger === 'on') {
			document.getElementById('output').classList.add('mobile-slide');
			document.getElementById('name').classList.add('mobile-hide');
			document.getElementById('preview').classList.add('mobile-show');
		} else if (trigger === 'off') {
			document.getElementById('output').classList.remove('mobile-slide');
			document.getElementById('name').classList.remove('mobile-hide');
			document.getElementById('preview').classList.remove('mobile-show');
		}
	},
	/* Add bg color to row */
	ACTIVE_ROW: (action, item, parent, optFileRow) => {
		const activeArray = document.querySelectorAll('.activeRow');

		switch (action) {
			case 'expand':
				if (optFileRow === 'file' && event.target.classList.contains('activeRow') !== true) {
					// Print folder location
					app.PRINT_FOLDER_LOCATION(`${parent}-${item}-${event.target.dataset.row.split('-')[1]}`)
					for (let el in activeArray) {
						try {
							if (activeArray[el].dataset.row.substring(0, parent.length) === parent) {
								activeArray[el].classList.add('parent');
							} else {
								activeArray[el].classList.remove('activeRow');
								activeArray[el].classList.remove('parent');
							}
						} catch (error) { continue };
					}
				}
				else {
					if (event.target.classList.contains('activeRow') === true) return;
					if (typeof parent === 'string') {
						for (let el in activeArray) {
							try {
								if (activeArray[el].dataset.row.substring(0, activeArray[el].dataset.row.length) === parent) {
									activeArray[el].classList.add('parent');
								} 
							} catch (error) { continue };
						}
						let
						parentArray = document.querySelectorAll('.parent');
						for (let el in parentArray) {
							try {
								if (parentArray[el].dataset.row.substring(0, parent.length + 1) === `${parent}-`) {
									parentArray[el].classList.remove('parent');
								}
							} catch (error) { continue };
						}
					} 
					else {
						for (let el in activeArray) {
							try {
								if (activeArray[el].dataset.row.substring(0, activeArray[el].dataset.row.length) !== item) {
									activeArray[el].classList.remove('activeRow');
									activeArray[el].classList.remove('parent');
								}
							} catch (error) { continue };
						}
					}
					app.DESTROY_ROW(parent, item, 'new_row');
				}
				event.target.classList.add('activeRow');
			break;

			case 'collapse':
				if (item === 'root' && activeArray.length > 0) {
					for (let el in activeArray) {
						try {
							activeArray[el].classList.remove('activeRow');
							activeArray[el].classList.remove('parent');
						} catch (error) { continue };
					}
				} 
				else {
					for (let el in activeArray) {
						try {
							if (typeof parent === 'string') {
								if (activeArray[el].dataset.row.substring(0, activeArray[el].dataset.row.length) === item) {
									// activeArray[el].classList.remove('activeRow');
									// activeArray[el].classList.remove('parent');
								}
							} else {
								activeArray[el].classList.remove('activeRow');
								activeArray[el].classList.remove('parent');
							}
						} catch (error) { continue };
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
		const contentCont = document.createElement('div');
		const imgCont = document.createElement('img');
		const name = document.createElement('div');
		const rootCategory = document.createElement('div');
		const description = document.createElement('div');
		const collapseButton = document.createElement('div');
		const file = event.target.dataset.row.split('-')[1];
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
		if (state === 'active') {
			preview.classList.add('activePreview');
		} else {
			preview.classList.remove('activePreview');
		}
	},
	/* Set or reset the folder name */
	ACTIVE_ROW_FILE_COUNT: (options) => {
		const folderCount = options.category.length;
		const folderElement = document.querySelector(`div[data-row="${options.grandparent}-${options.parent}"]`);
		const folderElementSpan = Array.from(folderElement.childNodes)[1];
		if (options.action === 'expand') {
			// Update folder name to include file count
			const folderElementSpanText = folderElementSpan.innerText;
			const folderElementSpanTextMutated = `${folderElementSpanText} (${folderCount})`;
			folderElementSpan.innerText = folderElementSpanTextMutated;
		} else if (options.action === 'collapse') {
			const parentName = options.parent.split('_').join(' ');
			folderElementSpan.innerText = parentName;
		}
	},
	/* Destroy row if clicked again */
	DESTROY_ROW: (grandparent, parent, newRow, optFilesSibling) => {
		const prefix = document.querySelectorAll(`[data-row*="${parent}-"]`);
		const files  = document.querySelectorAll(`[data-file]`);

		if (newRow !== 'new_row') {
			if (typeof grandparent !== 'string') {
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
			const inactiveChildren = document.querySelectorAll(`[data-row]`);
			const datafiles = document.querySelectorAll(`[data-origin]`);
			let variable;
			// File vs Folder
			switch (optFilesSibling) {
				case 'file_siblings': // Files level
					const grandparentArray = document.querySelectorAll(`[data-row*="${grandparent}-"]`);
					// ActiveRow removed
					for (let el in grandparentArray) {
						try { 
							if (grandparentArray[el].dataset.row.substring(grandparent.length + 1, grandparent.length + 1 + parent.length) != grandparent) {
								if (grandparentArray[el].classList.contains('activeRow')) {
									const header = grandparentArray[el].dataset.row.split('-')[1];
									const headerMutated = header.split('_').join(' ');
									Array.from(grandparentArray[el].childNodes)[1].innerText = headerMutated;
								}
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
							if (files[el].dataset.file === 'true' && files[el].dataset.row.substring(0, parent.length) !== parent) {
								files[el].remove();
							}
						} catch (error) {
							continue;
						}
					}
				break;

				default: // Folder level
					if (typeof grandparent !== 'string') {
						variable = parent;
					} else {
						variable = grandparent;
					}
					//
					for (let el in rootFolders) {
						if (event.target.dataset.row.substring(0, variable.length) !== rootFolders[el]) {
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
								if (event.target.dataset.row.substring(0, variable.length) !== datafiles[el].dataset.origin) {
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
		const dataTheme = document.querySelectorAll('[data-theme]');

		if (event.target.dataset.themebool === 'false') {
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
		const curtain = document.createElement('div');
		const welcome = document.createElement('div');
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
			const ua = navigator.userAgent || navigator.vendor || window.opera;
			const isInstagram = (ua.indexOf('Instagram') > -1) ? true : false;
			isMobileDevice = true;
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

export { app };