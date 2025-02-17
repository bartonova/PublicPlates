import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Region from './region';
import Country from './country';
import Location from './location';
import Department from './department';
import Note from './note';
import Person from './person';
import Plate from './plate';
import PlateHistory from './plate-history';
/* freedata-needle-add-route-import - freedata will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}region`} component={Region} />
      <ErrorBoundaryRoute path={`${match.url}country`} component={Country} />
      <ErrorBoundaryRoute path={`${match.url}location`} component={Location} />
      <ErrorBoundaryRoute path={`${match.url}department`} component={Department} />
      <ErrorBoundaryRoute path={`${match.url}note`} component={Note} />
      <ErrorBoundaryRoute path={`${match.url}person`} component={Person} />
      <ErrorBoundaryRoute path={`${match.url}plate`} component={Plate} />
      <ErrorBoundaryRoute path={`${match.url}plate-history`} component={PlateHistory} />
      {/* freedata-needle-add-route-path - freedata will add routes here */}
    </Switch>
  </div>
);

export default Routes;
