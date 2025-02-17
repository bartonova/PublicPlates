import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-freedata';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './person.reducer';
import { IPerson } from 'app/shared/model/person.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPersonDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PersonDetail = (props: IPersonDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { personEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="platesApp.person.detail.title">Person</Translate> [<b>{personEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="firstName">
              <Translate contentKey="platesApp.person.firstName">First Name</Translate>
            </span>
            <UncontrolledTooltip target="firstName">
              <Translate contentKey="platesApp.person.help.firstName" />
            </UncontrolledTooltip>
          </dt>
          <dd>{personEntity.firstName}</dd>
          <dt>
            <span id="lastName">
              <Translate contentKey="platesApp.person.lastName">Last Name</Translate>
            </span>
          </dt>
          <dd>{personEntity.lastName}</dd>
          <dt>
            <span id="email">
              <Translate contentKey="platesApp.person.email">Email</Translate>
            </span>
          </dt>
          <dd>{personEntity.email}</dd>
          <dt>
            <span id="phoneNumber">
              <Translate contentKey="platesApp.person.phoneNumber">Phone Number</Translate>
            </span>
          </dt>
          <dd>{personEntity.phoneNumber}</dd>
          <dt>
            <span id="hireDate">
              <Translate contentKey="platesApp.person.hireDate">Hire Date</Translate>
            </span>
          </dt>
          <dd>{personEntity.hireDate ? <TextFormat value={personEntity.hireDate} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="salary">
              <Translate contentKey="platesApp.person.salary">Salary</Translate>
            </span>
          </dt>
          <dd>{personEntity.salary}</dd>
          <dt>
            <span id="commissionPct">
              <Translate contentKey="platesApp.person.commissionPct">Commission Pct</Translate>
            </span>
          </dt>
          <dd>{personEntity.commissionPct}</dd>
          <dt>
            <Translate contentKey="platesApp.person.manager">Manager</Translate>
          </dt>
          <dd>{personEntity.manager ? personEntity.manager.id : ''}</dd>
          <dt>
            <Translate contentKey="platesApp.person.department">Department</Translate>
          </dt>
          <dd>{personEntity.department ? personEntity.department.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/person" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/person/${personEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ person }: IRootState) => ({
  personEntity: person.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PersonDetail);
