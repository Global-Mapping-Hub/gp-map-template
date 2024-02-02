import React from 'react';
import Dropdown from './Dropdown';
import { ADD_PINS_ENABLED } from '../Utilities/Config';
import { isMobile } from '../Utilities/Helpers';

import '../Styles/Header.css';

function Header(props) {
	const { language, availableLanguages, onToggleAddPoint, searchParams } = props;

	return (
		<div className="header-wrapper">
			<div className="header-flex-wrapper">
				<div className="header-logo"></div>
				<div className="header-map-title">{(language) ? language['map:title'] : 'Title'}</div>
			</div>

			<div className="header-spacer"></div>

			{(ADD_PINS_ENABLED === true) &&
				<button className="gp-button-big addpin" onClick={onToggleAddPoint}>{(language) ? language['addpoint:button:header'] : 'Add new pin'}</button>
			}

			<Dropdown
				title={(language) ? ((isMobile()) ? language['language:short'] : language['language:name']) : 'English'}
				menu={availableLanguages && Object.entries(availableLanguages)}
				searchParams={searchParams}
			/>
		</div>
	)
}

export default Header;
