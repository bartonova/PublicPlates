import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-freedata';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './plate.reducer';
import { IPlate } from 'app/shared/model/plate.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPlateDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PlateDetail = (props: IPlateDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { plateEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="platesApp.plate.detail.title">Plate</Translate> [<b>{plateEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="plateTitle">
              <Translate contentKey="platesApp.plate.plateTitle">Plate Title</Translate>
            </span>
          </dt>
          <dd>{plateEntity.plateTitle}</dd>
          <dt>
            <Translate contentKey="platesApp.plate.note">Note</Translate>
          </dt>
          <dd>
            {plateEntity.notes
              ? plateEntity.notes.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.title}</a>
                    {plateEntity.notes && i === plateEntity.notes.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
          <dt>
            <Translate contentKey="platesApp.plate.person">Person</Translate>
          </dt>
          <dd>{plateEntity.person ? plateEntity.person.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/plate" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/plate/${plateEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ plate }: IRootState) => ({
  plateEntity: plate.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PlateDetail);
