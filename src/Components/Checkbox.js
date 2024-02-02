import {React, forwardRef} from 'react';
import '../Styles/Checkbox.css';

const Checkbox = forwardRef(function(props, ref) {
	const { id, name, value, title, onChange } = props;
	return (
		<label className='checkbox-container'>
			<div className='checkbox-title'>{title}</div>
			<input ref={ref} id={id} name={name} checked={value} onChange={onChange} type='checkbox'/>
			<span className='checkmark'></span>
		</label>
	);
});

export default Checkbox;