import React, { useContext } from "react";
import { mapContext } from "../Services/MapContext";

import '../Styles/MapControls.css';

function Controls(props) {
	const { onToggleFilter, onToggleInfo } = props;
	const {map} = useContext(mapContext);

	const clickZoomIn = (e) => {
		let currentZoom = map.getZoom();
		map.flyTo({zoom: currentZoom+1})
	}
	const clickZoomOut = (e) => {
		let currentZoom = map.getZoom();
		map.flyTo({zoom: currentZoom-1})
	}

	return (
		<>
			<div className="controls-left">
				<button type="button" className="gp-button filter" onClick={onToggleFilter}></button>
			</div>
			<div className="controls-right">
				<button type="button" className="gp-button info" onClick={onToggleInfo}></button>
				<div className="zoom-wrapper">
					<button type="button" className="gp-button zoom-in" onClick={clickZoomIn}></button>
					<button type="button" className="gp-button zoom-out" onClick={clickZoomOut}></button>
				</div>
			</div>
		</>
	);
}

export default Controls;
