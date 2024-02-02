import React from 'react';
import '../Styles/Toggle.css';

function Toggle(props) {
	const { id, checked, onChange } = props;
	return (
		<div className='filter-toggle'>
			<input
				className='filter-toggle-input'
				type='checkbox'
				id={id}
				checked={checked}
				onChange={onChange}
			/>
		</div>
	);
};

export default Toggle;