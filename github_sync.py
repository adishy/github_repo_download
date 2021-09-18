from github import Github
from os import environ as env
import os
import subprocess
import sys
import time

def check_args():
    if len(sys.argv) < 3:
        print("Usage: {sys.argv[0]} <root-dir> <github-access-token>")
        exit(1)

def main():
    check_args()
    
    root_dir = os.path.abspath(sys.argv[1])
    os.makedirs(root_dir, exist_ok=True)
    
    access_token = sys.argv[2]
    client = Github(access_token)
    
    user = client.get_user()
    for repo in user.get_repos():
        owner = repo.owner.login
        name = repo.name
        print("Repository name:", name, "Owner:", owner)
        branches = list(repo.get_branches())
        repo_dir_path = os.path.join(root_dir, name)
        os.makedirs(repo_dir_path, exist_ok=True)
        for branch in branches:
            branch_dir_path = os.path.join(root_dir, name, f"{branch.name}.zip")
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
            print("   curl:", " ".join(download_zip))
            os.system(" ".join(download_zip))
            time.sleep(0.75)

if __name__ == "__main__":
    main()
