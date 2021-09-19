const { execSync } = require("child_process");
const fs = require('fs');
const GitHub = require('github-api');
const path = require('path');

/**
 checkArgs: return expected command-line args provided, show usage information if incorrectly used
**/
function checkArgs() {
    let requiredArgs =
    [ 
        { name: "rootDir", show: "root-dir" },
        { name: "token", show: "github-personal-access-token" },
        { name: "archiveFormat", show: "archive-format: [zip, tar]" }
    ];
    if ( process.argv.length < 2 + requiredArgs.length  ) {
        let argsDisplay = requiredArgs.map( arg => `<${arg.show}>` ).join(" ");
        console.log(`Usage:\n ${process.argv[0]} ${process.argv[1]} ${argsDisplay}`);
        process.exit(1);
    }
    let args = {};
    for ( [ index, arg ] of process.argv.entries() ) {
        if ( index < 2) continue;
        args[requiredArgs[index - 2].name] = arg;
    }
    return args;
}

/**
 downloadArchiveShell: returns curl command <str> used in exec for retrieving repo zipball

 Required arguments:
 args: 
    {
        owner: <str>, // Name of repo owner
        repo: <str>, // Name of repo
        branch: <str>, // Name of branch within repo
        token: <str>, // Personal access token with scopes to retrieve repo archive
        destinationDir: <str> // Destination directory to which zipball should be downloaded
    }
 format: 
    Describes the archive format in which the branches will be stored
    Options: [ "zip", "tar" ]
**/
function downloadArchive(args, format="tar") {
    let archiveFormats =
    {
        "tar": ".tar.gz",
        "zip": ".zip"
    };
    let fullUrl = `https://api.github.com/repos/${args.owner}/${args.repo}/${format}ball/${args.branch}`;
    let sanitizedBranchName = args.branch.replace(/\//g, "-");
    let archivePath = path.join(args.destinationDir, `${sanitizedBranchName}${archiveFormats[format]}`);
    if ( fs.existsSync(archivePath) ) fs.unlinkSync(archivePath);
    let curlArgs = 
    [
      "curl",
      "-H", `"Accept: application/vnd.github.v3+json"`,
      "-H", `"Authorization: token ${args.token}"`,
      "-L", fullUrl,
      ">", archivePath
    ];
    execSync(curlArgs.join(" "));
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

    for ( const [ index, repo ] of repositories.entries() ) {
        // Create directory for repository in specified root-dir
        let repositoryDir = path.join(rootDir, repo.name);
        if ( !fs.existsSync(repositoryDir) ) fs.mkdirSync(repositoryDir);
        
        // Retrieve repository and branches
        let repository = client.getRepo(repo.owner.login, repo.name);
        let allBranches = await repository.listBranches();
        let branches = allBranches.data;
        let branchNames = branches.map( branch => branch.name ); 
        console.log(`(${index + 1}/${repositories.length}): ${repo.name} - ${branchNames}`);

        for ( branch of branchNames ) {
            let archiveFormat = "zip";
            if ( "archiveFormat" in args ) archiveFormat = args.archiveFormat;
            downloadArchive(
                            {
                                owner: repo.owner.login,
                                repo: repo.name,
                                branch: branch,
                                token: args.token,
                                destinationDir: repositoryDir
                            },
                            archiveFormat
                           );            
            await new Promise(r => setTimeout(r, 1000));
        }
        console.log("[DONE!]\n");
    }
}

main();
