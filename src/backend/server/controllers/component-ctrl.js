const schemas = require('../../models/models');

const VehicleComponent = schemas.vehicleComponent;
const RadioNet = schemas.radioNet;
const PowerSupply = schemas.powerSupply;
const Engineer = schemas.engineer;
const Vehicle = schemas.vehicle;
const Approval = schemas.approval;
const Software = schemas.software;

// Vehicles
const createVehicle = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a vehicle',
        });
    }

    const vehicle = new Vehicle(body);

    if (!vehicle) {
        return res.status(400).json({
            success: false,
            error: 'Invalid vehicle provided',
        });
    }

    vehicle
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: vehicle._id,
                name: vehicle.name,
                message: 'New vehicle created!',
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error,
                message: 'Vehicle not created!',
            });
        });
};

const updateVehicle = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    Vehicle.findOne({ _id: req.params.id }, (err, vehicle) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Vehicle not found!',
            });
        }

        if (!vehicle) {
            return res.status(400).json({
                success: false,
                error: `Vehicle '${req.params.id}' not found`,
            });
        }

        for (const [key, value] of Object.entries(body)) {
            vehicle[key] = value;
        }

        vehicle
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: vehicle._id,
                    name: vehicle.name,
                    message: 'Vehicle updated!',
                });
            })
            .catch((error) => {
                return res.status(404).json({
                    error,
                    message: 'Vehicle not updated!',
                });
            });
    });
};

const updateVehicleByName = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    Vehicle.findOne({ name: req.params.name }, (err, vehicle) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Vehicle not found!',
            });
        }

        if (!vehicle) {
            return res.status(400).json({
                success: false,
                error: `Vehicle '${req.params.name}' not found`,
            });
        }

        for (const [key, value] of Object.entries(body)) {
            vehicle[key] = value;
        }

        vehicle
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: vehicle._id,
                    name: vehicle.name,
                    message: 'Vehicle updated!',
                });
            })
            .catch((error) => {
                return res.status(404).json({
                    error,
                    message: 'Vehicle not updated!',
                });
            });
    });
};

const deleteVehicle = async (req, res) => {
    await Vehicle.findOneAndDelete({ _id: req.params.id }, (err, vehicle) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                error: `Vehicle '${req.params.id}' not found`,
            });
        }

        return res.status(200).json({ success: true, data: vehicle });
    }).catch((err) => console.log(err));
};

const deleteVehicleByName = async (req, res) => {
    await Vehicle.findOneAndDelete(
        { name: req.params.name },
        (err, vehicle) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }

            if (!vehicle) {
                return res.status(404).json({
                    success: false,
                    error: `Vehicle '${req.params.name}' not found`,
                });
            }

            return res.status(200).json({ success: true, data: vehicle });
        }
    ).catch((err) => console.log(err));
};

const getVehicleById = async (req, res) => {
    await Vehicle.findOne({ _id: req.params.id }, (err, vehicle) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                error: `Vehicle '${req.params.id}' not found`,
            });
        }

        return res.status(200).json({ success: true, data: vehicle });
    }).catch((err) => console.log(err));
};

const getVehicleByName = async (req, res) => {
    // console.log(req);
    await Vehicle.find({ name: req.params.name }, (err, vehicle) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!vehicle) {
            return res.satus(404).json({
                success: false,
                error: `Vehicle '${req.params.name}' not found`,
            });
        }

        return res.status(200).json({ success: true, data: vehicle });
    }).catch((err) => console.log(err));
};

const getVehicles = async (req, res) => {
    await Vehicle.find({}, (err, vehicles) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!vehicles.length) {
            return res.status(404).json({
                success: false,
                error: 'No vehicles in database',
            });
        }

        return res.status(200).json({ success: true, data: vehicles });
    }).catch((err) => console.log(err));
};

const getLatestVehicles = async (req, res) => {
    await Vehicle.find({ latest: true }, (err, vehicles) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!vehicles.length) {
            return res.status(404).json({
                success: false,
                error: 'No latest vehicles in database',
            });
        }

        return res.status(200).json({ success: true, data: vehicles });
    }).catch((err) => console.log(err));
};

