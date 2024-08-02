# QuickBytes

## Iteration 03 - Review & Retrospect

 * When: August 3, 2024
 * Where: Online (Discord)

## Process - Reflection

At this point, our process has improved significantly since the intial sprint. We've ironed out some previous issues and now we are running quite smoothly.

#### Decisions that turned out well

1. Thorough documentation

    During this sprint, we have made a conscious effort to more thoroughly document our code, especially components that were worked on by numerous members. We really focused on doing this during this sprint as we had run into significant confusion and conflict during previous sprint when working on shared files. This could often result in members overwriting a crucial part of the file that they did not fully understand and that was not well documented. Also, there were some instances where members would re-implement functionality that was already implemented by another member, wasting signifcant time and causing conflicts. Now, we've made sure to document any parts of the code whose purpose or function may not be immediately obvious, as a result, we've had far fewer conflicts and we're far more efficient overall.
    
2. Decoupling Components

	During our earlier sprints, we had naively incorporated several components together that were used across the app (notably the mapping components required for tracking). This made these components quite cumbersome and difficult to maintain. It also introduces significant bugs that were difficult to locate and correct. So, in this sprint, we invested a considerable amount of time in refactoring these components and separating them into various files that each had a single responsibility and that could be resused wherever that functionality was required. This vastly improved the performance of the application and corrected many of the existing bugs. It also better adhered to SOLID design principles making the application much more maintainable.

#### Decisions that did not turn out as well as we hoped

1. Highly connected/inter-related tasks assigned to different members

    This sprint, we focused significantly on bug fixes and polishing the application. During the intial planning meeting we identified the various outstanding bugs and assigned each member a subset to resolve without considering their interconnectedness or dependencies. As a result, we found that numerous bug fixes were blocked by the by other bugs, requiring members to wait for on another. Moreover, some bug fixes would also directly resolve some other bugs that were assigned to other members, resulting in a duplication of work.

2. Keeping most bug fixes to the end

    As mentioned we dedicated most of this sprint to bug resolution as we had invested our previous sprints in implementing as many features as possible. This resulted in us deferring bug correction to the end in order to ensure we had at least a minimally functioning feature to demonstrate during the previous sprints. This also caused major bugs to build up to the end, and often, features would be implemented on top of buggy components, further complicating the bug resolution process. A more ideal approach would be to reduce the features implemented in previous sprints and invest more time in ensuring that what little features were implemented were implemented correctly. This would have shifted much of the bug correction work to earlier in the project and possibly reduced the complexity of the bug tackling process.

#### Planned changes

This is not quite applicable as this is the final sprint, but for future projects we will make sure to make the following adjustment:

1. Ensure implemented features are implemented fully and correctly before delivering and marking them as complete.

    This addresses point 2 in the previous section. Instead of rushing to complete a future as soon as possible, take more time to implement the feature properly and do not defer improvements and fixes to later on as they will pile up.

## Product - Review

#### Goals and/or tasks that were met/completed:

1. Overhauling the order tracking into separate, more robust fragments 
    - Artifact: The [customer order tracking page](../../app/frontend/src/pages/CustomerOrderTracking.tsx), [courier order tracking page](../../app/frontend/src/pages/CourierOrderTracking.tsx), and the [new map component](../../app/frontend/src/components/MasterMap.tsx)
2. Securing the backend through request authentication
    - Artifact: The [backend middleware](../../app/backend/middleware/)
3. Various backend fixes and improvements (e.g. preventing self-order acceptance, harmonizing schema across endpoints, etc.)
    - Artifact: The [backend controllers](../../app/backend/controllers/)
4. Numerous frontend refinments
    - Artifact: Spread across the application, notably the [landing page](../../app/frontend/src/pages/WelcomePage.tsx)

__NOTE__: Though there were only 4 main goals for this sprint, they each entailed signifanct work and subtasks. See Jira for a detailed breakdown.

#### Goals and/or tasks that were planned but not met/completed:

1. In app chat for communication between courier and customer

    The founder we are collaborating with preferred that we spend our efforts in making code improvements that would make the application more maintainable so that there would be fewer issues when he took it over. As a result, he suggest we keep the chat feature for later as it wasn't crucial at this point.

## Meeting Highlights

Although there is no subsequent sprint, we take the following insights to future projects

1. Invest time up-front in planning the development process, ensure that dependencies are identified, and don't skimp on bug correction and enhacement early in the process

    This primarily references decision 2 in the "Decisions that did not turn out well section". We should not sacrifice code quality for feature delivery.

2. Agree on documentation standards and ensure they are met at each stage in the development process.

    We initialy documented our code in early stages of the development but quickly neglected this as we got busier, we did manage to correct this during this final sprint (hence its inclusion in the first section) but we had to retroactively document already merged and approved code. For future projects, we should agree on a documenatation standard that we will adhere to throughout development and we should enforce this standard during code reviews. Code that does not meet documentation standard should be merged until it does.
