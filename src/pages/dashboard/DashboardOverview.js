import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
    Col,
    Row,
    Button,
    Dropdown,
    ButtonGroup,
    Modal,
} from '@themesberg/react-bootstrap';

import { ProjectTable } from '../../components/Tables';
import { DateTime } from 'luxon';

var entries = [
    {
        projectName: 'Project A',
        id: 0,
        complete: false,
        selected: false,
        deliverableName: 'Certify document',
        dueDate: DateTime.fromISO('2021-06-23').setLocale('sg'),
        children: null,
        parentId: null,
        edit: false,
    },
    {
        projectName: 'Project A',
        id: 1,
        complete: false,
        selected: false,
        deliverableName: 'Testing document',
        dueDate: DateTime.fromISO('2021-07-04').setLocale('sg'),
        children: [
            {
                projectName: 'Project A',
                id: 0,
                complete: false,
                selected: false,
                deliverableName: 'child 1',
                dueDate: DateTime.fromISO('2021-06-28').setLocale('sg'),
                children: null,
                parentId: 1,
                edit: false,
            },
            {
                projectName: 'Project A',
                id: 1,
                complete: false,
                selected: false,
                deliverableName: 'child 2',
                dueDate: DateTime.fromISO('2021-12-21').setLocale('sg'),
                children: null,
                parentId: 1,
                edit: false,
            },
        ],
        parentId: null,
        edit: false,
    },
];

export default () => {
    const todayDate = DateTime.now().setLocale('sg');
    const [itemsDue, _] = useState([]);
    const [showReminder, setShowReminder] = useState(numItemsDue(entries) > 0);

    function numItemsDue(entries) {
        var remind = 0;
        for (var entry of entries) {
            if (Math.round(entry.dueDate.diff(todayDate, 'days').days) < 4) {
                remind++;
                addItemsDue(entry.deliverableName);
            }
            if (entry.children) {
                for (var child of entry.children) {
                    if (
                        Math.round(child.dueDate.diff(todayDate, 'days').days) <
                        4
                    ) {
                        remind++;
                        addItemsDue(child.deliverableName);
                    }
                }
            }
        }

        return remind;
    }

    function addItemsDue(itemName) {
        if (!itemsDue.includes(itemName)) itemsDue.push(itemName);
    }

    var dashboardObj = [];

    if (showReminder) {
        dashboardObj = (
            <>
                <Modal
                    as={Modal.Dialog}
                    centered
                    show={showReminder}
                    onHide={() => {}}
                >
                    <Modal.Header>
                        <Modal.Title className='h6'>Reminder</Modal.Title>
                        <Button
                            variant='close'
                            aria-label='Close'
                            onClick={() => setShowReminder(false)}
                        />
                    </Modal.Header>
                    <Modal.Body>
                        <p>{`You have ${numItemsDue(
                            entries
                        )} items due within 3 days.`}</p>
                        <ol>
                            {itemsDue.map((item) => (
                                <li>{item}</li>
                            ))}
                        </ol>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className='btn-block'
                            variant='secondary'
                            onClick={() => setShowReminder(false)}
                        >
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4'>
                    <Dropdown className='btn-toolbar'>
                        <Dropdown.Toggle
                            as={Button}
                            variant='primary'
                            size='sm'
                            className='me-2'
                            onClick={() => {
                                console.log('clicked');
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} className='me-2' />
                            New Project
                        </Dropdown.Toggle>
                    </Dropdown>

                    <ButtonGroup>
                        <Button variant='outline-primary' size='sm'>
                            Share
                        </Button>
                        <Button variant='outline-primary' size='sm'>
                            Export
                        </Button>
                    </ButtonGroup>
                </div>

                <Row className='justify-content-md-center'>
                    <Col xs={12} className='mb-4 d-none d-sm-block'>
                        <ProjectTable {...entries} />
                    </Col>
                </Row>
            </>
        );
    } else {
        dashboardObj = (
            <>
                <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4'>
                    <Dropdown className='btn-toolbar'>
                        <Dropdown.Toggle
                            as={Button}
                            variant='primary'
                            size='sm'
                            className='me-2'
                            onClick={() => {
                                console.log('clicked');
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} className='me-2' />
                            New Project
                        </Dropdown.Toggle>
                    </Dropdown>
                </div>

                <Row className='justify-content-md-center'>
                    <Col xs={12} className='mb-4 d-none d-sm-block'>
                        <ProjectTable {...entries} />
                    </Col>
                </Row>
            </>
        );
    }

    return <>{dashboardObj}</>;
};