// Vehicle components
const createVehicleComponent = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a vehicle component',
        });
    }

    const vehicleComponent = new VehicleComponent(body);

    if (!vehicleComponent) {
        return res.status(400).json({
            success: false,
            error: 'Invalid vehicle component provided',
        });
    }

    vehicleComponent
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: vehicleComponent._id,
                name: vehicleComponent.name,
                message: 'New vehicle component created!',
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error,
                message: 'Vehicle component not created!',
            });
        });
};

const updateVehicleComponent = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    VehicleComponent.findOne(
        { _id: req.params.id },
        (err, vehicleComponent) => {
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'Vehicle component not found!',
                });
            }

            if (!vehicleComponent) {
                return res.status(400).json({
                    success: false,
                    error: `Vehicle component '${req.params.id}' not found`,
                });
            }

            for (const [key, value] of Object.entries(body)) {
                vehicleComponent[key] = value;
            }

            vehicleComponent
                .save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        id: vehicleComponent._id,
                        name: vehicleComponent.name,
                        message: 'Vehicle component updated!',
                    });
                })
                .catch((error) => {
                    return res.status(404).json({
                        error,
                        message: 'Vehicle component not updated!',
                    });
                });
        }
    );
};

const updateVehicleComponentByName = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    VehicleComponent.findOne(
        { name: req.params.name },
        (err, vehicleComponent) => {
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'Vehicle component not found!',
                });
            }

            if (!vehicleComponent) {
                return res.status(400).json({
                    success: false,
                    error: `Vehicle component '${req.params.name}' not found`,
                });
            }

            for (const [key, value] of Object.entries(body)) {
                vehicleComponent[key] = value;
            }

            vehicleComponent
                .save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        id: vehicleComponent._id,
                        name: vehicleComponent.name,
                        message: 'Vehicle component updated!',
                    });
                })
                .catch((error) => {
                    return res.status(404).json({
                        error,
                        message: 'Vehicle component not updated!',
                    });
                });
        }
    );
};

const deleteVehicleComponent = async (req, res) => {
    await VehicleComponent.findOneAndDelete(
        { _id: req.params.id },
        (err, vehicleComponent) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }

            if (!vehicleComponent) {
                return res.status(404).json({
                    success: false,
                    error: `Vehicle component '${req.params.id}' not found`,
                });
            }

            return res
                .status(200)
                .json({ success: true, data: vehicleComponent });
        }
    ).catch((err) => console.log(err));
};

const deleteVehicleComponentByName = async (req, res) => {
    await VehicleComponent.findOneAndDelete(
        { name: req.params.name },
        (err, vehicleComponent) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }

            if (!vehicleComponent) {
                return res.status(404).json({
                    success: false,
                    error: `Vehicle component '${req.params.name}' not found`,
                });
            }

            return res
                .status(200)
                .json({ success: true, data: vehicleComponent });
        }
    ).catch((err) => console.log(err));
};

const getVehicleComponentById = async (req, res) => {
    await VehicleComponent.findOne(
        { _id: req.params.id },
        (err, vehicleComponent) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }

            if (!vehicleComponent) {
                return res.status(404).json({
                    success: false,
                    error: `Vehicle component '${req.params.id}' not found`,
                });
            }

            return res
                .status(200)
                .json({ success: true, data: vehicleComponent });
        }
    ).catch((err) => console.log(err));
};

const getVehicleComponentByName = async (req, res) => {
    // console.log(req);
    await VehicleComponent.find(
        { name: req.params.name },
        (err, vehicleComponent) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }

            if (!vehicleComponent) {
                return res.satus(404).json({
                    success: false,
                    error: `Vehicle component '${req.params.name}' not found`,
                });
            }

            return res
                .status(200)
                .json({ success: true, data: vehicleComponent });
        }
    ).catch((err) => console.log(err));
};

const getVehicleComponents = async (req, res) => {
    await VehicleComponent.find({}, (err, vehicleComponents) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!vehicleComponents.length) {
            return res.status(404).json({
                success: false,
                error: 'No vehicle components in database',
            });
        }

        return res.status(200).json({ success: true, data: vehicleComponents });
    }).catch((err) => console.log(err));
};

const getLatestVehicleComponents = async (req, res) => {
    await VehicleComponent.find({ latest: true }, (err, vehicleComponents) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!vehicleComponents.length) {
            return res.status(404).json({
                success: false,
                error: 'No latest vehicle components in database',
            });
        }

        return res.status(200).json({ success: true, data: vehicleComponents });
    }).catch((err) => console.log(err));
};

