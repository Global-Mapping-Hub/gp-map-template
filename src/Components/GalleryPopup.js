import React, { useEffect, useRef } from 'react';

export default function GalleryPopup(props) {
	const { show, url, handlePopupGallery } = props;
	const windowReference = useRef(null);

	// Focus on window when it becomes visible
	useEffect(() => {
		if (show) {
			setTimeout(() => { windowReference.current.focus(); }, 1000);
		}
	}, [show]);

	// Close on clicking outside of window
	const handleClickOutside = (e) => {
		if (!windowReference.current.contains(e.target)) handlePopupGallery(false, undefined);
	};
	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	});

	// Close on button click
	const onCloseClick = () => {
		handlePopupGallery(false, undefined);
	}

	return (
		<div className={show ? 'gallery-popup-wrapper show': 'gallery-popup-wrapper'}>
			<div tabIndex="0" ref={windowReference} className={show ? 'gallery-popup show': 'gallery-popup'}>
				<div className="button-close white" onClick={onCloseClick}></div>
				<img src={url}/>
			</div>
		</div>
	);
}