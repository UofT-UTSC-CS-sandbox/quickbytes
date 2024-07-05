# QuickBytes

## Iteration 02 - Review & Retrospect

 * When: July 4, 2024
 * Where: Online (Discord)

## Process - Reflection

With the experience from sprint 1 in hand, sprint 2 proceeded much more smoothly, though there is always room for improvement. 

#### Decisions that turned out well

1. Early submission
    
    Our group's decision to set a soft deadline a few days in advance of the true deadline worked out as intended. We were more efficient with our time and were able to spread our resources for the project more evenly throughout the sprint, rather than cramming at the last minute.  
2. Creating the new "Clean-up" ticket type in Jira and incorporating it into the sprint.

    Since the first sprint, we've added a "Clean-up" ticket type in our Jira group and created several tickets of this type, assigning two of them in sprint 2. This ticket type represents tasks that are not directly part of the application itself, nor will they likely be visible or known to a user, but that nonetheless improved our overall product by making it more maintainable in the future. For example, [SCRUM-29](https://quick-bytes.atlassian.net/browse/SCRUM-29?atlOrigin=eyJpIjoiMmJjNmRmNWExOWQ5NGIwZWE4NGMzZGJkNjQ0YzA0M2IiLCJwIjoiaiJ9) was created to refactor the various data fetching strategies across the application into a single consistent approach. This means that development of future features will be more streamlined as data access can be accomplished by imitating the already exisiting services, rather than having to navigate a complex and inconsistent architecture. 

#### Decisions that did not turn out as well as we hoped

1. Poor prioritization of tasks

We made some incorrect assumptions about the dependencies of tasks with respect to each other which lead to some inefficiency during our sprint. Notably, the data fetch ticket was one of the first to be completed, meaning that a significant refactor was done that impacted a large portion of the application while other features that depended on it were still being developed. This resulted in us having to refactor code on multiple branches rather on a single occassion as would be desired. Moreover, when more than a single PR was put up, there were some dependencies between them that required us to temporarily put the PR in draft while they were fixed which is not an ideal workflow. 

2. Incomplete acceptance criteria

Though we included acceptance criteria for every user story, the criteria was not thorough or exhaustive and was created prior to implementation when we had significantly less knowledge about how our project would shape out. This lead to us prematurely accepting stories when in reality there was still some work to be completed, meaning that we had to add follow up tickets to finish up the stories. 

#### Planned changes

1. Spend more time and effort in initial sprint planning meeting

Since both of our issues this sprint stemmed from improper planning, we wish to correct this in upcoming sprints by spending more time and effort in our initial sprint planning meeting and ensure we take more consideration when assigning priorities to tasks and perhaps consider modifying acceptance criteria that seems vauge. 

## Product - Review

#### Goals and/or tasks that were met/completed:

1. Order status updating
    - Artifact: The [order tracking page](../../app/frontend/src/pages/OrderTracking.tsx)
2. More versatile tracking map
    - Artifact: The [updated map component](../../app/frontend/src/components/DirectionsMap.tsx)
3. Courier delivery acceptance 
    - Artifact: The [delivery list page](../../app/frontend/src/pages/Deliveries.tsx)
4. Refresh bug fix
    - Artifact: Fixed [checkout page](../../app/frontend/src/components/CheckoutCart.tsx)
5. Standardized data fetch method
    - Artifact: The various data fetching services, for instance, the [tracking service](../../app/frontend/src/services/trackingService.ts)
6. Customer notifications
    - Artifact: Again, the [order tracking page](../../app/frontend/src/pages/OrderTracking.tsx)
7. Confirm courier via pin
    - Artifact: The [staff orders page](../../app/frontend/src/pages/StaffOrders.tsx)
9. Restaurant worker views orders
    - Artifact: Also in the [staff orders page](../../app/frontend/src/pages/StaffOrders.tsx)

#### Goals and/or tasks that were planned but not met/completed:

TODO

 * From most to least important.
 * For each goal/task, explain why it was not met/completed.      
   e.g. Did you change your mind, or did you just not get to it yet?

## Meeting Highlights

1. Invest more time in our planning stages and get more acquainted with each of the stories and how they relate and depend on each other. Leverage our experience from these past two sprints to produce more comprehensive and accurate priorities, dependencies, and acceptance criteria for our various tasks. Adhere to the prioritization set out in the tickets and ensure and blocking tickets are closed first. 

2. Enhance communication between members. Rather than only consulting teammates when a conlfict is encountered or a PR is ready, members should consistently communicate with each other and keep each other up to date as soon as any signifcant or notable developments arise. Standups should not be the only time when information is shared between members.
