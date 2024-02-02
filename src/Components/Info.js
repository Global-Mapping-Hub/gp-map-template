import React from 'react';
import '../Styles/Info.css';

export default function Info(props) {
	const { show, onToggle, language } = props;

	const showImage = () => {
		return (language) ? (language['map:info:image']) ? JSON.parse(language['map:info:image']).image : '' : '';
	}

	return (
		<div className={show ? 'modal-info-wrapper show': 'modal-info-wrapper'}>
			<div tabIndex="0" className={show ? 'modal-info show': 'modal-info'}>
				<div className='modal-info-header-wrapper'>
					<div className='header'>{(language) ? language['map:info:title'] : 'Map information'}</div>
					<div className='button-close' onClick={onToggle}></div>
				</div>
				<div className='content scroller'>
					<div className='description'>{(language) ? language['map:info:content'] : ''}</div>
					<img className='info-image' src={showImage()}></img>
				</div>
			</div>
		</div>
	);
}