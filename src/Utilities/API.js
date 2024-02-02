import { API_URL } from './Config';
import { csvToJSON } from './Helpers';

export const getData = (url, callback) => {
	if (url) {
		fetch(url)
		.then(x => x.text())
		.then(y => {
			csvToJSON(y, (json) => {
				callback(json)
			});
		})
	} else {
		callback()
	}

}

export const sendPostData = (data, callback) => {
	fetch(API_URL, {
		method: 'POST',
		body: data
	})
	.then((res) => {
		return res.json();
	})
	.then((data) => {
		callback(data)
	});
};