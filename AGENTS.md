# AGENTS.md

## Checkout and worktree policy

- Use the current checkout for ordinary work, especially small fixes, documentation, and configuration changes. Task size, convenience, or unrelated uncommitted files alone do not justify a new worktree.
- Before creating a checkout, inspect the repository's existing worktrees and branches. Reuse the appropriate main or task checkout when it is safe. Do not switch a busy checkout's branch, overwrite unrelated changes, or move to a different code lineage merely to avoid creating a worktree.
- Create a new worktree only when explicitly requested or when overlapping edits or genuinely independent concurrent work require isolation. Explain the concrete reason before creating it. Intentional PR isolation under the babysit-pr workflow remains allowed; do not create an additional worktree when that PR already has a suitable checkout.
- Keep all new worktrees under `~/worktrees/<project>-worktree/<task-or-branch>/` on the machine doing the work. Use the main repository's stable folder name for `<project>`, even when starting from another worktree. Keep names readable; add a short repository identifier only if two different repositories would otherwise share that folder.
- Do not create worktree siblings directly under `~/code`, nest them inside the source checkout, or scatter them in `/tmp`. An explicit user-specified location takes precedence.
- Prefer T3's managed worktree tools when they support this location and layout. If the configured Worktree location or generated folder name differs, report that limitation before creating anything; do not silently choose a different path or use a shell checkout to bypass thread/workspace tracking.
- Leave existing worktrees, branches, uncommitted files, and saved application paths intact. This policy applies to new worktrees; moving or deleting existing worktrees requires the user's request.
