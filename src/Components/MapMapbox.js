import React, { useRef, useEffect, useCallback, useState, useContext } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import * as turf from '@turf/helpers';
import centerOfMass from '@turf/center-of-mass';

import { mapContext } from '../Services/MapContext';
import { convertToGeoJSON, isMobile } from '../Utilities/Helpers';
import MarkerPath from '../Images/marker-sdf.png';

import { DEFAULT_COORDS, DEFAULT_ZOOM, LAYER_PREFIX, MAPBOX_TOKEN, LAYERS } from '../Utilities/Config';
import { getData } from '../Utilities/API';

import 'mapbox-gl/dist/mapbox-gl.css';
import '../Styles/MapMapbox.css';

const Map = (props) => {
	const { data, layersVisible, selectedData, setSelectedData, toggleSidebar, setLoaderVisible, setSearchParams, sidebarWidth } = props;
	mapboxgl.accessToken = MAPBOX_TOKEN;

	const { map, setMap, styleLoaded, handleStyleLoaded, layersLoaded, setLayersLoaded } = useContext(mapContext);
	const selectedDataPrev = useRef(null);
	const mapContainer = useRef(null);
	let sidebarWidthLocal = sidebarWidth || 0;

	// Initialize layer - add, set flags and toggle visible layers
	const initLayers = useCallback((data) => {
		// Add layers
		addLayers(data);
		// Toggle layer visibility
		toggleLayers(layersVisible);
	}, [map, layersVisible]);

	// Add layers to the map
	const addLayers = (geojson) => {
		Object.entries(LAYERS).forEach((layer) => {
			const layerId = layer[0];
			const layerEngine = layer[1].engine;
			const sourceURL = layer[1].sourceURL;
			const sourceLayer = layer[1].sourceLayer;
			const layerType = layer[1].layerType;
			const layerFilter = layer[1].layerFilter;
			const layerConfig = layer[1].sourceConfig;
			const afterLayer = layer[1].afterLayer;
			const layerName = `${layerEngine}-${layerId}`;

			const subLayer = layer[1].subLayer || null;
			let subLayerType = null;
			let subLayerName = null;
			if (subLayer) {
				subLayerType = layer[1].subLayer.layerType || null;
				subLayerName = `${layerEngine}-${layerId}-${subLayerType}`;
			}

			if (layerEngine === 'geojson' || layerEngine === 'vector') {
				// Remove old layers - just in case
				if (map.getLayer(layerName)) map.removeLayer(layerName);
				if (subLayer && map.getLayer(subLayerName)) map.removeLayer(subLayerName);
				if (map.getSource(layerName)) map.removeSource(layerName);
				
				if (!map.getSource(layerName)) map.addSource(layerName,
					(layerEngine === 'geojson') ? {
						'type': 'geojson',
						'data': sourceURL
					} : {
						'type': 'vector',
						'tiles': [sourceURL]
					}
				);

				if (!map.getLayer(layerName)) map.addLayer({
					'id': layerName,
					'source': layerName,
					'type': layerType,
					'layout': layerConfig.layout,
					'paint': layerConfig.paint,
					...((layerFilter) && {'filter': layerFilter}), // add filter if it exists
					...((layerEngine === 'vector' && sourceLayer) && {'source-layer': sourceLayer}), // add sourceLayer if it exists
				}, (afterLayer) ? afterLayer : null); // getFirstSymbolLayer()

				if (subLayer) {
					if (!map.getLayer(subLayerName)) map.addLayer({
						'id': subLayerName,
						'source': layerName,
						'type': subLayer.layerType,
						'layout': subLayer.sourceConfig.layout,
						'paint': subLayer.sourceConfig.paint,
						...((layerFilter) && {'filter': layerFilter}), // add filter if it exists
						...((layerEngine === 'vector' && sourceLayer) && {'source-layer': sourceLayer}), // add sourceLayer if it exists
					}, layerName);
				}

				// Mouse over the polygon
				map.on('mousemove', layerName, (e) => {
					if (e.features.length === 0) return;
					map.getCanvas().style.cursor = 'pointer';
				});

				map.on('mouseleave', layerName, (e) => {
					map.getCanvas().style.cursor = '';
				});

				// On area click - show data
				map.on('click', [layerName, subLayerName], (e) => {
					if (!e.originalEvent.defaultPrevented) {
						e.originalEvent.preventDefault();
						const f = map.queryRenderedFeatures(e.point);
						if (f.length) {
							if (f[0].source.includes(layerName) || f[0].source.includes(subLayerName)) {
								// Load properties
								setSelectedData(f[0]);
							}
						}
					}
				});

			} else if ((layerEngine === 'story' && geojson) || (layerEngine === 'google' && layerType === 'csv')) {
				// Add an image to use as a custom marker
				// Main pin
				if (!map.hasImage(`custom-marker-${layerId}`)) {
					let img = new Image();
					img.onload = () => { map.addImage(`custom-marker-${layerId}`, img, { sdf: true }); };
					img.src = MarkerPath;
				}

				getData(sourceURL, (data) => {
					if (!(layerEngine === 'story' && geojson)) geojson = convertToGeoJSON(data);

					// Filter features based on feature type
					const filteredFeatures = geojson.features.filter(el => el.properties.filter_type === layerId);
					const filteredGeoJSON = {
						"type": "FeatureCollection",
						"features": filteredFeatures
					};

					// Create source
					const layerName = `${LAYER_PREFIX}${layerId}`;
					if (!map.getSource(layerName)) map.addSource(layerName, {
						'type': 'geojson',
						'data': filteredGeoJSON
					});

					// Create layers
					if (!map.getLayer(`${layerName}-points`)) map.addLayer({
						'id': `${layerName}-points`,
						'type': 'symbol',
						'source': layerName,
						'filter': ['==', ['geometry-type'], 'Point'],
						'layout': {
							'icon-image': `custom-marker-${layerId}`,
							'icon-size': 0.15,
							'icon-anchor': 'bottom',
							'icon-padding': 0,
							'icon-allow-overlap': true,
							'icon-ignore-placement': true,
							'text-allow-overlap': true,
						},
						'paint': {
							'icon-opacity': 1,
							'icon-color': [
								'case',
								['boolean', ['feature-state', 'clicked'], false],
								LAYERS[layerId].pinColorSelected || LAYERS[layerId].pinColor,
								LAYERS[layerId].pinColor,
							],
						}
					});

					if (!map.getLayer(`${layerName}-lines`)) map.addLayer({
						'id': `${layerName}-lines`,
						'type': 'line',
						'source': layerName,
						'filter': ['==', ['geometry-type'], 'LineString'],
						'layout': {
							'line-join': 'round',
							'line-cap': 'round'
						},
						'paint': {
							'line-color': LAYERS[layerId].pinColor,
							'line-width': 2
						}
					});

					if (!map.getLayer(`${layerName}-polygons`)) map.addLayer({
						'id': `${layerName}-polygons`,
						'type': 'fill',
						'source': layerName,
						'filter': ['==', ['geometry-type'], 'Polygon'],
						'paint': {
							'fill-color': [
								'case',
								['boolean', ['feature-state', 'clicked'], false],
								LAYERS[layerId].pinColorSelected || LAYERS[layerId].pinColor,
								LAYERS[layerId].pinColor,
							],
							'fill-opacity': 0.5,
						},
					});

					// Hover over the marker - pointer
					map.on('mousemove', [`${layerName}-points`, `${layerName}-polygons`, `${layerName}-lines`], (e) => {
						if (e.features.length === 0) return;
						map.getCanvas().style.cursor = 'pointer';
					});

					// Mouse left the marker
					map.on('mouseleave', [`${layerName}-points`, `${layerName}-polygons`, `${layerName}-lines`], (e) => {
						map.getCanvas().style.cursor = '';
					});

					// On marker click - show data
					map.on('click', /*`${layerName}-points`*/[`${layerName}-points`, `${layerName}-polygons`, `${layerName}-lines`], (e) => {
						const f = map.queryRenderedFeatures(e.point);
						if (f.length) {
							if (f[0].source.includes(layerName)) {
								// Load properties
								setSelectedData(f[0]);
							}
						}
					});
				});
			}
		});
	}

	useEffect(() => {
		if (layersLoaded && selectedData) {
			clickOnMarker(selectedData);
		}
		
	}, [layersLoaded, selectedData]);

	const clickOnMarker = (feature) => {
		if (feature) {
			const props = feature.properties;

			// Center on Marker
			// get coordinates
			let center;
			if (feature.geometry.type === 'Point') {
				center = feature.geometry.coordinates; // get coordinates
			} else if (feature.geometry.type === 'Polygon') {
				center = centerOfMass(turf.polygon(feature.geometry.coordinates)).geometry.coordinates;
			} else if (feature.geometry.type === 'LineString') {
				center = centerOfMass(turf.lineString(feature.geometry.coordinates)).geometry.coordinates;
			}
	
			// Fly to marker
			if (isMobile()) {
				map.flyTo({ center: center });
			} else {
				let x_offset = sidebarWidthLocal;
				center = map.project(center);
				let target = map.unproject([center.x + (x_offset/2), center.y]);
				map.flyTo({ center: target });
			}

			// Open sidebar
			toggleSidebar(true);
	
			// Update URL with new ID
			if (props.id) {
				setSearchParams(params => {
					params.set('id', props.id);
					return params;
				});
			}
		}
	}

	const toggleLayers = (layerIDs) => {
		if (map) {
			Object.entries(layerIDs).forEach((layer) => {
				const layerId = layer[0];
				const state = layer[1].state;
				const layerEngine = layer[1].engine;
				const layerType = layer[1].layerType;
				const layerName = `${LAYER_PREFIX}${layerId}`;

				if (layerEngine === 'geojson' || layerEngine === 'vector') {
					const layerName = `${layerEngine}-${layerId}`;
					if (map.getLayer(layerName)) map.setLayoutProperty(layerName, 'visibility', (state) ? 'visible' : 'none');
					if (map.getLayer(`${layerName}-data`)) map.setLayoutProperty(`${layerName}-data`, 'visibility', (state) ? 'visible' : 'none');
				} else if ((layerEngine === 'story') || (layerEngine === 'google' && layerType === 'csv')) {
					if (map.getLayer(`${layerName}-points`)) map.setLayoutProperty(`${layerName}-points`, 'visibility', (state) ? 'visible' : 'none');
					if (map.getLayer(`${layerName}-polygons`)) map.setLayoutProperty(`${layerName}-polygons`, 'visibility', (state) ? 'visible' : 'none');
					if (map.getLayer(`${layerName}-lines`)) map.setLayoutProperty(`${layerName}-lines`, 'visibility', (state) ? 'visible' : 'none');
				}

				const subLayer = layer[1].subLayer || null;
				const subLayerName = (subLayer) ? `${layerEngine}-${layerId}-${layer[1].subLayer.layerType}` : null;
				if (subLayer && map.getLayer(subLayerName)) map.setLayoutProperty(subLayerName, 'visibility', (state) ? 'visible' : 'none');
			});
		}
	}

	// Init map
	useEffect(() => {
		const initializeMap = ({ setMap, mapContainer }) => {
			const map = new mapboxgl.Map({
				container: mapContainer.current,
				style: 'mapbox://styles/greenpeacegmh/clg4wl6ce006101mm309awop4/draft',
				center: DEFAULT_COORDS,
				zoom: DEFAULT_ZOOM,
				detectRetina: true,
				noWrap: true,
				// renderWorldCopies: false,
				continuousWorld: false,
				projection: 'mercator',
				// hash: true,
			});

			// On load events
			map.on('style.load', () => {
				handleStyleLoaded();
			});

			setMap(map);
		};

		if (!map) initializeMap({ setMap, mapContainer });
	}, [setMap]);

	// Trigger on map style load and on basemap change
	useEffect(() => {
		if (styleLoaded !== null && data) {
			initLayers(data);
			map.once('idle', () => {
				// Set flag for loaded layers
				setLayersLoaded(true);
				// Disable loader
				setLoaderVisible(false);
			});
		}
	}, [styleLoaded, data]);

	// Adding event listener on change of layersEnabled
	useEffect(() => {
		toggleLayers(layersVisible);
	}, [layersVisible]);

	// Update sidebar width
	useEffect(() => {
		sidebarWidthLocal = sidebarWidth;
	}, [sidebarWidth]);

	// Trigger on current ID change
	useEffect(() => {
		// Change marker styling
		if (layersLoaded) {
			// Remove style from previous marker
			if (selectedDataPrev.current != null) map.setFeatureState({ source: `${LAYER_PREFIX}${selectedDataPrev.current.properties['filter_type']}`, id: selectedDataPrev.current.id }, { 'clicked': false });
			// Add style to the current marker
			if (selectedData != null) map.setFeatureState({ source: `${LAYER_PREFIX}${selectedData.properties['filter_type']}`, id: selectedData.id }, { 'clicked': true });
		}
		selectedDataPrev.current = selectedData;
	}, [layersLoaded, selectedData]);

	// Render
	return (
		<div className="map-wrapper">
			<div ref={mapContainer} className="map-container" />
		</div>
	);
};

export default Map;