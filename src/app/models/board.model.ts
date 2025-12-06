import { Column } from './task.model';

export interface Board {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  columns: Column[];
}

export interface CreateBoardDto {
  name: string;
  description?: string;
}
