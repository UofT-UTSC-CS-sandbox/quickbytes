# QuickBytes

## What are you planning to build?

We are building QuickBytes, a web application that facilitates on-campus food and beverage delivery. Students often complain of the inconvenience of having to interrupt their study sessions and pack up their belongings when they want to grab a quick snack or drink. Other students with a bit more time on their hands may be looking for opportunities to make some quick cash without the time and schedule commitments of a regular job. QuickBytes solves these problems by acting as a broker and connecting these students together. The busy student can log on to the QuickBytes web application, select the desired on-campus vendor, and place an order for an item on their menu. The other student can now view and accept this order, pick it up from the vendor, and drop it off at the agreed-upon location, finally earning a few dollars all while making a small detour from their usual route between classes. 

Students with special accessibility needs will especially find QuickBytes useful as it eliminates the need for them to navigate crowded areas or make extra trips, ensuring they can access refreshments conveniently and efficiently within the campus environment. Given the smaller scale of QuickBytes over other delivery services, delivery fees will be considerably lower than those of competitors, offering an affordable alternative for students. Moreover, administrators, restaurant workers, and campus security officials will welcome the reduced on-campus traffic and improved safety that will come as a result of relying on students to carry out deliveries, as opposed to strangers coming through other apps. By offering these services, QuickBytes will make the university campus a safer, more affordable, and less stressful place.


## Who are our target users?

