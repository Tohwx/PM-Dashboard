const express = require('express');

const componentCtrl = require('../controllers/component-ctrl');

const router = express.Router();

// Vehicles
router.post('/vehicle', componentCtrl.createVehicle);
router.put('/vehicle/:id', componentCtrl.updateVehicle);
router.put('/vehicle/name/:name', componentCtrl.updateVehicleByName);
router.delete('/vehicle/:id', componentCtrl.deleteVehicle);
router.delete('/vehicle/name/:name', componentCtrl.deleteVehicleByName);
router.get('/vehicle/:id', componentCtrl.getVehicleById);
router.get('/vehicle/name/:name', componentCtrl.getVehicleByName);
router.get('/vehicles', componentCtrl.getVehicles);
router.get('/vehicles/latest', componentCtrl.getLatestVehicles);

// Vehicle components
router.post('/vehicle_component', componentCtrl.createVehicleComponent);
router.put('/vehicle_component/:id', componentCtrl.updateVehicleComponent);
router.put(
    '/vehicle_component/name/:name',
    componentCtrl.updateVehicleComponentByName
);
router.delete('/vehicle_component/:id', componentCtrl.deleteVehicleComponent);
router.delete(
    '/vehicle_component/name/:name',
    componentCtrl.deleteVehicleComponentByName
);
router.get('/vehicle_component/:id', componentCtrl.getVehicleComponentById);
router.get(
    '/vehicle_component/name/:name',
    componentCtrl.getVehicleComponentByName
);
router.get('/vehicle_components', componentCtrl.getVehicleComponents);
router.get(
    '/vehicle_components/latest',
    componentCtrl.getLatestVehicleComponents
);

// Radio nets
router.post('/radio_net', componentCtrl.createRadioNet);
router.put('/radio_net/:id', componentCtrl.updateRadioNet);
router.put('/radio_net/name/:name', componentCtrl.updateRadioNetByName);
router.delete('/radio_net/:id', componentCtrl.deleteRadioNet);
router.delete('/radio_net/name/:name', componentCtrl.deleteRadioNetByName);
router.get('/radio_net/:id', componentCtrl.getRadioNetById);
router.get('/radio_net/name/:name', componentCtrl.getRadioNetByName);
router.get('/radio_nets', componentCtrl.getRadioNets);
router.get('/radio_nets/latest', componentCtrl.getLatestRadioNets);

// Power supplies
router.post('/power_supply', componentCtrl.createPowerSupply);
router.put('/power_supply/:id', componentCtrl.updatePowerSupply);
router.put('/power_supply/name/:name', componentCtrl.updatePowerSupplyByName);
router.delete('/power_supply/:id', componentCtrl.deletePowerSupply);
router.delete(
    '/power_supply/name/:name',
    componentCtrl.deletePowerSupplyByName
);
router.get('/power_supply/:id', componentCtrl.getPowerSupplyById);
router.get('/power_supply/name/:name', componentCtrl.getPowerSupplyByName);
router.get('/power_supplies', componentCtrl.getPowerSupplies);
router.get('/power_supplies/latest', componentCtrl.getLatestPowerSupplies);

// Software
router.post('/software', componentCtrl.createSoftware);
router.put('/software/:id', componentCtrl.updateSoftware);
router.put('/software/name/:name', componentCtrl.updateSoftwareByName);
router.delete('/software/:id', componentCtrl.deleteSoftware);
router.delete('/software/name/:name', componentCtrl.deleteSoftwareByName);
router.get('/software/:id', componentCtrl.getSoftwareById);
router.get('/software/name/:name', componentCtrl.getSoftwareByName);
router.get('/softwares', componentCtrl.getSoftwares);
router.get('/softwares/latest', componentCtrl.getLatestSoftwares);

module.exports = router;
