'use strict';

// Variables
const 
categoryEl             = document.querySelector('#category'), // Category dropdown
subcategoryEl          = document.querySelector('#subcategory'), // Subcategory dropdown
nameEl                 = document.querySelector('#name'), // Name input
descriptionEl          = document.querySelector('#description'), // Description textarea
addToManifestBtn       = document.querySelector('#add-to-manifest'), // Add item to batch
generateNewManifestBtn = document.querySelector('#generate-new-manifest'), // Download the newly generated manifest
itemsInFolder          = document.querySelector('#items-in-folder'), // Items in the Category > Subcategory folder
newJsonTab             = document.querySelector('#json-new-tab'), // Display new JSON tab
fullJsonTab            = document.querySelector('#json-full-tab'), // Display full JSON tab
displayJSON            = document.querySelector('#display-json'), // Display the JSON
errorDisplay           = document.querySelector('#error-display'), // Display validation errors
aboutBtn 							 = document.querySelector('#about'), // About trigger, open
closeAboutBtn 				 = document.querySelector('#about-close'), // About trigger, close
dataReq                = new Request('js/data.json'); // JSON file

let
dataJsonFetched, // Fetched JSON
manifestTemp = '', // Write to temp object to eventually send as file
manifestFullTemp, // Above but for full
dataJsonSent, // Output upon addition
dropdownData = []; // Mutated categories and subcategories

// Get data
fetch(dataReq)
	.then(response => response.json())
	.then(dataRes => {
		dataJsonFetched = dataRes;
		manifestFullTemp = dataRes;
		initData(dataRes);
	})
	.catch(console.error);

// App
const
initData = (dataRes) => {
	let 
	counter = 0,
	categories = Object.keys(dataRes.category);

	for (let i = 0; i < categories.length; i++) {
		let 
		catObj = {},
		catSub = Object.keys(dataRes.category[`${categories[i]}`]);
		catObj[`${categories[i]}`] = [];

		for (let j = 0; j < catSub.length; j++) {
			catObj[`${categories[i]}`].push(catSub[j]);
		}

		dropdownData.push(catObj);
	}

	populateCatDropdown();
},

populateCatDropdown = () => {
	for (let i = 0; i < dropdownData.length; i++) {
		let categoryOptions = Object.keys(dropdownData[i]);
		let option = new Option(categoryOptions[0].split('_').join(' '), categoryOptions[0]);
		categoryEl.options.add(option);
	}

	populateSubDropdown();
},

populateSubDropdown = () => {
	let 
	categoryValue = categoryEl.value;
	subcategoryEl.innerHTML = '';

	if (categoryEl.value == 'void') subcategoryEl.disabled = true;
	else subcategoryEl.disabled = false;

	for (let i = 0; i < dropdownData.length; i++) {
		if (dropdownData[i].hasOwnProperty(`${categoryValue}`)) {
			let subArr = dropdownData[i][`${categoryValue}`].sort();
			for (let j = 0; j < subArr.length; j++) {
				let option = new Option(subArr[j].split('_').join(' '), subArr[j]);
				subcategoryEl.options.add(option);
			}
		}
	}
	populateItemsInFolder();
},

populateItemsInFolder = () => {
	let
	categoryVal = categoryEl.value,
	subcategoryVal = subcategoryEl.value;

	itemsInFolder.innerHTML = '';

	if (subcategoryVal != '') {
		let	itemsArr = dataJsonFetched.category[`${categoryVal}`][`${subcategoryVal}`];
		for (let item in itemsArr) {
			itemsInFolder.innerHTML += `<span class="item-span">${itemsArr[item].split('_').join(' ').replace(/=\s*/g, ': ')}</span>`; // add support: : -> =
		}
	} else return;
},

validateAddToManifest = () => {
	if (
		categoryEl.value !== '' &&
		subcategoryEl.value !== '' &&
		nameEl.value !== '' &&
		descriptionEl.value !== ''
	) {
		addToManifestBtn.classList.remove('disabled');
	} else {
		addToManifestBtn.classList.add('disabled');
	}
},

addToManifestHandler = () => {
	let 
	nameValue = nameEl.value,
	descValue = descriptionEl.value;
	let 
	validationResults = validateNameRules(nameValue, descValue);

	if (validationResults.name.validated && validationResults.desc.validated) addToManifest();
	else printError(validationResults);
},

addToManifest = () => {
	let
	cat = categoryEl.value,
	sub = subcategoryEl.value,
	name = nameEl.value.toLowerCase().split(' ').join('_').replace(/:\s*/g, '='),
	desc = descriptionEl.value;
	let 
	newNode = {},
	displayCombined = {},
	combinedKey = `${cat}--${sub}--${name}`;
	// Hide potential error display
	errorDisplay.classList.add('hide');
	// Node keys
	newNode.notes = desc;
	newNode.misc1 = '';
	newNode.misc2 = '';
	newNode.misc3 = '';
	// Merge
	displayCombined[`${combinedKey}`] = newNode;
	// Send to Full JSON
	addToFullManifest(combinedKey, newNode);
	// Formatted
	let nodeToManifest = JSON.stringify(displayCombined).substr(1, JSON.stringify(displayCombined).length - 2);
	if (fullJsonTab.classList.contains('active')) newJsonTab.click();
	if (manifestTemp == '') {
		manifestTemp = nodeToManifest;
		displayJSON.innerHTML = manifestTemp;
	} else {
		manifestTemp += ',\n' + nodeToManifest;
		displayJSON.innerHTML = manifestTemp;
	}
	// Reset inputs
	document.querySelector('#category [value="void"]').selected = true;
	populateSubDropdown();
	nameEl.value = '';
	descriptionEl.value = '';
	addToManifestBtn.classList.add('disabled');
	generateNewManifestBtn.classList.remove('hide');
},

