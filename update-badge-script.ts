const userName = "tobsef";

const pipelineRun = true; // Set to false for local debugging
const templateFile = 'github-repo-count-template.svg';
const outputFile = 'github-repo-count.svg';
const apiURL = "https://api.github.com/users/";
const repoCountUrl = apiURL + userName;

const response = await fetch(repoCountUrl);
const json = await response.json()
updateBadge(json.public_repos);

function updateBadge(repoCount: string) {
    try {
        console.log("Received count of " + repoCount + " repos from GitHub API");
        const templateData = readFile(templateFile);
        const compiledBadge = compileTemplate(templateData, repoCount);
        const oldBadge = readFile(outputFile);

        if (oldBadge === compiledBadge) {
            console.log("Badge data has not changed. Skipping commit.");
            setUpdateBannerEnv("false");
        } else {
            console.log("Updating badge ...");
            Deno.writeTextFileSync("./" + outputFile, compiledBadge);
            console.log("Updated " + outputFile + " successfully");
            setUpdateBannerEnv("true")
        }
    } catch (error) {
        console.error(error);
    }
}

function setUpdateBannerEnv(value:string) {
    setEnv("update-badge", value);
}

function setEnv(key:string, value:string) {
    if (pipelineRun) {
        const fileName = Deno.env.get("GITHUB_ENV");
        if(fileName){
            Deno.writeTextFileSync(fileName, key + "=" + value);
        }
    } else {
        console.log("New Property: " + key + "=" + value);
    }
}

function readFile(file:string): string{
    return Deno.readTextFileSync("./" + file);
}

function compileTemplate(template:string, repoCount:string): string {
    const compiled = setTemplateVar(template, "repoCount", repoCount);
    const size = calculateSize(repoCount);
    return setTemplateVar(compiled, "length", size.toString());
}

function setTemplateVar(template: string, name: string, value: string | number): string {
    const searchValue = "${" + name + "}";
    return template.replaceAll(searchValue, value.toString());
}

function calculateSize(number:string): number {
    const letterSize = 80;
    return number.toString().length * letterSize;
}

export {};
Deno.exit()