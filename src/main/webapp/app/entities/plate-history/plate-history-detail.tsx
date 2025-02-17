import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-freedata';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './plate-history.reducer';
import { IPlateHistory } from 'app/shared/model/plate-history.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPlateHistoryDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PlateHistoryDetail = (props: IPlateHistoryDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { plateHistoryEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="platesApp.plateHistory.detail.title">PlateHistory</Translate> [<b>{plateHistoryEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="startDate">
              <Translate contentKey="platesApp.plateHistory.startDate">Start Date</Translate>
            </span>
          </dt>
          <dd>
            {plateHistoryEntity.startDate ? <TextFormat value={plateHistoryEntity.startDate} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="endDate">
              <Translate contentKey="platesApp.plateHistory.endDate">End Date</Translate>
            </span>
          </dt>
          <dd>
            {plateHistoryEntity.endDate ? <TextFormat value={plateHistoryEntity.endDate} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="platesApp.plateHistory.plate">Plate</Translate>
          </dt>
          <dd>{plateHistoryEntity.plate ? plateHistoryEntity.plate.id : ''}</dd>
          <dt>
            <Translate contentKey="platesApp.plateHistory.department">Department</Translate>
          </dt>
          <dd>{plateHistoryEntity.department ? plateHistoryEntity.department.id : ''}</dd>
          <dt>
            <Translate contentKey="platesApp.plateHistory.person">Person</Translate>
          </dt>
          <dd>{plateHistoryEntity.person ? plateHistoryEntity.person.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/plate-history" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/plate-history/${plateHistoryEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ plateHistory }: IRootState) => ({
  plateHistoryEntity: plateHistory.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PlateHistoryDetail);
