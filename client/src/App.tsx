import React, { FunctionComponent, useEffect, useState } from 'react';
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

import './App.css';
import {
  Article,
  Dictionary,
  Dimensions,
  GraphData,
  QueryFilter,
} from './types';

const App: FunctionComponent = () => {
  const [emptyGraph, setEmptyGraph] = useState(true);
  const [authorDict, setAuthorDict] = useState<Dictionary>({});
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedArticle, setSelectedArticle] = useState('');
  const [emptySearch, setEmptySearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tooLarge, setTooLarge] = useState(false);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 100,
    height: 100,
  });

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerWidth / 2,
    });
  }, []);

  const handleSearchForm = async (
    title = '',
    author = '',
    journal = '',
    abstract = '',
    filters: QueryFilter
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
      const [dict, data, , articles] = await fetchGraphData(
        query,
        searchFilters
      );
      if (!dict || !data || !articles) return false;
      if (data.links.length > 1000) {
        setTooLarge(true);
        setTimeout(() => setTooLarge(false), 5000);
      } else {
        setAuthorDict(dict);
        setGraphData({ ...(graphData || {}), ...data });
        setArticleList(articles);
        setEmptyGraph(false);
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

  const handleQuickSearch = (author: string) => {
    if (articleList.length === 0) {
      handleSearchForm('', author, '', '', {});
    } else {
      handleGraphExpand(author);
    }
  };

  const handleGraphExpand = async (author: string) => {
    const [query] = queryPathBuilder('', author);
    setLoading(true);
    try {
      const [dict, , , articles] = await fetchGraphData(query);
      if (!dict || !articles) return undefined;
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

  const removeSelectedAuthor = (author: string) => {
    if (graphData) {
      setGraphData(removeAuthorFromGraph(graphData, author));
      setSelectedAuthor('');
    }
  };

  const killGraph = () => {
    setGraphData(null);
    setEmptyGraph(true);
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
            emptyGraph={emptyGraph}
            dimensions={dimensions}
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
            articleList={articleList}
            authorDict={authorDict}
            selectedArticle={selectedArticle}
            selectedAuthor={selectedAuthor}
            setSelectedArticle={setSelectedArticle}
            setSelectedAuthor={setSelectedAuthor}
          />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
