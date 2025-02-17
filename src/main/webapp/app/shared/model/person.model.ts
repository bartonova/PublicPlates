import { Moment } from 'moment';
import { IPlate } from 'app/shared/model/plate.model';
import { IDepartment } from 'app/shared/model/department.model';

export interface IPerson {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  hireDate?: string;
  salary?: number;
  commissionPct?: number;
  plates?: IPlate[];
  manager?: IPerson;
  department?: IDepartment;
}

export const defaultValue: Readonly<IPerson> = {};
