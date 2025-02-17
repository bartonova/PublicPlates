import { INote } from 'app/shared/model/note.model';
import { IPerson } from 'app/shared/model/person.model';

export interface IPlate {
  id?: number;
  plateTitle?: string;
  notes?: INote[];
  person?: IPerson;
}

export const defaultValue: Readonly<IPlate> = {};
