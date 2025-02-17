import { IPlate } from 'app/shared/model/plate.model';

export interface INote {
  id?: number;
  title?: string;
  description?: string;
  plates?: IPlate[];
}

export const defaultValue: Readonly<INote> = {};
