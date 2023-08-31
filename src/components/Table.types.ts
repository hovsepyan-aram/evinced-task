export interface TableColumn {
  key: string;
  title: string;
  searchable?: boolean;
  dataType: 'number' | 'string';
  renderer?: (value: string) => JSX.Element;
}

export interface TableDataRow {
  id: number | string;
  [key: string]: any;
}