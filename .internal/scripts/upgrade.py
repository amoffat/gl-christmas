import argparse
import json
import shutil
import subprocess
from pathlib import Path
from typing import NoReturn

THIS_DIR = Path(__file__).parent
REPO_DIR = THIS_DIR.parent.parent
TEMPLATE_REPO = "https://github.com/amoffat/getlost-level-template.git"


def check_clean_working_tree(target_path: Path) -> None:
    result = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=str(target_path),
        capture_output=True,
        text=True,
    )
    if result.stdout.strip():
        print(
            "Error: Working tree or index is not clean. Please commit or stash your changes."
        )
        exit(1)


def upgrade_repo(*, target_path: Path, branch: str = "main") -> None:
    level_dir = target_path / "level"
    internal_dir = target_path / ".internal"
    version_file = internal_dir / "package.json"
    temp_clone_dir = target_path / "_template_update"
    level_backup = target_path / "_level_backup"

    # Stop all pm2 processes before upgrade
    print("Stopping all pm2 processes...")
    subprocess.run(
        [
            "npx",
            "--prefix",
            str(internal_dir),
            "pm2",
            "stop",
            "all",
        ],
        check=True,
    )

    if not target_path.exists():
        print(f"Error: Target directory '{target_path}' does not exist.")
        exit(1)

    # Check that target_dir is a git repository
    if not (target_path / ".git").exists():
        print(f"Error: '{target_path}' is not a git repository, aborting.")
        exit(1)

    if temp_clone_dir.exists():
        print(
            f"Warning: Temporary clone directory '{temp_clone_dir}' already exists, removing"
        )
        shutil.rmtree(temp_clone_dir, ignore_errors=True)

    if level_backup.exists():
        print(f"Warning: Backup directory '{level_backup}' already exists, removing")
        shutil.rmtree(level_backup, ignore_errors=True)

    # Check if the working tree and index are clean
    check_clean_working_tree(target_path)

    # Move 'level' directory aside
    shutil.move(str(level_dir), str(level_backup))

    # Clone the latest template repo
    print("Cloning template repository...")
    subprocess.run(
        [
            "git",
            "clone",
            "--depth",
            "1",
            "--branch",
            branch,
            TEMPLATE_REPO,
            str(temp_clone_dir),
        ],
        check=True,
    )

    # Return true if the file should be removed from the level repo.
    def should_remove(item: Path) -> bool:
        preserve = [
            level_backup,
            temp_clone_dir,
            target_path / ".git",
        ]
        return item not in preserve

    # Return true if the file should be copied from the temp cloned template
    # repo into our level repo.
    def should_restore(item: Path) -> bool:
        ignore = [
            temp_clone_dir / "level",
            temp_clone_dir / ".git",
        ]
        return item not in ignore

    # Remove old contents (except 'level_backup')
    print("Removing old contents from target directory...")
    for item in target_path.iterdir():
        if should_remove(item):
            if item.is_dir():
                print(f"Removing directory: {item}")
                shutil.rmtree(item, ignore_errors=True)
            else:
                print(f"Removing file: {item}")
                item.unlink()

    # Move new contents into place
    print("Restoring new contents from template repository...")
    for item in temp_clone_dir.iterdir():
        if should_restore(item):
            print(f"Restoring item: {item} to {target_path}")
            shutil.move(str(item), str(target_path))

    # Restore 'level' directory
    if level_backup.exists():
        print(f"Restoring 'level' directory from backup: {level_backup} to {level_dir}")
        shutil.move(str(level_backup), str(level_dir))

    # Cleanup
    print(f"Cleaning up temporary clone directory: {temp_clone_dir}")
    shutil.rmtree(temp_clone_dir)

    # Commit changes
    subprocess.run(["git", "add", "-A"], cwd=str(target_path), check=True)

    with version_file.open() as f:
        version = json.load(f).get("version", "unknown")

    print(f"Committing changes with version: {version}")
    subprocess.run(
        ["git", "commit", "--allow-empty", "-m", f"+upgrade to {version}"],
        cwd=str(target_path),
        check=True,
    )

    for hook in ["onCreate", "postCreate", "postStart"]:
        print(f"Running {hook} devcontainer hook...")
        subprocess.run(
            ["bash", f".devcontainer/hooks/{hook}.sh"],
            cwd=str(target_path),
            check=True,
        )
    print(f"Upgrade complete! Committed as 'Upgrade to {version}'")


def main() -> NoReturn:
    parser = argparse.ArgumentParser(description="Upgrade the level template.")
    parser.add_argument(
        "--branch",
        type=str,
        default="main",
        help="The branch name to use for the upgrade (default: 'main').",
    )
    args = parser.parse_args()

    upgrade_repo(target_path=REPO_DIR, branch=args.branch)
    exit(0)


if __name__ == "__main__":
    main()
