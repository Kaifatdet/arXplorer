import './App.css';
import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import Graph from './components/Graph';
import Home from './components/Home';
import Search from './components/Search';
import Navbar from './components/Navbar';
import ArticlesList from './components/ArticlesList';

import {
  fetchGraphData,
  removeAuthorFromGraph,
  updateArticlesList,
  updateAuthorData,
} from './services/ApiClient';
import { queryPathBuilder } from './services/apiHelpers';

function App() {
  const [authorDict, setAuthorDict] = useState({});
  const [graphData, setGraphData] = useState({});
  const [articleList, setArticleList] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');

  const handleSearchForm = async (title, author, journal, abstract) => {
    const query = queryPathBuilder(title, author, journal, abstract);
    try {
      // eslint-disable-next-line no-unused-vars
      const [dict, data, metadata, articles] = await fetchGraphData(query);
      setAuthorDict(() => dict);
      setGraphData((init) => {
        return {
          ...init,
          ...data,
        };
      });
      setArticleList(articles);
    } catch (err) {
      console.log('No results for the given search');
    }
  };

  const handleGraphExpand = async (author) => {
    const query = queryPathBuilder('', author);
    try {
      // eslint-disable-next-line no-unused-vars
      const [dict, data, metadata, articles] = await fetchGraphData(query);
      const [updatedDict, updatedData] = await updateAuthorData(
        authorDict,
        dict
      );
      const updatedArticles = await updateArticlesList(articleList, articles);
      setGraphData(updatedData);
      setAuthorDict(updatedDict);
      setArticleList(updatedArticles);
    } catch (err) {
      console.log('No results for the searched author');
    }
  };

  const handleSidebarAuthorRedirect = (author) => {
    setSelectedAuthor(author);
  };

  const selectAuthor = (author) => {
    setSelectedAuthor(author);
  };

  const resetSelectedAuthor = () => {
    setSelectedAuthor('');
  };

  const removeSelectedAuthor = (author) => {
    setGraphData(() => removeAuthorFromGraph(graphData, author));
    setSelectedAuthor('');
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
            selectedAuthor={selectedAuthor}
            selectAuthor={selectAuthor}
            resetSelectedAuthor={resetSelectedAuthor}
            handleSidebarAuthorRedirect={handleSidebarAuthorRedirect}
            removeSelectedAuthor={removeSelectedAuthor}
          />
        </Route>
        <Route exact path="/list">
          <ArticlesList
            authorDict={authorDict}
            articleList={articleList}
            selectedAuthor={selectedAuthor}
            selectAuthor={selectAuthor}
            resetSelectedAuthor={resetSelectedAuthor}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
