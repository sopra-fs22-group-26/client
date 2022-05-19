import React from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {ScrumbleButton} from "./ScrumbleButton";
import 'styles/ui/Helper.scss';

/**
 * Define all helper texts
 */

let instructionTaskOverview = (
    <div className="scrumblebee-help-content">
        <p>On the first sight, ScrumbleBee can be confusing.<br/>
            This short description should help you get started – after that you will navigate
            through the app like a bee!</p>
        <p>On the RIGHT hand side you can create a new task, see your overall work estimate for the week
            and have a look at pending or already running Poll sessions.</p>
        <p>In the MIDDLE you have an overview of all the tasks. If you switch to reports, only tasks
            are displayed which are completed and need to be rated by you.</p>
        <p className="list-title">On the LEFT hand side you have some filtering options:</p>
        <ul>
            <li>Show: what tasks should be shown? Open tasks or completed tasks?</li>
            <li>Filter: Should all tasks be displayed or only my tasks?</li>
            <li>Sort: here you can sort the tasks according to the five attributes available</li>
        </ul>
        <p>Hopefully that was useful!</p>
    </div>
);


let instructionReports = (
    <div className="scrumblebee-help-content">
        <p>On the first sight, ScrumbleBee can be confusing.<br/>
            This short description should help you get started – after that you will navigate
            through the app like a bee!</p>
        <p>On the RIGHT hand side you can create a new task, see your overall work estimate for the week
            and have a look at pending or already running Poll sessions.</p>
        <p>In the MIDDLE you have an overview of all the tasks which are completed and need to be rated by you.
            If you switch to the dashboard, you will see all tasks.</p>
        <p className="list-title">On the LEFT hand side you have some filtering options:</p>
        <ul>
            <li>Show:
                <ul>
                    <li>Open => Completed tasks that need a rating</li>
                    <li>Upcoming => Task you will have to rate in the future, but that are not completed yet</li>
                    <li>Finished => Tasks you have already rated.</li>
                </ul>
            </li>
            <li>Sort: here you can sort the tasks according to the four attributes available</li>
        </ul>
        <p>Hopefully that was useful!</p>
    </div>
);


/**
 * Create and export component
 * @returns {JSX.Element}
 */
export const Helper = (props) => {

    let instructionText;

    switch (props.topic) {
        case "dashboard":
            instructionText = instructionTaskOverview;
            break;
        case "reports":
            instructionText = instructionReports;
            break;
        default:
            instructionText = instructionTaskOverview;
    }

    //generate pop-up instructions if button is pressed
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div>
            <ScrumbleButton
                type="help"
                className="medium"
                onClick={handleOpen}
            />

            <Dialog maxWidth="md"
                    fullWidth={true}
                    scroll="paper"
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="scrumblebee-help-title"
                    aria-describedby="modal-modal-description"
                    className="help-dialog"
            >
                <Box position="absolut" top={0} right={0}>
                    <DialogTitle id="scrumblebee-help-title">
                        <span className="brand">ScrumbleBee</span> Instructions
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 12,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography style={{whiteSpace: "pre-line"}}>
                            {instructionText}
                        </Typography>
                    </DialogContent>
                </Box>
            </Dialog>
        </div>
    );
}
