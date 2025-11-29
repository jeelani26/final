import React from 'react';
import { Alert, AlertTitle, IconButton, Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ConflictAlert = ({ conflict, onDismiss }) => {
    return (
        <Collapse in={!!conflict}>
            <Alert
                severity="error"
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={onDismiss}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{ mb: 2, borderRadius: '8px' }}
            >
                <AlertTitle>Schedule Conflict Detected</AlertTitle>
                {conflict?.message}
            </Alert>
        </Collapse>
    );
};

export default ConflictAlert;
