let state = {};

console.log("ready");

const REPSTATE = "REPSTATE";
const REQSTATE = "REQSTATE";

//let endpoint = "wss://snode.benjyz.repl.co/ws";
let endpoint = "ws://127.0.0.1:8000/ws";
//let endpoint = "wss://snode.benjyz.repl.co/ws";


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
// }


// window.addEventListener('resize', function () {
// 	if(this.innerWidth > 576) {
// 	}
// })


const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

console.log("ready.. try WS connection " + endpoint);

let socket = new WebSocket(endpoint);

document.getElementById("network").textContent = endpoint;

function socketSendMsg(msg) {
    socket.send(JSON.stringify({type: "Msg", value: msg}));
}

socket.onopen = () => {
    console.log("Successfully Connected");
    socketSendMsg({type: "HNDCLIENT", value: ""});
    //socketSendMsg({type: "REQSTATE", value: ""});
};

socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!")
};

function appendHistory(msgvalue) {
    console.log("appendHistory")
    //let hist = msgvalue;
    let hist = JSON.parse(msgvalue);
    //for (let i = 0; i < hist.length; i++) {
    //TODO not full history here if its long
    for (let i = 0; i < hist.length; i++) {
        console.log(">>>>>> " + hist[i].type);
        //let smsg = msg.type + " " + hist[i].value;
        if (hist[i].type == "chat"){
            let v = hist[i].sender + ":" + hist[i].value;
            document.getElementById("chatlog").textContent += "\n" + v;
        } else {

        }
    }
}

socket.onmessage = function (e) {
    console.log("Received: " + e.data);
    
    try {
        let outermsg = JSON.parse(e.data);
        let msg = outermsg.value
        //console.log("msg  received" + msg);
        console.log("value: " + msg.value.substring(0, 30));
        console.log(">> msgtype: " + msg.type);
        console.log("is rep: ", msg.type === "REPSTATE");

        switch(msg.type){
            case "chat":
                document.getElementById("chatlog").textContent += "\n" + msg.value;
                break;
            case "uuid":
                document.getElementById("uuid").textContent = msg.value;
                break;
            case "name":
                let v = msg.value;
                let n = v.split("|")[0]
                document.getElementById("username").textContent = n;
                document.getElementById("otherlog").textContent += "\n" + msg.value;
                break;
            case "REPSTATE":
                console.log(">> REPSTATE")
                console.log(">> " + msg.value)
                //console.log(">>>> message hist " + msg.value);
                //console.log(">>>> first message " + msg.value.state.MsgHistory[0].value);
                //console.log(">>>> first message " + msg.value.state);
                appendHistory(msg.value);                        
                break;
            case "info":
                document.getElementById("otherlog").textContent += "\n" + msg.value;
                break;
            default:
                console.error("?? unkown message ", msg.type)
        }

        
			
        
    } catch {
        console.error("cant parse message")
    }
};

socket.onerror = error => {
    console.log("Socket Error: ", error);
};

function sendChat() {

    console.log("sendChat");
    
    //conn.send(document.getElementById("input").value);
    let inputValue = document.getElementById("input").value;
    // let jmsg = JSON.stringify({
    //   type: "chat",
    //   value: inputValue
    // });

    socketSendMsg({type: "chat", value: inputValue});
  
    // let pmsg = JSON.stringify({
    //   type: "ping", 
    //   value: "ping"   
    // });
  
    // conn.send(pmsg);
    //conn.send("ping");
  }

function registerName() {
    console.log("registerName");
    //conn.send(document.getElementById("input").value);
    let inputValue = document.getElementById("registerInput").value;
    console.log("inputValue " + inputValue);
    // let jmsg = JSON.stringify({
    //   type: "name",
    //   value: inputValue
    // });
    socketSendMsg({type: "name", value: inputValue});

    

	//document.getElementById("username").textContent = "test"
  
}
  
document.getElementById("sendchat_button").addEventListener("click", sendChat);
document.getElementById("registerButton").addEventListener("click", registerName);

  