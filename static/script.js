console.log("ready");

const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})


const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

// searchButton.addEventListener('click', function (e) {
// 	if(window.innerWidth < 576) {
// 		e.preventDefault();
// 		searchForm.classList.toggle('show');
// 		if(searchForm.classList.contains('show')) {
// 			searchButtonIcon.classList.replace('bx-search', 'bx-x');
// 		} else {
// 			searchButtonIcon.classList.replace('bx-x', 'bx-search');
// 		}
// 	}
// })


// if(window.innerWidth < 768) {
// 	sidebar.classList.add('hide');
// } else if(window.innerWidth > 576) {
// 	searchButtonIcon.classList.replace('bx-x', 'bx-search');
// 	searchForm.classList.remove('show');
// }


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})


const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

console.log("ready.. try WS connection");

let endpoint = "ws://127.0.0.1:8000/ws";
let socket = new WebSocket(endpoint);
console.log("Attempting Connection...");


document.getElementById("network").textContent = endpoint;

socket.onopen = () => {
    console.log("Successfully Connected");
    socket.send("handshake")
};

socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!")
};

socket.onmessage = function (e) {
    console.log("Received: " + e.data);
    try {
        let msg = JSON.parse(e.data);
        console.log("msg " + msg);
        console.log("value: " + msg.value);
        console.log("type: " + msg.type);

        if (msg.type == "chat") {
            document.getElementById("log").textContent += "\n" + msg.value;
        } else if (msg.type == "uuid") {
            document.getElementById("uuid").textContent = msg.value;
        } else if (msg.type == "name") {
			let v = msg.value;
            let n = v.split("|")[0]
            // document.getElementById("log").textContent += "\n" + n;
			
            document.getElementById("log").textContent += "\n" + msg.value;
			document.getElementById("username").textContent = n;
        }
        
    } catch {

    }
};

socket.onerror = error => {
    console.log("Socket Error: ", error);
};

function sendChat() {
    
    //conn.send(document.getElementById("input").value);
    let inputValue = document.getElementById("input").value;
    let jmsg = JSON.stringify({
      type: "chat",
      value: inputValue
    });
    console.log("jmsg " + jmsg);
    socket.send(jmsg);
  
    // let pmsg = JSON.stringify({
    //   type: "ping", 
    //   value: "ping"   
    // });
  
    // conn.send(pmsg);
    //conn.send("ping");
  }

  function registerName() {
    
    //conn.send(document.getElementById("input").value);
    let inputValue = document.getElementById("registerInput").value;
    console.log("inputValue " + inputValue);
    let jmsg = JSON.stringify({
      type: "name",
      value: inputValue
    });
    console.log("jmsg " + jmsg);
    socket.send(jmsg);

	document.getElementById("username").textContent = "test"
  
  
  }
  
  document.getElementById("sendchat_button").addEventListener("click", sendChat);
  document.getElementById("registerButton").addEventListener("click", registerName);