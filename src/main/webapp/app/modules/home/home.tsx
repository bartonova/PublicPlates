import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-freedata';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';

export type IHomeProp = StateProps;

export const Home = (props: IHomeProp) => {
  const { account } = props;

  return (
    <Row>
      <Col md="9">
        <h2>
          <Translate contentKey="home.title">Welcome, Java Hipster!</Translate>
        </h2>
        <p className="lead">
          <Translate contentKey="home.subtitle">This is your homepage</Translate>
        </p>
        {account && account.login ? (
          <div>
            <Alert color="success">
              <Translate contentKey="home.logged.message" interpolate={{ username: account.login }}>
                You are logged in as user {account.login}.
              </Translate>
            </Alert>
          </div>
        ) : (
          <div>
            <Alert color="warning">
              <Translate contentKey="global.messages.info.authenticated.prefix">If you want to </Translate>
              <Link to="/login" className="alert-link">
                <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
              </Link>
              <Translate contentKey="global.messages.info.authenticated.suffix">
                , you can try the default accounts:
                <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
                <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
              </Translate>
            </Alert>

            <Alert color="warning">
              <Translate contentKey="global.messages.info.register.noaccount">You do not have an account yet?</Translate>&nbsp;
              <Link to="/account/register" className="alert-link">
                <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
              </Link>
            </Alert>
          </div>
        )}
        <p>
          <Translate contentKey="home.question">If you have any question on freedata:</Translate>
        </p>

        <ul>
          <li>
            <a href="https://www.freedata.tech/" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.homepage">freedata homepage</Translate>
            </a>
          </li>
          <li>
            <a href="http://stackoverflow.com/tags/freedata/info" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.stackoverflow">freedata on Stack Overflow</Translate>
            </a>
          </li>
          <li>
            <a href="https://github.com/freedata/generator-freedata/issues?state=open" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.bugtracker">freedata bug tracker</Translate>
            </a>
          </li>
          <li>
            <a href="https://gitter.im/freedata/generator-freedata" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.chat">freedata public chat room</Translate>
            </a>
          </li>
          <li>
            <a href="https://twitter.com/freedata" target="_blank" rel="noopener noreferrer">
              <Translate contentKey="home.link.follow">follow @freedata on Twitter</Translate>
            </a>
          </li>
        </ul>

        <p>
          <Translate contentKey="home.like">If you like freedata, do not forget to give us a star on</Translate>{' '}
          <a href="https://github.com/freedata/generator-freedata" target="_blank" rel="noopener noreferrer">
            Github
          </a>
          !
        </p>
      </Col>
      <Col md="3" className="pad">
        <span className="hipster rounded" />
      </Col>
    </Row>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
