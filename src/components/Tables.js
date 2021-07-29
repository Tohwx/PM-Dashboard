import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleDown,
    faAngleUp,
    faAngleLeft,
    faAngleRight,
    faEdit,
    faEllipsisH,
    faEye,
    faTrashAlt,
    faCheck,
    faChevronRight,
    faCalendarAlt,
    faTimesCircle,
    faPlus,
    faMinus,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
    Col,
    Row,
    Nav,
    Card,
    Button,
    Table,
    Dropdown,
    Pagination,
    ButtonGroup,
    Form,
    Badge,
    InputGroup,
    Modal,
} from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routes } from '../routes';
import Datetime from 'react-datetime';
import { DateTime } from 'luxon';

import api from '../backend/api';
import { Comparison, check } from '../checks/checks';
import _ from 'lodash';
const FileDownload = require('js-file-download');

const ValueChange = ({ value, suffix }) => {
    const valueIcon = value < 0 ? faAngleDown : faAngleUp;
    const valueTxtColor = value < 0 ? 'text-danger' : 'text-success';

    return value ? (
        <span className={valueTxtColor}>
            <FontAwesomeIcon icon={valueIcon} />
            <span className='fw-bold ms-1'>
                {Math.abs(value)}
                {suffix}
            </span>
        </span>
    ) : (
        '--'
    );
};