// Radio nets
const createRadioNet = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a radio net',
        });
    }

    const radioNet = new RadioNet(body);

    if (!radioNet) {
        return res.status(400).json({
            success: false,
            error: 'Invalid radio net provided',
        });
    }

    radioNet
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: radioNet._id,
                name: radioNet.name,
                message: 'New radio net created!',
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error,
                message: 'Radio net not created!',
            });
        });
};

const updateRadioNet = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    RadioNet.findOne({ _id: req.params.id }, (err, radioNet) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Radio net not found!',
            });
        }

        if (!radioNet) {
            return res.status(400).json({
                success: false,
                error: `Radio net '${req.params.id}' not found`,
            });
        }

        for (const [key, value] of Object.entries(body)) {
            radioNet[key] = value;
        }

        radioNet
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: radioNet._id,
                    name: radioNet.name,
                    message: 'Radio net updated!',
                });
            })
            .catch((error) => {
                return res.status(404).json({
                    error,
                    message: 'Radio net not updated!',
                });
            });
    });
};

const updateRadioNetByName = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    RadioNet.findOne({ name: req.params.name }, (err, radioNet) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Radio net not found!',
            });
        }

        if (!radioNet) {
            return res.status(400).json({
                success: false,
                error: `Radio net '${req.params.name}' not found`,
            });
        }

        for (const [key, value] of Object.entries(body)) {
            radioNet[key] = value;
        }

        radioNet
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: radioNet._id,
                    name: radioNet.name,
                    message: 'Radio net updated!',
                });
            })
            .catch((error) => {
                return res.status(404).json({
                    error,
                    message: 'Radio net not updated!',
                });
            });
    });
};

const deleteRadioNet = async (req, res) => {
    await RadioNet.findOneAndDelete({ _id: req.params.id }, (err, radioNet) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!radioNet) {
            return res.status(404).json({
                success: false,
                error: `Radio net '${req.params.id}' not found`,
            });
        }

        return res.status(200).json({ success: true, data: radioNet });
    }).catch((err) => console.log(err));
};

const deleteRadioNetByName = async (req, res) => {
    await RadioNet.findOneAndDelete(
        { name: req.params.name },
        (err, radioNet) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }

            if (!radioNet) {
                return res.status(404).json({
                    success: false,
                    error: `Radio net '${req.params.name}' not found`,
                });
            }

            return res.status(200).json({ success: true, data: radioNet });
        }
    ).catch((err) => console.log(err));
};

const getRadioNetById = async (req, res) => {
    await RadioNet.findOne({ _id: req.params.id }, (err, radioNet) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!radioNet) {
            return res.status(404).json({
                success: false,
                error: `Radio net '${req.params.id}' not found`,
            });
        }

        return res.status(200).json({ success: true, data: radioNet });
    }).catch((err) => console.log(err));
};

const getRadioNetByName = async (req, res) => {
    // console.log(req);
    await RadioNet.find({ name: req.params.name }, (err, radioNet) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!radioNet) {
            return res.satus(404).json({
                success: false,
                error: `Radio net '${req.params.name}' not found`,
            });
        }

        return res.status(200).json({ success: true, data: radioNet });
    }).catch((err) => console.log(err));
};

const getRadioNets = async (req, res) => {
    await RadioNet.find({}, (err, radioNets) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!radioNets.length) {
            return res
                .status(404)
                .json({ success: false, error: 'No radio nets in database' });
        }

        return res.status(200).json({ success: true, data: radioNets });
    }).catch((err) => console.log(err));
};

const getLatestRadioNets = async (req, res) => {
    await RadioNet.find({ latest: true }, (err, radioNets) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!radioNets.length) {
            return res
                .status(404)
                .json({ success: false, error: 'No radio nets in database' });
        }

        return res.status(200).json({ success: true, data: radioNets });
    }).catch((err) => console.log(err));
};

// Power supply
const createPowerSupply = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a power supply',
        });
    }

    const powerSupply = new PowerSupply(body);

    if (!powerSupply) {
        return res.status(400).json({
            success: false,
            error: 'Invalid power supply provided',
        });
    }

    powerSupply
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: powerSupply._id,
                name: powerSupply.name,
                message: 'New power supply created!',
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error,
                message: 'Power supply not created!',
            });
        });
};

