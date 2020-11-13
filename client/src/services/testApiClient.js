/* eslint-disable no-unused-vars */
'use strict';
const fetch = require('node-fetch');
const { parseString } = require('xml2js');
// const {
//   createAuthorDict,
//   createNodesFromDict,
//   createLinksFromDict,
// } = require('./data_helpers');

const BASE_URL = 'http://export.arxiv.org/api/';

async function fetchRequest(queryPath) {
  const res = await fetch(queryPath);
  const text = await res.text();
  return parseResponse(text);
}

function queryPathBuilder(title = '', author = '') {
  let queryUrl = BASE_URL + 'query' + '?search_query=';
  if (title && author) {
    queryUrl += `ti:%22${title.replace(/\s/g, '+')}%22`;
    queryUrl += '+AND+';
    queryUrl += `au:%22${author.replace(/\s/g, '+')}%22`;
  } else if (title) {
    queryUrl += `ti:%22${title.replace(/\s/g, '+')}%22`;
  } else if (author) {
    queryUrl += `au:%22${author.replace(/\s/g, '+')}%22`;
  } else {
    return false;
  }
  queryUrl += '&start=0&max_results=25';
  return queryUrl;
}

function parseResponse(res) {
  let metadata = {};
  let articles;
  parseString(res, function (err, result) {
    if (err) throw err;
    Object.assign(metadata, result.feed);
    delete metadata.entry;
    articles = result.feed.entry;
  });
  return [articles, metadata];
}

async function fetchGraphData(query) {
  const [articles, metadata] = await fetchRequest(query);
  if (articles) {
    const dict = createAuthorDict(articles);
    const nodes = createNodesFromDict(dict);
    const links = createLinksFromDict(dict);
    return [dict, { nodes, links }, metadata, articles];
  }
  return false;
}

