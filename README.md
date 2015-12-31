# NuFeeder (ALPHA)

The goal of NuFeeder is to help NuShares holders manage their voting in an easier way. Instead of changing votes manually on your Nu wallet you can connect your wallet to use your own personal NuFeeder repository as a datafeed. Then you can use the NuFeeder GUI to manage the votes. You will be able to manage your NuShares voting from anywhere that you have access to a web browser. This also makes it easier for users to become a data feed provider with minimal effort. NuFeeder runs entirely from github as a github page. It's also completely open source. 

## Usage

1. Fork this repository to your own github account

2. Check that a github page was created for the forked repo (sometimes can take a few minutes after forking) `http://<YOUR-USERNAME>.github.io/NuFeeder`

3. login to NuFeeder by entering your github account information.

4. Set your votes and hit save to have them updated on github. 

5. Get the RAW url to the votes.json file that's in the root of the reposity. It will look like `https://raw.githubusercontent.com/CoinGame/NuFeeder/gh-pages/votes.json`

6. Add this URL to your Nu wallet as a datafeed.
