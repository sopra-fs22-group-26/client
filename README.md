
<div align="center">
    <h2>SoPra FS22 - Group 26 Client</h2>
</div>
<p align="center">
<img src="https://github.com/sopra-fs22-group-26/client/blob/main/src/images/scrumblebee_logo_508x95.png?raw=true" width="508" height="95" />
</p>



# Scrumble(:bee:)
## Introduction
The idea of our project ScrumbleBee is to create an online task management system which encourages its users to complete their tasks by including gamification elements. In addition to the basic capabilities, like assigning users, due dates and comments to tasks, the members of ScrumbleBee can award points to each other for having successfully completed tasks - which peaks in a fiercely battle for the number one spot on the scoreboard!
. As this platform could also be used in a Scrum environment, we include an	 “Estimate Poll” widget, where the members can estimate the time needed to complete a task in real-time. By considering information from external sources like travel time to a location or dates of public holidays, time collisions should belong to the past, and a calendar export function allows the product to be integrated in your daily workflow.

## Technologies

- React: CSS, SCSS, JavaScript, HTML
- GitHub (Actions)
- Heroku
- REST API

## High-Level Components

The most important components are:
- [Dashboard](src/components/views/Dashboard.js)
- [Task](src/components/ui/Task.js) / [Task Creation](src/components/views/CreationForm.js)
- [Estimate Poll Session](src/components/views/SessionLobby.js)

After successful registration or login the user gets redirected to the main [dashboard](src/components/views/Dashboard.js). The dashboard keeps track of all open [tasks](src/components/ui/Task.js) - the heart of every task-management system! 
Upon creating a new task the user can set all kind of important informations like a description, location, assignee, reporter and a time estimate. It is also possible to comment on the tasks or to set it "private". A private task is only visible to the user who created it. 
If the time estimate is not clear to the creator, the [Estimate Poll Session](src/components/views/SessionLobby.js) comes into play.
Start a poll session, invite other users and decide together how long the task takes. Each user has a vote and in the end the average is set.


## Launch & Deployment

For your local development environment you'll need Node.js. You can download it [here](https://nodejs.org).

All other dependencies including React get installed with:

### `npm install`
**Hint**: _If you are using a modern IDE like Intellij it should automatically suggest `npm install` in a pop-up in the bottom right._

You have to run this command once before starting your application for the first time. Afterwards, start the application with:

### `npm run dev`
**Hint**: _In order to have complete access to all features make sure the server is running as well._

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### `npm run build`

This command builds the application for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance:

The build is minified and the filenames include the hashes.<br>

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Illustrations

### Dashboard
When a user is logged in they start on the following dashboard:
![Dashboard](https://github.com/sopra-fs22-group-26/client/blob/readMe-final/src/images/readme/Dashboard.PNG?raw=true)
So far there is only one task created.

### Create a task
The user can create a new task: 
![create a task](https://github.com/sopra-fs22-group-26/client/blob/readMe-final/src/images/readme/New_task.PNG?raw=true)
The assignee has to complete the task, while the reporter can rate the completed task in the end with 1-5 stars. Those ratings are reflected on the scoreboard.

### Detailed task view

After creation all users (if it is not private) can look at the task and even post a comment on it:
![Details](src/images/readme/TaskComment.PNG?raw=true)



## Roadmap
Potential improvements or extensions in the future may include:

- Implement a group feature, such that users are able to create and join subgroups. E.g. a user is part of a work group and part of a family group.
- Since ScrumbleBee is not a round-based game it is critical that you can log in with the same credentials everytime. A user doesn't want to lose all his scoreboard points just because they forgot the password. So a "Forgot Password" feature could be a next improvement.
- To further develope the calender integration, one could also connect a company or private calender to not only prevent national holiday conflicts but also personal or company ones.

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

## Authors & Acknowledement
>J. Zellweger, R. Hany, W. Chang & N. Mantzanas

>SoPra Team for the template and our TA T. Alakmeh

## License

Licensed under GNU General Public License v3.0
- See [License](LICENSE)





