import React, { useEffect, useRef } from 'react';
import Gallery from '../Components/Gallery';

import '../Styles/Sidebar.css';

export default function Sidebar(props) {
	const { show, data, onToggle, language, setSelectedData, setSearchParams, setSidebarWidth, handlePopupGallery } = props;

	const ref = useRef(null);

	const onClose = () => {
		onToggle(false);
		setSelectedData(null);
		setSearchParams(params => {
			if (params.has('id')) params.delete('id');
			return params;
		});
	}

	const generateURLs = (urls) => {
		return (
			<>
				{urls.map((url, index) => {
					return (
						<a className="gp-button-url" key={index} href={url.url} rel="noreferrer" target="_blank">
							{url.title}
						</a>
					)
				})}
			</>
		)
	}

	const generateContent = (data) => {
		if (data) {
			const storyId = data.id || 0;
			const images = JSON.parse(data.properties.images || '[]');
			const summary = data.properties.summary || '';
			const urls = JSON.parse(data.properties.urls || '[]');
			return (
				<>
					<div className='sidebar-header'>
						<div className='sidebar-title'>{(data) ? data.properties.title : null}</div>
						<div className='button-close' onClick={onClose}></div>
					</div>
					{(images.length > 0) &&
					<Gallery
						storyId={storyId}
						images={images}
						handlePopupGallery={handlePopupGallery}
					/>}
					<div className='sidebar-summary'>{summary}</div>
					<div className='sidebar-urls'>{generateURLs(urls)}</div>
				</>
			);
		}
	}

	// Detect Sidebar width
	useEffect(() => {
		const handleResize = () => { setSidebarWidth(ref.current ? ref.current.offsetWidth : 0) }
		handleResize();
		window.addEventListener('resize', handleResize)
	}, [ref.current]);

	return (
		<div ref={ref} className={show ? 'sidebar-wrapper show': 'sidebar-wrapper'}>
			{/* <div className='sidebar'> */}
			<div className={`sidebar ${(show) ? 'show': ''}`}>
				<div className='content-wrapper scroller'>
					{generateContent(data)}
				</div>
			</div>
		</div>
	);

}
