function createUserOnServer() {
    var userData = "userEmail=" + encodeURIComponent(app.userEmail)
    userData += "&userFirstName=" + encodeURIComponent(app.userFirstName)
    userData += "&userLastName=" + encodeURIComponent(app.userLastName)
    userData += "&userPlainPassword=" + encodeURIComponent(app.userPlainPassword)

    return fetch("https://guarded-mountain-22124.herokuapp.com/users", {
        method: "POST",
        body: userData,
        credentials: 'include',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

function createSessionOnServer() {
    var userData = "email=" + encodeURIComponent(app.userInputEmail)
    userData += "&plainPassword=" + encodeURIComponent(app.userInputPassword)

    return fetch("https://guarded-mountain-22124.herokuapp.com/session", {
        method: "POST",
        body: userData,
        credentials: 'include',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

function getMeFromServer() {
    return fetch("https://guarded-mountain-22124.herokuapp.com/session", {
        method: "GET",
        credentials: 'include'
    })
}

function createPlaylistOnServer() {
    console.log(app.user)
    var playlistData = "playlistName=" + encodeURIComponent(app.playlistName)
    playlistData += "&userId=" + encodeURIComponent(app.user)

    return fetch("https://guarded-mountain-22124.herokuapp.com/playlists", {
        method: "POST",
        body: playlistData,
        credentials: 'include',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

function createSongOnServer(clickedPlaylist) {
    console.log("create method")
    var songData = "songName=" + encodeURIComponent(app.songName)
    songData += "&songLength=" + encodeURIComponent(app.songLength)
    songData += "&songRating=" + encodeURIComponent(app.songRating)
    songData += "&playlistId=" + encodeURIComponent(clickedPlaylist._id)

    return fetch("https://guarded-mountain-22124.herokuapp.com/songs", {
        method: "POST",
        body: songData,
        credentials: 'include',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

function getPlaylistsFromServer() {
    console.log("This is the user in get playlists  ", app.user)
    return fetch("https://guarded-mountain-22124.herokuapp.com/playlists", {
        credentials: 'include',
    })
}


function getSongsFromServer() {

    return fetch("https://guarded-mountain-22124.herokuapp.com/songs", {
        credentials: 'include',
    })
}

function deleteSongFromServer(song) {
    songId = song._id
    
    return fetch("https://guarded-mountain-22124.herokuapp.com/songs/"+songId, {
        method: "DELETE",
        credentials: 'include',
    })
}

function deleteSessionOnServer() {
    
    return fetch("https://guarded-mountain-22124.herokuapp.com/session", {
        method: "DELETE",
        credentials: 'include',
    })
}

function loadSongsByPlaylist(playlist) {
    console.log(playlist._id)
    return fetch("https://guarded-mountain-22124.herokuapp.com/playlists/"+ playlist._id + "/songs", {
        credentials: 'include',
    })
}

function editSongFromServer(song) {
    var songId = song._id;
    var songData = "songName=" + encodeURIComponent(app.songName)
    songData += "&songLength=" + encodeURIComponent(app.songLength)
    songData += "&songRating=" + encodeURIComponent(app.songRating)

    return fetch("https://guarded-mountain-22124.herokuapp.com/songs/"+songId, {
        method: "PUT",
        body: songData,
        credentials: 'include',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

var app = new Vue({
    el: '#app',
    data: {
        userInputEmail: "",
        userInputPassword: "",
        userEmail: "",
        userPlainPassword: "",
        songs: [],
        playlists: [],
        message: "This is a message",
        createMode: false,
        registerMode: false,
        welcomeScreen: true,
        loginMode: false,
        createPlaylistMode: false,
        createSongMode: false,
        appScreen: false,
        songScreen: false,
        clickedPlaylist: "",
        playlistName: "",
        playlistNameToAppend: '',
        songName: '',
        songLength: '',
        songRating: '',
        playlistId: '',
        songsThisPlaylist: [],
        user: "",
        userFirstName: "",
        userLastName: ""


    },
    methods: {
        moveToRegister: function () {
            this.loginMode = false;
            this.welcomeScreen = false;
            this.registerMode = true;
        },
        moveToHome: function () {
            this.welcomeScreen = true;
            this.registerMode = false;
            this.loginMode = false;
            this.songScreen = false;
            this.appScreen = false;
            this.createPlaylistMode = false;
        },
        moveToLogin: function () {
            this.welcomeScreen = false;
            this.registerMode = false;
            this.loginMode = true;
        },
        moveToAppScreen: function () {
            this.appScreen = true;
            this.songScreen = false;
            this.welcomeScreen = false;
        },
        moveToAppScreenLogin: function () {
            this.createSession()
            
        },
        getMe: function () {
            getMeFromServer().then((response) => {
                // console.log(response.ok == true)
                if (response.ok == true) {
                    response.json().then((data) => {
                        this.user = data._id
                        this.verifyUser()
                        this.loadPlaylists()
                    })
                }
            })
        },
        moveToSongs: function (playlist) {
            console.log(playlist)
            this.loginMode = false;
            this.appScreen = false;
            this.songScreen = true;
            this.clickedPlaylist = playlist;
            console.log(this.clickedPlaylist)
            this.loadSongs(playlist)
        },
        moveToCreatePlaylist: function () {
            console.log(app.user)
            this.appScreen = false;
            this.createPlaylistMode = true;
        },
        moveToCreateSong: function () {
            this.songScreen = false;
            this.createSongMode = true;
        },
        createUser: function () {
            // this.welcomeScreen = false;
            // this.registerMode = false;
            console.log("In create user function ")
            if (!this.validateUser()) {
                var myString = ""
                for (var i = 0; i < this.errorMessages.length; i++) {
                    myString += this.errorMessages[i] + "  ";
                }
                alert(myString)
                return;
            } else {
                createUserOnServer().then(function (response) {
                    if (response.status == 201) {
                        app.registerMode = false
                        app.createMode = true
                        app.appScreen = true;
                    } else if (response.status == 422) {
                        alert("email already in use")
                    }
                })
            } 
        },
        createPlaylist: function () {
            createPlaylistOnServer().then(function (response) {
                app.loadPlaylists();
            })
            
            this.createPlaylistMode = false;
            this.appScreen = true;
            
        },
        validateSong: function () {
            this.errorMessages = []

            if (this.songName.length == 0) {
                this.errorMessages.push("Please Specify Name")
            }
            if (this.songLength.length == 0) {
                this.errorMessages.push("Please Specify Length")
            }
            if (this.songRating.length == 0) {
                this.errorMessages.push("Please Specify Rating")
            }
            if (this.errorMessages.length > 0) {
                return false;
            }
            else {
                return true;
            }
        },
        validateUser: function () {
            console.log("Validating user")
            this.errorMessages = []

            if (this.userEmail.length == 0) {
                console.log("Email not populated")
                this.errorMessages.push("Please Input Email")
            }
            if (this.userFirstName.length == 0) {
                this.errorMessages.push("Please Input First Name")
            }
            if (this.userLastName.length == 0) {
                this.errorMessages.push("Please Input Last Name")
            }
            if (this.userPlainPassword.length == 0) {
                this.errorMessages.push("Please Input Password")
            }
            if (this.errorMessages.length > 0) {
                return false;
            }
            else {
                return true;
            }
        },
        createSongOnServer: function () {
            if (!this.validateSong()) {
                for (error in this.errorMessages) {
                    alert(this.errorMessages[error])
                }
            }

            else {
                createSongOnServer(this.clickedPlaylist).then(function (response) {
                })
                this.loadSongs(this.clickedPlaylist)
                this.createSongMode = false;
                this.songScreen = true; 
            }
        },
        loadPlaylists: function () {
            getPlaylistsFromServer().then((response) => {
                response.json().then((data) => {
                    this.playlists = data
                })
            })
        },
        loadSongs: function (playlist) {
            this.songName = ""
            this.songLength = ""
            this.songRating = ""
            loadSongsByPlaylist(playlist).then((response) => {
                response.json().then((data) => {
                    this.songs = data;
                })
            })
        },
        deleteSong: function (song) {
            deleteSongFromServer(song).then( (response) => {
                console.log(this.clickedPlaylist)
                this.loadSongs(this.clickedPlaylist)
            })
        },
        editSong: function (song) {
            if (!this.validateSong()) {
                for (error in this.errorMessages) {
                    alert(this.errorMessages[error])
                }
            } else {
                editSongFromServer(song).then( (response) => {
                    this.loadSongs(this.clickedPlaylist)
                })
            }
        },
        createSession: function () {
            createSessionOnServer().then(function (response) {
                console.log("maybe", response.status)
                if (response.status == 201) {
                    app.loginMode = false;
                    app.appScreen = true;
                    app.songScreen = false;
                    app.createPlaylistMode = false;
                    app.getMe();
                } else {
                    alert("Invalid credentials")
                }
            })
        },
        verifyUser: function () {
            console.log(this.user)
            if (this.user != "") {
                this.appScreen = true;
                this.welcomeScreen = false;
                // this.loadPlaylists()
            }
        },
        logout: function () {
            this.appScreen = false;
            this.welcomeScreen = true;
            deleteSessionOnServer().then( (response) => {
                console.log("deleted");
            })
            this.user = ""
            console.log(this.user)
        }
    },
    created: function () {
        console.log("Loaded");
        this.getMe()
    }
})


// playlist 1 id 60480585a58d1b6078b19b41
// playlist 2 id 6048058ca58d1b6078b19b42


// for (var i = 0; i < this.playlists.length; i++) {
    //     myPlaylist = this.playlists[i]
    //     for (var j = 0; j < this.songs.length; j++) {
    //         if (myPlaylist.name == this.songs[j].playlist.name) {
    //             myPlaylist.songList.push(this.songs[j])
    //         }
    //     }
    // }
    // for (var count = 0; count < this.playlists.length; count++) {
    //     if (this.playlists[count].name == this.clickedPlaylist) {
    //         for (var j = 0; j < this.playlists[count].songList.length; j++) {
    //             this.songsThisPlaylist.push(this.playlists[count].songList[j])
    //         }
    //     }
    // }