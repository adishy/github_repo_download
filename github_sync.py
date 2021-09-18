from github import Github
from os import environ as env
from tenacity import retry, wait_exponential
import datetime
import os
import subprocess
import sys
import time

def check_args():
    if len(sys.argv) < 3:
        print("Usage: {sys.argv[0]} <root-dir> <github-access-token>")
        exit(1)

@retry(wait=wait_exponential())
def download_branch_zipball(curl_args):
    return_code = os.system(" ".join(curl_args))
    if return_code != 0:
        print(f"({datetime.datetime.now()})", "Could not correctly retrieve zipball")
        print("  ", curl_args)
        raise ValueError

def main():
    check_args()
    
    root_dir = os.path.abspath(sys.argv[1])
    os.makedirs(root_dir, exist_ok=True)
    
    access_token = sys.argv[2]
    client = Github(access_token)
    
    user = client.get_user()
    repos = list(user.get_repos())

    count = 0
    for repo in repos:
        count += 1
        owner = repo.owner.login
        name = repo.name
        print(f"{count}/{len(repos)})",
              "Repository name:", name,
              "Owner:", owner)
        branches = list(repo.get_branches())
        repo_dir_path = os.path.join(root_dir, name)
        os.makedirs(repo_dir_path, exist_ok=True)
        for branch in branches:
            branch_dir_path = os.path.join(root_dir, name, f"{branch.name}.zip")
            if os.path.exists(branch_dir_path):
                os.remove(branch_dir_path)
            full_url = f"https://api.github.com/repos/{owner}/{name}/zipball/{branch.name}"
            download_zip = \
                [
                  "curl",
                  "-H", "\"Accept: application/vnd.github.v3+json\"",
                  "-H", f"\"Authorization: token {access_token}\"",
                  "-L", full_url,
                  ">", branch_dir_path
                ]
            print("   Branch:", branch.name, f"({full_url})")
            download_branch_zipball(download_zip)
            time.sleep(0.75)

if __name__ == "__main__":
    main()
