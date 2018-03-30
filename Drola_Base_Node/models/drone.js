let mongoose=require('mongoose');

let droneSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    droneModel: {
        type: String,
        required: true
    },
    droneId: {
        type: String,
        required: true
    },
    drone_specs: {
        type: String,
        required: true
    },
    loraId: {
        type: String,
        required: true
    },
    verification_status: {
        type: String,
        default: false
    }
});

module.exports=mongoose.model("Drone", droneSchema);