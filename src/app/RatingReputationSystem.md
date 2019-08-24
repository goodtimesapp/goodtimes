Rating and Reputatation System
=============================

Work in progress...

The Factors
-----------
R = rating (1-5):  1=bad, 2=below average 3=average 4=above average 5=good
T = Total number of rides
NRS = Non-Rated Score: the average score a user gets if they recieve no rating for an action (based on Regional Non-Rate Positive Score)


Actions
-------


Good Actions
------------


Bad Actions
------------



Classifications
-----------------


Regional Non-Rated Positive Score
-------------------------------
Each region should have a regionally calculated score for non-rated positive score. Alot of times people are too busy to 
leave a rating but the user should still be rewarded for the instance of the action. 
For example, in Africa the non-rated score might be 4.91 (maybe more people rate becasue of culture)
in Chicago it might be 4.8 (people are too busy to rate and in a bad mood becase its cold and pissed of)
in San Diego it might be 4.999 (people might be happy becuase of the sunny weather and give a better ratings)


Weight and Subjective Ratings
-----------------------------
The weight for a rated score =  ( 1 * (subjectiveWeightBasedOnCommentSentimentAndPastRatings) ) / 2
The weight for a non-rated score = .9

The resoning for a lower wieght on the non-rated score is that if a person takes time to rate somebody it should be worth more. 

The resonning for a "subjectiveWeightBasedOnCommentSentimentAndPastRatings" is if a collector put a dirty diaper in a bin they might rate the user a score of "1" with a comment of "dirty diaper in bin". A differnet collector might rate the user with a "2" and a different comment "bin with soiled diaper". The algothim normalized the score of "1" and "2" with sentiment analysis and classification of the comment text. So the actual score might be "1.5". This will help fix subjective ratings.


How to Prevent Reputation and Rewards Fraud
-------------------------------------------
Each region will have an observer (gov or alliance appointed) that can access a dashboard.  Data can be be mined to correlate suspicious activites. They could correlate if a collector colluded with a user and/or recyling center by seeing if the weight in plastic adds up properly when sold or recycled. All tracable by the blockchain if all actions and transfer of counterparty are recorded with the app properly.


Sample DataSets
----------------

Raw Data collected from app
| User | Rating |
| ---- | ------ |
1 | 5 
1 | 5 
1 | NA (computed to 4.99 for Chicago Region)


Computed data on the server
| User | Number of Rides |
| ---- | --------------- |
1 | 2


Final Rating
| User | Rating |
|------| ------ | 
1  | 4.9999


Articles
=========
- https://jkchu.com/2016/02/17/designing-and-implementing-a-ranking-algorithm/ 
- https://forum.blockstack.org/t/karma-exploration-of-a-decentralized-open-source-reputation-system-for-the-web/45/7
- https://gist.github.com/dionyziz/e3b296861175e0ebea4b
- https://medium.com/openbazaarproject/verified-moderators-c83ea2f2c7f3 
- https://openbazaar.org/blog/decentralized-reputation-in-openbazaar/ 

- zero-knowledge reputation systems
    - https://eprint.iacr.org/2016/416.pdf
    - https://eprint.iacr.org/2018/835.pdf 
    - http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.176.2309&rep=rep1&type=pdf
    - https://cs.nyu.edu/~lakshmi/Lakshmi/Pubs/Sybil%20Resilient%20Online%20Content%20Voting.pdf 


