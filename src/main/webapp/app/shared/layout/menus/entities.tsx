import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate, translate } from 'react-freedata';
import { NavLink as Link } from 'react-router-dom';
import { NavDropdown } from './menu-components';

export const EntitiesMenu = props => (
  <NavDropdown
    icon="th-list"
    name={translate('global.menu.entities.main')}
    id="entity-menu"
    style={{ maxHeight: '80vh', overflow: 'auto' }}
  >
    <MenuItem icon="asterisk" to="/region">
      <Translate contentKey="global.menu.entities.region" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/country">
      <Translate contentKey="global.menu.entities.country" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/location">
      <Translate contentKey="global.menu.entities.location" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/department">
      <Translate contentKey="global.menu.entities.department" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/note">
      <Translate contentKey="global.menu.entities.note" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/person">
      <Translate contentKey="global.menu.entities.person" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/plate">
      <Translate contentKey="global.menu.entities.plate" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/plate-history">
      <Translate contentKey="global.menu.entities.plateHistory" />
    </MenuItem>
    {/* freedata-needle-add-entity-to-menu - freedata will add entities to the menu here */}
  </NavDropdown>
);
