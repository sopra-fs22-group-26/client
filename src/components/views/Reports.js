import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {isInCurrentWeek} from 'helpers/dateFuncs';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {Button} from "components/ui/Button";
import {Task} from "components/ui/Task";
import {EstimateTotals} from "components/ui/EstimateTotals";
import {LeftMenuItems} from "models/LeftMenuItems";
import {PollSessionMonitor} from "components/ui/PollSessionMonitor";
import 'styles/views/Dashboard.scss';
import 'styles/ui/LeftMenu.scss';
import React from "react";
import {Helper} from "../ui/Helper";


const MenuSection = props => {
    // Generate section with corresponding menu items
    let menuSection = [];
    let menuItems = LeftMenuItems[props.section];
    for (const item in menuItems){
        menuSection.push(props.state === menuItems[item] ?
            (<li className="selected">{menuItems[item]}</li>)
            :(<li onClick={() => props.clickAction(menuItems[item])}>{menuItems[item]}</li>));
    }
    return (
        <div>
            <h3>{props.name}</h3>
            <ul>
                {menuSection}
            </ul>
        </div>
    );
};

const Reports = () => {
    const history = useHistory();
    const [tasks, setTasks] = useState(null);
    const [users, setUsers] = useState(null);

    /**
     * Filters and sorts
     */
    const [show, setShow] = useState(LeftMenuItems.ReportsShow.Open);
    const [sort, setSort] = useState(LeftMenuItems.ReportsSort.DueDate);
    const [estimate, setEstimate] = useState({currentWeek: 0, total: 0});

    useEffect(() => {

        const prioritySortOrder = ["HIGH", "MEDIUM", "LOW", "NONE"];

        async function fetchData() {

            try {
                // Get all users and relevant tasks and store them temporarily.
                // We only need tasks related to the current user.
                let [r_tasks, r_users, r_assignedTasks] =
                    await Promise.all([
                        api.get(`/tasks/reporter/${localStorage.getItem("id")}`),
                        api.get('/users'),
                        api.get(`/tasks/assignee/${localStorage.getItem("id")}`)]);

                // Replace all assignee and reporter ids with users' names or usernames
                let users = r_users.data;
                let userArray = users.map(user => [user.id, (user.name ? user.name : user.username)]);
                const userDictionary = Object.fromEntries(userArray);

                let tasks = r_tasks.data;
                tasks.forEach(task => task.assignee_name = task.assignee ? userDictionary[task.assignee] : null);
                tasks.forEach(task => task.reporter_name = task.reporter ? userDictionary[task.reporter] : null);

                // Calculate Total Estimates for current user
                let estimates = {currentWeek: 0, total: 0};
                estimates.total = r_assignedTasks.data.reduce((acc, t) => acc + t.estimate, 0);
                estimates.currentWeek = r_assignedTasks.data.filter(t => isInCurrentWeek(new Date(t.dueDate))).reduce((acc, t) => acc + t.estimate, 0);
                setEstimate(estimates);

                // Apply filter and sorts

                /**
                 * Filter tasks according to the current show state
                 */
                switch (show) {
                    case LeftMenuItems.ReportsShow.Open:
                        tasks = tasks.filter(task => task.status === "COMPLETED");
                        break;
                    case LeftMenuItems.ReportsShow.Upcoming:
                        tasks = tasks.filter(task => task.status === "ACTIVE");
                        break;
                    case LeftMenuItems.ReportsShow.Finished:
                        tasks = tasks.filter(task => task.status === "REPORTED");
                        break;
                    default:
                        // do nothing
                }

                /**
                 * Sort tasks according to the current sort state
                 */
                switch (sort) {
                    // Sort by DueDate
                    case LeftMenuItems.ReportsSort.DueDate:
                        tasks = tasks.sort((a, b) => {
                            if (a.dueDate === b.dueDate) {
                                return prioritySortOrder.indexOf(a.priority) - prioritySortOrder.indexOf(b.priority);
                            }
                            else {
                                return a.dueDate > b.dueDate ? 1 : -1;
                            }
                        });
                        break;

                    // Sort by Priority
                    case LeftMenuItems.ReportsSort.Priority:
                        tasks = tasks.sort((a, b) => {
                            if (a.priority === b.priority) {
                                return a.dueDate > b.dueDate ? 1 : -1;
                            }
                            else {
                                return prioritySortOrder.indexOf(a.priority) - prioritySortOrder.indexOf(b.priority);
                            }
                        });
                        break;

                    // Sort by Title
                    case LeftMenuItems.ReportsSort.Title:
                        tasks = tasks.sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1);
                        break;

                    // Sort by Assignee
                    case LeftMenuItems.ReportsSort.Assignee:
                        tasks = tasks.sort((a, b) => {
                            if (a.assignee_name) {
                                return (b.assignee_name && a.assignee_name.toLowerCase() > b.assignee_name.toLowerCase()) ? 1 : -1;
                            }
                            else {
                                return 1;
                            }
                        });
                        break;

                    default:
                    // do nothing
                }

                // Get the returned tasks and update the state.
                setTasks(tasks);
                setUsers(users);

                // See here to get more data.
                console.log(r_tasks);
                console.log(r_users);
            } catch (error) {
                console.error(`Something went wrong while fetching the tasks: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the tasks! See the console for details.");
            }
        }
        fetchData();

        // Update data regularly
        const interval = setInterval(()=>{
            fetchData()
        },2999);
        return() => clearInterval(interval);

    }, [show, sort]);

    // Create content
    let content = <div className="nothing">--- no tasks for current view ---</div>;

    if (tasks && tasks.length > 0 && users) {
        content = tasks.map(task => (
            <Task props={task} key={task.id} />
        ));
    }

    /**
     * Combine contents and display reports dashboard
     */
    return (
        <BaseContainer>
            <div className="base-container left-frame">
                <div className="left-menu">
                    <MenuSection
                        name="Show"
                        section="ReportsShow"
                        state={show}
                        clickAction={setShow}
                    />
                    <MenuSection
                        name="Sort"
                        section="ReportsSort"
                        state={sort}
                        clickAction={setSort}
                    />
                    <Helper topic="reports" />
                </div>
            </div>
            <div className="base-container main-frame">
                <div className="dashboard task-area">
                    {content}
                </div>
            </div>
            <div className="base-container right-frame">
                <PollSessionMonitor />
                <EstimateTotals
                    currentWeek={estimate.currentWeek}
                    total={estimate.total}
                />
                <Button
                    onClick = { () => history.push('/creationform')}
                >
                    Create new task
                </Button>
            </div>
        </BaseContainer>
    );
}

export default Reports;
