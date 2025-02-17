import React from 'react';
import { Translate } from 'react-freedata';
import { Row, Col, Alert } from 'reactstrap';

class PageNotFound extends React.Component {
  render() {
    return (
      <div>
        <Alert color="danger">
          <Translate contentKey="error.http.404">The page does not exist.</Translate>
        </Alert>
      </div>
    );
  }
}

export default PageNotFound;
