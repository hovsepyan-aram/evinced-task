import React from 'react';
import './App.css';
import { Table, TableColumn } from './components';
import { tableData } from './data';

const columns: TableColumn[] = [
  {
    key: 'id',
    title: 'No.',
    dataType: 'number',
  },
  {
    key: 'issueType',
    title: 'Issue Type',
    dataType: 'string',
  },
  {
    key: 'severity',
    title: 'Severity',
    dataType: 'string',
  },
  {
    key: 'Component',
    title: 'Component',
    dataType: 'string',
  },
  {
    key: 'selector',
    title: 'Selector',
    searchable: true,
    dataType: 'string',
  },
  {
    key: 'url',
    title: 'Url',
    searchable: true,
    renderer: (value) => <a href={value}>{value}</a>,
    dataType: 'string',
  }
];
function App() {
  return (
    <div className="App">
      <Table columns={columns} data={tableData} />
    </div>
  );
}

export default App;
