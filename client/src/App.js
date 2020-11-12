import './App.css';
import React, { useState } from 'react';
import { Switch, Route, Link } from 'react-router-dom';

// import ApiClient from './services/ApiClient';
import Graph from './components/Graph';
import Home from './components/Home';
import Search from './components/Search';

import { queryPathBuilder } from './services/ApiClient';
// import { fetchGraphData, queryPathBuilder } from './services/ApiClient';
import { test_data } from './services/test_query';
import { update_data } from './services/update_query';

function App() {
  const [graphData, setGraphData] = useState({});

  const handleSearchForm = async (title, author) => {
    const query = queryPathBuilder(title, author);
    console.log('query', query);
    // const data = await fetchGraphData(query);
    // console.log(data);
    setGraphData((init) => {
      return {
        ...init,
        ...test_data,
      };
    });
  };

  const initData = () => {
    setGraphData((init) => {
      return {
        ...init,
        ...test_data,
      };
    });
  };

  const handleGraphExpand = async (author) => {
    const query = queryPathBuilder('', author);
    console.log('query', query);
    // const data = await fetchGraphData(query);
    // console.log(data);
    update(update_data);
    // update(data);
  };

  const update = (updateData) => {
    setGraphData((data) => {
      const newNodes = updateNodes(data.nodes, updateData.nodes);
      const newLinks = updateLinks(data.links, updateData.links);
      return { nodes: newNodes, links: newLinks };
    });
  };

  function updateNodes(oldNodes, newNodes) {
    let result = [...oldNodes];
    const toAdd = newNodes.map((n) => {
      result.forEach((o, j) => {
        if (n.id === o.id) {
          result.splice(j, 1);
        }
      });
      return n;
    });
    return [...result, ...toAdd];
  }

  function updateLinks(oldLinks, newLinks) {
    let toAdd = [];
    newLinks.forEach((n) => {
      if (
        [...oldLinks].filter(
          (o) => o.source === n.source && o.target === n.target
        ).length === 0
      )
        toAdd.push(n);
    });
    return [...oldLinks, ...toAdd];
  }

  // function deleteData() {
  //   setGraphData((data) => {
  //     const newNodes = data.nodes.slice().filter((el) => el.id !== 'Myriel');
  //     const newLinks = data.links
  //       .slice()
  //       .filter((el) => el.source !== 'Myriel' && el.target !== 'Myriel');
  //     return { nodes: newNodes, links: newLinks };
  //   });
  // }

  return (
    <div className="App">
      <h1>Graph container</h1>
      <div className="buttons">
        <button type="submit" onClick={initData}>
          Create chart
        </button>
        <button type="submit" onClick={() => update(update_data)}>
          Update chart
        </button>
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
          <Graph graphData={graphData} handleGraphExpand={handleGraphExpand} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
