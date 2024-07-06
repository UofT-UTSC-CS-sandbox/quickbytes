# QuickBytes


## Iteration 01


* Start date: May 23, 2024
* End date: June 13, 2024


## Process

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


#### Artifacts


We primarily rely on Jira to track our tasks. During each sprint, we select some user stories from the product backlog that we will work on for that sprint. We then assign them to team members using the assignment feature in Jira. Story prioritization and progress (TODO, In progress, etc.) are also done through the respective Jira tickets.


We also maintain some shared Google documents where we can collectively collaborate and document our progress before finalizing it in our Slack channel.




## Product


#### Goals and tasks


Our primary goal for this sprint is to lay the groundwork for the infrastructure required by our app. This includes setting up databases, frameworks/libraries, and ensuring the components are integrated together. With that complete, we begin development of some key user stories. We have selected a subset of stories that showcase some of the key features of the application as well as those that are foundational to its functioning. These include stories related to authentication (SCRUM-8, 26, 27), ordering (SCRUM-12, 25), and travel (SCRUM-5, 21, 23).


In decreasing priority, we will work on the following features:


1. User authentication and order handling
2. Location based features (setting order drop-off location, navigation to restaurant and customer)
3. Browsing restaurant menus


#### Artifacts


We will primarily showcase our features through our application frontend itself. We will have a page on our application responsible for showcasing each feature/group of related features through user interaction. The application will be running on one of the team member's machines but will be accessible from anywhere given the IP and port. Having our app itself serve as an artifact will give us a clear idea on how the final application will look and perform, allowing us the opportunity to make required changes to optimize the user experience.


We may also demonstrate some functionality through the database console to verify that the appropriate data is being modified/created by our app. This console is only accessible by individuals added to the project. The database console serves as an important artifact as it allows us to verify the correctness of our application logic as well as the efficiency of our data model.
