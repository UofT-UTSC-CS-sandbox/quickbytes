# QuickBytes


## Iteration 03


* Start date: July 6, 2024
* End date: July 19, 2024


## Process

Our overall process remains largely unchanged from sprint 2 seeing as it went quite smoothly.
Here it is again from `iteration 02` for convenience:  

> We intend to spread our work evenly across members and throughout sprint, making incremental changes at a time while merging and testing often. Details of our development process follow.

There are some minor changes we intend to make that are summarized in the following section.

#### Changes from previous iteration

1. Improved responsibility assignment
    
    One issue we faced during the previous sprint was that after approval, some PRs were not being merged into the destination branch despite being ready. This lead to some ineffciency where several already reviewed and approved PRs were just waiting to be merged, and they ended up accumulating in our repo. As a result, when we did go to merge them, they would introduce merge conflicts with other PRs that were also already approved, as a result, a conflicted PR could have been marked as approved which is contrary to our process of only approving PRs without any conflicts. This issue also extended to Jira where completed tasks would remain in the "in-progress" column despite being in review or completed. These issues stemmed from team members being unclear about whose responsibility it is to complete certain tasks such as cleaning up PRs and tickets. We will better communicate the roles of individuals taking part in each step of the PR. The final member who approves a PR will be responsible for merging it into develop and moving the corresponding ticket to complete. The merge should occur immediately after approval to prevent merge conflicts from building up across the repo. Also, whenever a member puts up a PR, they should put the corresponding ticket into the "in-review" column. 

_The remainder of the Process section remains unchanged_

#### Roles & responsibilities
- SCRUM Master
    - Organizes standups and coordinates between other team members to ensure smooth and efficient operation
- Developers
    - Develop the user stories in line with requirements, review pull requests, and collaborate together to deliver the functions of the app
- BRIDGE Founder
    - Identifies the goals and functions of the application, provides logistical support for tools and billings


#### Events
- Standups
    - Frequency: Every other day
    - Location: online (Discord)
    - Purpose: Summarize progress since previous standup, plan goals for next standup, identify blockers
- BRIDGE Founder Meeting
    - Frequency: Weekly
    - Location: online (Zoom)
    - Purpose: Ensure goals, vision, and timeline align with founder's
- Demo Dry-Run
    - Frequency: Prior to each demo
    - Location: online (Discord)
    - Purpose: Plan and practice demo
- Sprint Review
    - Frequency: At the end of every sprint
    - Location: online (Discord)
    - Purpose: Reflect on the previous sprint and make adjustments in preparation for next sprint

#### Git / GitHub workflow

We follow the Git Flow convention to organize our work. Specifically, we have one main branch that is protected and that will hold our most up to date working version of our application. This is the code that will be shown during demos with the TA. Next, we have a develop branch that is branched off of main, here is where all the work, development, and testing will occur. For each story or bug fix, we will have a seperate branch responsible for resolving it, these feature branches will follow the naming convention `ticketNum-short_description`. When a feature/fix is ready and has been thoroughly tested by the assigned developer, a pull request from that branch into develop is made. The format of pull request is outlined in our project's `README`. A pull request requires 2 approvals before being merged, any team member (apart from the author of the request of course) may review and approve a PR. They may also leave comments for improvement that should be pushed to the same branch. When two approvals are attained, the final reviewer is responsible for completing the merge. At the end of each sprint, a group member should create a final PR from develop into main.

We follow this convention as it ensures smooth operation between teammates with minimal additional overhead for things like managing conflicts, etc. By having a separate branch for each feature, developers can work individually and only have to worry about their portion of the work, conflict resolution only needs to be done at the time of merging into develop. Moreover, by having a develop branch separate from our main branch, we can ensure that we always have a functioning version of the application that we can revert to in the worst case if something goes wrong. Finally, by requiring two other members to review a PR, we can potentially catch some errors or issues that the author may have missed and can offer different perspectives and suggestions for improvement. 


#### Artifacts


We primarily rely on Jira to track our tasks. During each sprint, we select some user stories from the product backlog that we will work on for that sprint. We then assign them to team members using the assignment feature in Jira. Story prioritization and progress (TODO, In progress, etc.) are also done through the respective Jira tickets.


We also maintain some shared Google documents where we can collectively collaborate and document our progress before finalizing it in our Slack channel.




## Product


#### Goals and tasks

We are approaching the tail end of the project so we are completing some more features in our application and focusing on polishing some of the already existing features.

In decreasing order of priority, new features are:

1. Customer updates pick up location after ordering (SCRUM-13)
2. Customer views active order (SCRUM-39)
3. Courier views active deliveries (SCRUM-40)
4. Cancelling an in progress order (SCRUM-14, 15)
5. Restaurant worker receives notification on courier arrival (SCRUM-20)
6. Notification setting changes (SCRUM-28)

And the following clean-up/fix tasks, also in decreasing priority:

1. Allow customer to have multiple orders (SCRUM-37)
2. Page re-direction upon login (SCRUM-33)
3. Refactor extra components into already existing ones (SCRUM-41)
4. Improve delivery list to show supplementary info (SCRUM-38)


#### Artifacts

_Our artifacts remain unchanged_

As before we will primarily showcase our features through our application frontend itself. Unlike the previous sprint however, we intend to navigate most of the workflow through the app, rather than having separate disconnected pages. This will give us a better sense of the application as a whole as it will more closely mimic the end goal for the app. 

We may still demostrate some functionality through a database console to again ensure business logic is correct and data storage and modification is sound.