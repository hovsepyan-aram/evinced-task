import React, { useMemo, useState } from 'react';
import { TableColumn, TableDataRow } from './Table.types';
import styles from './Table.module.scss';

interface Props {
  columns: TableColumn[];
  data: TableDataRow[];
}

export const Table: React.FC<Props> = ({
  columns,
  data
}) => {
  const [searchKeywords, setSearchKeywords] = useState<{[key: string]: string}>({});
  const [sort, setSort] = useState<{key: string, dir: 'asc' | 'desc'} | null>(null);

  const setSearchKeyword = (key: string, value: string) => setSearchKeywords(prev => ({...prev, [key]: value}));

  const filteredData = useMemo(() => {
    const searchKeywordKeys = Object.keys(searchKeywords);

    if (searchKeywordKeys.length) {
      if (!searchKeywordKeys.some(key => searchKeywords[key].length)) {
        return data;
      } else {
        return data.filter(rowData =>
          searchKeywordKeys.every(key => rowData[key].toString().includes?.(searchKeywords[key]))
        );
      }
    }

    return data;
  }, [data, searchKeywords]);

  const handleSort = (key: string) => {
    if (key !== sort?.key || !sort) {
      setSort({
        key,
        dir: 'asc',
      });
    } else {
      if (sort.dir === 'asc') {
        setSort({
          key,
          dir: 'desc',
        });
      } else if (sort.dir === 'desc') {
        setSort(null);
      }
    }
  };

  const sortedData = useMemo(() => {
    if (!sort) {
      return filteredData;
    }

    const dataType = columns.find(column => column.key === sort?.key)?.dataType;
    if (!dataType) {
      return filteredData;
    }

    return [...filteredData].sort((a, b) => {
      if (sort.dir === 'asc') {
        switch (dataType) {
          case 'number':
          return a[sort.key] - b[sort.key];
          case 'string':
          default:
          return a[sort.key].localeCompare(b[sort.key]);
        }
      } else {
        switch (dataType) {
          case 'number':
          return b[sort.key] - a[sort.key];
          case 'string':
          default:
          return b[sort.key].localeCompare(a[sort.key]);
        }
      }
    })
  }, [filteredData, sort, columns]);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
            {columns.map(column => (
              <th 
                className={
                  column.key === sort?.key ? styles['sorted-header'] :''
                }
                key={`${column.key}-header`}
              >
                <span>{column.title}</span>
                <span
                  onClick={() => handleSort( column.key)}
                  className={
                    sort?.key === column.key ?
                      `${styles.sorted} ${styles[sort?.dir ?? '']}` :
                      styles.unsorted
                  }
                  >
                  {sort?.key === column.key ? '▲' : '<   >'}
                </span>
                {column.searchable && (
                  <input
                    value={searchKeywords[column.key]}
                    onChange={e => setSearchKeyword(column.key, e.target.value)}
                  />
                )}
              </th>
            ))}
        </tr>
      </thead>
      {sortedData.length ? sortedData.map(rowData => (
        <tr key={rowData.id}>
          {columns.map(column => (
            <td key={`${column.key}-${rowData.id}`}>
              {column.renderer ?
                column.renderer(rowData[column.key])
                : <span>{rowData[column.key]}</span>
              }
            </td>
          ))}
        </tr>
      )) : <tr><td colSpan={columns.length} className={styles['single-row']}>No data to display.</td></tr>}
    </table>
  );
};
