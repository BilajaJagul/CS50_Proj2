document.addEventListener('DOMContentLoaded', () => {
	document.querySelector('#submit').disabled  = true;

	document.querySelector('#username').onkeyup = () => {
		if(document.querySelector('#username').value.length > 0 & !localStorage.getItem('username'))
			document.querySelector('#submit').disabled = false;
	};

	const request = new XMLHttpRequest();
	const data = new FormData();

	document.querySelector('#form').onsubmit = () => {
		const userName = document.querySelector('#username').value;
		localStorage.setItem('username',userName);
		request.open('POST','/username');
		data.append('Username',userName);
		request.send(data);
		request.onload = () => {
			if(request.status != 200){
				alert('Error ${request.status}: ${request.statusText}');
				localStorage.removeItem('username');
				return true;
		}
	};

	};

	let welcome = "Hello, " + localStorage.getItem('username');
	document.querySelector('#welcome').innerHTML = welcome;

	if(localStorage.getItem('username')){
		const channel_request = new XMLHttpRequest();
		channel_request.open('POST','/channels');
		const channelData = new FormData();
		channelData.append('Username',localStorage.getItem('username'));
		channel_request.send(channelData);
		channel_request.onload = () => {
                        const channel_data = JSON.parse(channel_request.responseText);
                        document.querySelector('#welcome').innerHTML = channel_data.success;
                        if (channel_data.success){
                                channels = channel_data.channels;
                                channels.forEach(channel => {
                                        var li = document.createElement('li');
					var a = document.createElement('a');
					var link = '/channel/'+channel.replace(/\s+/g,'');
					a.textContent=channel;
					a.setAttribute('href',link);
					li.appendChild(a);
                                        document.querySelector('#Channels').append(li);
                                });
                        }
                        else{
				alert('Cannot access Server!');
                }
		}
	return false;
	}
});
	
	
