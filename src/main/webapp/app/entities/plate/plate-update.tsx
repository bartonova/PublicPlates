import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-freedata';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { INote } from 'app/shared/model/note.model';
import { getEntities as getNotes } from 'app/entities/note/note.reducer';
import { IPerson } from 'app/shared/model/person.model';
import { getEntities as getPeople } from 'app/entities/person/person.reducer';
import { getEntity, updateEntity, createEntity, reset } from './plate.reducer';
import { IPlate } from 'app/shared/model/plate.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPlateUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PlateUpdate = (props: IPlateUpdateProps) => {
  const [idsnote, setIdsnote] = useState([]);
  const [personId, setPersonId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { plateEntity, notes, people, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/plate' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getNotes();
    props.getPeople();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...plateEntity,
        ...values,
        notes: mapIdList(values.notes),
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
          <h2 id="platesApp.plate.home.createOrEditLabel">
            <Translate contentKey="platesApp.plate.home.createOrEditLabel">Create or edit a Plate</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : plateEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="plate-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="plate-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="plateTitleLabel" for="plate-plateTitle">
                  <Translate contentKey="platesApp.plate.plateTitle">Plate Title</Translate>
                </Label>
                <AvField id="plate-plateTitle" type="text" name="plateTitle" />
              </AvGroup>
              <AvGroup>
                <Label for="plate-note">
                  <Translate contentKey="platesApp.plate.note">Note</Translate>
                </Label>
                <AvInput
                  id="plate-note"
                  type="select"
                  multiple
                  className="form-control"
                  name="notes"
                  value={plateEntity.notes && plateEntity.notes.map(e => e.id)}
                >
                  <option value="" key="0" />
                  {notes
                    ? notes.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.title}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="plate-person">
                  <Translate contentKey="platesApp.plate.person">Person</Translate>
                </Label>
                <AvInput id="plate-person" type="select" className="form-control" name="person.id">
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
              <Button tag={Link} id="cancel-save" to="/plate" replace color="info">
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
  notes: storeState.note.entities,
  people: storeState.person.entities,
  plateEntity: storeState.plate.entity,
  loading: storeState.plate.loading,
  updating: storeState.plate.updating,
  updateSuccess: storeState.plate.updateSuccess,
});

const mapDispatchToProps = {
  getNotes,
  getPeople,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PlateUpdate);
