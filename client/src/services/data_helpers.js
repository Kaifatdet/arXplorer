export function createNodes(articles) {
  let nodesSet = new Set();
  let nodes = [];
  articles.forEach((article) => {
    article.author.forEach((author) => {
      if (nodesSet.has(author.name[0]) === false) {
        nodes.push({ id: author.name[0] });
        nodesSet.add(author.name[0]);
      }
    });
  });
  return nodes;
}

export function createLinks(articles) {
  let links = [];
  let dict = {};
  articles.forEach((article) => {
    if (linkAuthors(article.author) !== []) {
      const tempLinks = linkAuthors(article.author);
      tempLinks.forEach((link) => {
        if (dict[link.source]) {
          if (!dict[link.source].includes(link.target)) {
            dict[link.source].push(link.target);
          }
        } else {
          dict[link.source] = [link.target];
        }
      });
    }
  });

  for (const key in dict) {
    dict[key].forEach((target) =>
      links.push({
        source: key,
        target: target,
      })
    );
  }
  return links.flat();
}

function linkAuthors(authorArr) {
  let links = [];
  for (let i = 0; i < authorArr.length - 1; i++) {
    for (let j = i + 1; j <= authorArr.length - 1; j++) {
      links.push({
        source: authorArr[i].name[0],
        target: authorArr[j].name[0],
      });
    }
  }
  return links;
}
