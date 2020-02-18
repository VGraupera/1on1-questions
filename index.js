// Generate README.md file based on JSON data

const fs = require('fs');
const questionsJson = require('./questions.json');

function sortQuestions (a, b) {
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
function categoryMapReducer (accumulator, item) {
  if (accumulator[item.category]) {
    accumulator[item.category] = [ ...accumulator[item.category], item ];
  } else {
    accumulator[item.category] = [ item ];
  }
  return accumulator;
};
function generateQuestionSectionReducer(lang, categories) {
  return function questionSectionReducer (accumulator, [category, items]) {
    const i18nCategory = categories[category] && categories[category][lang];
    return [
      ...accumulator,
      `\n\n## ${i18nCategory || category}`,
      ...items.sort(sortQuestions).map((item) => `* ${item.question[lang] || item.question.en}`)
    ];
  }
}
function getReadmeName(lang) {
  if (lang === 'en') {
    return 'README.md';
  }
  return `README_${lang}.md`;
}

const title = `# 1 on 1 Meeting Questions
Mega list compiled from a variety to sources. Also available here: http://www.managersclub.com/mega-list-of-1-on-1-meeting-questions/`;
const faq = `

## FAQ

Why is there also a JSON file?
- it can be directly consumed by apps
- README.md can be generated from json file so you only have to make changes in one place`;
const contributing = `
## Contributing
1. Fork repo
2. Add your question to \`questions.json\` or provide README.md updates through \`index.js\`
3. Run \`npm start\` to regenerate README.md
4. Create new Pull Request
`;

const categoryMap = questionsJson.questions.reduce(categoryMapReducer, {});
for (const lang of questionsJson.languages) {
  const questionsBySection = Object.entries(categoryMap).reduce(generateQuestionSectionReducer(lang, questionsJson.categories), []);
  const content = [
    title,
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

