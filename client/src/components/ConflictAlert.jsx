import React from 'react';
import { Alert, AlertTitle, IconButton, Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ConflictAlert = ({ conflict, onDismiss }) => {
    // The 'in' prop on Collapse controls the visibility with a smooth animation.
    // The '!!conflict' syntax is a shortcut to convert the conflict object (or null) to a boolean (true/false).
    return (
        <Collapse in={!!conflict}>
            <Alert
                severity="error"
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={onDismiss} // This calls the function to hide the alert
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{ mb: 2, borderRadius: '8px' }}
            >
                <AlertTitle>Schedule Conflict Detected</AlertTitle>
                {/* We display the specific message received from the backend */}
                {conflict?.message}
            </Alert>
        </Collapse>
    );
};

export default ConflictAlert;