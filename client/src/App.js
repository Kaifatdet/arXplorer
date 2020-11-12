import './App.css';
import React, { useState } from 'react';
import { Switch, Route, Link } from 'react-router-dom';

// import ApiClient from './services/ApiClient';
import Graph from './components/Graph';
import Home from './components/Home';
import Search from './components/Search';

// import { queryPathBuilder } from './services/ApiClient';
import {
  fetchGraphData,
  queryPathBuilder,
  updateData,
} from './services/ApiClient';

// import { test_data } from './services/test_query';
// import { update_data } from './services/update_query';

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
      <h1>Graph container</h1>
      <div className="buttons">
        {/* <button type="submit" onClick={initData}>
          Create chart
        </button> */}
        {/* <button type="submit" onClick={() => updateState(update_data)}>
          Update chart
        </button> */}
        {/* <button type="submit" onClick={deleteData}>
          Delete data
        </button> */}
      </div>
      <Link to="/">Home</Link>
      <Link to="/search">Search</Link>
      <Link to="/graph">Graph</Link>
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
