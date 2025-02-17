import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-freedata';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IPlate, defaultValue } from 'app/shared/model/plate.model';

export const ACTION_TYPES = {
  SEARCH_PLATES: 'plate/SEARCH_PLATES',
  FETCH_PLATE_LIST: 'plate/FETCH_PLATE_LIST',
  FETCH_PLATE: 'plate/FETCH_PLATE',
  CREATE_PLATE: 'plate/CREATE_PLATE',
  UPDATE_PLATE: 'plate/UPDATE_PLATE',
  DELETE_PLATE: 'plate/DELETE_PLATE',
  RESET: 'plate/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IPlate>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type PlateState = Readonly<typeof initialState>;

// Reducer

export default (state: PlateState = initialState, action): PlateState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_PLATES):
    case REQUEST(ACTION_TYPES.FETCH_PLATE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PLATE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_PLATE):
    case REQUEST(ACTION_TYPES.UPDATE_PLATE):
    case REQUEST(ACTION_TYPES.DELETE_PLATE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.SEARCH_PLATES):
    case FAILURE(ACTION_TYPES.FETCH_PLATE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PLATE):
    case FAILURE(ACTION_TYPES.CREATE_PLATE):
    case FAILURE(ACTION_TYPES.UPDATE_PLATE):
    case FAILURE(ACTION_TYPES.DELETE_PLATE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_PLATES):
    case SUCCESS(ACTION_TYPES.FETCH_PLATE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_PLATE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_PLATE):
    case SUCCESS(ACTION_TYPES.UPDATE_PLATE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_PLATE):
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

const apiUrl = 'api/plates';
const apiSearchUrl = 'api/_search/plates';

// Actions

export const getSearchEntities: ICrudSearchAction<IPlate> = (query, page, size, sort) => ({
  type: ACTION_TYPES.SEARCH_PLATES,
  payload: axios.get<IPlate>(`${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`),
});

export const getEntities: ICrudGetAllAction<IPlate> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_PLATE_LIST,
    payload: axios.get<IPlate>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IPlate> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PLATE,
    payload: axios.get<IPlate>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IPlate> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PLATE,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IPlate> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PLATE,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IPlate> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PLATE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
