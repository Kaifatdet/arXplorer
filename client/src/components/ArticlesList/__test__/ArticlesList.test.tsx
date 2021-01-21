import { articlesListMock, authorDictMock } from './mockData';
import React from 'react';
import ArticlesList from '../ArticlesList';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

describe('test articlesList component', () => {
  test('displays list of articles correctly', () => {
    //Whenever any action changes the state of component, we need to wrap this action(render) in act. Make sure you asser outside of the act.

    act(() => {
      render(
        <ArticlesList
          articleList={articlesListMock}
          authorDict={authorDictMock}
          selectedAuthor=""
          selectedArticle=""
        />,
        { wrapper: MemoryRouter }
      );
    });
    screen.getByText('Total # of articles: 25');
    const articlesList = screen.getAllByTestId('article');
    expect(articlesList.length).toBe(25);
    const archiveLinks = screen.getAllByText('See article on arXiv.org');
    expect(
      archiveLinks.every((elem) => elem.href.startsWith('http://arxiv.org'))
    );
  });
});
