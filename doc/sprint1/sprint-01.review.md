# QuickBytes

 > _Note:_ This document is meant to be written during (or shortly after) your review meeting, which should happen fairly close to the due date.      
 >      
 > _Suggestion:_ Have your review meeting a day or two before the due date. This way you will have some time to go over (and edit) this document, and all team members should have a chance to make their contribution.

## Iteration 01 - Review & Retrospect

 * When: Saturday, June 15 at 11:00AM
 * Where: Online on Discord

## Process - Reflection

In iteration 01 of the QuickBytes project, our team focused on adopting agile methodologies, including Jira task management, scrum meetings, and pair programming to enhance collaboration and maintain high code quality. We summarize the insights made in sprint 1 and include what worked well and what we need to improve in the next sprint. Our aim is to continually improve our collaborative practices so that we can efficiently deliver a reliable product. 

#### Decisions that turned out well

List process-related (i.e. team organization) decisions that, in retrospect, turned out to be successful.

- Regular Scrum Meetings:
  - These short, regular meetings kept everyone in the loop and allowed us to quickly address any blockers. It ensured that team members were aware of each other's progress and any potential issues.
  - This practice enhanced team communication and coordination, since we often knew how far along each user story was so we knew when to start discussions around merging code or discussing how common issues would be handled.

- Using Jira for Task Management:
  - Utilizing Jira to keep track of tasks and issues throughout the sprint helped us to organize our work more effectively.
  - Our usage of Jira made it an easy place to view each person's assigned user stories. It was also another way to check the progress of others and judge how close we were to meeting goals before the sprint deadline. We also used it to mark which stories were ready for code review.
  - Jira Board: https://quick-bytes.atlassian.net/jira/software/projects/SCRUM/boards/1?atlOrigin=eyJpIjoiYTZlMGVmNmRiMjJhNDU4ZGFjZWJjYmRmY2M1MzQ0ZDUiLCJwIjoiaiJ9 

- Pair Programming:
  - Pair programming sessions were particularly effective for tackling complex coding tasks and improving code quality. 
  - Through short pair programming sessions, team members were able to assist others with challenging bugs such as internal server errors when interacting with backend endpoints and conflicting data modeling practices in our Firebase database. It also facilitated knowledge sharing among team members, with members more familiar with the tech stack able to suggest best practices and provide guidance in navigating the project directory. 

- Meeting with the Bridge founder:
  - Having regular meetings with our Bridge founder (Evan Davidson) helped us gain insight into his requirements/needs. We were also able to provide him with suggestions on other features and the technologies needed.
  - This collaboration ensured that we stayed aligned with business goals, and Evan helped us align as a team on functional requirements to be implemented by the end of term. For example, he was able to help us decide the best way to handle customer pick-ups in the app which would best suit users from both a usability and safety perspective.

#### Decisions that did not turn out as well as we hoped

List process-related (i.e. team organization) decisions that, in retrospect, were not as successful as you thought they would be.

- Underestimating Task Complexity:
  - We underestimated the complexity of certain tasks, which led to delays in work towards the end of the iteration. For example, we underestimated the changes required for a proper authentication system because we had assumed that an off-the-shelf solution would involve minimal code and refactoring. However, we instead encountered issues with setting up the system and it required some modification of existing code for proper integration https://github.com/UofT-UTSC-CS-sandbox/quickbytes/pull/10. Therefore, integration of other features into the authentication system will likely take longer than originally predicted going forward. This affected the overall completeness of some features.

- Late Start to Testing:
  - We delayed the start of our testing phase, which compressed the time available for thorough testing and bug fixing. This resulted in some issues being discovered late in the development cycle and also required us to apply fixes to resolve particularly problematic bugs, like https://github.com/UofT-UTSC-CS-sandbox/quickbytes/pull/9

#### Planned changes

List any process-related changes you are planning to make (if there are any):

- Code Review Meetings:
  - We plan to conduct regular code reviews to ensure that the codebase remains clean and maintainable. It also provided an opportunity for team members to learn from each other's coding practices.
  - Reason for Change: Regular code reviews will improve code quality and consistency.

- Early Testing Integration:
  - We plan to integrate testing earlier in the development cycle to ensure adequate time for identifying and fixing bugs.
  - Reason for Change: This will improve the overall quality of the product and reduce last-minute fixes.

- Code review and clean-up tickets
  - We plan on creating a new type of Jira issue dedicated for reviewing previously written code to identify opportunities to refactor for better readability and encourage better security practices



## Product - Review

#### Goals and/or tasks that were met/completed:

- Create an Account and Login page:
  - A customer/courier should be able to create an account so they can log in and make/take orders.
  - A customer should be able to log in, so they can begin using the app/have access to information associated with my account.
  - A customer/courier should be able to login so they can make/take orders.
  - Code Link: https://github.com/UofT-UTSC-CS-sandbox/quickbytes/tree/26-create_account_login
  - Localhost Link: http://localhost:5173/login

- Google Maps Integration: 
  - A courier should be able to view the location, directions, and ETA to the restaurant so they know how to travel there from their current location.
    - Code Link: https://github.com/UofT-UTSC-CS-sandbox/quickbytes/tree/21-courier_restaurant_directions
    - Localhost Link: http://localhost:5173/tracking
  - A courier should be able to view the location, directions, and ETA to the customer's pickup location so they know how to travel there from the restaurant.
    - Code Link: https://github.com/UofT-UTSC-CS-sandbox/quickbytes/tree/23-courier_customer_directions
    - Localhost Link: http://localhost:5173/user-page (click Toggle View button)
  - A customer should be able to set the pickup location of their order to meet with the courier at an agreed location.
    - Code Link: https://github.com/UofT-UTSC-CS-sandbox/quickbytes/tree/5-customer_set_pickup_location 
    - Localhost Link: http://localhost:5173/restaurant/6 (feature visible after clicking 'Set a Pick-up Location' after starting an order.)

- Allow Customers to Make an Order:
  - Create a restaurant menu for customers to browse and make an order.
  - Code Link: https://github.com/UofT-UTSC-CS-sandbox/quickbytes/tree/25-restaurant_menu_ordering
  - Localhost Link: http://localhost:5173/restaurant/6

#### Goals and/or tasks that were planned but not met/completed:

- Email Verification Notification:
  - A nicer UI change to notify users that they received an email verification when they create a new account.
  - This was pointed out in the sprint review meeting by the TA.

## Meeting Highlights

Going into the next iteration, our main insights are:

- Earlier Emphasis on Testing:
  - It is important to integrate testing into the development process from the beginning to ensure a higher quality product. This can include having code reviewers conduct more in-depth tests locally before approving pull requests and exploring libraries or GitHub actions for test automation options.

- Secure Handling of Sensitive Information:
  - Ensure that sensitive information like API keys is handled securely and not posted in remote repositories. Using tools like GitHub secrets for this purpose is a recommended practice.

- Earlier Emphasis on Documentation:
  - Ensure that team members agree on how data is stored in the database and retrieved by endpoints, by formally documenting these specifications and starting communication early.
