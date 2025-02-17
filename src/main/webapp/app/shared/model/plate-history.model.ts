import { Moment } from 'moment';
import { IPlate } from 'app/shared/model/plate.model';
import { IDepartment } from 'app/shared/model/department.model';
import { IPerson } from 'app/shared/model/person.model';

export interface IPlateHistory {
  id?: number;
  startDate?: string;
  endDate?: string;
  plate?: IPlate;
  department?: IDepartment;
  person?: IPerson;
}

export const defaultValue: Readonly<IPlateHistory> = {};
