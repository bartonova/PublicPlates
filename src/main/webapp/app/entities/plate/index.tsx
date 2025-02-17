import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Plate from './plate';
import PlateDetail from './plate-detail';
import PlateUpdate from './plate-update';
import PlateDeleteDialog from './plate-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={PlateUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={PlateUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PlateDetail} />
      <ErrorBoundaryRoute path={match.url} component={Plate} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={PlateDeleteDialog} />
  </>
);

export default Routes;
