const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const RadioNet = new Schema(
    {
        name: { type: String, minLength: 1, required: true },
        frequency: { type: Number, required: true },
        latest: { type: Boolean, default: false, required: true },
        parent: { type: ObjectId, default: null }, //, required: true },
    },
    { timestamps: true }
);

const PowerSupply = new Schema(
    {
        name: { type: String, minLength: 1, required: true },
        voltage: { type: Number, required: true },
        latest: { type: Boolean, default: false, required: true },
        parent: { type: ObjectId, default: null }, //, required: true },
    },
    { timestamps: true }
);

const Engineer = new Schema(
    {
        name: { type: String, minLength: 1, required: true, unique: true },
    },
    { timestamps: true }
);

const Approval = new Schema(
    {
        name: { type: String, minLength: 1, required: true },
        document: {
            type: String,
            default: '',
            required: true,
        },
    },
    { timestamps: true }
);

const Software = new Schema(
    {
        name: { type: String, minLength: 1, required: true },
        version: {
            type: [Number],
            minLength: 3,
            default: [1, 0, 0],
            required: true,
        },
        latest: { type: Boolean, default: false, required: true },
        parent: { type: ObjectId, default: null },
        approval: { type: ObjectId, default: null },
    },
    { timestamps: true }
);

const VehicleComponent = new Schema(
    {
        name: { type: String, minLength: 1, required: true },
        weight: { type: Number, min: 0, required: true },
        dimensions: { type: [Number], required: true },
        parent: { type: ObjectId, default: null }, //, required: true },
        version: {
            type: [Number],
            minLength: 3,
            default: [1, 0, 0],
            required: true,
        },
        latest: { type: Boolean, default: false, required: true },
        approval: { type: ObjectId, default: null }, //, required: true },
        power: {
            vmin: { type: Number, default: null },
            vmax: { type: Number, default: null },
            supply: { type: ObjectId, default: null },
        },
        radionet: {
            fmin: { type: Number, min: 0, default: null },
            fmax: { type: Number, min: 0, default: null },
            net: { type: ObjectId, default: null },
        },
        maintenance: {
            last: {
                date: { type: Date, default: null },
                by: { type: ObjectId, default: null },
            },
            next: {
                date: { type: Date, default: null },
            },
        },
    },
    { timestamps: true }
);

const Vehicle = new Schema(
    {
        name: { type: String, minLength: 1, required: true },
        version: {
            type: [Number],
            minLength: 3,
            default: [1, 0, 0],
            required: true,
        },
        parent: { type: ObjectId, default: null, required: true },
        approval: { type: ObjectId, default: null, required: true },
        weightlimit: { type: Number, min: 0, required: true },
        dimensions: { type: [Number], required: true },
        software: { type: ObjectId, default: null },
        components: {
            type: Object,
            default: {},
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = {
    vehicleComponent: mongoose.model('VehicleComponent', VehicleComponent),
    radioNet: mongoose.model('RadioNet', RadioNet),
    powerSupply: mongoose.model('PowerSupply', PowerSupply),
    engineer: mongoose.model('Engineer', Engineer),
    approval: mongoose.model('Approval', Approval),
    software: mongoose.model('Software', Software),
    vehicle: mongoose.model('Vehicle', Vehicle),
};
