import fetch from 'node-fetch';
import fs from 'fs';

let userName = "tobsef"

let pipelineRun = true
let templateFile = 'github-repo-count-template.svg'
let outputFile = 'github-repo-count.svg'
let apiURL = "https://api.github.com/users/"
let repoCountUrl = apiURL + userName + "/repos?per_page=100"

fetch(repoCountUrl, {
    method: 'get',
    headers: {'Content-Type': 'application/json'}
})
    .then((res) => res.json())
    .then((json) => {
        updateBadge(json)
    });

function updateBadge(json) {
    try {
        let repos = json.map(parseJson)
        let repoCount = repos.length
        console.log("Received " + repoCount + " repos from GitHub API");
        let templateData = readFile(templateFile);
        let compiledBadge = compileTemplate(templateData, repoCount);
        let oldBadge = readFile(outputFile);

        if (oldBadge === compiledBadge) {
            console.log("Badge data has not changed. Skipping commit.");
            setUpdateBannerEnv("false")
        } else {
            console.log("Updating badge ...");
            fs.writeFileSync("./" + outputFile, compiledBadge);
            console.log("Updated " + outputFile + " successfully");
            setUpdateBannerEnv("true")
        }
    } catch (error) {
        console.error(error);
    }
}

function setUpdateBannerEnv(value) {
    setEnv("update-badge", value)
}

function setEnv(key, value) {
    if (pipelineRun) {
        fs.writeFileSync(process.env.GITHUB_ENV, key + "=" + value);
    } else {
        console.log("New Property: " + key + "=" + value);
    }
}

function parseJson(json) {
    return new RepoInfo(json.name, json.id)
}

class RepoInfo {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}

function readFile(file) {
    return fs.readFileSync("./" + file, 'utf8')
}

function compileTemplate(template, repoCount) {
    return template.replaceAll("${repoCount}", repoCount)
}