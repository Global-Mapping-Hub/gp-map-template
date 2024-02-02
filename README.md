# Webmap Template

This map template is based on **React.js** - a widely used JavaScript library for building dynamic user interfaces. If you want to download and run our map template on your local machine or hosted server, there are a few steps you can follow. Below is a step-by-step guide to downloading a React project from GitHub and running it locally.


# **Prerequisites**

1. **Node.js** is a JavaScript runtime used to build server-side applications. It is also required to run React projects.

2. **npm (Node Package Manager)** is a package manager for Node.js that allows you to download and install the packages and dependencies you need for your React project. npm is included with Node.js.

**Here is a** [**link to the Installation instructions**](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)**.**

**Once you have these prerequisites installed, you can follow the following steps to download a React project from Github and run it on your computer.**


# **Installation**

## **1. Download or clone the repository:**

Simply download the following archive and place it in any directory on your system.

Or, if you have git installed, then you can clone the repository to your computer using the following command:

```console
git clone https://github.com/Global-Mapping-Hub/gp-map-template.git
```


## **2. Navigate to the project directory:**

After downloading or cloning the repository, navigate to the project directory using the following command

```console
cd \<path-to-project-directory>
```

**3. Install dependencies:**

Once you're in the project directory, run the following command to install the dependencies required for the project:

```console
npm install
```

- This command reads the package.json file in the repository and downloads any dependencies listed there into the node\_modules folder.

* If you encounter problems after installing npm, run the following command to automatically fix the problems:

```console
npm audit fix
```


## **4. Start the development server:**

Use this command in the terminal

```console
npm run start
```

- This command starts a local development server and runs the React project on your local computer. You can access the project by navigating to **http\://localhost:3000** in your web browser.


## **5. Build the project:**

Use this command in the terminal

```console
npm run build
```

- This command builds your React map and places it in the build directory by default.


# **Configuration file overview**

The src\Utilities\Config.js file stores the main configuration. The description of the variables is given below.

