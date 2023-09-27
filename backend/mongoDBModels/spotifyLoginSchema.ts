import mongoose, { model } from "mongoose";

const Schema = mongoose.Schema;

const spotifyLoginSchema = new Schema({
    Client_ID: {
        type : String ,
        required : true
    } ,
    Redirect_URI: {
        type : String ,
        required : true
    },
    Release_Radar_code: {
        type : String ,
        required : false
    }
})

export default mongoose.model('spotifyLoginSchema', spotifyLoginSchema)