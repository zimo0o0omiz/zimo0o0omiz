// index.js
const Mustache = require('mustache');
const fs = require('fs');
const { execSync } = require('child_process');
const MUSTACHE_MAIN_DIR = './main.mustache';

function resolveLogin() {
    if (process.env.GITHUB_REPOSITORY_OWNER) {
        return process.env.GITHUB_REPOSITORY_OWNER;
    }
    try {
        const remote = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
        const match = remote.match(/github\.com[:/]([^/]+)\//);
        if (match) {
            return match[1];
        }
    } catch (err) {
        console.log('读取 git remote 失败: ' + err.message);
    }
    throw new Error('无法确定 GitHub 用户名，请设置环境变量 GITHUB_REPOSITORY_OWNER');
}

let DATA = {
    user: {
        'name': '子墨',
        login: resolveLogin()
    },
    date: new Date().toUTCString()
};

generateReadMe(DATA)

function generateReadMe(DATA) {
    console.log(DATA)
    fs.readFile(MUSTACHE_MAIN_DIR, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            throw err;
        }
        const output = Mustache.render(data, DATA);
        fs.writeFileSync('README.md', output + '\n', 'utf8');
    });
}
