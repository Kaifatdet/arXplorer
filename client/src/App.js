import './App.css';
import React, { useState } from 'react';
import { Switch, Route, Link } from 'react-router-dom';

// import ApiClient from './services/ApiClient';
import Graph from './components/Graph';
import Home from './components/Home';
import Search from './components/Search';

// import lesmis from './services/test_data';
import { fetchGraphData, queryPathBuilder } from './services/ApiClient';
import { testdata } from './services/test_query';

function App() {
  const [graphData, setGraphData] = useState({});

  const handleSearchForm = async (title, author) => {
    const query = queryPathBuilder(title, author);
    const data = await fetchGraphData(query);
    console.log(data);
  };

  const initData = () => {
    setGraphData((data) => {
      return {
        ...data,
        ...testdata,
      };
    });
    console.log(graphData);
  };

  const updateData = () => {
    const newData = {
      nodes: [
        { id: 'Hr Kineser', group: 1 },
        { id: 'Hej verden', group: 1 },
      ],
      links: [
        { source: 'Myriel', target: 'Hr Kineser', value: '1' },
        { source: 'Myriel', target: 'Hej verden', value: '1' },
        { source: 'Hr Kineser', target: 'Hej verden', value: '1' },
      ],
    };
    setGraphData((data) => {
      const newNodes = data.nodes.slice().concat(newData.nodes);
      const newLinks = data.links.slice().concat(newData.links);
      return { nodes: newNodes, links: newLinks };
    });
    console.log(graphData);
  };

  const deleteData = () => {
    setGraphData((data) => {
      const newNodes = data.nodes.slice().filter((el) => el.id !== 'Myriel');
      const newLinks = data.links
        .slice()
        .filter((el) => el.source !== 'Myriel' && el.target !== 'Myriel');
      return { nodes: newNodes, links: newLinks };
    });
  };

  return (
    <div className="App">
      <h1>Graph container</h1>
      <div className="buttons">
        <button type="submit" onClick={initData}>
          Create chart
        </button>
        <button type="submit" onClick={updateData}>
          Update chart
        </button>
        <button type="submit" onClick={deleteData}>
          Delete data
        </button>
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
          <Graph data={graphData} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
