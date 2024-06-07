fetch('../lessons.json')
	.then(response => response.json())
	.then(data => {
		console.log(data.lessons.BD);
	})
	.catch(error => {
		console.error(error);
	});




