import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Routes } from '../routes';

// pages
import DashboardOverview from './dashboard/DashboardOverview';
import PQRL from './PQRL';
import VehicleInfo from './VehicleInfo';

// components
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Preloader from '../components/Preloader';

const RouteWithLoader = ({ component: Component, ...rest }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Route
            {...rest}
            render={(props) => (
                <>
                    {' '}
                    <Preloader show={loaded ? false : true} />{' '}
                    <Component {...props} />{' '}
                </>
            )}
        />
    );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const localStorageIsSettingsVisible = () => {
        return localStorage.getItem('settingsVisible') === 'false'
            ? false
            : true;
    };

    const [showSettings, setShowSettings] = useState(
        localStorageIsSettingsVisible
    );

    const toggleSettings = () => {
        setShowSettings(!showSettings);
        localStorage.setItem('settingsVisible', !showSettings);
    };

    return (
        <Route
            {...rest}
            render={(props) => (
                <>
                    <Preloader show={loaded ? false : true} />
                    <Sidebar />

                    <main className='content'>
                        <Navbar />
                        <Component {...props} />
                    </main>
                </>
            )}
        />
    );
};

export default () => (
    <Switch>
        <RouteWithSidebar
            exact
            path={Routes.Presentation.path}
            component={DashboardOverview}
        />

        {/* pages */}
        <RouteWithSidebar
            exact
            path={Routes.DashboardOverview.path}
            component={DashboardOverview}
        />
        <RouteWithSidebar exact path={Routes.PQRL.path} component={PQRL} />
        <RouteWithSidebar
            exact
            path={Routes.VehicleInfo.path}
            component={VehicleInfo}
        />

        <Redirect to={Routes.NotFound.path} />
    </Switch>
);
