const miFormulario = document.querySelector('form')

let url = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/auth/' : 'https://rest-server-aem.herokuapp.com/api/auth/'

miFormulario.addEventListener('submit', ev => {
	ev.preventDefault() // prevenir refresh de la pag

	const formData = {}
	for(let data of miFormulario.elements){
		if(data.name.length > 0){
			formData[data.name] = data.value
		}
	}

	fetch(url + "login", {
		method: 'POST',
		body : JSON.stringify(formData),
		headers: {'Content-Type' : 'application/json'}
	})
	.then(res => res.json())
	.then(({msg,token}) => {
		if(msg){
			return console.log(msg)
		}
		localStorage.setItem('token', token)
		window.location = 'chat.html'
	})
	.catch(err => {
		console.log(err)
	})
})

function handleCredentialResponse(response) {
	//const responsePayload = decodeJwtResponse(response.credential);
	//Google Token ID_TOKEN
	//console.log('id_token:',response.credential)
	const body = { id_token: response.credential }
	fetch(url + "google", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	})
		.then(res => res.json()) //para que de el body
		.then(({ token }) => {
			//console.log(token)
			localStorage.setItem('token', token)
			window.location = 'chat.html'
		})
		.catch(console.log)
}


const boton = document.getElementById("signout")
boton.onclick = () => {
	console.log(google.accounts.id)
	google.accounts.id.disableAutoSelect()
	google.accounts.id.revoke(localStorage.getItem('correo'), done => {
		localStorage.clear()
		location.reload()
	})
}