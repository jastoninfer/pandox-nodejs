const fs = require('fs').promises;
const path = require('path');

const {URL_PREFIX} = require('./app/config/env.config');

const readPath1 = path.join(__dirname, 'page_data', `page21.txt`);
const readPath = path.join(__dirname, 'testxxx.txt');

fs.readFile(readPath, 'utf-8').then((data) => {
    // console.log(data.slice(0, 1000));
    const regex = /!\[(.*?)\]\((.*?)\s*(".*?")?\)/g;
    const regex2 = /\bWechatIMG21.jpeg\b|\bo_Many_Points_Example.jpg\b|\bo_Untitled\%20Diagram\%20(1).png\b|\bo_Untitled Diagram (2) (1).png\b|\bo_Untitled Diagram (2) (2).png\b|\bo_Untitled Diagram (2).png\b|\bo_Untitled Diagram (3).png\b|\bo_Untitled Diagram (4).png\b|\bo_Untitled Diagram (5).png\b|\bo_Untitled Diagram (6).png\b|\bo_Untitled Diagram (7).png\b|\bosaka.png\b|\bsample1.png\b/g;
    const regex3 = /o_Untitled%20Diagram%20(1).png/g;
    const regex4 = /o_Untitled%20Diagram%20\(1\)/g;
    const regex9 = /KEYWORDS\[\[(.*?)\]\]KEYWORDS/s;
    const regex1 = /KEYWORDS\[\[.*?\]\]KEYWORDS/s;
    // console.log(regex1);
    // const newData = data.replace(regex, `![$1]($2)`);
    // const newData = data.replace(regex, (match, p1, p2, p3) => {
    //     const new_p2 = p2.replace(/https:\/\/[^\/]+/g, URL_PREFIX);
    //     return `![${p1}](${new_p2}${p3&&` ${p3}`||''})`;
    // });
    // console.log(newData);
    // const newData = data.replace(regex1, match => {
    //     console.log('match');
    //     console.log(match);
    //     return match;
    // });
    // const regex = /https?:\/\/(?:[^\s()]*\([^)]*\)|[^\s()]+)/g;
    // const matches = [];
    // let match;
    const match = data.match(regex1);
    // console.log(match);
    // console.log(match[1]);
    // let keywords = [];
    // if(match && match[1]) {
    //     keywords = match[1].split('][').map(keyword => keyword.trim());
    // }
    // console.log(keywords);
    const newData = data.replace(regex1, '').trim();
    console.log(newData);
    return;

    while((match = regex.exec(data)) !== null) {
        const link = {
            altText: match[1],
            url: match[2],
            title: match[3],
        };
        matches.push(link);
    }
    console.log(matches.length);
    console.log(matches);
}).catch((err) => {
    console.log(err);
});