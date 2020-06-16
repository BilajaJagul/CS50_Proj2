document.addEventListener('DOMContentLoaded',() => {
	var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
	document.querySelector('#submit').disabled = true;
	document.querySelector('#message').onkeyup = () => {
		if(document.querySelector('#message').value.length > 0)
			document.querySelector('#submit').disabled = false;
	};

	socket.on('connect', () => {
		document.querySelector('#channel_message').onsubmit = () => {
			const message=document.querySelector('#message').value;
			const time=new Date().toLocaleString();
			var transmission = {
				"message":message,"time":time,"channel":document.title
			};
			socket.emit('Submit Message',{'transmission':transmission});
		};
	});

	socket.on('receive', data_msg => {
		console.log('Received!');
		const li = document.createElement('li');
		const ul_mess = document.createElement('ul');
		const li_time_name = document.createElement('li');
		const li_message = document.createElement('li');
		li_time_name.innerHTML = `${data_msg.user} @ ${data_msg.time}`;
		li_message.innerHTML = data_msg.message;
		ul_mess.appendChild(li_time_name);
		ul_mess.appendChild(li_message);
		li.appendChild(ul_mess);
		document.querySelector('#list_messages').append(li);
	});
	return false;
});


		

