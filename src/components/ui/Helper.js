import React from "react";
import {Button} from "./Button";
import {Box, Dialog, DialogContent, DialogTitle, Typography} from "@material-ui/core";
//import 'styles/ui/Helper.scss';

export const Helper = () => {
    let instructionText ="On the first sight, ScrumbleBee can be confusing.\n " +
        "This short description should help you get started – after that you will navigate through the app like a bee!\n \n" +
        "On the RIGHT hand side you can create a new task, see your overall work estimate for the week and have a look at pending or already running Poll sessions.\n"+
        "\n" +
        "In the MIDDLE you have have an overview of all the tasks. If you switch to reports, only tasks are displayed which are completed and need to be rated by you.\n" +
        "\n" +
        "On the LEFT hand side you have some filtering options:\n" +
        "  - Show: what tasks should be shown? Open tasks or completed tasks?\n" +
        " - Filter: Should all tasks be displayed or only my tasks?\n" +
        " - Sort: here you can sort the tasks according to the five attributes available\n" +
        "\n Hopefully that was useful!"

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
            <Button onClick={handleOpen}>Help ?</Button>
            <Dialog maxWidth="md"
                    fullWidth={true}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="help-dialog"
            >
                <Box position="absolut" top={0} right={0}>
                    <DialogTitle>ScrumbleBee Instructions</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" style={{whiteSpace: "pre-line"}}>{instructionText}</Typography>
                    </DialogContent>
                </Box>
            </Dialog>
        </div>
    );
}
