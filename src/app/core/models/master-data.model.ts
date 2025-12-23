export interface Nationality {
  id: number;
  name: string;
  nameAr: string;
  tag: string;
  users?: any[];
}

export interface MasterCode {
  id: number;
  name: string;
  description?: string;
}

export interface BusinessType extends MasterCode {}

export interface Currency extends MasterCode {}
