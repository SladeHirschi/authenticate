const bcrypt = require('bcrypt');
const mongoose = require('mongoose');






mongoose.connect('mongodb+srv://Web4200:YpAGKG0TMQhG5cy1@cluster0.0mhc7.mongodb.net/midtermSongs?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.model
mongoose.set('useCreateIndex', true);




const songSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Song Name"]
    },
    length: {
        type: String,
        required: [true, "Please Enter Song Length"]
    },
    rating: {
        type: String,
        required: [true, "Please Enter Song Rating"]
    },
    playlist: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Playlist'
    }
})

const Song = mongoose.model('Song', songSchema);

const userSchema = mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    userFirstName: {
        type: String,
        required: true
    },
    userLastName: {
        type: String,
        required: true
    },
    userEncryptedPassword: {
        type: String,
        required: true
    },
})

userSchema.methods.verifyPassword = function (plainPassword, callback) {
    bcrypt.compare(plainPassword, this.userEncryptedPassword).then(result => {
        callback(result)
    })
}

const User = mongoose.model('User', userSchema)

const playlistSchema = mongoose.Schema({
    name: String,
    songList: Array,
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
    }
})

const Playlist = mongoose.model('Playlist', playlistSchema)


module.exports = {
    Song: Song,
    Playlist: Playlist,
    User: User
}




