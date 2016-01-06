# NuFeeder (ALPHA)

The goal of NuFeeder is to help NuShares holders manage their voting in an easier way. Instead of changing votes manually on your Nu wallet you can connect your wallet to use your own personal NuFeeder repository as a datafeed. Then you can use the NuFeeder GUI to manage the votes. You will be able to manage your NuShares voting from anywhere that you have access to a web browser. This also makes it easier for users to become a data feed provider with minimal effort. NuFeeder runs entirely from github as a github page. It's also completely open source. 

## Usage

1. Fork this repository to your own github account

1. delete the delete.me file in the root of the repo. A push to the repo is required to trigger the github pages generation after it is forked. Deleting this file will trigger the page rendering. Only needs to be performed the first time.

1. Check that a github page was created for the forked repo (sometimes can take a few minutes after forking) `http://<YOUR-USERNAME>.github.io/NuFeeder`

1. login to NuFeeder by entering your github account information.

1. Set your votes and hit save to have them updated on github. 

1. Get the RAW url to the votes.json file that's in the root of the reposity. It will look like `https://raw.githubusercontent.com/CoinGame/NuFeeder/gh-pages/_data/votes.json`

1. Add this URL to your Nu wallet as a datafeed.

## Updating your branch with latest changes
for those that already forked it's fairly simple to update with my repo. go to your repo page:

`http://github.com/<your-username>/NuFeeder`

then add `/compare/gh-pages...CoinGame:gh-pages` to the end of the url:

`http://github.com/<your-username>/NuFeeder/compare/gh-pages...CoinGame:gh-pages`

Click the "create pull request" button (give it a title if you need to) then just merge the pull request into your repo. That will update your gh-pages branch with my latest gh-pages branch. The voting data shouldn't be affected, but you can see if it is in the pull request.


