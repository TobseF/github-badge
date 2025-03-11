# 🎫 GitHub Repository Counter Badge
This is a GitHub-Badge SVG graphic which shows the number of repository of a user.
The counter gets automatically updated by a [GitHub CI workflow](https://resources.github.com/ci-cd/).

![github-repo-count](https://raw.githubusercontent.com/TobseF/github-badge/master/github-repo-count.svg)

## ⭐ Features
 ⭐ Customizable  
 ⭐ SVG graphic  
 ⭐ Always up-to-date  
 ⭐ Image hosted by GitHub  
 ⭐ Git-based stats history  
 ⭐ No API key is needed

## 📖 How it works
This `update-badge-script.js` [Node.js](https://nodejs.org/en/) script reads 
the [GitHub user API](https://docs.github.com/en/rest/users/users)
and writes the badge stats into an SVG template file (`github-repo-count-template.svg`).
If the generated badge is newer then the file in the repository, it
commits the new generated `github-repo-count.svg` to this GIT repository.
The pipeline gets triggered by a cron job, which automatically updates the image every midnight.

You can link the generated file by:  
https://raw.githubusercontent.com/$userName$/github-badge/master/github-repo-count.svg (replace `$userName$`)

## 🛠 Config
The script can be configured to generate a badge for any user:
* `userName`: Your username on GitHub.  
   Example url: https://github.com/TobseF  
   `userName` = `TobseF`
* `cron`: You can change the update time interval in the `.github/workflows/main.yml`:  
   On Line 6:  
   `- cron: '0 0 * * *'` (every day at midnight).
   Uses the [cron-job syntax](https://crontab.guru/every-midnight).

