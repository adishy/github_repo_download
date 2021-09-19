### Github Repository Downloader

* This is a script that downloads all the repositories from a user's Github account as zip archives.
* A directory corresponding to each repository is created under the specified root directory. Each branch in a repository is downloaded as 
  a separate zip archive in the corresponding repository directory. 
  * If a zip archive for a branch already exists in the directory corresponding to a repository, it is deleted and redownloaded
  
#### Installation and Usage
```
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