The initial stages of the app's deployment would be limited to a single web application operating
for the University of Toronto Scarborough (UTSC) for all U of T students. This alone is quite a sizable market.
[Based on institutional data provided by the University](https://www.utsc.utoronto.ca/ipro/institutional-data), 
UTSC is estimated to have around 14200 undergraduate students in attendance, 
of which 12856 (91%) are enrolled full-time. In addition, UTSC has approximately 150 Masters students
and 91 PhD students are enrolled in UTSC graduate programs. 
Delivery operations will cover nearly the entire geographical footprint of UTSC, consisting of approximately 32
campus buildings spread across 303 acres of total area. This includes over 800 student resident spaces on campus.
The campus is also actively expanding, with the recent opening of Harmony Commons with over 700 further residence beds, as well
as the opening of the Retail and Parking Commons in 2027 [according to the Office of the Governing Council](https://governingcouncil.utoronto.ca/media/31497) and the ongoing construction of a new Health Sciences center.

In recent years, the wider market for food delivery has increased substantially. A 2024 Statista survey found that 50% of Canadian respondents ordered delivery using Uber Eats, with a similar percentage also using DoorDash. Statista estimates that Uber Eats, DoorDash and SkipTheDishes each had over 1 million downloads in Canada in 2022. [A 2024 paper by Gupta et al](https://www.sciencedirect.com/science/article/pii/S2211335524001815) found that in 2021, a survey revealed that 19.2% of Canadian respondents ordered using food delivery services in the past 7 days. Applied to the UTSC undergraduate population, a market penetration rate of even 19% would equate to over 2600 users for the application.

Additionally, our app will be used by workers at food establishments operating on UTSC property. [According to the university's food website](https://www.utsc.utoronto.ca/programs/utscfood/), 26 food and beverage entities operate here through agreements called "Food Partnerships".
At a glance, this includes large multinational franchises such as Starbucks, KFC and Subway, as well as smaller entities such as Fired Up Pizza Co and 1265 Bistro. Website design and rollout will have to consider the needs of users working at these establishments.

Based on this preliminary research, we created four personas which can be viewed in the [personas.pdf file in this repository.](doc/sprint0/personas.pdf).

## Why would your users choose your product? What are they using today to solve their problem/need? 

Our food delivery app designed exclusively for UTSC students addresses a unique set of needs and offers distinct advantages for students.

### Current Solutions and Their Limitations
Today, UTSC students primarily rely on the following methods to get food on campus:

- **Walking to On-Campus Restaurants:** This is time-consuming, especially during peak hours or bad weather. Although they may be able to order food online through apps, [such as the Transact Mobile App linkable to U of T accounts](https://www.utsc.utoronto.ca/food/mobile-app), they still must physically pick-up food themselves.
- **Off-Campus Food Delivery Services:** These services are often slower due to longer travel distances and non-student couriers unfamiliar with the campus layout.
- **Friends and Classmates:** Informal arrangements can be unreliable and inconvenient.

While these methods are functional, they lack the efficiency, reliability, and safety that our product provides.

### How Our Product Fits the Needs of UTSC Students

#### Exclusivity and Safety
- **Verified UTSC Students Only:** By restricting the app's usage to active UTSC students, we create a safer environment. Students can trust that their couriers are fellow students.

#### Convenience and Time Efficiency
- **On-Campus Focus:** Our app is designed specifically for on-campus restaurants and deliveries. This focus ensures that the entire process is streamlined and faster.
- **Faster Delivery:** Student couriers familiar with the campus can navigate efficiently, reducing delivery times significantly compared to off-campus services.
- **Anywhere on Campus:** Students can get their food delivered to any location on campus, be it the library, dorms, or study halls. This saves them the hassle of walking to get food, and it also means students can focus on their studies or activities without interruption.

#### Financial Benefits
- **Earning Opportunities for Students:** Our app provides a platform for students to earn extra money during their free time, creating a mutually beneficial ecosystem.
- **Lower Delivery Costs:** By utilizing student couriers, we can keep delivery costs lower than traditional delivery services.

#### Community Building
- **Student Interaction:** Our app fosters a sense of community by encouraging interactions among students. This can lead to a more connected and supportive campus environment.
- **Feedback and Improvement:** As a community-focused app, we can quickly adapt to the specific needs and preferences of UTSC students through regular feedback.


## What does "DONE" mean for our team?

A task, user story, or bug fix is considered "DONE" if it satisfies the following criteria:

**Code Completeness**
- Code follows the standards and practices which the team agrees on.
- The feature passes at least one peer code review. This will be done by another team member who will check for good coding practices and potential bugs.

**Functionality**
- The feature meets the acceptance criteria in the user story.
- The functionality should strive to account for edge cases.

**Testing**
- Some sort of testing (such as unit testing) should be created to cover the primary functionality added.
- Unit tests should strive to account for and test edge cases.

**Documentation**
- User guides are updated, such as a description of how someone should interact with a user-facing interface.
- Technical documentation is updated. This includes comments in code as well as descriptions in GitHub pull requests and commits. Additional information is in the project README.

**Performance**
- Load testing (if applicable) has been done.

**Security**
- Data privacy requirements are met (if applicable), especially concerning user data.

**UI/UX**
- The features UI aspect meets the design specifications.
- Usability has been tested.
- The feature works on all supported devices and screen sizes.

**Deployment**
- The feature has been merged into the develop/staging branch without conflicts.
- The feature works in the staging environment.
- The feature has been merged into the master/main branch without issue.

**Approval**
- The founder has looked over and approved the feature.

**Post-Deployment**
- The feature is monitored post-deployment.
- Any post-deployment issues are noted and addressed (e.g. bug fixes).

The definition should be regularly revisited and updated.

## Highlights

Through meetings with the development team and the Bridge founder, we gained several key insights that helped us to
determine the desired user functionality and business strategy for the web app.

A key decision was whether external vendors would be allowed to sell on the application. Given that, from anecdotal experience, students might visit locations off campus for food options, it was originally expected that external vendors would be allowed to sell on the platform. By expanding the restaurant selection for students, we expected to draw in more users and more closely replicate what traditional delivery apps would otherwise provide to students. However, after meeting with our Bridge founder, external vendors would initially not be able to access the app, due to the potential security and financial risks. Opening the app to these vendors would require them to comply with university guidelines, most notably the Food Operations Operating Principles provided by the university. This may also conflict with the business interests of current restaurants. It would also increase the safety risks to students if couriers were to travel farther away from university property. At this early stage, these business risks are unacceptable, so we decided to only support on-campus restaurants.

A key user experience consideration discussed was user interface considerations for separating the customer and the courier experience. We identified that minimizing the barriers between the two roles was integral to good user experience and a solid business plan. Previously, an alternative was to feature two different login screens for both the customer and the courier views and include a separate account setup process for each role. This approach would decouple the customer and courier functionalities, allowing us to simplify the new user experience based on what the user wants to sign-up for. For example, the two roles might need to accept different agreements or provide different pieces of personal information. However, this option was too cumbersome because we want our customers to more frequently consider being couriers for our service to ensure that there would be enough couriers for orders to be taken promptly. Thus, we instead decided for the courier and customer separation to be limited to different pages on the website, which can be switched between at will. Customers who want to be couriers can do so by simply changing the page without additional registration, and they can customize their notifications based on whether they want to be couriers, customers, or both. These decisions are reflected in our Figma design.   

Another key decision was adding features to verify the identities of customers and couriers when food is exchanged. This refers to adding a mechanism whereby restaurant owners could verify that the courier picking up the food is indeed the courier assigned to that order and couriers could verify that the person they are handing off the food to is indeed the original customer. Previously, we did not consider such a system, because it did not seem necessary given that the restaurant workers, couriers, and customers involved would be trusted members of the university community. It would also simplify the order process and reduce the number of steps needed for a courier to fulfill an order. However, further discussion with team members more familiar with Uber Eats and DoorDash mentioned this as a feature in these apps, so adding these features would make the pickup and delivery process more familiar to users who have used these apps before. It would also give restaurants more piece of mind that the delivery was successfully fulfilled, increasing user satisfaction and giving them a sense of control. From the customer's point of view, it also reduces the stress of locating your delivery, especially if multiple couriers are delivering to the same location.

For team organization, we decided to use Jira to track user stories, not only because it is mandatory but also because it is standard within the software industry. For communication, we will be using messaging on Slack and Discord, and email. All members are able to take on roles as developers to work on user stories mostly independently, and members can work with other members for code reviews and help. Git was selected for version control, and guidelines for naming branches was given in README.md to ensure that changes are properly documented to track progress. For Sprint 0, we met as a team three times and there were online messages exchanged between members almost daily. In the future, we expect to meet as a complete team with the Bridge founder at least once a week. Additional team meetings will be called as needed to start and wrap up different sprints.

