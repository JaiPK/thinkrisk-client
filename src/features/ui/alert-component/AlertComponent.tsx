import { AlertColor, Snackbar } from "@mui/material";

export interface Props {
    openAlert: boolean;
    handleClose(): any;
    handleOpen?(): any;
    message: string;
    severity?: AlertColor | undefined;
    key?: string;
    vertical?: any;
    horizontal?: any;
}

const AlertComponent = (props: Props) => {
    const { openAlert, handleClose, message, vertical, horizontal} =
        props;

    // const action = (
    //     <React.Fragment>
    //         <IconButton
    //             size="small"
    //             aria-label="close"
    //             color="inherit"
    //             onClick={handleClose}
    //         >
    //             <CloseIcon fontSize="small" />
    //         </IconButton>
    //     </React.Fragment>
    // );

    return (
        <Snackbar
            open={openAlert}
            autoHideDuration={2000}
            onClose={handleClose}
            anchorOrigin={{ vertical, horizontal }}
            message={message}
            // action={action}
        />
        // <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        //   {message}
        // </Alert>
            
    );
};

export default AlertComponent;
