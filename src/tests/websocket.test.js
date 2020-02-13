function loadjscssfile(filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}


loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.dev.js", "js");
var ws = io('http://localhost:5000')
ws.emit('join', 'a')
ws.emit('message', 
{ room: 'a', 
  message: { 
        "content": "tester 1213", 
        "clientGuid": "1-13e9-4317-b8a2-beac736a5ee1", 
        "avatar": "https://banter-pub.imgix.net/users/nicktee.id", 
        "user": "good42482.id.blockstack", 
        "hashtag": [], 
        "hashtagColor": "#4c9aff", 
        "pullRight": false, 
        "geohash": "a", 
        "latitude": 1, 
        "longitude": 2, 
        "image": 1, 
        "radiksType": "Post",
        "isSynced": false, 
        "createdAt": 1581110335977, 
        "updatedAt": 1581110335977, 
        "signingKeyId": "3b97f351c0a0-46f2-aa43-5d98f2b36424", 
        "radiksSignature": "304502210081d9db80d1f80d1101137ca572bea2d90a842ca916aba6af5655f293beb6b9ad022004c03faadcfd8c896461728c9e9b43d210b9de9132421cbc427371c38e363486", 
        "_id": "732b8e16294b-42f3-b08d-2051580639ab" 
    } 
 });