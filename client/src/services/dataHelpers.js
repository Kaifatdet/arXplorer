const { categoriesDict } = require('./categories');

export function createAuthorDict(articles) {
  let dict = {};
  articles.forEach((article) => {
    const aID = article.id[0].replace('http://arxiv.org/abs/', '');
    const collabs = article.author.map((auth) => auth.name).flat();
    const categories = article.category
      .map((cat) => {
        if (categoriesDict[cat.$.term]) return cat.$.term;
      })
      .flat()
      .filter((cat) => cat !== undefined);

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
          categories.forEach((cat) => {
            const main_cat = dict[author].main_cat;
            dict[author].categories[cat]
              ? dict[author].categories[cat]++
              : (dict[author].categories[cat] = 1);
            if (
              dict[author].categories[cat] > dict[author].categories[main_cat]
            ) {
              dict[author].main_cat = cat;
            }
          });
        }
      } else {
        dict[author] = {
          collabs: [...collabs.filter((au) => au !== author)],
          ids: [aID],
          articles: [article],
          expanded: false,
          main_cat: categories[0],
          categories: {},
        };
        categories.forEach((cat) => (dict[author].categories[cat] = 1));
      }
    });
  });
  return dict;
}

export function createNodesFromDict(dict) {
  const nodes = [];
  const colorDict = calculateGroupsFromCategories(dict);
  for (const author in dict) {
    const main_cat = dict[author].main_cat;
    nodes.push({
      id: author,
      weight: dict[author].collabs.length,
      group: colorDict[main_cat],
      cat: main_cat,
      cat_name: categoriesDict[main_cat],
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

          const categories = ar.category
            .map((cat) => {
              if (categoriesDict[cat.$.term]) return cat.$.term;
            })
            .flat()
            .filter((cat) => cat !== undefined);

          categories.forEach((cat) => {
            const main_cat = dict[key].main_cat;
            if (dict[key].categories[cat]) {
              dict[key].categories[cat]++;
              if (dict[key].categories[cat] > dict[key].categories[main_cat]) {
                dict[key].main_cat = cat;
              }
            } else {
              dict[key].categories[cat] = 1;
            }
          });
        }
      });
      newDict[key].collabs.forEach((col) => {
        !dict[key].collabs.includes(col) && dict[key].collabs.push(col);
      });
    }
  }
  return dict;
}

function calculateGroupsFromCategories(dict) {
  let cats = {};
  let counter = 1;
  for (const key in dict) {
    const cat = dict[key].main_cat;
    if (!cats[cat]) {
      cats[cat] = counter;
      counter++;
    }
  }
  return cats;
}

export function addNewArticles(prev, newList) {
  let toAdd = [];
  newList.forEach((ar) => {
    prev.filter((old) => old.id[0] === ar.id[0]).length === 0 && toAdd.push(ar);
  });
  return [...prev, ...toAdd];
}
