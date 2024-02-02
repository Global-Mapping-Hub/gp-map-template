// Main configuration
export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_KEY || '<YOUR MAPBOX TOKEN>'; // mapbox token
export const DEFAULT_COORDS = [95, 15]; // default coordinates for the initial page load
export const DEFAULT_ZOOM = 4.5; // default zoom level for the initial page load
export const GOOGLE_DATA_SPREADSHEET_URL= 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVTc7QCWXNereqOCcGRnZzDhLdtHm1mbG3hct4hLTVRui-Dl2FNjTmvK8fzfyV-l1y1xJQZwsRL6Vj/pub?output=csv'; // URL to the spreadsheet with map data (points, polygons, etc)
export const GOOGLE_LANGUAGES_SPREADSHEET_URL= 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQDcxYO8WgGLgCxZa7FqYPRT0ePnc-D5TsY2mrdgmCZtS2gTt9Y8ereKkp3qnJSkkEYjF1K0bM0SfX0/pub?output=csv'; // URL to the spreadsheet with translations

export const LAYERS = { // Layer setup
	// 'nitrate': {
	// 	engine: 'vector',
	// 	layerType: 'fill',
	// 	// layerFilter: ['has', 'props'],
	// 	// renderFilter: ['has', 'props'],
	// 	sourceURL: 'https://.../{z}/{x}/{y}.pbf',
	// 	sourceLayer: 'source_layer_name',
	// 	sourceConfig: {
	// 		'layout': {},
	// 		'paint': {},
	// 	},
	// 	// subLayer: {},
	// 	state: true
	// },
	'1': {engine: 'story', pinColor: '#707295', pinColorSelected: '#363853', state: true},
	'2': {engine: 'story', pinColor: '#D8F814', pinColorSelected: '#B0CC03', state: true},
	'3': {engine: 'story', pinColor: '#FFBD5C', pinColorSelected: '#E99E2F', state: true},
};

// Enable/disable specific functionality
export const COOKIE_DISCLAIMER = true;
export const INFO_DISCLAIMER = false;
export const ADD_PINS_ENABLED = true;
export const API_URL = 'http://localhost:1234';
export const LOCAL_STORAGE_TOKEN = 'gp-template-disclaimer-hide'; // name of the localstorage variable

// Don't touch the following parameters, if you are not sure what you are doing
export const LAYER_PREFIX = 'geojson-';
export const DEFAULT_LANG = 'en';