import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import PlateHistory from './plate-history';
import PlateHistoryDetail from './plate-history-detail';
import PlateHistoryUpdate from './plate-history-update';
import PlateHistoryDeleteDialog from './plate-history-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={PlateHistoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={PlateHistoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PlateHistoryDetail} />
      <ErrorBoundaryRoute path={match.url} component={PlateHistory} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={PlateHistoryDeleteDialog} />
  </>
);

export default Routes;
