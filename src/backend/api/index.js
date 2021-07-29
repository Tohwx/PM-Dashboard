import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

// Approval
export const insertApproval = (payload) => api.post(`/approvals`, payload);
export const getAllApprovals = () => api.get(`/approvals`);
export const getApprovalById = (id, download) =>
    api.get(`/approvals/${id}/${download}`);
export const getApprovalFileById = (id) =>
    api.get(`/approvals/${id}/1`, { responseType: 'blob' });
export const getApprovalByName = (filename, download) =>
    api.get(`/approvals/name/${filename}/${download}`);
export const deleteApprovalById = (id) => api.delete(`/approvals/${id}`);

// Vehicles
export const insertVehicle = (payload) => api.post(`/vehicle`, payload);
export const getAllVehicles = () => api.get(`/vehicles`);
export const getLatestVehicles = () => api.get(`/vehicles/latest`);
export const updateVehicleById = (id, payload) =>
    api.put(`/vehicle/${id}`, payload);
export const updateVehicleByName = (name, payload) =>
    api.put(`/vehicle/name/${name}`, payload);
export const deleteVehicleById = (id) => api.delete(`/vehicle/${id}`);
export const deleteVehicleByName = (name) =>
    api.delete(`/vehicle/name/${name}`);
export const getVehicleById = (id) => api.get(`/vehicle/${id}`);
export const getVehicleByName = (name) => api.get(`/vehicle/name/${name}`);

// Vehicle components
export const insertVehicleComponent = (payload) =>
    api.post(`/vehicle_component`, payload);
export const getAllVehicleComponents = () => api.get(`/vehicle_components`);
export const getLatestVehicleComponents = () =>
    api.get(`/vehicle_components/latest`);
export const updateVehicleComponentById = (id, payload) =>
    api.put(`/vehicle_component/${id}`, payload);
export const updateVehicleComponentByName = (name, payload) =>
    api.put(`/vehicle_component/name/${name}`, payload);
export const deleteVehicleComponentById = (id) =>
    api.delete(`/vehicle_component/${id}`);
export const deleteVehicleComponentByName = (name) =>
    api.delete(`/vehicle_component/name/${name}`);
export const getVehicleComponentById = (id) =>
    api.get(`/vehicle_component/${id}`);
export const getVehicleComponentByName = (name) =>
    api.get(`/vehicle_component/name/${name}`);

// Radio nets
export const insertRadioNet = (payload) => api.post(`/radio_net`, payload);
export const getAllRadioNets = () => api.get(`/radio_nets`);
export const getLatestRadioNets = () => api.get(`/radio_nets/latest`);
export const updateRadioNetById = (id, payload) =>
    api.put(`/radio_net/${id}`, payload);
export const updateRadioNetByName = (name, payload) =>
    api.put(`/radio_net/name/${name}`, payload);
export const deleteRadioNetById = (id) => api.delete(`/radio_net/${id}`);
export const deleteRadioNetByName = (name) =>
    api.delete(`/radio_net/name/${name}`);
export const getRadioNetById = (id) => api.get(`/radio_net/${id}`);
export const getRadioNetByName = (name) => api.get(`/radio_net/name/${name}`);

// Power supplies
export const insertPowerSupply = (payload) =>
    api.post(`/power_supply`, payload);
export const getAllPowerSupplies = () => api.get(`/power_supplies`);
export const getLatestPowerSupplies = () => api.get(`/power_supplies/latest`);
export const updatePowerSupplyById = (id, payload) =>
    api.put(`/power_supply/${id}`, payload);
export const updatePowerSupplyByName = (name, payload) =>
    api.put(`/power_supply/name/${name}`, payload);
export const deletePowerSupplyById = (id) => api.delete(`/power_supply/${id}`);
export const deletePowerSupplyByName = (name) =>
    api.delete(`/power_supply/name/${name}`);
export const getPowerSupplyById = (id) => api.get(`/power_supply/${id}`);
export const getPowerSupplyByName = (name) =>
    api.get(`/power_supply/name/${name}`);

// Software
export const insertSoftware = (payload) => api.post(`/software`, payload);
export const getAllSoftwares = () => api.get(`/softwares`);
export const getLatestSoftwares = () => api.get(`/softwares/latest`);
export const updateSoftwareById = (id, payload) =>
    api.put(`/software/${id}`, payload);
export const updateSoftwareByName = (name, payload) =>
    api.put(`/software/name/${name}`, payload);
export const deleteSoftwareById = (id) => api.delete(`/software/${id}`);
export const deleteSoftwareByName = (name) =>
    api.delete(`/software/name/${name}`);
export const getSoftwareById = (id) => api.get(`/software/${id}`);
export const getSoftwareByName = (name) => api.get(`/software/name/${name}`);

const apis = {
    insertApproval,
    getAllApprovals,
    getApprovalById,
    getApprovalFileById,
    getApprovalByName,
    deleteApprovalById,

    insertVehicle,
    getAllVehicles,
    getLatestVehicles,
    updateVehicleById,
    updateVehicleByName,
    deleteVehicleById,
    deleteVehicleByName,
    getVehicleById,
    getVehicleByName,

    insertVehicleComponent,
    getAllVehicleComponents,
    getLatestVehicleComponents,
    updateVehicleComponentById,
    updateVehicleComponentByName,
    deleteVehicleComponentById,
    deleteVehicleComponentByName,
    getVehicleComponentById,
    getVehicleComponentByName,

    insertRadioNet,
    getAllRadioNets,
    getLatestRadioNets,
    updateRadioNetById,
    updateRadioNetByName,
    deleteRadioNetById,
    deleteRadioNetByName,
    getRadioNetById,
    getRadioNetByName,

    insertPowerSupply,
    getAllPowerSupplies,
    getLatestPowerSupplies,
    updatePowerSupplyById,
    updatePowerSupplyByName,
    deletePowerSupplyById,
    deletePowerSupplyByName,
    getPowerSupplyById,
    getPowerSupplyByName,

    insertSoftware,
    getAllSoftwares,
    getLatestSoftwares,
    updateSoftwareById,
    updateSoftwareByName,
    deleteSoftwareById,
    deleteSoftwareByName,
    getSoftwareById,
    getSoftwareByName,
};

export default apis;
