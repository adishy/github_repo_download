# Github Repository Downloader

* This repository contains Python and NodeJS scripts that download all the repositories from a user's Github account as tar/zip archives.
* A directory corresponding to each repository is created under the specified root directory. Each branch in a repository is downloaded as 
  a separate zip archive in the corresponding repository directory. 
  * If an archive for a branch already exists in the directory corresponding to a repository, it is deleted and redownloaded

## NodeJS Version:

### Installation and Usage
```
# Clone the repository
git clone https://github.com/adishy/github_repo_download
cd github_repo_download

# Ensure node / npm is installed and available in the environment where the script will be run
# Install dependencies
# Note: Please ensure curl is installed and available in the environment where the script will be run
#       Run `curl --version` to test whether curl is installed in your environment
npm install

# Download archives as zip
node github_sync.js <root-dir> <github-personal-access-token> zip

# Download archives as tar
node github_sync.js <root-dir> <github-personal-access-token> tar
```
* Example:  
  `node github_sync.js /tmp/test/ mytokenhere zip`
* `root-dir` : The destination directory to which the repositories will be downloaded into
* `github-personal-access-token`: Create a [Github personal access token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) 
   which has at least read access to the `repo` and `admin:org` scopes.
* `archive-format`: The format in which the archive files will be downloaded as. Options are: "zip" and "tar".

#### Dependencies
* [`github-api`](https://www.npmjs.com/package/github-api)
* shells out to `curl`

--- 

## Python Version:
  
#### Installation and Usage
```
# Clone the repository
git clone https://github.com/adishy/github_repo_download
cd github_repo_download

# Ensure python3 / pip3 is installed and available in the environment where the script will be run
# Create a Python3 virtual env and enable the env
python3 -m venv env
source env/bin/activate

# Install dependencies
# Note: Please ensure curl is installed and available in the environment where the script will be run
#       Run `curl --version` to test whether curl is installed in your environment
pip install -r requirements.txt

# Run the github_sync Python script with the required args
python github_sync.py <root-dir> <github-personal-access-token>
```

* Example:  
  `python github_sync.py /tmp/test/ mytokenhere`
* `root-dir` : The destination directory to which the repositories will be downloaded into
* `github-personal-access-token`: Create a [Github personal access token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) 
   which has at least read access to the `repo` and `admin:org` scopes.
   
#### Dependencies
* [`PyGithub`](https://github.com/PyGithub/PyGithub)
* [`tenacity`](https://tenacity.readthedocs.io/en/latest/)
* shells out to `curl`

---
