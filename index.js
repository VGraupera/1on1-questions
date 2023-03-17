// Generate README.md file based on JSON data

const fs = require('fs');
const questionsJson = require('./questions.json');

function sortQuestions(a, b) {
  // case insensitive sort
  const qA = a.question.en.toUpperCase();
  const qB = b.question.en.toUpperCase();
  if (qA < qB) {
    return -1;
  }
  if (qA > qB) {
    return 1;
  }
  return 0;
}
function stringToSlug(string) {
  return string
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}
function categoryMapReducer(accumulator, item) {
  if (accumulator[item.category]) {
    accumulator[item.category] = [...accumulator[item.category], item];
  } else {
    accumulator[item.category] = [item];
  }
  return accumulator;
};
function generateQuestionSectionReducer(lang, i18nCategories) {
  return function questionSectionReducer (accumulator, [category, items]) {
    const i18nCategory = i18nCategories[category] && i18nCategories[category][lang];
    return [
      ...accumulator,
      `\n## ${i18nCategory || category}`,
      ...items.sort(sortQuestions).map((item) => `* ${item.question[lang] || item.question.en}`)
    ];
  }
}
function getReadmeName(lang) {
  if (lang === 'en') {
    return 'README.md';
  }
  return `README.${lang}.md`;
}
function tableOfContentsReducer(accumulator, category) {
  return [
    ...accumulator,
    `\n- [${category}](#${stringToSlug(category)})`
  ];
}

const title = `# 1 on 1 Meeting Questions
Mega list compiled from a variety to sources. Also available here: http://www.managersclub.com/mega-list-of-1-on-1-meeting-questions/`;
const faq = `

## FAQ

Why is there also a JSON file?
- It can be directly consumed by apps
- README.md can be generated from json file so you only have to make changes in one place`;
const contributing = `
## Contributing
1. Fork repo
2. Add your question to \`questions.json\`.
3. Create new Pull Request

You can update the README manually running \`npm start\` but there is GitHub action that will automatically update the README with your questions.
`;

const categoryMap = questionsJson.questions.reduce(categoryMapReducer, {});
for (const lang of questionsJson.languages) {
  const questionsBySection = Object.entries(categoryMap).reduce(generateQuestionSectionReducer(lang, questionsJson.i18nCategories), []);
  const tableOfContents = Object.keys(categoryMap).reduce(tableOfContentsReducer, ['\n## Table of Contents']).join('');
  const content = [
    title,
    tableOfContents,
    ...questionsBySection,
    faq,
    contributing
  ];

  // create README file
  const readmeName = getReadmeName(lang);
  fs.writeFile(`./${readmeName}`, content.join('\n'), function (err) {
    if (err) throw err;
    console.log(`Updated ${readmeName}`);
  });
}

