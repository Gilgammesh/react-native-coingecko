export const fetchData = async (url = '', method = 'GET', data = {}) => {
	let options = {
		method,
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application-json'
		}
	};
	if (method !== 'GET') {
		options.body = JSON.stringify(data);
	}

	let result = {};
	await fetch(url, options)
		.then(res => res.json())
		.then(data => {
			result = {
				status: true,
				data
			};
		})
		.catch(err => {
			console.log('Conexión API con FETCH', url, err);
			result = {
				status: false,
				data: null,
				msg: 'No se pudo establecer la conexión con el servidor'
			};
		});
	return result;
};
