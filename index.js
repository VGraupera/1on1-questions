const fs = require('fs');
const obj = require('./questions.json');

const categoryMap = {};

for (const item of obj) {
  if (categoryMap[item.category]) {
    categoryMap[item.category].push(item);
  }
  else {
    categoryMap[item.category] = [item];
  }
}

let content = ['# 1 on 1 Questions\nUltimate list compiled from a variety to sources']

for (const [key, items] of Object.entries(categoryMap)) {
  content.push(`\n\n## ${key}`)

  const sorted = items.sort(function(a, b) {
    var qA = a.question.toUpperCase(); // ignore upper and lowercase
    var qB = b.question.toUpperCase(); // ignore upper and lowercase
    if (qA < qB) {
      return -1;
    }
    if (qA > qB) {
      return 1;
    }

    return 0;
  });

  for (const item of sorted) {
    content.push(
      `* ${item.question}`
    )
  }
}

// create contributing instructions
content.push('\n\n## Contributing \n' +
'1. Fork it\n' +
'2. Add your resource to `README.md` and `questions.json`\n' +
'3. Create new Pull Request\n');

// create README file
fs.writeFile('./README.md', content.join('\n'), function (err) {
  if (err) throw err;
  console.log('Updated README.md');
});
