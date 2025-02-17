import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, UncontrolledTooltip } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-freedata';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntities as getPeople } from 'app/entities/person/person.reducer';
import { IDepartment } from 'app/shared/model/department.model';
import { getEntities as getDepartments } from 'app/entities/department/department.reducer';
import { getEntity, updateEntity, createEntity, reset } from './person.reducer';
import { IPerson } from 'app/shared/model/person.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPersonUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PersonUpdate = (props: IPersonUpdateProps) => {
  const [managerId, setManagerId] = useState('0');
  const [departmentId, setDepartmentId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { personEntity, people, departments, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/person');
  };

  useEffect(() => {
    if (!isNew) {
      props.getEntity(props.match.params.id);
    }

    props.getPeople();
    props.getDepartments();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.hireDate = convertDateTimeToServer(values.hireDate);

    if (errors.length === 0) {
      const entity = {
        ...personEntity,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="platesApp.person.home.createOrEditLabel">
            <Translate contentKey="platesApp.person.home.createOrEditLabel">Create or edit a Person</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : personEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="person-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="person-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="firstNameLabel" for="person-firstName">
                  <Translate contentKey="platesApp.person.firstName">First Name</Translate>
                </Label>
                <AvField id="person-firstName" type="text" name="firstName" />
                <UncontrolledTooltip target="firstNameLabel">
                  <Translate contentKey="platesApp.person.help.firstName" />
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="lastNameLabel" for="person-lastName">
                  <Translate contentKey="platesApp.person.lastName">Last Name</Translate>
                </Label>
                <AvField id="person-lastName" type="text" name="lastName" />
              </AvGroup>
              <AvGroup>
                <Label id="emailLabel" for="person-email">
                  <Translate contentKey="platesApp.person.email">Email</Translate>
                </Label>
                <AvField id="person-email" type="text" name="email" />
              </AvGroup>
              <AvGroup>
                <Label id="phoneNumberLabel" for="person-phoneNumber">
                  <Translate contentKey="platesApp.person.phoneNumber">Phone Number</Translate>
                </Label>
                <AvField id="person-phoneNumber" type="text" name="phoneNumber" />
              </AvGroup>
              <AvGroup>
                <Label id="hireDateLabel" for="person-hireDate">
                  <Translate contentKey="platesApp.person.hireDate">Hire Date</Translate>
                </Label>
                <AvInput
                  id="person-hireDate"
                  type="datetime-local"
                  className="form-control"
                  name="hireDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.personEntity.hireDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="salaryLabel" for="person-salary">
                  <Translate contentKey="platesApp.person.salary">Salary</Translate>
                </Label>
                <AvField id="person-salary" type="string" className="form-control" name="salary" />
              </AvGroup>
              <AvGroup>
                <Label id="commissionPctLabel" for="person-commissionPct">
                  <Translate contentKey="platesApp.person.commissionPct">Commission Pct</Translate>
                </Label>
                <AvField id="person-commissionPct" type="string" className="form-control" name="commissionPct" />
              </AvGroup>
              <AvGroup>
                <Label for="person-manager">
                  <Translate contentKey="platesApp.person.manager">Manager</Translate>
                </Label>
                <AvInput id="person-manager" type="select" className="form-control" name="manager.id">
                  <option value="" key="0" />
                  {people
                    ? people.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="person-department">
                  <Translate contentKey="platesApp.person.department">Department</Translate>
                </Label>
                <AvInput id="person-department" type="select" className="form-control" name="department.id">
                  <option value="" key="0" />
                  {departments
                    ? departments.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/person" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  people: storeState.person.entities,
  departments: storeState.department.entities,
  personEntity: storeState.person.entity,
  loading: storeState.person.loading,
  updating: storeState.person.updating,
  updateSuccess: storeState.person.updateSuccess,
});

const mapDispatchToProps = {
  getPeople,
  getDepartments,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PersonUpdate);
