# QuickBytes


## Iteration 04


* Start date: July 19, 2024
* End date: August 2, 2024


## Process

Our overall process remains largely unchanged from sprint 2 seeing as it went quite smoothly.
Here it is again from `iteration 02` for convenience:  

> We intend to spread our work evenly across members and throughout sprint, making incremental changes at a time while merging and testing often. Details of our development process follow.

There are some minor changes we intend to make that are summarized in the following section.

#### Changes from previous iteration

1. More thorough issue documentation

During our previous sprints, our issues were not as well documented as we would have liked. They consisted mainly of the acceptance criteria and little else. As a result, there were often ambiguities in the issue requirements that required us to meet in order to resolve them. This was inefficient as it had used up member time that could have otherwise been used for development. Also, some dependencies/blockers of issues were not mentioned on the tickets which lead us to incorrectly start issues that were actually blocked. To resolve this, we will add detailed tasks and requirments to each ticket in addition to the acceptance criteria. Also, we will use the Jira "linked issue" feature to more thoroughly identify dependencies.
    
    

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

We have essentially completed all the primary features of our application in previous sprints. For this sprint, we finish some extra features related to notifications and customer-courier communication but we mainly focus on bug fixes and code improvements.

The features to be implemented in decreasing priority are:

1. Customer-courier communication via chat (SCRUM-10)
2. New order notifications (SCRUM-18, 19)

And we have plenty of fix and clean up tasks as well:

1. Securing endpoints with authentication (SCRUM-49)
2. Refactoring the order tracking page for different roles (SCRUM-54)
3. Add favicon and tab titles for app (SCRUM-55)
4. Enforcing access restriction on order retreivals (SCRUM-51)
5. Remove ability for customer to accept their own order as a courier (SCRUM-53)
6. Courier GPS navigation (SCRUM-63)
7. Refactor the landing page (SCRUM-61)
8. Database field, endpoint, and status code consistency (SCRUM-59, 60, 58, 56)
9. Add default user settings on registration (SCRUM-57)
10. Consistent page redirection on succesful order (SCRUM-52)

#### Artifacts

_Our artifacts remain unchanged_

As before we will primarily showcase our features through our application frontend itself. Unlike the previous sprint however, we intend to navigate most of the workflow through the app, rather than having separate disconnected pages. This will give us a better sense of the application as a whole as it will more closely mimic the end goal for the app. 

We may still demostrate some functionality through a database console to again ensure business logic is correct and data storage and modification is sound.