const updatePowerSupply = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    PowerSupply.findOne({ _id: req.params.id }, (err, powerSupply) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Power supply not found!',
            });
        }

        if (!powerSupply) {
            return res.status(400).json({
                success: false,
                error: `Power supply '${req.params.id}' not found`,
            });
        }

        for (const [key, value] of Object.entries(body)) {
            powerSupply[key] = value;
        }

        powerSupply
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: powerSupply._id,
                    name: powerSupply.name,
                    message: 'Power supply updated!',
                });
            })
            .catch((error) => {
                return res.status(404).json({
                    error,
                    message: 'Power supply not updated!',
                });
            });
    });
};

const updatePowerSupplyByName = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    PowerSupply.findOne({ name: req.params.name }, (err, powerSupply) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Power supply not found!',
            });
        }

        if (!powerSupply) {
            return res.status(400).json({
                success: false,
                error: `Power supply '${req.params.name}' not found`,
            });
        }

        for (const [key, value] of Object.entries(body)) {
            powerSupply[key] = value;
        }

        powerSupply
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: powerSupply._id,
                    name: powerSupply.name,
                    message: 'Power supply updated!',
                });
            })
            .catch((error) => {
                return res.status(404).json({
                    error,
                    message: 'Power supply not updated!',
                });
            });
    });
};

const deletePowerSupply = async (req, res) => {
    await PowerSupply.findOneAndDelete(
        { _id: req.params.id },
        (err, powerSupply) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }

            if (!powerSupply) {
                return res.status(404).json({
                    success: false,
                    error: `Power supply '${req.params.id}' not found`,
                });
            }

            return res.status(200).json({ success: true, data: powerSupply });
        }
    ).catch((err) => console.log(err));
};

const deletePowerSupplyByName = async (req, res) => {
    await PowerSupply.findOneAndDelete(
        { name: req.params.name },
        (err, powerSupply) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }

            if (!powerSupply) {
                return res.status(404).json({
                    success: false,
                    error: `Power supply '${req.params.name}' not found`,
                });
            }

            return res.status(200).json({ success: true, data: powerSupply });
        }
    ).catch((err) => console.log(err));
};

const getPowerSupplyById = async (req, res) => {
    await PowerSupply.findOne({ _id: req.params.id }, (err, powerSupply) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!powerSupply) {
            return res.status(404).json({
                success: false,
                error: `Power supply '${req.params.id}' not found`,
            });
        }

        return res.status(200).json({ success: true, data: powerSupply });
    }).catch((err) => console.log(err));
};

const getPowerSupplyByName = async (req, res) => {
    // console.log(req);
    await PowerSupply.find({ name: req.params.name }, (err, powerSupply) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!powerSupply) {
            return res.satus(404).json({
                success: false,
                error: `Power supply '${req.params.name}' not found`,
            });
        }

        return res.status(200).json({ success: true, data: powerSupply });
    }).catch((err) => console.log(err));
};

const getPowerSupplies = async (req, res) => {
    await PowerSupply.find({}, (err, powerSupplys) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!powerSupplys.length) {
            return res.status(404).json({
                success: false,
                error: 'No power supplies in database',
            });
        }

        return res.status(200).json({ success: true, data: powerSupplys });
    }).catch((err) => console.log(err));
};

const getLatestPowerSupplies = async (req, res) => {
    await PowerSupply.find({ latest: true }, (err, powerSupplys) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!powerSupplys.length) {
            return res.status(404).json({
                success: false,
                error: 'No power supplies in database',
            });
        }

        return res.status(200).json({ success: true, data: powerSupplys });
    }).catch((err) => console.log(err));
};

// Software
const createSoftware = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a software',
        });
    }

    const software = new Software(body);

    if (!software) {
        return res.status(400).json({
            success: false,
            error: 'Invalid software provided',
        });
    }

    software
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: software._id,
                name: software.name,
                message: 'New software created!',
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error,
                message: 'Software not created!',
            });
        });
};

