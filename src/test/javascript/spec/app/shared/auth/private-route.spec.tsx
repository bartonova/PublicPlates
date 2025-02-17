import React from 'react';
import { Route } from 'react-router-dom';
import { shallow } from 'enzyme';
import { TranslatorContext } from 'react-freedata';

import { AUTHORITIES } from 'app/config/constants';
import { PrivateRouteComponent, hasAnyAuthority } from 'app/shared/auth/private-route';

const TestComp = () => <div>Test</div>;

describe('private-route component', () => {
  beforeAll(() => {
    TranslatorContext.registerTranslations('en', {});
  });

  // All tests will go here
  it('Should throw error when no component is provided', () => {
    expect(() => shallow(<PrivateRouteComponent component={null} isAuthenticated sessionHasBeenFetched isAuthorized />)).toThrow(Error);
  });

  it('Should render an error message when the user has no authorities', () => {
    const route = shallow(
      <PrivateRouteComponent component={TestComp} isAuthenticated sessionHasBeenFetched isAuthorized={false} path="/" />
    );
    const renderedRoute = route.find(Route);
    const props = renderedRoute.props() as any;
    const renderFn: Function = props.render;
    const comp = shallow(
      renderFn({
        location: '/',
      })
    );
    expect(comp.length).toEqual(1);
    const error = comp.find('div.insufficient-authority');
    expect(error.length).toEqual(1);
    expect(error.find('.alert-danger').html()).toEqual(
      '<div class="alert alert-danger"><span>You are not authorized to access this page.</span></div>'
    );
  });

  it('Should render a route for the component provided when authenticated', () => {
    const route = shallow(<PrivateRouteComponent component={TestComp} isAuthenticated sessionHasBeenFetched isAuthorized path="/" />);
    const renderedRoute = route.find(Route);
    expect(renderedRoute.length).toEqual(1);
    const props = renderedRoute.props() as any;
    expect(props.path).toEqual('/');
    expect(props.render).toBeDefined();
    const renderFn: Function = props.render;
    const comp = shallow(
      renderFn({
        location: '/',
      })
    );
    expect(comp.length).toEqual(1);
    expect(comp.html()).toEqual('<div>Test</div>');
  });

  it('Should render a redirect to login when not authenticated', () => {
    const route = shallow(
      <PrivateRouteComponent component={TestComp} isAuthenticated={false} sessionHasBeenFetched isAuthorized path="/" />
    );
    const renderedRoute = route.find(Route);
    expect(renderedRoute.length).toEqual(1);
    const props = renderedRoute.props() as any;
    const renderFn: Function = props.render;
    // as rendering redirect outside router will throw error
    expect(() =>
      shallow(
        renderFn({
          location: '/',
        })
      ).html()
    ).toThrow(Error);
  });
});

describe('hasAnyAuthority', () => {
  // All tests will go here
  it('Should return false when authorities is invalid', () => {
    expect(hasAnyAuthority(undefined, undefined)).toEqual(false);
    expect(hasAnyAuthority(null, [])).toEqual(false);
    expect(hasAnyAuthority([], [])).toEqual(false);
    expect(hasAnyAuthority([], [AUTHORITIES.USER])).toEqual(false);
  });

  it('Should return true when authorities is valid and hasAnyAuthorities is empty', () => {
    expect(hasAnyAuthority([AUTHORITIES.USER], [])).toEqual(true);
  });

  it('Should return true when authorities is valid and hasAnyAuthorities contains an authority', () => {
    expect(hasAnyAuthority([AUTHORITIES.USER], [AUTHORITIES.USER])).toEqual(true);
    expect(hasAnyAuthority([AUTHORITIES.USER, AUTHORITIES.ADMIN], [AUTHORITIES.USER])).toEqual(true);
    expect(hasAnyAuthority([AUTHORITIES.USER, AUTHORITIES.ADMIN], [AUTHORITIES.USER, AUTHORITIES.ADMIN])).toEqual(true);
    expect(hasAnyAuthority([AUTHORITIES.USER, AUTHORITIES.ADMIN], [AUTHORITIES.USER, 'ROLEADMIN'])).toEqual(true);
    expect(hasAnyAuthority([AUTHORITIES.USER, AUTHORITIES.ADMIN], [AUTHORITIES.ADMIN])).toEqual(true);
  });

  it('Should return false when authorities is valid and hasAnyAuthorities does not contain an authority', () => {
    expect(hasAnyAuthority([AUTHORITIES.USER], [AUTHORITIES.ADMIN])).toEqual(false);
    expect(hasAnyAuthority([AUTHORITIES.USER, AUTHORITIES.ADMIN], ['ROLE_USERSS'])).toEqual(false);
    expect(hasAnyAuthority([AUTHORITIES.USER, AUTHORITIES.ADMIN], ['ROLEUSER', 'ROLEADMIN'])).toEqual(false);
  });
});
