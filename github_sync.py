from github import Github
from os import environ as env
import os
import sys

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
        owner = repo.owner
        name = repo.name
        branches = list(repo.get_branches())
        os.makedirs(os.path.join(root_dir, name), exist_ok=True)
        for branch in branches:
            os.makedirs(os.path.join(root_dir, name, branch.name), exist_ok=True)
        print(f"Name: {name}, Branches: {[ branch.name for branch in branches ]}")

if __name__ == "__main__":
    main()