toggleDisplayJSON = (event) => {
	newJsonTab.classList.toggle('active');
	fullJsonTab.classList.toggle('active');
},

validateNameRules = (input, textarea) => {
	let
	validationObject = {};
	validationObject.name = {};
	validationObject.desc = {};
	validationObject.name.validated = false;
	validationObject.name.errors = [];
	validationObject.desc.validated = false;
	validationObject.desc.errors = [];
	// Specific errors
	if (input.includes(`'`)) validationObject.name.errors.push(`'`);
	if (input.includes(`"`)) validationObject.name.errors.push(`"`);
	if (textarea.includes(`'`)) validationObject.desc.errors.push(`'`);
	if (textarea.includes(`"`)) validationObject.desc.errors.push(`"`);
	// Booleans
	if (
		!input.includes(`'`) &&
		!input.includes(`"`)
	) validationObject.name.validated = true;
	if (
		!textarea.includes(`'`) &&
		!textarea.includes(`"`)
	) validationObject.desc.validated = true;
	// Return obj
	return validationObject;
},

printError = (errorObj) => { console.log(errorObj)
	let
	nameError = '',
	descError = '',
	displayMessage;
	// Show error display
	errorDisplay.classList.remove('hide');
	// Text to display variations
	if (!errorObj.name.validated) nameError = `Item Name`;
	if (!errorObj.desc.validated) descError = `Item Description`;
	if (nameError !== '' && descError !== '') {
		displayMessage = `<div>Invalid character(s) ${errorObj.name.errors.toString().split(',').join(' and ')} used in ${nameError}</div><div>Invalid character(s) ${errorObj.desc.errors.toString().split(',').join(' and ')} used in ${descError}</div>`;
	} else if (nameError !== '' && descError === '') {
		displayMessage = `<div>Invalid character(s) ${errorObj.name.errors.toString().split(',').join(' and ')} used in ${nameError}</div>`;
	} else if (nameError === '' && descError !== '') {
		displayMessage = `<div>Invalid character(s) ${errorObj.desc.errors.toString().split(',').join(' and ')} used in ${descError}</div>`;
	}
	// Write to DOM
	errorDisplay.innerHTML = displayMessage;
},

addToFullManifest = (key, payload) => {
	// Category update
	manifestFullTemp.category[`${key.split('--')[0]}`][`${key.split('--')[1]}`].push(`${key.split('--')[2]}`);
	manifestFullTemp.category[`${key.split('--')[0]}`][`${key.split('--')[1]}`].sort();
	// Descriptions update
	manifestFullTemp.descriptions[`${key}`] = payload;
},

getManifest = (option) => {
	if (option == 'full') displayJSON.innerHTML = JSON.stringify(manifestFullTemp);
	if (option == 'new')  displayJSON.innerHTML = manifestTemp;
},

downloadNewManifest = () => {
	dataJsonSent = manifestFullTemp;

	let 
	timeStamp = new Date().getTime(),
	dataJsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataJsonSent))}`,
  downloadAnchor = document.createElement('a');

  downloadAnchor.setAttribute('href', dataJsonString);
  downloadAnchor.setAttribute('download', `data--${timeStamp}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  callDebug();
},

toggleAboutModal = () => {
	let aboutModal = document.querySelector('#about-modal');
	if (aboutModal.classList.contains('active')) aboutModal.classList.remove('active');
	else aboutModal.classList.add('active');
};

// Utility
const
eventListeners = () => {
	// About modal slide in/out
	aboutBtn.addEventListener('click', toggleAboutModal, false);
	closeAboutBtn.addEventListener('click', toggleAboutModal, false);
	// Populate sub drop
	categoryEl.addEventListener('change', populateSubDropdown, false);
	// Populate items in folder
	subcategoryEl.addEventListener('change', populateItemsInFolder, false);
	// Validate inputs
	categoryEl.addEventListener('change', validateAddToManifest, false);
	subcategoryEl.addEventListener('change', validateAddToManifest, false);
	nameEl.addEventListener('change', validateAddToManifest, false);
	descriptionEl.addEventListener('change', validateAddToManifest, false);
	// Toggle JSON display
	newJsonTab.addEventListener('click', toggleDisplayJSON, false);
	fullJsonTab.addEventListener('click', toggleDisplayJSON, false);
	// Add to manifest
	addToManifestBtn.addEventListener('click', addToManifestHandler, false);
	// Get newly added JSON only
	newJsonTab.addEventListener('click', getManifest.bind(this, 'new'), false);
	// Get full JSON display
	fullJsonTab.addEventListener('click', getManifest.bind(this, 'full'), false);
	// Generate new manifest
	generateNewManifestBtn.addEventListener('click', downloadNewManifest, false);
},

callDebug = () => {
	console.log({
		dataJsonFetched: dataJsonFetched,
		dataJsonSent: dataJsonSent,
		manifestTemp: manifestTemp,
		manifestFullTemp: manifestFullTemp,
		dropdownData: dropdownData
	});
};

document.onreadystatechange = function () {
	if (document.readyState == 'complete') {
		eventListeners();
	}
};