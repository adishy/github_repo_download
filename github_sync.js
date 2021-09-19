var GitHub = require('github-api');

let repositories = [];
let repoNames = [];

function checkArgs() {

}

async function main() {
    checkArgs();
    let client = new GitHub({
       token: process.env.GITHUB_ACCESS_TOKEN
    });
    let user = client.getUser();
    const result = await user.listRepos();
    let repositories = result.data;
    let repoNames = repositories.map(repo => repo.name);
    console.log(`${repoNames.length} repositories retrieved!`);
    console.log(repoNames);
}

main();
