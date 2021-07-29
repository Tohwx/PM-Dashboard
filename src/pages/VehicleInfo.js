import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faCog,
    faHome,
    faSearch,
} from '@fortawesome/free-solid-svg-icons';
import {
    Col,
    Row,
    Form,
    Button,
    ButtonGroup,
    Breadcrumb,
    InputGroup,
    Dropdown,
} from '@themesberg/react-bootstrap';

import {
    VehicleTable,
    VehicleComponentTable,
    RadioNetTable,
    PowerSupplyTable,
    SoftwareTable,
} from '../components/Tables';

import api from '../backend/api';

export default () => {
    // const [vehicleComponents, setVehicleComponents] = useState([]);
    const [reloadPage, setReloadPage] = useState(false);

    // async function getComponents() {
    //     await api.getAllVehicleComponents().then((components) => {
    //         setVehicleComponents(components.data.data);
    //         setReloadTable(false);
    //     });
    // }

    // function setReloadPageHandle(bool) {
    //     setReloadPage(bool);
    // }

    useEffect(() => {
        setReloadPage(false);
    }, [reloadPage]);

    // console.log(getComponents());
    // console.log(vehicleComponents);

    return (
        <>
            <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4'>
                <div className='d-block mb-4 mb-md-0'>
                    <Breadcrumb
                        className='d-none d-md-inline-block'
                        listProps={{
                            className: 'breadcrumb-dark breadcrumb-transparent',
                        }}
                    >
                        <Breadcrumb.Item>
                            <FontAwesomeIcon icon={faHome} />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Project</Breadcrumb.Item>
                        <Breadcrumb.Item active>Vehicle Info</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            <div className='my-3'>
                <h4>Vehicles</h4>
                <VehicleTable />
            </div>

            <div className='my-3'>
                <h4>Components</h4>
                <VehicleComponentTable />
            </div>
            <Row>
                <Col className='w-50 my-3'>
                    <RadioNetTable setReloadPage={setReloadPage} />
                </Col>
                <Col className='w-50 my-3'>
                    <PowerSupplyTable setReloadPage={setReloadPage} />
                </Col>
            </Row>
            <Row>
                <Col className='w-50 my-3'>
                    <SoftwareTable setReloadPage={setReloadPage} />
                </Col>
                <Col></Col>
            </Row>
        </>
    );
};
