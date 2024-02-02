import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { getData } from './Utilities/API';
import { convertToGeoJSON } from './Utilities/Helpers'; // getQueryVariable
import { MapProvider } from './Services/MapContext';
import Loader from './Components/Loader';
import Header from './Components/Header';
import MapMapbox from './Components/MapMapbox';
import Controls from './Components/MapControls';
import GalleryPopup from './Components/GalleryPopup';
import Info from './Components/Info';
import Disclaimer from './Components/Disclaimer';
import AddPoint from './Components/AddPoint';
import Filter from './Components/Filter';
import Legend from './Components/Legend';
import Sidebar from './Components/Sidebar';
import Logos from './Components/Logos';
import CookieConsent from './Components/CookieConsent';

import { LAYERS, DEFAULT_LANG, COOKIE_DISCLAIMER, INFO_DISCLAIMER, GOOGLE_DATA_SPREADSHEET_URL, GOOGLE_LANGUAGES_SPREADSHEET_URL, LOCAL_STORAGE_TOKEN } from './Utilities/Config';

import './App.css';

export default function App() {
	// Map data
	const [data, setData] = useState(null);
	const [selectedData, setSelectedData] = useState(null);

	// Language
	const [language, setLanguage] = useState(null);
	const [availableLanguages, setAvailableLanguages] = useState(null);

	// Query search parameters
	const [searchParams, setSearchParams] = useSearchParams({});

	// Windows/forms
	const [loaderVisible, setLoaderVisible] = useState(true);
	const [filterVisible, setFilterVisible] = useState(true);
	const [infoVisible, setInfoVisible] = useState(false);
	const [addPointVisible, setAddPointVisible] = useState(false);
	const [sidebarVisible, setSidebarVisible] = useState(false);
	const [sidebarWidth, setSidebarWidth] = useState(0);
	const handleLoaderVisibility = (state) => { setLoaderVisible(state); }
	const handleFilterVisibility = () => { setFilterVisible((prevState) => !prevState); }
	const handleInfoVisibility = () => { setInfoVisible((prevState) => !prevState); }
	const handleAddPointVisibility = () => { setAddPointVisible((prevState) => !prevState); }
	const handleSidebarVisibility = (state) => { setSidebarVisible(state); }

	// List of layers
	const [layersVisible, setLayersVisible] = useState(LAYERS);

	// Info disclaimer
	const [disclaimerVisible, setDisclaimerVisible] = useState(true);

	// Cookie disclaimer
	const [cookieDisclaimerAgreed, setCookieDisclaimerAgreed] = useState(false);
	const handleCookieDisclaimerAgreed = (state) => { setCookieDisclaimerAgreed(state); }

	// Gallery image popup
	const [popupGalleryURL, setPopupGalleryURL] = useState(undefined);
	const [popupGalleryVisible, setPopupGalleryVisible] = useState(false);
	const handlePopupGallery = (state, url) => {
		setPopupGalleryURL(url);
		setPopupGalleryVisible(state);
	}

	// const [disclaimerAgreed, setDisclaimerAgreed] = useState(JSON.parse(localStorage.getItem('disclaimerAgreed')) || false);
	// useEffect(() => {
	// 	localStorage.setItem('disclaimerAgreed', JSON.stringify(disclaimerAgreed));
	// }, [disclaimerAgreed]);

	const jumpToFeature = (data) => {
		// Get URL parameter for language
		const selectedId = searchParams.get('id') || null;
		if (selectedId) {
			const filteredFeatures = data.features.filter((el => el.id === selectedId));
			if (filteredFeatures.length > 0) {
				let foundFeature = filteredFeatures[0];
				if (foundFeature) {
					setSelectedData(foundFeature);
					// setSidebarVisible(true);
				}
			}
		}
	}

	useEffect(() => {
		// Load languages from Google spreadsheet
		if (GOOGLE_LANGUAGES_SPREADSHEET_URL) {
			// Get URL parameter for language
			const lang = searchParams.get('lang') || DEFAULT_LANG;
			getData(GOOGLE_LANGUAGES_SPREADSHEET_URL, (json) => {
				const langArray = () => {
					let object = {};
					Object.entries(json.filter(val => val.param === 'language:name')[0]).forEach((el) => {
						if (el[0] !== 'param') object[el[0].replace('translation_','')] = el[1];
					});
					return object;
				}

				let translation = json.reduce((acc, val) => {
					if (val.param) acc[val.param] = val[`translation_${lang}`];
					return acc;
				}, {});

				setLanguage(translation);
				setAvailableLanguages(langArray());
			});
		}

		// Load point data from Google spreadsheet
		if (GOOGLE_DATA_SPREADSHEET_URL) {
			getData(GOOGLE_DATA_SPREADSHEET_URL, (json) => {
				const data = convertToGeoJSON(json);
				setData(data);
				jumpToFeature(data);
			});
		}

		// Check if disclaimer should be shown
		if (INFO_DISCLAIMER === true) {
			const disclaimerStatus = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TOKEN)) || false;
			if (disclaimerStatus === true) setDisclaimerVisible(false);
		}
	}, []);

	return (
		<div className="App">
			<Loader
				show={loaderVisible}
			/>
			<Header
				language={language}
				availableLanguages={availableLanguages}
				onToggleAddPoint={handleAddPointVisibility}
				searchParams={searchParams}
			/>
			{INFO_DISCLAIMER === true &&
				<Disclaimer
					show={disclaimerVisible}
					onToggle={setDisclaimerVisible}
					language={language}
				/>
			}
			{(COOKIE_DISCLAIMER === true && !cookieDisclaimerAgreed) &&
				<CookieConsent
					handleCookieDisclaimerAgreed={handleCookieDisclaimerAgreed}
					setLoaderVisible={handleLoaderVisibility}
					language={language}
				/>
			}
			{((COOKIE_DISCLAIMER === true && cookieDisclaimerAgreed) || (COOKIE_DISCLAIMER === false)) &&
				<>
					<MapProvider>
						<Controls
							onToggleFilter={handleFilterVisibility}
							onToggleInfo={handleInfoVisibility}
						/>
						<MapMapbox
							data={data}
							layersVisible={layersVisible}
							selectedData={selectedData}
							setSelectedData={setSelectedData}
							toggleSidebar={handleSidebarVisibility}
							setLoaderVisible={setLoaderVisible}
							setSearchParams={setSearchParams}
							sidebarWidth={sidebarWidth}
						/>
					</MapProvider>
					<Sidebar
						show={sidebarVisible}
						data={selectedData}
						onToggle={handleSidebarVisibility}
						language={language}
						setSelectedData={setSelectedData}
						setSearchParams={setSearchParams}
						setSidebarWidth={setSidebarWidth}
						handlePopupGallery={handlePopupGallery}
					/>
				</>
			}
			<Filter
				show={filterVisible}
				onToggle={handleFilterVisibility}
				layersVisible={layersVisible}
				setLayersVisible={setLayersVisible}
				language={language}
			/>
			<AddPoint
				show={addPointVisible}
				onToggle={handleAddPointVisibility}
				language={language}
			/>
			<Info
				show={infoVisible}
				onToggle={handleInfoVisibility}
				language={language}
			/>
			<Legend
				language={language}
			/>
			<GalleryPopup
				show={popupGalleryVisible}
				url={popupGalleryURL}
				handlePopupGallery={handlePopupGallery}
			/>
			<Logos/>
		</div>
	);
}