export const ProjectTable = (entriesInit) => {
    // TODO: perform API call to get entries
    const [entries, setEntries] = useState(
        Array.from(Object.values(entriesInit))
    );
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    var [projectName, setProjectName] = useState(
        entries.length ? entries[0].projectName : 'Project'
    );
    const [changeProjName, setChangeProjName] = useState(false);

    console.log('Init');
    console.log(entries);

    const completeBtn = (
        <Button
            variant='success'
            size='sm'
            className=''
            onClick={toggleComplete}
        >
            Done
        </Button>
    );

    function checkSelected(items) {
        for (var item of items) {
            if (!item.complete && item.selected) return true;
            if (item.children) {
                for (var child of item.children) {
                    if (!child.complete && child.selected) return true;
                }
            }
        }
        return false;
    }

    const tableHeader = [
        checkSelected(entries) ? completeBtn : null,
        'Deliverable Name',
        'Due Date',
        'Due In',
        null,
    ];

    function toggleComplete() {
        var entriesNew = [...entries];
        for (var entry of entriesNew) {
            if (entry.selected) {
                entry.selected = false;
                entry.complete = true;
                if (entry.children) {
                    for (var child of entry.children) {
                        child.selected = false;
                        child.complete = true;
                    }
                }
            } else if (entry.children) {
                let allChildrenComplete = true;
                for (var child of entry.children) {
                    if (child.complete) continue;
                    else if (child.selected) {
                        child.selected = false;
                        child.complete = true;
                    } else {
                        allChildrenComplete = false;
                    }
                }

                if (allChildrenComplete) {
                    entry.selected = false;
                    entry.complete = true;
                } else {
                    entry.complete = false;
                }
            } else {
                entry.complete = false;
            }
        }
        setEntries(entriesNew);
    }

    function toggleIncomplete(id, childId) {
        var entriesNew = [...entries];
        entriesNew[id].selected = false;
        entriesNew[id].complete = false;

        if (childId !== null) {
            entriesNew[id].children[childId].selected = false;
            entriesNew[id].children[childId].complete = false;
        } else if (entriesNew[id].children) {
            for (var child of entriesNew[id].children) {
                child.selected = false;
                child.complete = false;
            }
        }
        setEntries(entriesNew);
    }

    function toggleCheckbox(id, childId) {
        var entriesNew = [...entries];

        if (childId === null) {
            entriesNew[id].selected = !entriesNew[id].selected;
            if (entriesNew[id].children) {
                for (var child of entriesNew[id].children) {
                    if (!child.complete)
                        child.selected = entriesNew[id].selected;
                }
            }
        } else {
            entriesNew[id].children[childId].selected =
                !entriesNew[id].children[childId].selected;
            let allChildrenSelected = true;
            for (var child of entriesNew[id].children) {
                if (child.complete || child.selected) continue;
                else {
                    allChildrenSelected = false;
                    break;
                }
            }
            if (allChildrenSelected) {
                entriesNew[id].selected = true;
            } else entriesNew[id].selected = false;
        }
        setEntries(entriesNew);
    }

    function editEntry(newEntry) {
        var entriesNew = [...entries];
        if (newEntry.parentId !== null) {
            const parentId = newEntry.parentId;
            entriesNew[parentId].children[newEntry.id] = newEntry;
        } else {
            entriesNew[newEntry.id] = newEntry;
        }
        // console.log('edited entries');
        setEntries(entriesNew);
    }

    const todayDT = DateTime.now().setLocale('sg');

    const handleAddItem = () => {
        let selectedId = null;
        for (let entry of entries) {
            if (entry.selected) {
                selectedId = entry.id;
                break;
            }
        }
        var entriesNew = [];
        if (selectedId === null) {
            const newItem = {
                projectName: projectName,
                id: entries.length,
                complete: false,
                selected: false,
                deliverableName: 'New Item',
                dueDate: DateTime.now().plus({ days: 7 }).setLocale('sg'),
                children: null,
                parentId: null,
                edit: false,
            };
            entriesNew = [...entries, newItem];
        } else {
            const newItem = {
                projectName: projectName,
                id: selectedId + 1,
                complete: false,
                selected: false,
                deliverableName: 'New Item',
                dueDate: DateTime.now().plus({ days: 7 }).setLocale('sg'),
                children: null,
                parentId: null,
                edit: false,
            };
            entriesNew = [...entries];
            entriesNew.splice(selectedId + 1, 0, newItem);
            for (var [idx, entry] of entriesNew.entries()) {
                if (idx > selectedId + 1) {
                    entry.id++;
                }
            }
        }
        setEntries(entriesNew);
    };

    const handleAddChild = (id) => {
        var entriesNew = [...entries];
        var newParentId = id;

        if (entriesNew[id].children === null) {
            var newChildId = 0;
        } else {
            newChildId = entriesNew[id].children.length;
        }

        const newItem = {
            projectName: projectName,
            id: newChildId,
            complete: false,
            selected: false,
            deliverableName: 'New Child',
            dueDate: DateTime.now().plus({ days: 7 }).setLocale('sg'),
            children: null,
            parentId: newParentId,
            edit: false,
        };

        if (entriesNew[id].children === null) {
            entriesNew[id].children = [newItem];
        } else {
            entriesNew[id].children.push(newItem);
        }

        if (entriesNew[id].complete) {
            entriesNew[id].selected = false;
            entriesNew[id].complete = false;
        }

        setEntries(entriesNew);
    };

    const numSelected = () => {
        let total = 0;
        for (var entry of entries) {
            if (entry.selected && !entry.complete) total++;
            if (entry.children) {
                for (var child of entry.children) {
                    if (child.selected && !child.complete) total++;
                }
            }
        }

        return total;
    };

    const handleDeleteItem = () => {
        var entriesNew = [...entries];
        const entriesReverse = [...entriesNew.reverse()];
        entriesNew.reverse();
        for (var entry of entriesReverse) {
            // console.log(entry);
            if (entry.selected && !entry.complete) {
                entriesNew.splice(entry.id, 1);
            } else if (!entry.selected && entry.children) {
                // console.log(entry.children);
                const childrenReverse = [...entry.children.reverse()];
                entry.children.reverse();
                for (var child of childrenReverse) {
                    if (child.selected && !child.complete) {
                        entriesNew[entry.id].children.splice(child.id, 1);
                    }
                }
            }
        }

        // reorder id
        let idx = 0;
        for (var entry of entriesNew) {
            console.log(entry);
            if (entry.id !== idx) entry.id = idx;
            idx++;
            if (entry.children) {
                let childIdx = 0;
                for (var child of entry.children) {
                    if (child.id !== childIdx) child.id = childIdx;
                    childIdx++;

                    if (child.parentId !== entry.id) child.parentId = entry.id;
                }
            }
        }

        setEntries(entriesNew);
        setShowDeleteWarning(false);
    };

    const handleChangeProjName = (event) => {
        setProjectName(event.target.value);
        setChangeProjName(true);
    };

    const submitChangeProjName = () => {
        // console.log(projectName);
        var entriesNew = [...entries];
        for (var entry of entriesNew) {
            entry.projectName = projectName;
            if (entry.children) {
                for (var child of entry.children) {
                    console.log(child);
                    child.projectName = projectName;
                }
            }
        }
        setEntries(entriesNew);
        setChangeProjName(false);
    };

    function TableRow(props) {
        const {
            id,
            selected,
            complete,
            deliverableName,
            dueDate,
            children,
            parentId,
            edit,
        } = props;
        const diffDays = Math.round(dueDate.diff(todayDT, 'days').days);
        const diffWeeks = Math.round(dueDate.diff(todayDT, 'weeks').weeks);
        const diffMths = Math.round(dueDate.diff(todayDT, 'months').months);
        const dueDateStr = dueDate.toFormat('dd/MM/yyyy');

        const handleClick = () => {
            if (parentId !== null) toggleCheckbox(parentId, id);
            else toggleCheckbox(id, null);
        };

        const handleIncomplete = () => {
            if (parentId !== null) toggleIncomplete(parentId, id);
            else toggleIncomplete(id, null);
        };

        const handleEdit = () => {
            props.edit = true;
            // console.log('edit mode');
            toggleComplete();
        };

        const submitEdit = (props) => {
            props.edit = false;
            // console.log('edit submit');
            editEntry(props);
        };

        const changeName = (event) => {
            props.deliverableName = event.target.value;
            editEntry(props);
        };

        const changeDueDate = (momentObj) => {
            props.dueDate = DateTime.fromISO(momentObj.toISOString()).setLocale(
                'sg'
            );
            editEntry(props);
        };

        let rowColour = null;
        if (!complete) {
            if (diffDays <= 3) rowColour = '#ff6675';
            else if (diffDays <= 7) rowColour = '#ffbf66';
            else if (diffDays <= 21) rowColour = '#ffffb3';
        }

        const overdueBadge = (
            <>
                <Badge className='me-1 m-1' bg='danger'>
                    Overdue
                </Badge>
            </>
        );

        // check if deliverable is completed
        const completeIcon = (complete) => {
            if (complete) {
                return (
                    <FontAwesomeIcon
                        icon={faCheck}
                        className={'text-success me-3'}
                    />
                );
            }

            return (
                <>
                    <Form.Check
                        id={id}
                        checked={selected}
                        onClick={handleClick}
                    />
                </>
            );
        };

        // show options
        const optionsIcon = (props) => {
            const incompleteOption = (
                <Dropdown.Item onClick={handleIncomplete}>
                    <FontAwesomeIcon
                        icon={faTimesCircle}
                        style={{ marginRight: '5' }}
                    />
                    Mark as Incomplete
                </Dropdown.Item>
            );

            const editOption = (
                <Dropdown.Item onClick={handleEdit}>
                    <FontAwesomeIcon
                        icon={faEdit}
                        style={{ marginRight: '5' }}
                    />
                    Edit
                </Dropdown.Item>
            );

            const addChildOption = (
                <Dropdown.Item onClick={() => handleAddChild(id)}>
                    <FontAwesomeIcon
                        icon={faPlus}
                        style={{ marginRight: '5' }}
                    />
                    Add Child
                </Dropdown.Item>
            );

            if (props.complete && props.parentId !== null) {
                var dropdownMenu = (
                    <Dropdown.Menu>
                        {incompleteOption}
                        {editOption}
                    </Dropdown.Menu>
                );
            } else if (props.complete) {
                dropdownMenu = (
                    <Dropdown.Menu>
                        {incompleteOption}
                        {addChildOption}
                        {editOption}
                    </Dropdown.Menu>
                );
            } else if (props.parentId === null) {
                dropdownMenu = (
                    <Dropdown.Menu>
                        {addChildOption}
                        {editOption}
                    </Dropdown.Menu>
                );
            } else {
                dropdownMenu = <Dropdown.Menu>{editOption}</Dropdown.Menu>;
            }

            return (
                <Dropdown>
                    <Dropdown.Toggle variant='clear'>
                        <FontAwesomeIcon
                            icon={faEllipsisH}
                            className='dropdown-btn'
                        />
                    </Dropdown.Toggle>

                    {dropdownMenu}
                </Dropdown>
            );
        };

        const childMarker = (deliverableObj) => (
            <>
                <FontAwesomeIcon className='mx-1 me-3' icon={faChevronRight} />
                {deliverableObj}
            </>
        );

        const dueIn = () => {
            if (diffDays < 0) return null;
            else if (diffDays < 7) return `${diffDays} days`;
            else if (diffWeeks < 4)
                return diffWeeks === 1
                    ? `${diffWeeks} week`
                    : `${diffWeeks} weeks`;
            else
                return diffMths === 1
                    ? `${diffMths} month`
                    : `${diffMths} months`;
        };

        var currentTableRow = [];
        if (!edit) {
            let deliverableObj = <span>{deliverableName}</span>;

            currentTableRow = [
                completeIcon(complete),
                parentId !== null
                    ? childMarker(deliverableObj)
                    : deliverableObj,
                dueDateStr,
                !complete && !dueIn()
                    ? overdueBadge
                    : complete
                    ? null
                    : dueIn(),
                optionsIcon(props),
            ];
        } else {
            let deliverableForm = (
                <Form>
                    <Form.Control
                        type='text'
                        placeholder={deliverableName}
                        onChange={changeName}
                    />
                </Form>
            );

            let dueDateForm = (
                <Form>
                    <Datetime
                        timeFormat={false}
                        closeOnSelect={false}
                        onChange={changeDueDate}
                        renderInput={(formProps, openCalendar) => (
                            <InputGroup>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                </InputGroup.Text>
                                <Form.Control
                                    required
                                    type='text'
                                    value={dueDate.toFormat('dd/MM/yyyy')}
                                    onFocus={openCalendar}
                                    onChange={() => {}}
                                />
                            </InputGroup>
                        )}
                    />
                </Form>
            );

            let changeBtn = (
                <Button
                    size='sm'
                    onClick={() => {
                        submitEdit(props);
                    }}
                >
                    Confirm
                </Button>
            );

            currentTableRow = [
                completeIcon(complete),
                parentId !== null
                    ? childMarker(deliverableForm)
                    : deliverableForm,
                dueDateForm,
                !complete && !dueIn()
                    ? overdueBadge
                    : complete
                    ? null
                    : dueIn(),
                changeBtn,
            ];
        }

        const childrenTable = () => {
            if (children) {
                return <>{children.map((child, idx) => TableRow(child))}</>;
            }
            return null;
        };
        return (
            <>
                <tr>
                    {currentTableRow.map((item, i) => (
                        <td key={i} style={{ background: rowColour }}>
                            {item}
                        </td>
                    ))}
                </tr>
                {childrenTable()}
            </>
        );
    }

    const projectNameObj = () => {
        if (changeProjName) {
            return (
                <Row className='align-items-center'>
                    <Col>
                        <h5>
                            <Form sm='6'>
                                <Form.Control
                                    type='text'
                                    placeholder={projectName}
                                    onChange={handleChangeProjName}
                                />
                            </Form>
                        </h5>
                    </Col>
                    <Col>
                        <Button
                            className='mx-2'
                            size='sm'
                            variant='success'
                            onClick={submitChangeProjName}
                        >
                            <FontAwesomeIcon icon={faCheck} />
                        </Button>
                    </Col>
                </Row>
            );
        } else {
            return (
                <h5>
                    {projectName}
                    <Button
                        className='mx-2'
                        size='sm'
                        variant='link'
                        onClick={handleChangeProjName}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                </h5>
            );
        }
    };

    return (
        <Card>
            <Card.Header>
                <Row className='align-items-center'>
                    <Col>{projectNameObj()}</Col>
                    <Col className='text-end'>
                        <ButtonGroup>
                            <Button
                                variant='secondary'
                                size='sm'
                                onClick={handleAddItem}
                            >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    style={{ marginRight: '5' }}
                                />
                                Add
                            </Button>
                            <Button
                                variant='danger'
                                size='sm'
                                onClick={() => {
                                    if (numSelected() > 0)
                                        setShowDeleteWarning(true);
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faMinus}
                                    style={{ marginRight: '5' }}
                                />
                                Delete
                            </Button>
                            <Modal
                                as={Modal.Dialog}
                                centered
                                show={showDeleteWarning}
                                onHide={() => {}}
                            >
                                <Modal.Header>
                                    <Modal.Title className='h6'>
                                        Confirm Delete
                                    </Modal.Title>
                                    <Button
                                        variant='close'
                                        aria-label='Close'
                                        onClick={() =>
                                            setShowDeleteWarning(false)
                                        }
                                    />
                                </Modal.Header>
                                <Modal.Body>
                                    <p>{`Are you sure you want to delete ${numSelected()} items?`}</p>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        variant='secondary'
                                        onClick={handleDeleteItem}
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        variant='outline-gray'
                                        className='ms-auto'
                                        onClick={() =>
                                            setShowDeleteWarning(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </ButtonGroup>
                    </Col>
                </Row>
            </Card.Header>
            <Table responsive className='align-items-center table-flush'>
                <thead className='thead-light'>
                    <tr>
                        {tableHeader.map((header, i) => (
                            <th key={i} scope='col'>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>{entries.map((entry) => TableRow(entry))}</tbody>
            </Table>
        </Card>
    );
};

export const PQRLTable = () => {
    // TODO: API call to fetch data
    // TODO: complete PQRL table header

    const tableHeader = ['', '', '', '', '', '', ''];

    const TableRow = (props) => {
        // TODO: dereference props and change respective parameters shown on page

        const {
            invoiceNumber,
            subscription,
            price,
            issueDate,
            dueDate,
            status,
        } = props;

        const statusVariant =
            status === 'Paid'
                ? 'success'
                : status === 'Due'
                ? 'warning'
                : status === 'Canceled'
                ? 'danger'
                : 'primary';

        return (
            <tr>
                <td>
                    <Card.Link
                        as={Link}
                        to={Routes.Invoice.path}
                        className='fw-normal'
                    >
                        {invoiceNumber}
                    </Card.Link>
                </td>
                <td>
                    <span className='fw-normal'>{subscription}</span>
                </td>
                <td>
                    <span className='fw-normal'>{issueDate}</span>
                </td>
                <td>
                    <span className='fw-normal'>{dueDate}</span>
                </td>
                <td>
                    <span className='fw-normal'>
                        ${parseFloat(price).toFixed(2)}
                    </span>
                </td>
                <td>
                    <span className={`fw-normal text-${statusVariant}`}>
                        {status}
                    </span>
                </td>
                <td>
                    <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle
                            as={Button}
                            split
                            variant='link'
                            className='text-dark m-0 p-0'
                        >
                            <span className='icon icon-sm'>
                                <FontAwesomeIcon
                                    icon={faEllipsisH}
                                    className='icon-dark'
                                />
                            </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <FontAwesomeIcon
                                    icon={faEye}
                                    className='me-2'
                                />{' '}
                                View Details
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <FontAwesomeIcon
                                    icon={faEdit}
                                    className='me-2'
                                />{' '}
                                Edit
                            </Dropdown.Item>
                            <Dropdown.Item className='text-danger'>
                                <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    className='me-2'
                                />{' '}
                                Remove
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>
        );
    };

    return (
        <Card
            border='light'
            className='table-wrapper table-responsive shadow-sm'
        >
            <Card.Body className='pt-0'>
                <Table hover className='user-table align-items-center'>
                    <thead>
                        <tr>
                            {tableHeader.map((header) => (
                                <th className='border-bottom'>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody></tbody>
                </Table>
                <Card.Footer className='px-3 border-0 d-lg-flex align-items-center justify-content-between'>
                    <Nav>
                        <Pagination className='mb-2 mb-lg-0'>
                            <Pagination.Prev>Previous</Pagination.Prev>
                            <Pagination.Item active>1</Pagination.Item>
                            <Pagination.Item>2</Pagination.Item>
                            <Pagination.Item>3</Pagination.Item>
                            <Pagination.Item>4</Pagination.Item>
                            <Pagination.Item>5</Pagination.Item>
                            <Pagination.Next>Next</Pagination.Next>
                        </Pagination>
                    </Nav>
                    <small className='fw-bold'>
                        Showing <b>{10}</b> out of <b>25</b> entries
                    </small>
                </Card.Footer>
            </Card.Body>
        </Card>
    );
};

const ChangeRadioNetParam = {
    FMIN: 0,
    FMAX: 1,
    NET: 2,
};

const Dimensions = {
    LENGTH: 0,
    WIDTH: 1,
    HEIGHT: 2,
};

const Voltage = {
    VMIN: 0,
    VMAX: 1,
    SUPPLY: 2,
};

const Version = {
    MAJOR: 0,
    MINOR: 1,
    PATCH: 2,
};

function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        console.log('keylength');
        return false;
    }

    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            (areObjects && !deepEqual(val1, val2)) ||
            (!areObjects && val1 !== val2)
        ) {
            console.log('obj check');
            return false;
        }
    }

    return true;
}

function isObject(object) {
    return object != null && typeof object === 'object';
}

export const VehicleTable = () => {
    // TODO: Version checking for software updates
    // TODO: Weight checking for vehicle components
    // TODO: Complete TableRow function

    const [vehicles, setVehicles] = useState([]);
    const [reloadTable, setReloadTable] = useState(false);
    const [warning, setWarning] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function getVehicles() {
        await api.getLatestVehicles().then((vehicles) => {
            setVehicles(vehicles.data.data);
        });
    }

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            getVehicles();
            setReloadTable(false);
        }
        return () => (isSubscribed = false);
    }, [reloadTable]);

    const tableHeader = [
        'Vehicle Name',
        'Version',
        'Current Weight',
        'Weight Limit',
        'Dimensions',

        {
            headerName: 'Maintenance',
            subHeaders: ['Last', 'Next'],
        },
        'Status',
        null,
    ];

    const TableRow = (props) => {};

    return (
        <>
            <Card
                border='light'
                className='table-wrapper table-responsive shadow-sm'
            >
                <Card.Body className='pt-0'>
                    <Table hover className='user-table align-items-center'>
                        <thead>
                            <tr>
                                {tableHeader.map((header) => {
                                    if (
                                        typeof header === 'object' &&
                                        header !== null
                                    ) {
                                        return (
                                            <th
                                                className='border-bottom'
                                                colSpan={
                                                    header.subHeaders.length
                                                }
                                            >
                                                <tr>
                                                    <td>{header.headerName}</td>
                                                </tr>
                                                <tr>
                                                    {header.subHeaders.map(
                                                        (subheader) => (
                                                            <th className='no-border'>
                                                                {subheader}
                                                            </th>
                                                        )
                                                    )}
                                                </tr>
                                            </th>
                                        );
                                    } else {
                                        return (
                                            <th
                                                className='border-bottom'
                                                rowSpan='2'
                                            >
                                                {header}
                                            </th>
                                        );
                                    }
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map((vehicle) => (
                                <TableRow {...vehicle} />
                            ))}
                        </tbody>
                    </Table>
                    <Card.Footer className='px-3 border-0 d-lg-flex align-items-center justify-content-between'>
                        <Nav>
                            <Pagination className='mb-2 mb-lg-0'>
                                <Pagination.Prev>Previous</Pagination.Prev>
                                <Pagination.Item active>1</Pagination.Item>
                                <Pagination.Item>2</Pagination.Item>
                                <Pagination.Item>3</Pagination.Item>
                                <Pagination.Item>4</Pagination.Item>
                                <Pagination.Item>5</Pagination.Item>
                                <Pagination.Next>Next</Pagination.Next>
                            </Pagination>
                        </Nav>
                        <small className='fw-bold'>
                            Showing <b>{10}</b> out of <b>25</b> entries
                        </small>
                    </Card.Footer>
                </Card.Body>
            </Card>

            <Modal as={Modal.Dialog} centered show={warning} onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title className='h6'>Error</Modal.Title>
                    <Button
                        variant='close'
                        aria-label='Close'
                        onClick={() => setWarning(false)}
                    />
                </Modal.Header>
                <Modal.Body>
                    <p>{errorMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='outline-gray'
                        className='ms-auto'
                        onClick={() => setWarning(false)}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export const VehicleComponentTable = () => {
    const [vehicleComponents, setVehicleComponents] = useState([]);
    const [reloadTable, setReloadTable] = useState(false);
    const [warning, setWarning] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function getComponents() {
        await api.getLatestVehicleComponents().then((components) => {
            setVehicleComponents(components.data.data);
            console.log('VC', components.data.data);
        });
    }

    useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            getComponents();
            console.log('reload table', vehicleComponents);
            setReloadTable(false);
        }
        return () => (isSubscribed = false);
    }, [reloadTable]);

    const tableHeader = [
        'Component Name',
        'Version',
        'Weight',
        'Dimensions',
        {
            headerName: 'Power',
            subHeaders: ['Min Voltage', 'Max Voltage', 'By'],
        },
        {
            headerName: 'Radio Net',
            subHeaders: ['Min Freq', 'Max Freq', 'Net'],
        },
        {
            headerName: 'Maintenance',
            subHeaders: ['Last', 'Next'],
        },
        'Status',
        null,
    ];

    const TableRow = (props) => {
        const { _id } = props;
        var {
            name,
            version,
            weight,
            dimensions,
            parent,
            approval,
            power: { vmin, vmax, supply },
            radionet: { fmin, fmax, net },
            maintenance: {
                last: { date: last },
                next: { date: next },
            },
        } = props;

        const [isEdit, setIsEdit] = useState(false);
        const [showDetails, setShowDetails] = useState(false);

        const checkList = ['frequency', 'power'];
        const [checkStatus, setCheckStatus] = useState({});

        const [newProps, setNewProps] = useState(_.cloneDeep(props));
        const [nthParentId, setNthParentId] = useState(0);
        const [nthParent, setNthParent] = useState(props);
        const [reloadParent, setReloadParent] = useState(false);

        useEffect(() => {
            const getRadioNetName = async () => {
                if (net) {
                    const result = await api.getRadioNetById(net);
                    newProps.radionet.name = result.data.data.name;
                    setNewProps(newProps);
                }
            };

            const getPowerSupplyName = async () => {
                if (supply) {
                    const result = await api.getPowerSupplyById(supply);
                    newProps.power.name = result.data.data.name;
                    setNewProps(newProps);
                }
            };

            let isSubscribed = true;
            if (isSubscribed) {
                getRadioNetName();
                getPowerSupplyName();
            }

            return () => {
                isSubscribed = false;
            };
        }, [net, supply, newProps]);

        useEffect(() => {
            let isSubscribed = true;
            if (isSubscribed) {
                checkAll()
                    .then((results) => {
                        let checkResults = {};
                        checkList.map(
                            (check, i) =>
                                (checkResults[check] = results[i].value)
                        );
                        setCheckStatus(checkResults);
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });
            }

            return () => {
                isSubscribed = false;
            };
        }, [props]);

        useEffect(() => {
            const getNthParent = async (idx, currentObjId) => {
                if (currentObjId === null) setNthParent(null);
                else if (idx === 0) {
                    await api
                        .getVehicleComponentById(currentObjId)
                        .then(async (result) => {
                            var currentResult = { ...result.data.data };
                            if (currentResult.approval) {
                                await api
                                    .getApprovalById(currentResult.approval, 0)
                                    .then((approval) => {
                                        if (approval.data)
                                            currentResult.approvalFileName =
                                                approval.data.filename;
                                    })
                                    .catch((error) => console.log(error));
                            }
                            setNthParent(currentResult);
                        })
                        .catch((error) => console.log(error));
                } else {
                    await api
                        .getVehicleComponentById(currentObjId)
                        .then((result) => {
                            console.log(result);
                            const parentObjId = result.data.data.parent;
                            getNthParent(idx - 1, parentObjId);
                        });
                }
            };

            getNthParent(nthParentId, _id);
            setReloadParent(false);
        }, [nthParentId, _id, reloadParent]);

        const handleEdit = () => {
            checkUpdatedVehicleComponent(newProps)
                .then((updatedProps) => {
                    delete updatedProps.radionet.name;
                    delete updatedProps.power.name;

                    if (!deepEqual(updatedProps, props)) {
                        // console.log('creating new entry');
                        updatedProps.parent = _id;
                        updatedProps.latest = true;
                        updatedProps._id = null;

                        if (
                            updatedProps.version.every(
                                (val, index) => val === props.version[index]
                            )
                        ) {
                            updatedProps.version[
                                updatedProps.version.length - 1
                            ]++;
                        }

                        api.insertVehicleComponent(updatedProps)
                            .then(() => {
                                // console.log('updating old entry');
                                var oldProps = { ...props };
                                oldProps.latest = false;
                                return api.updateVehicleComponentById(
                                    _id,
                                    oldProps
                                );
                            })
                            .then(() => {
                                // console.log('success');
                                setReloadTable(true);
                            })
                            .catch((error) => {
                                setErrorMessage(`${error.message}.`);
                                setWarning(true);
                            });
                    } else {
                        setIsEdit(false);
                    }
                })
                .catch((error) => console.log(error));
        };

        const changeName = (event) => {
            newProps.name = event.target.value;
            // console.log(name);
        };

        const changeWeight = (event) => {
            newProps.weight = parseInt(event.target.value);
            // console.log(weight);
        };

        const changeDimensions = (idx, event) => {
            newProps.dimensions[idx] = parseInt(event.target.value);
        };

        const changeVersion = (idx, event) => {
            newProps.version[idx] = parseInt(event.target.value);
        };

        const changeVoltage = (category, event) => {
            if (category === Voltage.VMIN)
                newProps.power.vmin = parseInt(event.target.value);
            else if (category === Voltage.VMAX)
                newProps.power.vmax = parseInt(event.target.value);
            else if (category === Voltage.SUPPLY) {
                if (event.target.value) {
                    // console.log(event.target.value);
                    newProps.power.name = event.target.value;
                } else newProps.power.name = null;
            } else console.log('Invalid power supply category');
        };

        const changeRadionet = (category, event) => {
            if (category === ChangeRadioNetParam.FMIN)
                newProps.radionet.fmin = parseInt(event.target.value);
            else if (category === ChangeRadioNetParam.FMAX)
                newProps.radionet.fmax = parseInt(event.target.value);
            else if (category === ChangeRadioNetParam.NET) {
                if (event.target.value) {
                    // console.log(event.target.value);
                    newProps.radionet.name = event.target.value;
                } else newProps.radionet.name = null;
            } else {
                console.log('Invalid radio net category.');
            }
        };

        const checkUpdatedVehicleComponent = async (newProps) => {
            var updatedProps = _.cloneDeep(newProps);

            return await Promise.allSettled([
                api.getPowerSupplyByName(updatedProps.power.name),
                api.getRadioNetByName(updatedProps.radionet.name),
            ]).then(async (results) => {
                const success = [];
                results.forEach((result) => {
                    success.push(result.value.data.success);
                });

                // console.log(success);
                if (success.includes(true)) {
                    await api
                        .getPowerSupplyByName(updatedProps.power.name)
                        .then((newPowerSupply) => {
                            var newPowerSupplyId = null;
                            const result = newPowerSupply.data.data[0];
                            // console.log('result', result);
                            if (result) {
                                newPowerSupplyId = result._id;
                            }

                            updatedProps.power.supply = newPowerSupplyId;
                            // console.log('new supply', updatedProps.power);
                        })
                        .catch((error) => console.log(error));

                    await api
                        .getRadioNetByName(updatedProps.radionet.name)
                        .then((newRadioNet) => {
                            var newRadioNetId = null;
                            const result = newRadioNet.data.data[0];
                            // console.log('result', result);

                            if (result) {
                                newRadioNetId = result._id;
                            }
                            updatedProps.radionet.net = newRadioNetId;
                            // console.log('new net', updatedProps.radionet);
                        })
                        .catch((error) => console.log(error));

                    // console.log('checking...', updatedProps);
                    return updatedProps;
                } else {
                    throw Error('Unable to update. Check database connection.');
                }
            });
        };

        const handleRemove = async (_id) => {
            await api
                .deleteVehicleComponentById(_id)
                .then(() => setReloadTable(true));
        };

        const frequencyCheck = (net, freqRange) => {
            return new Promise((resolve, reject) => {
                if (net) {
                    // console.log(net);
                    resolve(api.getRadioNetById(net));
                } else reject(Error('Component has no net.'));
            })
                .then((radioNet) => {
                    const { frequency } = radioNet.data.data;
                    // console.log(frequency, freqRange);
                    return check(frequency, freqRange, Comparison.BETWEEN);
                })
                .then(() => {
                    // console.log('passed check');
                    return true;
                })
                .catch((error) => {
                    console.log(error.message);
                    return false;
                });
        };

        const powerCheck = (supply, voltageRange) => {
            return new Promise((resolve, reject) => {
                if (supply) {
                    // console.log(supply);
                    resolve(api.getPowerSupplyById(supply));
                } else reject(Error('Component has no power supply.'));
            })
                .then((powerSupply) => {
                    const { voltage } = powerSupply.data.data;
                    // console.log(voltage, voltageRange);
                    return check(voltage, voltageRange, Comparison.BETWEEN);
                })
                .then(() => {
                    // console.log('passed check');
                    return true;
                })
                .catch((error) => {
                    console.log(error.message);
                    return false;
                });
        };

        const checkAll = async () => {
            return await Promise.allSettled([
                frequencyCheck(net, [fmin, fmax]),
                powerCheck(supply, [vmin, vmax]),
            ])
                .then((results) => {
                    // console.log(results);
                    return results;
                })
                .catch((error) => {
                    console.error(error.message);
                    return error;
                });
        };

        const revertButton = () => {
            if (nthParentId > 0) {
                return (
                    <>
                        <Button
                            variant='outline-tertiary'
                            className='ms-auto'
                            onClick={() => handleRevert(nthParentId)}
                        >
                            Revert
                        </Button>
                    </>
                );
            }
        };

        const handleRevert = (nthParentId) => {
            api.getVehicleComponentById(nthParent._id)
                .then((results) => {
                    // console.log(results.data.data);
                    var newParent = results.data.data;
                    newParent.latest = true;
                    return api.updateVehicleComponentById(
                        newParent._id,
                        newParent
                    );
                })
                .then(() => {
                    newProps.latest = false;
                    // console.log(newProps);
                    return api.updateVehicleComponentById(_id, newProps);
                })
                .then(() => {
                    setReloadParent(true);
                })
                .catch((error) => console.log(error));
        };

        const getApprovalFile = (id, filename) => {
            api.getApprovalFileById(id)
                .then((file) => {
                    FileDownload(file.data, filename);
                })
                .catch((error) => console.log(error));
        };

        var approvalFile;

        const storeFile = (event) => {
            if (event.target.files) {
                const file = event.target.files[0];
                const formData = new FormData();
                formData.append('file', file);
                approvalFile = formData;
            }
        };

        const uploadFile = async (event) => {
            if (approvalFile) {
                await api
                    .insertApproval(approvalFile)
                    .then(async (result) => {
                        // console.log(result.data);
                        const { id } = result.data.file;
                        var newNthParent = { ...nthParent };
                        newNthParent.approval = id;
                        // console.log(newNthParent);
                        return await api.updateVehicleComponentById(
                            newNthParent._id,
                            newNthParent
                        );
                    })
                    .then(() => setReloadTable(true))
                    .catch((error) => console.log(error));
            } else {
                console.log('No file selected');
            }
        };

        const uploadApprovalWidget = (
            <>
                <Col xs={10}>
                    <input onChange={storeFile} type='file' />
                </Col>
                <Col xs={2}>
                    <Button variant='secondary' size='sm' onClick={uploadFile}>
                        Upload
                    </Button>
                </Col>
            </>
        );

        const revertViewer = () => {
            if (!nthParent) return null;

            const parameters = [
                'version',
                'weight',
                'dimensions',
                'power (min/max/supply)',
                'radio net (min/max/net)',
                'maintenance (last/next)',
                'approval',
            ];

            var netName = '-';
            var powerSupplyName = '-';

            if (nthParent.radionet.net) {
                api.getRadioNetById(nthParent.radionet.net)
                    .then((net) => (netName = net.data.data))
                    .catch((error) => console.log(error));
            }

            if (nthParent.power.supply) {
                api.getPowerSupplyById(nthParent.power.supply)
                    .then((supply) => (powerSupplyName = supply.data.data))
                    .catch((error) => console.log(error));
            }

            const values = [
                nthParent.version.join('.'),
                nthParent.weight,
                nthParent.dimensions.join(' x '),
                (nthParent.power.min ? `${nthParent.power.min}` : '-') +
                    ' / ' +
                    (nthParent.power.max ? `${nthParent.power.max}` : '-') +
                    ` / ${powerSupplyName}`,
                (nthParent.radionet.fmin ? `${nthParent.radionet.fmin}` : '-') +
                    ' / ' +
                    (nthParent.radionet.fmax
                        ? `${nthParent.radionet.fmax}`
                        : '-') +
                    ` / ${netName}`,
                `${nthParent.maintenance.last.date} / ${nthParent.maintenance.next.date}`,
                nthParent.approvalFileName ? (
                    <Button
                        bsPrefix='text'
                        href='#'
                        variant='info'
                        className='m-3'
                        onClick={() =>
                            getApprovalFile(
                                nthParent.approval,
                                nthParent.approvalFileName
                            )
                        }
                    >{`${nthParent.approvalFileName}`}</Button>
                ) : (
                    ''
                ),
            ];

            const outputTable = _.zip(parameters, values);

            return (
                <Table>
                    {outputTable.map((row) => (
                        <Row classname='my-auto'>
                            <Col style={{ color: 'black' }}>{row[0] + ':'}</Col>
                            <Col>{row[1]}</Col>
                        </Row>
                    ))}
                    <Row>{uploadApprovalWidget}</Row>
                </Table>
            );
        };

        const incrementNthParentId = () => {
            if (nthParent.parent) setNthParentId(nthParentId + 1);
        };

        const radioNetBackground =
            net && !checkStatus.frequency ? '#ff6675' : '';

        const powerSupplyBackground =
            supply && !checkStatus.power ? '#ff6675' : '';

        if (!isEdit) {
            return (
                <>
                    <tr>
                        <td>
                            <Card.Link
                                as={Link}
                                to={Routes.Invoice.path}
                                className='fw-normal'
                            >
                                {name}
                            </Card.Link>
                        </td>
                        <td>
                            <span className='fw-normal'>
                                {version.join('.')}
                            </span>
                        </td>
                        <td>
                            <span className='fw-normal'>{weight}</span>
                        </td>
                        <td>
                            <span className='fw-normal'>
                                {version.join(' x ')}
                            </span>
                        </td>
                        <td>
                            <span className='fw-normal'>
                                {vmin > 0 ? `+${vmin}` : vmin}
                            </span>
                        </td>
                        <td>
                            <span className='fw-normal'>
                                {vmax > 0 ? `+${vmax}` : vmax}
                            </span>
                        </td>
                        <td style={{ background: powerSupplyBackground }}>
                            <span className='fw-normal'>
                                {newProps.power.name}
                            </span>
                        </td>
                        <td>
                            <span className='fw-normal'>{fmin}</span>
                        </td>
                        <td>
                            <span className='fw-normal'>{fmax}</span>
                        </td>
                        <td style={{ background: radioNetBackground }}>
                            <span className={`fw-normal`}>
                                {newProps.radionet.name}
                            </span>
                        </td>
                        <td>
                            <span className='fw-normal'>{last}</span>
                        </td>
                        <td>
                            <span className='fw-normal'>{next}</span>
                        </td>
                        <td>
                            <Dropdown as={ButtonGroup}>
                                <Dropdown.Toggle
                                    as={Button}
                                    split
                                    variant='link'
                                    className='text-dark m-0 p-0'
                                >
                                    <span className='icon icon-sm'>
                                        <FontAwesomeIcon
                                            icon={faEllipsisH}
                                            className='icon-dark'
                                        />
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={() => setShowDetails(true)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faInfoCircle}
                                            className='me-2'
                                        />{' '}
                                        More Details
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => setIsEdit(true)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            className='me-2'
                                        />{' '}
                                        Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        className='text-danger'
                                        onClick={() => handleRemove(_id)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            className='me-2'
                                        />{' '}
                                        Remove
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </td>
                    </tr>

                    <Modal
                        as={Modal.Dialog}
                        centered
                        show={showDetails}
                        onHide={() => {}}
                    >
                        <Modal.Header>
                            <Modal.Title className='h6 mx-auto'>
                                {nthParent ? nthParent.name : ''}
                            </Modal.Title>
                            <Button
                                variant='close'
                                aria-label='Close'
                                onClick={() => setShowDetails(false)}
                            />
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col className='my-auto'>
                                    <Button
                                        variant='outline-gray'
                                        onClick={() => incrementNthParentId()}
                                    >
                                        <FontAwesomeIcon
                                            icon={faAngleLeft}
                                            className='me-2'
                                        />
                                    </Button>
                                </Col>
                                <Col xs={8}>{revertViewer()}</Col>
                                <Col className='my-auto'>
                                    <Button
                                        variant='outline-gray'
                                        onClick={() => {
                                            if (nthParentId > 0)
                                                setNthParentId(nthParentId - 1);
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faAngleRight}
                                            className='me-2'
                                        />
                                    </Button>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            {revertButton()}
                            <Button
                                variant='outline-gray'
                                className='ms-auto'
                                onClick={() => setShowDetails(false)}
                            >
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            );
        } else {
            return (
                <tr>
                    <td>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={newProps.name}
                                onChange={changeName}
                            />
                        </Form>
                    </td>
                    <td>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={newProps.version[Version.MAJOR]}
                                onChange={(event) =>
                                    changeVersion(Version.MAJOR, event)
                                }
                            />
                        </Form>
                        <span>.</span>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={newProps.version[Version.MINOR]}
                                onChange={(event) =>
                                    changeVersion(Version.MINOR, event)
                                }
                            />
                        </Form>
                        <span>.</span>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={newProps.version[Version.PATCH]}
                                onChange={(event) =>
                                    changeVersion(Version.PATCH, event)
                                }
                            />
                        </Form>
                    </td>
                    <td>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={newProps.weight}
                                onChange={changeWeight}
                            />
                        </Form>
                    </td>
                    <td>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={
                                    newProps.dimensions[Dimensions.LENGTH]
                                }
                                onChange={(event) =>
                                    changeDimensions(Dimensions.LENGTH, event)
                                }
                            />
                        </Form>
                        <span>.</span>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={
                                    newProps.dimensions[Dimensions.WIDTH]
                                }
                                onChange={(event) =>
                                    changeDimensions(Dimensions.WIDTH, event)
                                }
                            />
                        </Form>
                        <span> x </span>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={
                                    newProps.dimensions[Dimensions.HEIGHT]
                                }
                                onChange={(event) =>
                                    changeDimensions(Dimensions.HEIGHT, event)
                                }
                            />
                        </Form>
                    </td>
                    <td>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={newProps.power.vmin}
                                onChange={(event) =>
                                    changeVoltage(Voltage.VMIN, event)
                                }
                            />
                        </Form>
                    </td>
                    <td>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={newProps.power.vmax}
                                onChange={(event) =>
                                    changeVoltage(Voltage.VMAX, event)
                                }
                            />
                        </Form>
                    </td>
                    <td>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={newProps.power.name}
                                onChange={(event) =>
                                    changeVoltage(Voltage.SUPPLY, event)
                                }
                            />
                        </Form>
                    </td>
                    <td>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={newProps.radionet.fmin}
                                onChange={(event) =>
                                    changeRadionet(
                                        ChangeRadioNetParam.FMIN,
                                        event
                                    )
                                }
                            />
                        </Form>
                        <span>kHz</span>
                    </td>
                    <td>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={newProps.radionet.fmax}
                                onChange={(event) =>
                                    changeRadionet(
                                        ChangeRadioNetParam.FMAX,
                                        event
                                    )
                                }
                            />
                        </Form>
                        <span>kHz</span>
                    </td>
                    <td>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={newProps.radionet.name}
                                onChange={(event) =>
                                    changeRadionet(
                                        ChangeRadioNetParam.NET,
                                        event
                                    )
                                }
                            />
                        </Form>
                    </td>
                    <td>
                        <span className='fw-normal'>{newProps.last}</span>
                    </td>
                    <td>
                        <span className='fw-normal'>{newProps.next}</span>
                    </td>
                    <td>
                        <Button onClick={handleEdit}>
                            <FontAwesomeIcon
                                icon={faCheck}
                                className='icon-dark'
                            />
                        </Button>
                    </td>
                </tr>
            );
        }
    };

    return (
        <>
            <Card
                border='light'
                className='table-wrapper table-responsive shadow-sm'
            >
                <Card.Body className='pt-0'>
                    <Table hover className='user-table align-items-center'>
                        <thead>
                            <tr>
                                {tableHeader.map((header) => {
                                    if (
                                        typeof header === 'object' &&
                                        header !== null
                                    ) {
                                        return (
                                            <th
                                                className='border-bottom'
                                                colSpan={
                                                    header.subHeaders.length
                                                }
                                            >
                                                <tr>
                                                    <td>{header.headerName}</td>
                                                </tr>
                                                <tr>
                                                    {header.subHeaders.map(
                                                        (subheader) => (
                                                            <th className='no-border'>
                                                                {subheader}
                                                            </th>
                                                        )
                                                    )}
                                                </tr>
                                            </th>
                                        );
                                    } else {
                                        return (
                                            <th
                                                className='border-bottom'
                                                rowSpan='2'
                                            >
                                                {header}
                                            </th>
                                        );
                                    }
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {vehicleComponents.map((component) => (
                                <TableRow {...component} />
                            ))}
                        </tbody>
                    </Table>
                    <Card.Footer className='px-3 border-0 d-lg-flex align-items-center justify-content-between'>
                        <Nav>
                            <Pagination className='mb-2 mb-lg-0'>
                                <Pagination.Prev>Previous</Pagination.Prev>
                                <Pagination.Item active>1</Pagination.Item>
                                <Pagination.Item>2</Pagination.Item>
                                <Pagination.Item>3</Pagination.Item>
                                <Pagination.Item>4</Pagination.Item>
                                <Pagination.Item>5</Pagination.Item>
                                <Pagination.Next>Next</Pagination.Next>
                            </Pagination>
                        </Nav>
                        <small className='fw-bold'>
                            Showing <b>{10}</b> out of <b>25</b> entries
                        </small>
                    </Card.Footer>
                </Card.Body>
            </Card>

            <Modal as={Modal.Dialog} centered show={warning} onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title className='h6'>Error</Modal.Title>
                    <Button
                        variant='close'
                        aria-label='Close'
                        onClick={() => setWarning(false)}
                    />
                </Modal.Header>
                <Modal.Body>
                    <p>{errorMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='outline-gray'
                        className='ms-auto'
                        onClick={() => setWarning(false)}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export const RadioNetTable = ({ setReloadPage }) => {
    const [radioNets, setRadioNets] = useState([]);
    const [reloadTable, setReloadTable] = useState(false);
    const [warning, setWarning] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function getNets() {
        await api.getLatestRadioNets().then((components) => {
            setRadioNets(components.data.data);
            setReloadTable(false);
        });
    }

    useEffect(() => {
        getNets();
    }, [reloadTable]);

    async function editNetById(id, payload) {
        await api.updateRadioNetById(id, payload);
    }

    const tableHeader = ['Net Name', 'Frequency', null];

    const TableRow = (props) => {
        const { _id } = props;
        var { name, frequency } = props;

        const [isEdit, setIsEdit] = useState(false);

        const handleEdit = () => {
            const newProps = {
                name,
                frequency,
            };

            editNetById(_id, newProps)
                .then(() => {
                    setIsEdit(false);
                    setReloadTable(true);
                    setReloadPage(true);
                })
                .catch((error) => {
                    setErrorMessage(
                        `${error.message}. Check that net name is not duplicated.`
                    );
                    setWarning(true);
                });
        };

        const changeName = (event) => {
            name = event.target.value;
            // console.log(name);
        };

        const changeFrequency = (event) => {
            frequency = event.target.value;
            // console.log(frequency);
        };

        const handleRemove = async (_id) => {
            await api.deleteRadioNetById(_id).then(() => {
                setReloadTable(true);
                setReloadPage(true);
            });
        };

        if (!isEdit) {
            return (
                <tr>
                    <td>
                        <Card.Link
                            as={Link}
                            to={Routes.Invoice.path}
                            className='fw-normal'
                        >
                            {name}
                        </Card.Link>
                    </td>
                    <td>
                        <span className='fw-normal'>{frequency}</span>
                    </td>
                    <td>
                        <Dropdown as={ButtonGroup}>
                            <Dropdown.Toggle
                                as={Button}
                                split
                                variant='link'
                                className='text-dark m-0 p-0'
                            >
                                <span className='icon icon-sm'>
                                    <FontAwesomeIcon
                                        icon={faEllipsisH}
                                        className='icon-dark'
                                    />
                                </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setIsEdit(true)}>
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        className='me-2'
                                    />{' '}
                                    Edit
                                </Dropdown.Item>
                                <Dropdown.Item
                                    className='text-danger'
                                    onClick={() => handleRemove(_id)}
                                >
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        className='me-2'
                                    />{' '}
                                    Remove
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </td>
                </tr>
            );
        } else {
            return (
                <tr>
                    <td>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={name}
                                onChange={changeName}
                            />
                        </Form>
                    </td>
                    <td>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={frequency}
                                onChange={changeFrequency}
                            />
                        </Form>
                    </td>
                    <td>
                        <Button onClick={handleEdit}>
                            <FontAwesomeIcon
                                icon={faCheck}
                                className='icon-dark'
                            />
                        </Button>
                    </td>
                </tr>
            );
        }
    };

    return (
        <>
            <Card
                border='light'
                className='table-wrapper table-responsive shadow-sm'
            >
                <Card.Body className='pt-0'>
                    <Table hover className='user-table align-items-center'>
                        <thead>
                            <tr>
                                {tableHeader.map((header) => (
                                    <th className='border-bottom'>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {radioNets.map((component) => (
                                <TableRow {...component} />
                            ))}
                        </tbody>
                    </Table>
                    <Card.Footer className='px-3 border-0 d-lg-flex align-items-center justify-content-between'>
                        <Nav>
                            <Pagination className='mb-2 mb-lg-0'>
                                <Pagination.Prev>Previous</Pagination.Prev>
                                <Pagination.Item active>1</Pagination.Item>
                                <Pagination.Item>2</Pagination.Item>
                                <Pagination.Item>3</Pagination.Item>
                                <Pagination.Item>4</Pagination.Item>
                                <Pagination.Item>5</Pagination.Item>
                                <Pagination.Next>Next</Pagination.Next>
                            </Pagination>
                        </Nav>
                        <small className='fw-bold'>
                            Showing <b>{10}</b> out of <b>25</b> entries
                        </small>
                    </Card.Footer>
                </Card.Body>
            </Card>

            <Modal as={Modal.Dialog} centered show={warning} onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title className='h6'>Error</Modal.Title>
                    <Button
                        variant='close'
                        aria-label='Close'
                        onClick={() => setWarning(false)}
                    />
                </Modal.Header>
                <Modal.Body>
                    <p>{errorMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='outline-gray'
                        className='ms-auto'
                        onClick={() => setWarning(false)}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export const PowerSupplyTable = ({ setReloadPage }) => {
    const [powerSupplies, setPowerSupplies] = useState([]);
    const [reloadTable, setReloadTable] = useState(false);
    const [warning, setWarning] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function getPowerSupplies() {
        await api.getLatestPowerSupplies().then((components) => {
            setPowerSupplies(components.data.data);
            setReloadTable(false);
        });
    }

    useEffect(() => {
        getPowerSupplies();
    }, [reloadTable]);

    async function editPowerSupplyById(id, payload) {
        await api.updatePowerSupplyById(id, payload);
    }

    const tableHeader = ['Power Supply Name', 'Voltage', null];

    const TableRow = (props) => {
        const { _id } = props;
        var { name, voltage } = props;

        const [isEdit, setIsEdit] = useState(false);

        const handleEdit = () => {
            const newProps = {
                name,
                voltage,
            };

            editPowerSupplyById(_id, newProps)
                .then(() => {
                    setIsEdit(false);
                    setReloadTable(true);
                    setReloadPage(true);
                })
                .catch((error) => {
                    setErrorMessage(
                        `${error.message}. Check that power supply name is not duplicated.`
                    );
                    setWarning(true);
                });
        };

        const changeName = (event) => {
            name = event.target.value;
            // console.log(name);
        };

        const changeVoltage = (event) => {
            voltage = event.target.value;
            console.log(voltage);
        };

        const handleRemove = async (_id) => {
            await api.deletePowerSupplyById(_id).then(() => {
                setReloadTable(true);
                setReloadPage(true);
            });
        };

        if (!isEdit) {
            return (
                <tr>
                    <td>
                        <Card.Link
                            as={Link}
                            to={Routes.Invoice.path}
                            className='fw-normal'
                        >
                            {name}
                        </Card.Link>
                    </td>
                    <td>
                        <span className='fw-normal'>{voltage}</span>
                    </td>
                    <td>
                        <Dropdown as={ButtonGroup}>
                            <Dropdown.Toggle
                                as={Button}
                                split
                                variant='link'
                                className='text-dark m-0 p-0'
                            >
                                <span className='icon icon-sm'>
                                    <FontAwesomeIcon
                                        icon={faEllipsisH}
                                        className='icon-dark'
                                    />
                                </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setIsEdit(true)}>
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        className='me-2'
                                    />{' '}
                                    Edit
                                </Dropdown.Item>
                                <Dropdown.Item
                                    className='text-danger'
                                    onClick={() => handleRemove(_id)}
                                >
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        className='me-2'
                                    />{' '}
                                    Remove
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </td>
                </tr>
            );
        } else {
            return (
                <tr>
                    <td>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={name}
                                onChange={changeName}
                            />
                        </Form>
                    </td>
                    <td>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={voltage}
                                onChange={changeVoltage}
                            />
                        </Form>
                    </td>
                    <td>
                        <Button onClick={handleEdit}>
                            <FontAwesomeIcon
                                icon={faCheck}
                                className='icon-dark'
                            />
                        </Button>
                    </td>
                </tr>
            );
        }
    };

    return (
        <>
            <Card
                border='light'
                className='table-wrapper table-responsive shadow-sm'
            >
                <Card.Body className='pt-0'>
                    <Table hover className='user-table align-items-center'>
                        <thead>
                            <tr>
                                {tableHeader.map((header) => (
                                    <th className='border-bottom'>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {powerSupplies.map((component) => (
                                <TableRow {...component} />
                            ))}
                        </tbody>
                    </Table>
                    <Card.Footer className='px-3 border-0 d-lg-flex align-items-center justify-content-between'>
                        <Nav>
                            <Pagination className='mb-2 mb-lg-0'>
                                <Pagination.Prev>Previous</Pagination.Prev>
                                <Pagination.Item active>1</Pagination.Item>
                                <Pagination.Item>2</Pagination.Item>
                                <Pagination.Item>3</Pagination.Item>
                                <Pagination.Item>4</Pagination.Item>
                                <Pagination.Item>5</Pagination.Item>
                                <Pagination.Next>Next</Pagination.Next>
                            </Pagination>
                        </Nav>
                        <small className='fw-bold'>
                            Showing <b>{10}</b> out of <b>25</b> entries
                        </small>
                    </Card.Footer>
                </Card.Body>
            </Card>

            <Modal as={Modal.Dialog} centered show={warning} onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title className='h6'>Error</Modal.Title>
                    <Button
                        variant='close'
                        aria-label='Close'
                        onClick={() => setWarning(false)}
                    />
                </Modal.Header>
                <Modal.Body>
                    <p>{errorMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='outline-gray'
                        className='ms-auto'
                        onClick={() => setWarning(false)}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export const SoftwareTable = ({ setReloadPage }) => {
    const [radioNets, setRadioNets] = useState([]);
    const [reloadTable, setReloadTable] = useState(false);
    const [warning, setWarning] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function getNets() {
        await api.getLatestSoftwares().then((components) => {
            setRadioNets(components.data.data);
            setReloadTable(false);
        });
    }

    useEffect(() => {
        getNets();
    }, [reloadTable]);

    async function editNetById(id, payload) {
        await api.updateRadioNetById(id, payload);
    }

    const tableHeader = ['Software Name', 'Version', null];

    const TableRow = (props) => {
        const { _id } = props;
        var { name, version } = props;

        const [isEdit, setIsEdit] = useState(false);

        const handleEdit = () => {
            const newProps = {
                name,
                version,
            };

            editNetById(_id, newProps)
                .then(() => {
                    setIsEdit(false);
                    setReloadTable(true);
                    setReloadPage(true);
                })
                .catch((error) => {
                    setErrorMessage(
                        `${error.message}. Check that net name is not duplicated.`
                    );
                    setWarning(true);
                });
        };

        const changeName = (event) => {
            name = event.target.value;
            // console.log(name);
        };

        const changeFrequency = (event) => {
            version = event.target.value;
            // console.log(version);
        };

        const handleRemove = async (_id) => {
            await api.deleteRadioNetById(_id).then(() => {
                setReloadTable(true);
                setReloadPage(true);
            });
        };

        if (!isEdit) {
            return (
                <tr>
                    <td>
                        <Card.Link
                            as={Link}
                            to={Routes.Invoice.path}
                            className='fw-normal'
                        >
                            {name}
                        </Card.Link>
                    </td>
                    <td>
                        <span className='fw-normal'>{`${version[Version.MAJOR]}.
                            ${version[Version.MINOR]}.
                            ${version[Version.PATCH]}`}</span>
                    </td>
                    <td>
                        <Dropdown as={ButtonGroup}>
                            <Dropdown.Toggle
                                as={Button}
                                split
                                variant='link'
                                className='text-dark m-0 p-0'
                            >
                                <span className='icon icon-sm'>
                                    <FontAwesomeIcon
                                        icon={faEllipsisH}
                                        className='icon-dark'
                                    />
                                </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setIsEdit(true)}>
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        className='me-2'
                                    />{' '}
                                    Edit
                                </Dropdown.Item>
                                <Dropdown.Item
                                    className='text-danger'
                                    onClick={() => handleRemove(_id)}
                                >
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        className='me-2'
                                    />{' '}
                                    Remove
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </td>
                </tr>
            );
        } else {
            return (
                <tr>
                    <td>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={name}
                                onChange={changeName}
                            />
                        </Form>
                    </td>
                    <td>
                        <Form>
                            <Form.Control
                                type='text'
                                placeholder={`${version[Version.MAJOR]}.
                                    ${version[Version.MINOR]}.
                                    ${version[Version.PATCH]}`}
                                onChange={changeFrequency}
                            />
                        </Form>
                    </td>
                    <td>
                        <Button onClick={handleEdit}>
                            <FontAwesomeIcon
                                icon={faCheck}
                                className='icon-dark'
                            />
                        </Button>
                    </td>
                </tr>
            );
        }
    };

    return (
        <>
            <Card
                border='light'
                className='table-wrapper table-responsive shadow-sm'
            >
                <Card.Body className='pt-0'>
                    <Table hover className='user-table align-items-center'>
                        <thead>
                            <tr>
                                {tableHeader.map((header) => (
                                    <th className='border-bottom'>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {radioNets.map((component) => (
                                <TableRow {...component} />
                            ))}
                        </tbody>
                    </Table>
                    <Card.Footer className='px-3 border-0 d-lg-flex align-items-center justify-content-between'>
                        <Nav>
                            <Pagination className='mb-2 mb-lg-0'>
                                <Pagination.Prev>Previous</Pagination.Prev>
                                <Pagination.Item active>1</Pagination.Item>
                                <Pagination.Item>2</Pagination.Item>
                                <Pagination.Item>3</Pagination.Item>
                                <Pagination.Item>4</Pagination.Item>
                                <Pagination.Item>5</Pagination.Item>
                                <Pagination.Next>Next</Pagination.Next>
                            </Pagination>
                        </Nav>
                        <small className='fw-bold'>
                            Showing <b>{10}</b> out of <b>25</b> entries
                        </small>
                    </Card.Footer>
                </Card.Body>
            </Card>

            <Modal as={Modal.Dialog} centered show={warning} onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title className='h6'>Error</Modal.Title>
                    <Button
                        variant='close'
                        aria-label='Close'
                        onClick={() => setWarning(false)}
                    />
                </Modal.Header>
                <Modal.Body>
                    <p>{errorMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='outline-gray'
                        className='ms-auto'
                        onClick={() => setWarning(false)}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
