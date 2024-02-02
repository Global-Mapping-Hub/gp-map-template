import React from 'react';
import Toggle from './Toggle';

import '../Styles/Filter.css';

export default function Filter(props) {
	const { show, onToggle, layersVisible, setLayersVisible, language } = props;

	const toggleLayers = (e) => {
		let newObject = JSON.parse(JSON.stringify(layersVisible));
		if (e.target.checked) {
			newObject[e.target.id].state = true;
			setLayersVisible(newObject);
		} else {
			// Remove from object
			newObject[e.target.id].state = false;
			setLayersVisible(newObject);
		}
	}

	const layerList = () => {
		return Object.entries(layersVisible).map((layerID) => {
			const id = layerID[0];
			const title = (language) ? ((language[`layers:title:${id}`]) ? language[`layers:title:${id}`] : layerID[1].title) : layerID[1].title;
			const description = (language) ? ((language[`layers:description:${id}`]) ? language[`layers:description:${id}`] : layerID[1].description) : layerID[1].description;
			const state = layerID[1].state;
			return (
				<div className='toggle-wrapper' key={id}> {/* key={`${id}_${state}`} */}
					<div className='toggle-label'>
						<div className='toggle-title'>{title}</div>
						<div className='toggle-description'>{description}</div>
					</div>
					<Toggle
						id={id}
						checked={state}
						onChange={toggleLayers}
					/>
				</div>
			);
		});
	}

	return (
		<div className='filter-window-wrapper'>
			<div className={`filter-window ${(show) ? 'show' : ''}`}>
				<div className='filter-header'>
					<div className='filter-title'>{(language) ? language['filter:title'] : 'Filter'}</div>
					<div className='button-close' onClick={onToggle}></div>
				</div>
				<div className='content scroller'>
					{layerList()}
				</div>
			</div>
		</div>
	);

}
