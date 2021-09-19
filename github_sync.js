const GitHub = require('github-api');
const fs = require('fs');
const path = require('path');

function checkArgs() {
    let requiredArgs = [ "root-dir", "github-personal-access-token" ];
    if ( process.argv.length < 2 + requiredArgs.length  ) {
        let argsDisplay = requiredArgs.map( arg => `<${arg}>` ).join(" ");
        console.log(`Usage:\n ${process.argv[0]} ${process.argv[1]} ${argsDisplay}`);
        process.exit(1);
    }
    return {
        rootDir: process.argv[2],
        token: process.argv[3]
    }
}

async function main() {
    let args = checkArgs();
    console.log("Provided args:", args);

    // Initialize Github API client
    let client = new GitHub({ token: args.token });
    let user = client.getUser();
    const allRepos = await user.listRepos();
    let repositories = allRepos.data;
    console.log(`${repositories.length} repositories retrieved!`);
    console.log(repositories.map(repo => repo.name));

    // Initialize destination directory
    let rootDir = path.resolve(args.rootDir);
    if ( !fs.existsSync(rootDir) ) fs.mkdirSync(rootDir);

    for ( const repo of repositories ) {
        // Create directory for repository in specified root-dir
        let repositoryDir = path.join(rootDir, repo.name);
        if ( !fs.existsSync(repositoryDir) ) fs.mkdirSync(repositoryDir);
        
        //// Retrieve repository and branches
        //let repository = client.getRepo(repo.owner.login, repo.name);
        //let allBranches = await repository.listBranches();
        //let branches = allBranches.data;
        //let branchNames = branches.map( branch => branch.name ); 
        //console.log(`${repo.name}: branchNames`);

        
    }
}

main();
