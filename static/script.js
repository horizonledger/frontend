console.log("ready");

let global = {status: "..."};

let cur = window.location.href;
let arr = cur.split("/");
let page = arr[arr.length-1];
console.log("cur " + cur);
console.log("page: " + page);

//TODO only on startup, not every page reload
console.log("ready.. try WS connection");

let endpoint = "ws://127.0.0.1:8000/ws";
console.log("Attempting Connection... " + endpoint);
let socket = new WebSocket(endpoint);


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


const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})



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
    
    let outermsg = JSON.parse(e.data);
    let msg = outermsg.value;
    console.log("msg " + msg);
    console.log("value: " + msg.value);
    console.log("type: " + msg.type);

    switch (msg.type) {
        case "chat":
            document.getElementById("chatlog").textContent += "\n" + msg.value;
            break;
        case "uuid":
            document.getElementById("uuid").textContent = msg.value;
            break;
        case "name":
            let v = msg.value;
            let n = v.split("|")[0]
            // document.getElementById("log").textContent += "\n" + n;
            
            document.getElementById("chatlog").textContent += "\n" + msg.value;
            document.getElementById("username").textContent = n;
            break;
        case "status":
            console.log(msg);
            console.log(msg.value);
            document.getElementById("status").textContent = msg.value;
            break;
        default:
            console.log("unkonwn message")
        
    }  

};

socket.onerror = error => {
    console.log("Socket Error: ", error);
};

function socketSendMsg(msg) {
    socket.send(JSON.stringify({type: "Msg", value: msg}));
}

function sendChat() {
    
    //conn.send(document.getElementById("input").value);
    let inputValue = document.getElementById("input").value;
    socketSendMsg({type: "chat", value: inputValue});
    // console.log("jmsg " + jmsg);
    // socket.send(jmsg);
      
}

function registerName() {

    //conn.send(document.getElementById("input").value);
    let inputValue = document.getElementById("registerInput").value;
    console.log("inputValue " + inputValue);

    socketSendMsg({type: "name", value: inputValue});

}

if (page == "chat"){
    document.getElementById("sendchat_button").addEventListener("click", sendChat);
    document.getElementById("registerButton").addEventListener("click", registerName);
} else if (page == "settings"){
//TODO
    document.getElementById("network").textContent = endpoint;    
} else if (page == "nodes"){
    //TODO
    document.getElementById("status").textContent = global.status;    
}



// old
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


// window.addEventListener('resize', function () {
// 	if(this.innerWidth > 576) {
// 		searchButtonIcon.classList.replace('bx-x', 'bx-search');
// 		searchForm.classList.remove('show');
// 	}
// })

