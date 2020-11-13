import './App.css';
import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import Graph from './components/Graph';
import Home from './components/Home';
import Search from './components/Search';
import Navbar from './components/Navbar';

import {
  fetchGraphData,
  queryPathBuilder,
  updateData,
} from './services/ApiClient';

function App() {
  const [authorDict, setAuthorDict] = useState({});
  const [graphData, setGraphData] = useState({});

  const handleSearchForm = async (title, author) => {
    const query = queryPathBuilder(title, author);
    const [dict, data, metadata] = await fetchGraphData(query);
    console.log(metadata);
    setAuthorDict(() => dict);
    setGraphData((init) => {
      return {
        ...init,
        ...data,
      };
    });
  };

  const handleGraphExpand = async (author) => {
    const query = queryPathBuilder('', author);
    const [dict, data, metadata] = await fetchGraphData(query);
    const [updatedDict, updatedData] = await updateData(authorDict, dict);
    console.log('metadata', metadata, 'data', data);

    setGraphData(updatedData);
    setAuthorDict(updatedDict);
  };

  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/search">
          <Search handleSearchForm={handleSearchForm} />
        </Route>
        <Route exact path="/graph">
          <Graph
            graphData={graphData}
            handleGraphExpand={handleGraphExpand}
            authorDict={authorDict}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