function createAuthorDict(articles) {
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

function createNodesFromDict(dict) {
  const nodes = [];
  const colorDict = calculateGroupsFromCategories(dict);
  for (const author in dict) {
    const main_cat = dict[author].main_cat;
    nodes.push({
      id: author,
      weight: dict[author].collabs.length,
      group: colorDict[main_cat],
      cat: main_cat,
    });
  }
  return nodes;
}

function createLinksFromDict(dict) {
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

function updateAuthorDict(oldDict, newDict) {
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

function addNewArticles(prev, newList) {
  let toAdd = [];
  newList.forEach((ar) => {
    prev.filter((old) => old.id[0] === ar.id[0]).length === 0 && toAdd.push(ar);
  });
  console.log(toAdd);
  return [...prev, ...toAdd];
}

// tests
// (async () => {
//   const query = queryPathBuilder('', 'Dexter Kozen');
//   // eslint-disable-next-line no-unused-vars
//   const [dict, i, m, articles] = await fetchGraphData(query);

//   const cats = calculateGroupsFromCategories(dict);
//   console.log(cats);
//   return dict;
// })();
(async () => {
  const firstQ = queryPathBuilder('', 'Dexter Kozen');
  const secondQ = queryPathBuilder('', 'Helle Hvid Hansen');
  // eslint-disable-next-line no-unused-vars
  const [firstDict, i, m, firstList] = await fetchGraphData(firstQ);
  // eslint-disable-next-line no-unused-vars
  const [secondDict, j, n, secondList] = await fetchGraphData(secondQ);
  const updatedList = addNewArticles(firstList, secondList);
  console.log('first', firstList.length);
  console.log('second', secondList.length);
  console.log('updated', updatedList.length);
  return updatedList;
})();

const categoriesDict = {
  'astro-ph': 'Astrophysics',
  'astro-ph.CO': 'Cosmology and Nongalactic Astrophysics',
  'astro-ph.EP': 'Earth and Planetary Astrophysics',
  'astro-ph.GA': 'Astrophysics of Galaxies',
  'astro-ph.HE': 'High Energy Astrophysical Phenomena',
  'astro-ph.IM': 'Instrumentation and Methods for Astrophysics',
  'astro-ph.SR': 'Solar and Stellar Astrophysics',
  'cond-mat.dis-nn': 'Disordered Systems and Neural Networks',
  'cond-mat.mes-hall': 'Mesoscale and Nanoscale Physics',
  'cond-mat.mtrl-sci': 'Materials Science',
  'cond-mat.other': 'Other Condensed Matter',
  'cond-mat.quant-gas': 'Quantum Gases',
  'cond-mat.soft': 'Soft Condensed Matter',
  'cond-mat.stat-mech': 'Statistical Mechanics',
  'cond-mat.str-el': 'Strongly Correlated Electrons',
  'cond-mat.supr-con': 'Superconductivity',
  'cs.AI': 'Artificial Intelligence',
  'cs.AR': 'Hardware Architecture',
  'cs.CC': 'Computational Complexity',
  'cs.CE': 'Computational Engineering, Finance, and Science',
  'cs.CG': 'Computational Geometry',
  'cs.CL': 'Computation and Language',
  'cs.CR': 'Cryptography and Security',
  'cs.CV': 'Computer Vision and Pattern Recognition',
  'cs.CY': 'Computers and Society',
  'cs.DB': 'Databases',
  'cs.DC': 'Distributed, Parallel, and Cluster Computing',
  'cs.DL': 'Digital Libraries',
  'cs.DM': 'Discrete Mathematics',
  'cs.DS': 'Data Structures and Algorithms',
  'cs.ET': 'Emerging Technologies',
  'cs.FL': 'Formal Languages and Automata Theory',
  'cs.GL': 'General Literature',
  'cs.GR': 'Graphics',
  'cs.GT': 'Computer Science and Game Theory',
  'cs.HC': 'Human-Computer Interaction',
  'cs.IR': 'Information Retrieval',
  'cs.IT': 'Information Theory',
  'cs.LG': 'Learning',
  'cs.LO': 'Logic in Computer Science',
  'cs.MA': 'Multiagent Systems',
  'cs.MM': 'Multimedia',
  'cs.MS': 'Mathematical Software',
  'cs.NA': 'Numerical Analysis',
  'cs.NE': 'Neural and Evolutionary Computing',
  'cs.NI': 'Networking and Internet Architecture',
  'cs.OH': 'Other Computer Science',
  'cs.OS': 'Operating Systems',
  'cs.PF': 'Performance',
  'cs.PL': 'Programming Languages',
  'cs.RO': 'Robotics',
  'cs.SC': 'Symbolic Computation',
  'cs.SD': 'Sound',
  'cs.SE': 'Software Engineering',
  'cs.SI': 'Social and Information Networks',
  'cs.SY': 'Systems and Control',
  'econ.EM': 'Econometrics',
  'eess.AS': 'Audio and Speech Processing',
  'eess.IV': 'Image and Video Processing',
  'eess.SP': 'Signal Processing',
  'gr-qc': 'General Relativity and Quantum Cosmology',
  'hep-ex': 'High Energy Physics - Experiment',
  'hep-lat': 'High Energy Physics - Lattice',
  'hep-ph': 'High Energy Physics - Phenomenology',
  'hep-th': 'High Energy Physics - Theory',
  'math.AC': 'Commutative Algebra',
  'math.AG': 'Algebraic Geometry',
  'math.AP': 'Analysis of PDEs',
  'math.AT': 'Algebraic Topology',
  'math.CA': 'Classical Analysis and ODEs',
  'math.CO': 'Combinatorics',
  'math.CT': 'Category Theory',
  'math.CV': 'Complex Variables',
  'math.DG': 'Differential Geometry',
  'math.DS': 'Dynamical Systems',
  'math.FA': 'Functional Analysis',
  'math.GM': 'General Mathematics',
  'math.GN': 'General Topology',
  'math.GR': 'Group Theory',
  'math.GT': 'Geometric Topology',
  'math.HO': 'History and Overview',
  'math.IT': 'Information Theory',
  'math.KT': 'K-Theory and Homology',
  'math.LO': 'Logic',
  'math.MG': 'Metric Geometry',
  'math.MP': 'Mathematical Physics',
  'math.NA': 'Numerical Analysis',
  'math.NT': 'Number Theory',
  'math.OA': 'Operator Algebras',
  'math.OC': 'Optimization and Control',
  'math.PR': 'Probability',
  'math.QA': 'Quantum Algebra',
  'math.RA': 'Rings and Algebras',
  'math.RT': 'Representation Theory',
  'math.SG': 'Symplectic Geometry',
  'math.SP': 'Spectral Theory',
  'math.ST': 'Statistics Theory',
  'math-ph': 'Mathematical Physics',
  'nlin.AO': 'Adaptation and Self-Organizing Systems',
  'nlin.CD': 'Chaotic Dynamics',
  'nlin.CG': 'Cellular Automata and Lattice Gases',
  'nlin.PS': 'Pattern Formation and Solitons',
  'nlin.SI': 'Exactly Solvable and Integrable Systems',
  'nucl-ex': 'Nuclear Experiment',
  'nucl-th': 'Nuclear Theory',
  'physics.acc-ph': 'Accelerator Physics',
  'physics.ao-ph': 'Atmospheric and Oceanic Physics',
  'physics.app-ph': 'Applied Physics',
  'physics.atm-clus': 'Atomic and Molecular Clusters',
  'physics.atom-ph': 'Atomic Physics',
  'physics.bio-ph': 'Biological Physics',
  'physics.chem-ph': 'Chemical Physics',
  'physics.class-ph': 'Classical Physics',
  'physics.comp-ph': 'Computational Physics',
  'physics.data-an': 'Data Analysis, Statistics and Probability',
  'physics.ed-ph': 'Physics Education',
  'physics.flu-dyn': 'Fluid Dynamics',
  'physics.gen-ph': 'General Physics',
  'physics.geo-ph': 'Geophysics',
  'physics.hist-ph': 'History and Philosophy of Physics',
  'physics.ins-det': 'Instrumentation and Detectors',
  'physics.med-ph': 'Medical Physics',
  'physics.optics': 'Optics',
  'physics.plasm-ph': 'Plasma Physics',
  'physics.pop-ph': 'Popular Physics',
  'physics.soc-ph': 'Physics and Society',
  'physics.space-ph': 'Space Physics',
  'q-bio.BM': 'Biomolecules',
  'q-bio.CB': 'Cell Behavior',
  'q-bio.GN': 'Genomics',
  'q-bio.MN': 'Molecular Networks',
  'q-bio.NC': 'Neurons and Cognition',
  'q-bio.OT': 'Other Quantitative Biology',
  'q-bio.PE': 'Populations and Evolution',
  'q-bio.QM': 'Quantitative Methods',
  'q-bio.SC': 'Subcellular Processes',
  'q-bio.TO': 'Tissues and Organs',
  'q-fin.CP': 'Computational Finance',
  'q-fin.EC': 'Economics',
  'q-fin.GN': 'General Finance',
  'q-fin.MF': 'Mathematical Finance',
  'q-fin.PM': 'Portfolio Management',
  'q-fin.PR': 'Pricing of Securities',
  'q-fin.RM': 'Risk Management',
  'q-fin.ST': 'Statistical Finance',
  'q-fin.TR': 'Trading and Market Microstructure',
  'quant-ph': 'Quantum Physics',
  'stat.AP': 'Applications',
  'stat.CO': 'Computation',
  'stat.ME': 'Methodology',
  'stat.ML': 'Machine Learning',
  'stat.OT': 'Other Statistics',
  'stat.TH': 'Statistics Theory',
};
