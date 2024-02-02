import React, { useState, useRef, useEffect } from 'react';
import '../Styles/Dropdown.css';

export default function Dropdown(props) {
	const { title, menu, searchParams } = props;
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef();

	const handleClickOutside = e => {
		if (!dropdownRef.current.contains(e.target)) setOpen(false);
	};
	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	});

	const handleOpen = () => {
		setOpen(!open);
	};

	return (
	<div className='dropdown' ref={dropdownRef}>
		<button
			className='dropdown-button'
			onClick={handleOpen}
		>
			{title}
		</button>
		<div className={(open) ? 'dropdown-menu show' : 'dropdown-menu'}>
			{menu && menu.map((langData) => {
				let id = langData[0];
				let name = langData[1];

				// Get current search params and replace the language value
				let params = new URLSearchParams(searchParams.toString());
				params.set('lang', id);
				let url = `?${params.toString()}`;

				return (
					<a key={id} className='dropdown-item' href={url}>{name}</a>
				);
			})}
		</div>
	</div>
	);
};