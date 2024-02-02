import React, { useRef } from 'react';
import Checkbox from './Checkbox';
import { LOCAL_STORAGE_TOKEN } from '../Utilities/Config';

import '../Styles/Disclaimer.css';

export default function Disclaimer(props) {
	const { show, onToggle, language } = props;
	const hideDisclaimerWindow = useRef(false);

	// Close on button click
	const onClose = () => {
		if (hideDisclaimerWindow.current.checked === true) {
			localStorage.setItem(LOCAL_STORAGE_TOKEN, JSON.stringify(true));
		}
		onToggle(false);
	}

	return (
		<div className={show ? 'modal-disclaimer-wrapper show': 'modal-disclaimer-wrapper'}>
			<div tabIndex='0' className={show ? 'modal-disclaimer show': 'modal-disclaimer'}>
				<div className='modal-disclaimer-header-wrapper'>
					<div className='header'>{(language) ? language['map:disclaimer:title'] : 'Title'}</div>
					<div className='button-close' onClick={onClose}></div>
				</div>
				<div className='content scroller'>
					<div className='description'>{(language) ? language['map:disclaimer:content'] : 'Content'}</div>
				</div>
				<div className='disclaimer-button-wrapper vertical'>
					<button className='gp-button-big' onClick={onClose}>
						{(language) ? language['map:disclaimer:button:open'] : 'Open the Map'}
					</button>
					<div className='checkbox-show-window'>
						<Checkbox
							ref={hideDisclaimerWindow}
							title={(language) ? language['map:disclaimer:button:noshow'] : "Don't show this popup again"}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}