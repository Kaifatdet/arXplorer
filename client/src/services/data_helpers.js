export function createAuthorDict(articles) {
  let dict = {};
  articles.forEach((article) => {
    const aID = article.id[0].replace('http://arxiv.org/abs/', '');
    const collabs = article.author.map((auth) => auth.name).flat();
    collabs.forEach((author) => {
      if (dict[author]) {
        if (!dict[author].ids.includes(aID)) {
          dict[author].ids.push(aID);
          dict[author].articles.push(article);
          dict[author].collabs.push(
            ...collabs.filter(
              (au) => !dict[author].collabs.includes(au) && au !== author
            )
          );
        }
      } else {
        dict[author] = {
          collabs: [...collabs.filter((au) => au !== author)],
          ids: [aID],
          articles: [article],
          expanded: false,
        };
      }
    });
  });
  return dict;
}

export function createNodesFromDict(dict) {
  const nodes = [];
  for (const author in dict) {
    nodes.push({
      id: author,
      weight: dict[author].collabs.length,
    });
  }
  return nodes;
}

export function createLinksFromDict(dict) {
  const links = [];
  for (const author in dict) {
    const tempLinks = dict[author].collabs.map((co) => {
      return { source: author, target: co };
    });
    tempLinks.forEach((el) => {
      if (
        links.filter(
          (li) =>
            (li.source === el.source && li.target === el.target) ||
            (li.source === el.target && li.target === el.source)
        ).length === 0
      ) {
        links.push(el);
      }
    });
  }
  return links;
}

export function updateAuthorDict(oldDict, newDict) {
  let dict = Object.assign({}, oldDict);
  for (const key in newDict) {
    if (!dict[key]) {
      dict[key] = newDict[key];
    } else {
      newDict[key].articles.forEach((ar) => {
        const aID = ar.id[0].replace('http://arxiv.org/abs/', '');
        if (!dict[key].ids.includes(aID)) {
          dict[key].ids.push(aID);
          dict[key].articles.push(ar);
        }
      });
      newDict[key].collabs.forEach((col) => {
        !dict[key].collabs.includes(col) && dict[key].collabs.push(col);
      });
    }
  }
  return dict;
}