const updateSoftware = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    Software.findOne({ _id: req.params.id }, (err, software) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Software not found!',
            });
        }

        if (!software) {
            return res.status(400).json({
                success: false,
                error: `Software '${req.params.id}' not found`,
            });
        }

        for (const [key, value] of Object.entries(body)) {
            software[key] = value;
        }

        software
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: software._id,
                    name: software.name,
                    message: 'Software updated!',
                });
            })
            .catch((error) => {
                return res.status(404).json({
                    error,
                    message: 'Software not updated!',
                });
            });
    });
};

const updateSoftwareByName = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    Software.findOne({ name: req.params.name }, (err, software) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Software not found!',
            });
        }

        if (!software) {
            return res.status(400).json({
                success: false,
                error: `Software '${req.params.name}' not found`,
            });
        }

        for (const [key, value] of Object.entries(body)) {
            software[key] = value;
        }

        software
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: software._id,
                    name: software.name,
                    message: 'Software updated!',
                });
            })
            .catch((error) => {
                return res.status(404).json({
                    error,
                    message: 'Software not updated!',
                });
            });
    });
};

const deleteSoftware = async (req, res) => {
    await Software.findOneAndDelete({ _id: req.params.id }, (err, software) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!software) {
            return res.status(404).json({
                success: false,
                error: `Software '${req.params.id}' not found`,
            });
        }

        return res.status(200).json({ success: true, data: software });
    }).catch((err) => console.log(err));
};

const deleteSoftwareByName = async (req, res) => {
    await Software.findOneAndDelete(
        { name: req.params.name },
        (err, software) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }

            if (!software) {
                return res.status(404).json({
                    success: false,
                    error: `Software '${req.params.name}' not found`,
                });
            }

            return res.status(200).json({ success: true, data: software });
        }
    ).catch((err) => console.log(err));
};

const getSoftwareById = async (req, res) => {
    await Software.findOne({ _id: req.params.id }, (err, software) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!software) {
            return res.status(404).json({
                success: false,
                error: `Software '${req.params.id}' not found`,
            });
        }

        return res.status(200).json({ success: true, data: software });
    }).catch((err) => console.log(err));
};

const getSoftwareByName = async (req, res) => {
    // console.log(req);
    await Software.find({ name: req.params.name }, (err, software) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!software) {
            return res.satus(404).json({
                success: false,
                error: `Software '${req.params.name}' not found`,
            });
        }

        return res.status(200).json({ success: true, data: software });
    }).catch((err) => console.log(err));
};

const getSoftwares = async (req, res) => {
    await Software.find({}, (err, softwares) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!softwares.length) {
            return res
                .status(404)
                .json({ success: false, error: 'No software in database' });
        }

        return res.status(200).json({ success: true, data: softwares });
    }).catch((err) => console.log(err));
};

const getLatestSoftwares = async (req, res) => {
    await Software.find({ latest: true }, (err, softwares) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!softwares.length) {
            return res
                .status(404)
                .json({ success: false, error: 'No software in database' });
        }

        return res.status(200).json({ success: true, data: softwares });
    }).catch((err) => console.log(err));
};

module.exports = {
    createVehicle,
    updateVehicle,
    updateVehicleByName,
    deleteVehicle,
    deleteVehicleByName,
    getVehicles,
    getLatestVehicles,
    getVehicleById,
    getVehicleByName,
    createVehicleComponent,
    updateVehicleComponent,
    updateVehicleComponentByName,
    deleteVehicleComponent,
    deleteVehicleComponentByName,
    getVehicleComponents,
    getLatestVehicleComponents,
    getVehicleComponentById,
    getVehicleComponentByName,
    createRadioNet,
    updateRadioNet,
    updateRadioNetByName,
    deleteRadioNet,
    deleteRadioNetByName,
    getRadioNets,
    getLatestRadioNets,
    getRadioNetById,
    getRadioNetByName,
    createPowerSupply,
    updatePowerSupply,
    updatePowerSupplyByName,
    deletePowerSupply,
    deletePowerSupplyByName,
    getPowerSupplies,
    getLatestPowerSupplies,
    getPowerSupplyById,
    getPowerSupplyByName,
    createSoftware,
    updateSoftware,
    updateSoftwareByName,
    deleteSoftware,
    deleteSoftwareByName,
    getSoftwares,
    getLatestSoftwares,
    getSoftwareById,
    getSoftwareByName,
};
