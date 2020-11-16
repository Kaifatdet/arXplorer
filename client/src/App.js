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
  const [emptySearch, setEmptySearch] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearchForm = async (title, author, journal, abstract) => {
    const query = queryPathBuilder(title, author, journal, abstract);
    setLoading(true);
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
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      return false;
    }
  };

  const handleQuickSearch = (author) => {
    if (articleList.length === 0) {
      handleSearchForm('', author, '', '');
    } else {
      handleGraphExpand(author);
    }
  };

  const handleGraphExpand = async (author) => {
    const query = queryPathBuilder('', author);
    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const [dict, data, metadata, articles] = await fetchGraphData(query);
      const [updatedDict, updatedData] = await updateAuthorData(
        authorDict,
        dict
      );
      const updatedArticles = await updateArticlesList(articleList, articles);
      setEmptySearch(false);
      setLoading(false);
      setGraphData(updatedData);
      setAuthorDict(updatedDict);
      setArticleList(updatedArticles);
    } catch (err) {
      setEmptySearch(true);
      setLoading(false);
    }
  };

  const removeSelectedAuthor = (author) => {
    setGraphData(() => removeAuthorFromGraph(graphData, author));
    setSelectedAuthor('');
  };

  const killGraph = () => {
    setGraphData({});
    setAuthorDict({});
    setArticleList([]);
    setSelectedAuthor('');
  };

  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home handleQuickSearch={handleQuickSearch} />
        </Route>
        <Route exact path="/search">
          <Search handleSearchForm={handleSearchForm} loading={loading} />
        </Route>
        <Route exact path="/graph">
          <Graph
            graphData={graphData}
            handleGraphExpand={handleGraphExpand}
            authorDict={authorDict}
            selectedAuthor={selectedAuthor}
            // selectAuthor={selectAuthor}
            setSelectedAuthor={setSelectedAuthor}
            removeSelectedAuthor={removeSelectedAuthor}
            handleQuickSearch={handleQuickSearch}
            killGraph={killGraph}
            emptySearch={emptySearch}
            loading={loading}
          />
        </Route>
        <Route exact path="/list">
          <ArticlesList
            authorDict={authorDict}
            articleList={articleList}
            selectedAuthor={selectedAuthor}
            setSelectedAuthor={setSelectedAuthor}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