|                                         |                                                                                                                                                                                                                                                                      |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **MAPBOX\_TOKEN**                       | Mapbox GL JS access token. This template uses Mapbox GL JS as its main mapping library, which requires an access token to function correctly. You can read more about this [here](https://docs.mapbox.com/help/getting-started/access-tokens/).                      |
| **DEFAULT\_COORDS**                     | Default coordinates for the start map position.The format is \[lng,lat].                                                                                                                                                                                             |
| **DEFAULT\_ZOOM**                       | Default zoom level for the initial page load.                                                                                                                                                                                                                        |
| **GOOGLE\_DATA\_SPREADSHEET\_URL**      | URL to the CSV file of map stories, preferably a Google spreadsheet shared as CSV (**File > Share > Publish to web**). You can find a template [here](https://docs.google.com/spreadsheets/d/1CuwYo5C_ee6j2iJI4Kozr84q2iyxoas_7-t6D4VLO5Y/edit?usp=sharing).         |
| **GOOGLE\_LANGUAGES\_SPREADSHEET\_URL** | URL to the CSV file of map translations, preferably a Google spreadsheet shared as CSV (**File > Share > Publish to web**). You can find a template [here](https://docs.google.com/spreadsheets/d/1VWQOIHTOthRL5AbJ4ipIUMyacj9h1laTkL2lbS2uVY4/edit?usp=drive_link). |
| **LAYERS**                              | Array of layers in the form of JSON objects. See the "Layer configuration" category below for a description.                                                                                                                                                         |
| **COOKIE\_DISCLAIMER**                  | Enable or disable the cookie disclaimer. If enabled, a modal window with a cookie consent message will be displayed when the page loads.                                                                                                                             |
| **INFO\_DISCLAIMER**                    | Enable or disable the information window. If enabled, it will display a modal window with map information when the page loads.                                                                                                                                       |
| **ADD\_PINS\_ENABLED**                  | Enable or disable the "Add new pins" button in the template header. Opens a modal window with a simple HTML form for submitting a new story. Requires **API\_URL** to be set.                                                                                        |
| **API\_URL**                            | URL that points to your backend service. At the moment it is only used by the "Add New Pins" form. The backend is not included in this map template.                                                                                                                 |
| **LOCAL\_STORAGE\_TOKEN**               | Default name of the browser's local store variable. It is recommended that you change this to something unique but readable if you intend to host multiple maps on a single host.                                                                                    |
| **LAYER\_PREFIX**                       | Internal prefix for the mapbox layer names.                                                                                                                                                                                                                          |
| **DEFAULT\_LANG**                       | Default language ID from the **GOOGLE\_LANGUAGES\_SPREADSHEET\_URL** CSV file.                                                                                                                                                                                       |


# **Layer configuration**

List of layers is represented in a form on an array populated by JSON objects. Can be configured in the following ways:

1. Simple layer with points/features taken from the spreadsheet file (**GOOGLE\_DATA\_SPREADSHEET\_URL**):

```js
'FILTER_TYPE_NAME': { // the name of the layer. Should be set to one of the values in the filter_type column of the "GOOGLE_DATA_SPREADSHEET_URL" file.
	engine: 'story', // value "story" tells template to use pin locations and data from Google spreadsheet file
	pinColor: 'HEX_VALUE_FOR_COLOR', // pin colour for this story type
	pinColorSelected: 'HEX_VALUE_FOR_COLOR', // pin colour for the clicked/selected story
	state: true // whether the layer should be visible by default or not
},
```

2. Custom mapbox layer:

```js
'nitrate': { // name of the layer
	engine: 'vector', // can be either vector or raster, depending on the type of the layer
	layerType: 'fill', // type of mapbox layer. See the full list here - https://docs.mapbox.com/style-spec/reference/layers/
	layerFilter: ['has', 'props'], // mapbox filter expression (https://docs.mapbox.com/style-spec/reference/expressions/) applied to all the sourced features
	renderFilter: ['has', 'props'], // mapbox filter expression (https://docs.mapbox.com/style-spec/reference/expressions/) applied to the rendered features
	sourceURL: 'https://.../{z}/{x}/{y}.pbf', // URL to the source data
	sourceLayer: 'source_layer', // name of the source layer (https://docs.mapbox.com/help/glossary/source-layer/)
	sourceConfig: { // visual representation of the mapbox layer (https://docs.mapbox.com/help/glossary/layout-paint-property/)
		'layout': {}, // layout property 
		'paint': {}, // paint property
	},
	subLayer: {}, // here you can insert the same structure as above. This way you can have a sublayer depending on the parent layer
	state: true // whether the layer should be visible by default or not
},
```


# **Quick components overview**

|                  |                                                                            |
| ---------------- | -------------------------------------------------------------------------- |
| AddPoint.js      | Modal window with a simple form to submit new point information            |
| Checkbox.js      | Custom checkbox                                                            |
| CookieConsent.js | Cookie consent modal window                                                |
| Disclaimer.js    | Modal window with map information that opens when the map is loaded        |
| Dropdown.js      | Language drop down menu                                                    |
| Filter.js        | Filter for layers added to the map                                         |
| Gallery.js       | Image gallery                                                              |
| GalleryPopup.js  | Small lightbox-like component to display images in full screen mode        |
| Header.js        | Map header with logos, title, language selection, etc.                     |
| Info.js          | Modal window with map information that opens when you click the "i" button |
| Legend.js        | Map legend for layers, visible in bottom right corner                      |
| Loader.js        | Loader/Spinner                                                             |
| Logos.js         | Other logos, e.g. Greenpeace logo in bottom left corner                    |
| MapControls.js   | Map controls, such as filter and info buttons, zoom controls, etc.         |
| MapMapbox.js     | Main component with map and event handling                                 |
| Sidebar.js       | Sidebar with story content that slides out on marker clicks                |
| Toggle.js        | Custom toggle box                                                          |
