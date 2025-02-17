import axios from 'axios';
import {
  ICrudSearchAction,
  parseHeaderForLinks,
  loadMoreDataWhenScrolled,
  ICrudGetAction,
  ICrudGetAllAction,
  ICrudPutAction,
  ICrudDeleteAction,
} from 'react-freedata';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IPlateHistory, defaultValue } from 'app/shared/model/plate-history.model';

export const ACTION_TYPES = {
  SEARCH_PLATEHISTORIES: 'plateHistory/SEARCH_PLATEHISTORIES',
  FETCH_PLATEHISTORY_LIST: 'plateHistory/FETCH_PLATEHISTORY_LIST',
  FETCH_PLATEHISTORY: 'plateHistory/FETCH_PLATEHISTORY',
  CREATE_PLATEHISTORY: 'plateHistory/CREATE_PLATEHISTORY',
  UPDATE_PLATEHISTORY: 'plateHistory/UPDATE_PLATEHISTORY',
  DELETE_PLATEHISTORY: 'plateHistory/DELETE_PLATEHISTORY',
  RESET: 'plateHistory/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IPlateHistory>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type PlateHistoryState = Readonly<typeof initialState>;

// Reducer

export default (state: PlateHistoryState = initialState, action): PlateHistoryState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_PLATEHISTORIES):
    case REQUEST(ACTION_TYPES.FETCH_PLATEHISTORY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PLATEHISTORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PLATEHISTORY):
    case REQUEST(ACTION_TYPES.UPDATE_PLATEHISTORY):
    case REQUEST(ACTION_TYPES.DELETE_PLATEHISTORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.SEARCH_PLATEHISTORIES):
    case FAILURE(ACTION_TYPES.FETCH_PLATEHISTORY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PLATEHISTORY):
    case FAILURE(ACTION_TYPES.CREATE_PLATEHISTORY):
    case FAILURE(ACTION_TYPES.UPDATE_PLATEHISTORY):
    case FAILURE(ACTION_TYPES.DELETE_PLATEHISTORY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_PLATEHISTORIES):
    case SUCCESS(ACTION_TYPES.FETCH_PLATEHISTORY_LIST): {
      const links = parseHeaderForLinks(action.payload.headers.link);

      return {
        ...state,
        loading: false,
        links,
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    }
    case SUCCESS(ACTION_TYPES.FETCH_PLATEHISTORY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PLATEHISTORY):
    case SUCCESS(ACTION_TYPES.UPDATE_PLATEHISTORY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PLATEHISTORY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/plate-histories';
const apiSearchUrl = 'api/_search/plate-histories';

// Actions

export const getSearchEntities: ICrudSearchAction<IPlateHistory> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_PLATEHISTORIES,
  payload: axios.get<IPlateHistory>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`),
});

export const getEntities: ICrudGetAllAction<IPlateHistory> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PLATEHISTORY_LIST,
    payload: axios.get<IPlateHistory>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IPlateHistory> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PLATEHISTORY,
    payload: axios.get<IPlateHistory>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IPlateHistory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PLATEHISTORY,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const updateEntity: ICrudPutAction<IPlateHistory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PLATEHISTORY,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IPlateHistory> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PLATEHISTORY,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
