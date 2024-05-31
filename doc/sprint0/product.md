# Quick Bytes


### Q1: What are you planning to build?

We are building QuickBytes, a web application that facilitates on-campus food and beverage delivery. Students often complain of the inconvenience of having to interrupt their study sessions and pack up their belongings when they want to grab a quick snack or drink. Other students with a bit more time on their hands may be looking for opportunities to make some quick cash without the time and schedule commitments of a regular job. QuickBytes solves these problems by acting as a broker and connecting these students together. The busy student can log on to the QuickBytes web-app, select the desired on-campus vendor, and place an order for an item on their menu. The other student can now view and accept this order, pick it up from the vendor, and drop it off at the agreed upon location, earning a couple of bucks along the way for just making a detour on their usual route between classes. Students with special accessibility needs will especially find QuickBytes useful as it eliminates the need for them to navigate crowded areas or make extra trips, ensuring they can access refreshments conveniently and efficiently within the campus environment. Given the smaller scale of QuickBytes over other delivery services, delivery fees will be considerably lower than those of competitors, offering an affordable alternative for students. Moreover, administrators, restaurant workers, and campus security officials will welcome the reduced on-campus traffic and improved safety that will come as a result of relying on students to carry out deliveries, as opposed to strangers coming through other apps. By offering these services, QuickBytes will make the university campus a safer, more affordable, and less stressful place.


### Q2: Who are your target users? (2-3 personas)

Our target users are represented by four personas, which can be viewed in the personas.pdf file in this repository.

### Q3: Why would your users choose your product? What are they using today to solve their problem/need? 

Our Uber-like app designed exclusively for UTSC students addresses a unique set of needs and offers distinct advantages for our users. Let's delve into why our product fits the needs of UTSC students better than the current solutions available.

### Current Solutions and Their Limitations
Today, UTSC students primarily rely on the following methods to get food on campus:

- **Walking to On-Campus Restaurants:** This is time-consuming, especially during peak hours or bad weather.
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


### Q4: What does "DONE" means to your Team 


**Code Completeness**
- Code follows the standards and practices which the team agrees on.
- The feature passes at least one peer code review.

**Functionality**
- The feature meets the acceptance criteria in the user story.
- The functionality handles edge cases.

**Testing**
- Unit tests are created and pass.
- Unit tests account for edge cases.

**Documentation**
- User guides are updated.
- Technical documentation is updated. This includes comments in code and/or descriptions in GitHub pull requests and commits.

**Performance**
- Load testing (if applicable) has been done.

**Security**
- Data privacy requirements are met (if applicable), especially concerning user data.

**UI/UX**
- The features UI aspect meets the design specifications.
- Usability has been tested.
- The feature works on all supported devices and screen sizes.

**Deployment**
- The feature has been merged into the main branch without conflicts.
- The feature works in the staging environment.

**Approval**
- The founder has looked over and approved the feature.

**Post-Deployment**
- The feature is monitored post-deployment.
- Any post-deployment issues are logged and addressed.

The definition should be regularly revisited and updated.


## Highlights


A key business and app decision was whether external vendors would be allowed to sell on the application. Given that, from anecdotal experience, students might visit locations off campus for food options, it was originally expected that external vendors would be allowed to sell on the platform. By expanding the restaurant selection for students, we expected to draw in more  users and more closely replicate what traditional delivery apps would otherwise provide to students. However, after meeting with our Bridge co-founder, external vendors would initially not be able to access the app, due to the potential security and financial risks. Opening the app to these vendors would require them to comply with university guidelines, and may conflict with the business interests of current restaurants that operate on university property. This would also necessitate basic content moderation to ensure that restaurants and menu items are genuine and compliant. It would also increase the safety risks to students if couriers were to travel farther away from university property. These business risks were unacceptable given how early the application currently is.

A key user experience consideration that was discussed was user interface considerations for separating the customer and the courier experience. We identified that minimizing the barriers between the two roles was integral to good user experience and a solid business plan. Previously, an alternative was to feature two different login screens for both the customer and the courier views and include a separate account setup process for each role. This was too cumbersome, as we wanted our customers to more frequently consider being couriers for our service to ensure that there would be enough couriers for orders to be taken in a timely manner. Thus, we instead decided for the courier and customer separation to be limited to different pages on the website, which can be switched between at will. Customers that want to be couriers can do so by simply changing the page without additional registration, and they can customize their notifications based on whether they want to be couriers, customers or both. These decisions are reflected in our Figma design.

Another key decision was adding features to verify the identities of customers and couriers when food is exchanged. This refers to adding a mechanism whereby restaurant owners could verify that the courier picking up the food is indeed the courier assigned to that order and couriers could verify that the person they are handing off the food to is indeed the original customer. Previously, we did not consider such a system, because it did not seem necessary given that the workers, couriers and customers involved would be trusted members of the university community. However, further discussion with team members more familiar with Uber Eats and Doordash mentioned this as a feature in these apps, so adding these features would make the pickup and delivery process more familiar with users who have used these apps before. It would also give restaurants more piece of mind that the delivery was successfully fulfilled.

For team organization, we decided to use Jira to track user stories, not only because it is mandatory but also because it is standard within the software industry. For communication,  we decided to go with messaging on Slack and Discord. All members are able to take on roles as developers to work on user stories mostly independently, and members can tap other members for code reviews and help. Git was selected for version control, and guidelines for naming branches was given in README.md to ensure that changes are properly documented to track progress.

