import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Input, Row, Table } from 'reactstrap';
import { Translate, TextFormat, JhiPagination, JhiItemCount, getSortState, IPaginationBaseState } from 'react-freedata';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_TIMESTAMP_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

import { IRootState } from 'app/shared/reducers';
import { getAudits } from '../administration.reducer';

export interface IAuditsPageProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

const previousMonth = (): string => {
  const now: Date = new Date();
  const fromDate =
    now.getMonth() === 0
      ? new Date(now.getFullYear() - 1, 11, now.getDate())
      : new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  return fromDate.toISOString().slice(0, 10);
};

const today = (): string => {
  // Today + 1 day - needed if the current day must be included
  const day: Date = new Date();
  day.setDate(day.getDate() + 1);
  const toDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  return toDate.toISOString().slice(0, 10);
};

export const AuditsPage = (props: IAuditsPageProps) => {
  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );
  const [fromDate, setFromDate] = useState(previousMonth());
  const [toDate, setToDate] = useState(today());

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getAllAudits();
  }, [fromDate, toDate, pagination.activePage, pagination.order, pagination.sort]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    transition();
  }, [pagination.activePage, pagination.order, pagination.sort]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPagination({
        ...pagination,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  const onChangeFromDate = evt => setFromDate(evt.target.value);

  const onChangeToDate = evt => setToDate(evt.target.value);

  const sort = p => () =>
    setPagination({
      ...pagination,
      order: pagination.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });

  const transition = () => {
    const endURL = `?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  const handlePagination = currentPage =>
    setPagination({
      ...pagination,
      activePage: currentPage,
    });

  const getAllAudits = () => {
    props.getAudits(pagination.activePage - 1, pagination.itemsPerPage, `${pagination.sort},${pagination.order}`, fromDate, toDate);
  };

  const { audits, totalItems } = props;

  return (
    <div>
      <h2 id="audits-page-heading">Audits</h2>
      <span>
        <Translate contentKey="audits.filter.from">from</Translate>
      </span>
      <Input type="date" value={fromDate} onChange={onChangeFromDate} name="fromDate" id="fromDate" />
      <span>
        <Translate contentKey="audits.filter.to">to</Translate>
      </span>
      <Input type="date" value={toDate} onChange={onChangeToDate} name="toDate" id="toDate" />
      {audits && audits.length > 0 ? (
        <Table striped responsive>
          <thead>
            <tr>
              <th onClick={sort('auditEventDate')}>
                <Translate contentKey="audits.table.header.date">Date</Translate>
                <FontAwesomeIcon icon="sort" />
              </th>
              <th onClick={sort('principal')}>
                <Translate contentKey="audits.table.header.principal">User</Translate>
                <FontAwesomeIcon icon="sort" />
              </th>
              <th onClick={sort('auditEventType')}>
                <Translate contentKey="audits.table.header.status">State</Translate>
                <FontAwesomeIcon icon="sort" />
              </th>
              <th>
                <Translate contentKey="audits.table.header.data">Extra data</Translate>
              </th>
            </tr>
          </thead>
          <tbody>
            {audits.map((audit, i) => (
              <tr key={`audit-${i}`}>
                <td>{<TextFormat value={audit.timestamp} type="date" format={APP_TIMESTAMP_FORMAT} />}</td>
                <td>{audit.principal}</td>
                <td>{audit.type}</td>
                <td>
                  {audit.data ? audit.data.message : null}
                  {audit.data ? audit.data.remoteAddress : null}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="alert alert-warning">
          <Translate contentKey="audits.notFound">No audit found</Translate>
        </div>
      )}
      {props.totalItems ? (
        <div className={audits && audits.length > 0 ? '' : 'd-none'}>
          <Row className="justify-content-center">
            <JhiItemCount page={pagination.activePage} total={totalItems} itemsPerPage={pagination.itemsPerPage} i18nEnabled />
          </Row>
          <Row className="justify-content-center">
            <JhiPagination
              activePage={pagination.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={pagination.itemsPerPage}
              totalItems={props.totalItems}
            />
          </Row>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  audits: storeState.administration.audits,
  totalItems: storeState.administration.totalItems,
});

const mapDispatchToProps = { getAudits };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AuditsPage);
