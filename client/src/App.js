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
  // removeAuthorFromGraph,
  updateArticlesList,
  updateAuthorData,
  shrinkGraph,
} from './services/ApiClient';
import { queryPathBuilder } from './services/apiHelpers';
// import { shrinkGraph } from './services/dataHelpers';

function App() {
  const [authorDict, setAuthorDict] = useState({});
  const [graphData, setGraphData] = useState({});
  const [articleList, setArticleList] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedArticle, setSelectedArticle] = useState('');
  const [emptySearch, setEmptySearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tooLarge, setTooLarge] = useState(false);

  const handleSearchForm = async (
    title,
    author,
    journal,
    abstract,
    filters
  ) => {
    const [query, searchFilters] = queryPathBuilder(
      title,
      author,
      journal,
      abstract,
      filters
    );
    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const [dict, data, metadata, articles] = await fetchGraphData(
        query,
        searchFilters
      );
      if (data.links.length > 1000) {
        setTooLarge(true);
        setTimeout(() => setTooLarge(false), 5000);
      } else {
        setAuthorDict(() => dict);
        setGraphData((init) => {
          return {
            ...init,
            ...data,
          };
        });
        setArticleList(articles);
      }
      setLoading(false);
      return true;
    } catch (err) {
      setEmptySearch(true);
      setLoading(false);
      setTimeout(() => setEmptySearch(false), 5000);
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
    // eslint-disable-next-line no-unused-vars
    const [query, _] = queryPathBuilder('', author);
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
      if (updatedData.links.length > 1000) {
        setTooLarge(true);
        setTimeout(() => setTooLarge(false), 5000);
      } else {
        setGraphData(updatedData);
        setAuthorDict(updatedDict);
        setArticleList(updatedArticles);
      }
    } catch (err) {
      setEmptySearch(true);
      setLoading(false);
      setTimeout(() => setEmptySearch(false), 5000);
    }
  };

  // const removeSelectedAuthor = (author) => {
  // setGraphData(() => removeAuthorFromGraph(graphData, author));
  // setSelectedAuthor('');
  // };
  const removeSelectedAuthor = (author) => {
    const [dict, data] = shrinkGraph(authorDict, graphData.links, author);
    console.log('delDict', dict, 'data', data);
    // setGraphData(data);
    // setAuthorDict(dict);
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
          <Search
            handleSearchForm={handleSearchForm}
            loading={loading}
            setSelectedAuthor={setSelectedAuthor}
          />
        </Route>
        <Route exact path="/graph">
          <Graph
            graphData={graphData}
            handleGraphExpand={handleGraphExpand}
            authorDict={authorDict}
            selectedAuthor={selectedAuthor}
            setSelectedAuthor={setSelectedAuthor}
            setSelectedArticle={setSelectedArticle}
            removeSelectedAuthor={removeSelectedAuthor}
            handleQuickSearch={handleQuickSearch}
            killGraph={killGraph}
            emptySearch={emptySearch}
            loading={loading}
            tooLarge={tooLarge}
            setTooLarge={setTooLarge}
          />
        </Route>
        <Route exact path="/list">
          <ArticlesList
            authorDict={authorDict}
            articleList={articleList}
            selectedAuthor={selectedAuthor}
            setSelectedAuthor={setSelectedAuthor}
            selectedArticle={selectedArticle}
            setSelectedArticle={setSelectedArticle}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
