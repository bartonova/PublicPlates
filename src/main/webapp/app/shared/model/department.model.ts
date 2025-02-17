import { ILocation } from 'app/shared/model/location.model';
import { IPerson } from 'app/shared/model/person.model';

export interface IDepartment {
  id?: number;
  departmentName?: string;
  location?: ILocation;
  people?: IPerson[];
}

export const defaultValue: Readonly<IDepartment> = {};
