const fs = require('fs').promises;

const markdownText = `
The concept of "strongly connected components" (SCCs) is analogous to connected components in an undirected graph.

The relationship \`$$R$$\` defined by "mutual reachability" in a directed graph is an equivalent relationship. Each set from the partition induced by \`$$R$$\` is referred to as a strongly connected component (SCC).

If we consider each set as a node, all SCCs togother form a graph known as the SCC graph. Such a SCC graph does not contain any directed cycles, making it a Directed Acyclic Graph (DAG).

Algorithms for finding strongly connected components in a directed graph are typically based on depth-first-search (DFS). Commonly used alogirhmths include Kosaraju's algorithm and Tarjan's alogorithm. Below is the code for the Tarjan's algorithm:

\`\`\`cpp
vector<int> G[maxn];
int pre[maxn], low_link[maxn], scc_no[maxn], dfs_clk, scc_cnt;
stack<int> S;
void dfs(int u){
    pre[u] = low_link[u] = ++dfs_clk;
    S.push(u);
    FOR(i, 0, G[u].size() - 1){
        int v = G[u][i];
        if(!pre[v]){
            dfs(v);
            minimize(low_link[u], low_link[v]);
        }else if(!scc_no[v]) minimize(low_link[u], pre[v]);
    }
    if(low_link[u] == pre[u]){
        scc_cnt++;
        while(true){
            int x = S.top(); S.pop();
            scc_no[x] = scc_cnt;
            if(x == u) break;
        }
    }
}
void find_scc(int n){
    dfs_clk = scc_cnt = 0;
    clr(scc_no, 0), clr(pre, 0);
    FOR(i, 0, n - 1) if(!pre[i]) dfs(i);
}
\`\`\`

Since each vertex belongs to exactly one SCC, we aim to output the SCC when we first visit a node within that SCC and complete the traversal. It is essential to determine whether a particular node is the first one discovered in its SCC. Similar to the method for computing biconnected components in an undirected graph, for each node \`$$u$$\`, we use \`$$lowlink(u)$$\` to represent the value of \`$$pre(v)$$\` for the earliest ancestor point \`$$v$$\` that \`$$u$$\` and its descendants can trace back to. Therefore, \`$$u$$\` is the first discovered point if and only if \`$$lowlink(u)$$\` equals \`$$pre(u)$$\`.
`;

const markdownText2 = `
This is my first post
\`\`\`js
function A() {
    const counter = 0;
    const B = () => {
        console.log(counter);
    };
    return B;
}
const b = A();
b();
\`\`\`

***How about this page***

today is good

---
how are you

---

`;

const markdownTitle = "Graph Theory - Strongly Connected Components";

const markdownTitle2 = "123-123";

const jsonData = {title: markdownTitle, 
content: markdownText, author: 'pandoxone'};

const jsonData2 = {title: markdownTitle2, 
    content: markdownText2, author: 'pandoxone'};

const jsonStr = JSON.stringify(jsonData);
// console.log(jsonStr);
fs.writeFile('jsonFiles/page1.json', jsonStr, 'utf-8');
fs.writeFile('jsonFiles/page2.json', JSON.stringify(jsonData2), 'utf-8');

class Page {
    constructor(id, title) {
        this.id = id;
        this.title = title;
    }
}

const pages = [
    new Page(1, 'Graph Theory - Strongly Connected Components'),
    new Page(3, '线性回归模型'),
    new Page(4, '图论: 2-SAT问题'),
    new Page(5, '图论-最短路问题'),
    new Page(6, 'hdu 5779 Tower Defence'),
    new Page(7, 'hdu 5780 gcd'),
    new Page(8, 'hdu 5749 Colmerauer'),
    new Page(9, 'hdu 5751 Eades'),
    new Page(10, 'cf 712E Memory and Casinos'),
    new Page(11, 'hdu 5901 Count primes'),
    new Page(12, 'cf 710E Generate a String'),
    new Page(13, 'hdu 4401 Battery'),
    new Page(14, '解题策略-状态精简'),
    new Page(15, '变分法'),
    new Page(16, '拉格朗日乘子'),
    new Page(17, '部分矩阵求导结论及证明'),
    new Page(18, '核方法'),
    new Page(19, '采样方法'),
    new Page(20, '线性分类模型'),
    new Page(21, '图模型'),
];

for (let page of pages) {
   const {id, title} = page;
   const dir = `./page_data/page${id}.txt`;
//    console.log(id);
//    console.log(title);
   fs.readFile(dir, 'utf-8')
     .then((data) => {
        // const newData = data.replace(/`/g, '\\`');
        const newData = data;
        // console.log(newData);
        const writeDir = `jsonFiles/page${id}.json`;
        const jsonData = { title, 
            content: newData, author: 'pandoxone'};
        fs.writeFile(writeDir, JSON.stringify(jsonData), 'utf-8');
        return;
     })
     .catch((err) => {
        console.log('error reading file: ', err);
        return;
     });
}

const resolveComments = () => {
    const dir = './comments.txt';
    fs.readFile(dir, 'utf-8')
        .then((data) => {
            const writeDir = `jsonFiles/comment.json`;
            const threads = [];
            for (let thread of data.split('\n\n')){
                const threadBody1 = thread.match(/\$\$([\n\s\S]*?)>>/);
                const threadBody3 = thread.match(/\$\$(.*)/);
                const threadBodyText = (threadBody1 ? threadBody1[1] : threadBody3[1]).trim();
                // const threadBodyText = threadBody1 ? threadBody1[0] : (threadBody2 ? threadBody2[0] : threadBody3[0]);
                // console.log(threadBodyText);
                const subItems = [];
                const threadComments = Array.from(thread.matchAll(/([\n\s\S]*?)>>/g));
                for (let threadComment of threadComments.slice(1)) {
                    subItems.push(threadComment[1].trim());
                }
                // console.log(subItems);
                // console.log('-----');
                const threadData = {
                    'body': threadBodyText,
                    'comments': subItems
                };
                threads.push(threadData);
            }
            // console.log(threads);
            fs.writeFile(writeDir, JSON.stringify(threads), 'utf-8');
            return;
        })
        .catch((err)=>{
            console.log('error resolving comments: ', err);
            return;
        });
};

resolveComments();