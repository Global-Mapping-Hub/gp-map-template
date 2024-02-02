import React from 'react';
import { LAYERS } from '../Utilities/Config';

import '../Styles/Legend.css';

export default function Legend(props) {
	const { language } = props;

	const layerList = () => {
		return Object.entries(LAYERS).map((layer) => {
			const id = layer[0];
			const title = (language) ? language[`layers:title:${id}`] : layer[1].title;
			return (
				<div className='legend-wrapper' key={id}>
					<div className='legend-icon' style={{backgroundColor: layer[1].pinColor}}></div>
					<div className='legend-label'>{title}</div>
				</div>
			);
		});
	}

	return (
		<div className='legend-window-wrapper'>
			<div className='legend-window'>
				<div className="content">
					{layerList()}
				</div>
			</div>
		</div>
	);
}