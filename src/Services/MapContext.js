import React, { createContext, useState } from "react";

// Create two context:
// UserContext: to query the context state
// UserDispatchContext: to mutate the context state
const mapContext = createContext(undefined);

// A "provider" is used to encapsulate only the
// components that needs the state in this context
function MapProvider({ children }) {
	const [map, setMap] = useState(null);
	const [styleLoaded, setStyleLoaded] = useState(null);
	const [layersLoaded, setLayersLoaded] = useState(false);

	const handleStyleLoaded = () => { setStyleLoaded((prevState) => !prevState || false); }

	const Provider = mapContext.Provider;

	return (
		<Provider
			value={{
				map,
				setMap,
				styleLoaded,
				handleStyleLoaded,
				layersLoaded,
				setLayersLoaded,
			}}
			>
			{children}
		</Provider>
	);
}

export { MapProvider, mapContext };
