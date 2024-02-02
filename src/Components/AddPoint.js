import React, { useState } from 'react';
import { sendPostData } from '../Utilities/API';

import '../Styles/AddPoint.css';

export default function AddPoint(props) {
	const { show, onToggle, language } = props;
	const [inputs, setInputs] = useState({});
	const [file, setFile] = useState();

	const onInputChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInputs(values => ({...values, [name]: value}))
	}

	const onFileChange = (event) => {
		setFile(event.target.files[0]);
	}
	
	const onFormSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData();
		Object.entries(inputs).forEach((input) => {
			formData.append(input[0], input[1]);
		});
		formData.append('file', file);
		formData.append('fileName', file.name);

		sendPostData(formData, (response) => {
			alert(response);
		});
	}

	// return (show &&
	return (
		<div className={show ? 'modal-addpoint-wrapper show': 'modal-addpoint-wrapper'}>
			<div tabIndex="0" className={show ? 'modal-addpoint show': 'modal-addpoint'}>
				<div className='modal-addpoint-header-wrapper'>
					<div className="header">{(language) ? language['addpoint:header'] : 'Add new pin'}</div>
					<div className="button-close" onClick={onToggle}></div>
				</div>
				<form
					onSubmit={onFormSubmit}
					className="content scroller"
				>
					<div className="modal-addpoint-input-title">{(language) ? language['addpoint:name:title'] : 'Name or url'}</div>
					<input
						type="text"
						name="name"
						className="modal-addpoint-input"
						placeholder={(language) ? language['addpoint:name:placeholder'] : 'Name'}
						value={inputs.name || ''}
						onChange={onInputChange}
					/>
					<div className="modal-addpoint-input-title">{(language) ? language['addpoint:date:title'] : 'Date'}</div>
					<input
						type="text"
						name="date"
						className="modal-addpoint-input"
						placeholder={(language) ? language['addpoint:date:placeholder'] : 'Date'}
						value={inputs.date || ''}
						onChange={onInputChange}
					/>
					<div className="modal-addpoint-input-title">{(language) ? language['addpoint:file:title'] : 'Download file'}</div>
					<input
						type="file"
						name="file"
						className="modal-addpoint-input"
						placeholder={(language) ? language['addpoint:file:placeholder'] : 'Drop your file here'}
						onChange={onFileChange}
					/>
					<div className="modal-addpoint-input-title">{(language) ? language['addpoint:comment:title'] : 'Comments'}</div>
					<input
						name="comment"
						type="textarea"
						className="modal-addpoint-input"
						placeholder={(language) ? language['addpoint:comment:placeholder'] : 'Leave a comment here'}
						value={inputs.comment || ''}
						onChange={onInputChange}
					/>
					<button type="submit" className="gp-button-big wide">{(language) ? language['addpoint:button:submit'] : 'Submit'}</button>
				</form>
			</div>
		</div>
	);
}