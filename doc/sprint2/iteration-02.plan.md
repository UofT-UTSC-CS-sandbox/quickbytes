# QuickBytes


## Iteration 02


* Start date: June 23, 2024
* End date: July 6, 2024


## Process

We intend to spread our work evenly across members and throughout sprint, making incremental changes at a time while merging and testing often. Details of our development process follow.

#### Changes from previous iteration

The most significant change we've made since the previous iteration is the enforcement of an earlier deadline within our group. We have agreed that we would aim to complete all user stories at least 2 days prior to the actual deadline of June 5. We have made this change for two main reasons, first of all, it ensures we have ample time to commit to developing the other deliverables for the sprint that are not coding related (such as the documentation), by setting this earlier deadline, we can ensure that we give these components the time and effort they deserve. Second, finishing up the stories in advance affords us more time to merge together our work and ensure it is free from bugs and ready to demonstrate. We will gauge the success of this change through our grade, as well as TA feedback. We expect to be more prepared for our demo and should see this reflected in our grade. Also, we should see far less time spent on resolving conflicts and merging code owing to the improved organization of our process.


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

We have two main goals for this sprint. First, we wish to clean up the code from the previous sprint and ensure it is up to standard. This includes fixing up existing bugs and ensuring consistent standards and techniques across the app, for instance, SCRUM-29 was created to ensure uniform data fetching techniques throughout the app, SCRUM-34 generalizes the map component making it context aware and allowing it to be reused for various stories, and SCRUM-35 and SCRUM-36 fix some existing bugs. Second, we wish to implement some of the more advanced core functionality of the app that we did not get to before. This includes notifcation processing (SCRUM-9) and order management (SCRUM-12, 22, 7, 16, 6, 11, 17).

In decreasing priority, we will work on the following features:

1. Generalize map component, accepting deliveries, correcting refresh bug, updating order status (SCRUM-34, 12, 36, 7)
2. Live location tracking, fix user sign-up (SCURM-6, 11, 35)
3. Notification delivery, standardizing data fetch methods, order confirmation (SCRUM-9, 29, 16, 17)
4. Display all orders for restaurant (SCRUM-22)


#### Artifacts


As before we will primarily showcase our features through our application frontend itself. Unlike the previous sprint however, we intend to navigate most of the workflow through the app, rather than having separate disconnected pages. This will give us a better sense of the application as a whole as it will more closely mimic the end goal for the app. 

We may still demostrate some functionality through a database console to again ensure business logic is correct and data storage and modification is sound.