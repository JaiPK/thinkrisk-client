import { ActionButton } from '../models/workFlowItems';

export const glWorkFlow = (
    reviewStatusId: number,
    subrStatusId: number,
    roleId: number,
    userId: number,
    assignedBy: number,
    assignedTo: number
) => {
    // console.log('reviewStatusId:', reviewStatusId);
    // console.log('roleId:', roleId);
    // console.log('userId:', userId);
    // console.log('assignedBy:', assignedBy);
    // console.log('assignedTo:', assignedTo);
    var buttons: ActionButton[] = [];

    switch (reviewStatusId) {
        case 1:
            // console.log("case 1");
            buttons = [];
            if ([2].includes(roleId)) {
                // console.log("user has permission");

                buttons = [
                    { show: true, disabled: true, text: 'Close Issue' },
                    { show: true, disabled: true, text: 'Assign Task' },
                ];
            }

            break;
        case 2:
            // if([1,2,3,4,5].includes(roleId)){
            //     console.log("user has permission");
            // }
            if(subrStatusId === 4){
                if (assignedBy === userId || assignedTo === userId) {
                    if (assignedTo === userId) {
                        switch (roleId) {
                            case 2:
                                buttons = [
                                    {
                                        show: true,
                                        disabled: false,
                                        text: 'Close Issue',
                                    },
                                    {
                                        show: true,
                                        disabled: false,
                                        text: 'Assign Task',
                                    },
                                ];
                                break;
                            case 3:
                                buttons = [
                                    {
                                        show: true,
                                        disabled: false,
                                        text: 'Recommend to Closure',
                                    },
                                    {
                                        show: true,
                                        disabled: false,
                                        text: 'Assign Task',
                                    },
                                ];
                                break;
                            case 4:
                                buttons = [
                                    { show: true, disabled: false, text: 'Send to Manager' },
                                    { show: true, disabled: false, text: 'Assign Task' },
                                ];
                                break;
                            case 5:
                                buttons = [
                                    { show: true, disabled: false, text: 'Send to Manager' },
                                ];
                                break;
                            default:
                                break;
                        }
                    }
                    else if (assignedBy === userId) {
                        switch(roleId){
                            case 2:
                                buttons = [{ show: true, disabled: false, text: 'Recall' }];
                                break;
                            case 3:
                                buttons = [{ show: true, disabled: false, text: 'Recall' }];
                                break;
                            case 4:
                                buttons = [{ show: true, disabled: false, text: 'Recall' }];
                                break;
                            case 5: 
                            buttons = [
                                { show: true, disabled: true, text: 'Sent to Manager' },
                        ];
                        break;
                            default: break;
                        }
                        // buttons = [
                        //     { show: true, disabled: false, text: 'Recall' },
                        //     { show: true, disabled: true, text: 'Assign Task' },
                        // ];
                    }
                    
                }
            }
            if(subrStatusId === 3){
                if (assignedBy === userId || assignedTo === userId) {
                    if (assignedTo === userId) {
                        switch (roleId) {
                            case 2:
                                buttons = [
                                    {
                                        show: true,
                                        disabled: false,
                                        text: 'Close Issue',
                                    },
                                    {
                                        show: true,
                                        disabled: false,
                                        text: 'Assign Task',
                                    },
                                ];
                                break;
                            case 3:
                                buttons = [
                                    {
                                        show: true,
                                        disabled: false,
                                        text: 'Recommend to Closure',
                                    },
                                    {
                                        show: true,
                                        disabled: false,
                                        text: 'Assign Task',
                                    },
                                ];
                                break;
                            case 4:
                                buttons = [
                                    { show: true, disabled: false, text: 'Send to Manager' },
                                    { show: true, disabled: false, text: 'Assign Task' },
                                ];
                                break;
                            case 5:
                                buttons = [
                                    { show: true, disabled: false, text: 'Send to Manager' },
                                ];
                                break;
                            default:
                                break;
                        }
                    } else if (assignedBy === userId) {
                        switch(roleId){
                            case 3:
                                buttons = [
                                    { show: true, disabled: true, text: 'Recommended to Closure'},
                            ];
                            break;
                            case 4:
                                buttons = [
                                    { show: true, disabled: true, text: 'Sent to Manager' },
                            ];
                            break;
                            case 5: 
                            buttons = [
                                { show: true, disabled: true, text: 'Sent to Manager' },
                        ];
                        break;
                            default: break;
                        }
                        // buttons = [
                        //     { show: true, disabled: false, text: 'Recall' },
                        //     { show: true, disabled: true, text: 'Assign Task' },
                        // ];
                    }
                    
                }
            }
            // console.log('case 2 buttons send:', buttons);
            break;
        default:
            buttons = [];
            break;
    }
    return buttons;
};

export const apWorkFlow = (
    reviewStatusId: number,
    subrStatusId: number,
    roleId: number,
    userId: number,
    assignedBy: number,
    assignedTo: number
) => {
    // console.log('reviewStatusId:', reviewStatusId);
    // console.log('roleId:', roleId);
    // console.log('userId:', userId);
    // console.log('assignedBy:', assignedBy);
    // console.log('assignedTo:', assignedTo);
    var buttons: ActionButton[] = [];

    switch (reviewStatusId) {
        case 1:
            // console.log("case 1");
            buttons = [];
            if ([2].includes(roleId)) {
                // console.log("user has permission");

                buttons = [
                    { show: true, disabled: true, text: 'Close Issue' },
                    { show: true, disabled: true, text: 'Assign Task' },
                ];
            }

            break;
        case 2:
            // if([1,2,3,4,5].includes(roleId)){
            //     console.log("user has permission");
            // }
            if(subrStatusId === 4){
                if (assignedBy === userId || assignedTo === userId) {
                    if (assignedTo === userId) {
                        switch (roleId) {
                            case 2:
                                buttons = [
                                    {
                                        show: true,
                                        disabled: false,
                                        text: 'Close Issue',
                                    },
                                    {
                                        show: true,
                                        disabled: false,
                                        text: 'Assign Task',
                                    },
                                ];
                                break;
                            case 3:
                                buttons = [
                                    {
                                        show: true,
                                        disabled: false,
                                        text: 'Recommend to Closure',
                                    },
                                    {
                                        show: true,
                                        disabled: false,
                                        text: 'Assign Task',
                                    },
                                ];
                                break;
                            case 4:
                                buttons = [
                                    { show: true, disabled: false, text: 'Send to Manager' },
                                    { show: true, disabled: false, text: 'Assign Task' },
                                ];
                                break;
                            case 5:
                                buttons = [
                                    { show: true, disabled: false, text: 'Send to Manager' },
                                ];
                                break;
                            default:
                                break;
                        }
                    }
                    else if (assignedBy === userId) {
                        switch(roleId){
                            case 2:
                                buttons = [{ show: true, disabled: false, text: 'Recall' }];
                                break;
                            case 3:
                                buttons = [{ show: true, disabled: false, text: 'Recall' }];
                                break;
                            case 4:
                                buttons = [{ show: true, disabled: false, text: 'Recall' }];
                                break;
                            case 5: 
                            buttons = [
                                { show: true, disabled: true, text: 'Sent to Manager' },
                        ];
                        break;
                            default: break;
                        }
                        // buttons = [
                        //     { show: true, disabled: false, text: 'Recall' },
                        //     { show: true, disabled: true, text: 'Assign Task' },
                        // ];
                    }
                    
                }
            }
            if(subrStatusId === 3){
                if (assignedBy === userId || assignedTo === userId) {
                    if (assignedTo === userId) {
                        switch (roleId) {
                            case 2:
                                buttons = [
                                    {
                                        show: true,
                                        disabled: false,
                                        text: 'Close Issue',
                                    },
                                    {
                                        show: true,
                                        disabled: false,
                                        text: 'Assign Task',
                                    },
                                ];
                                break;
                            case 3:
                                buttons = [
                                    {
                                        show: true,
                                        disabled: false,
                                        text: 'Recommend to Closure',
                                    },
                                    {
                                        show: true,
                                        disabled: false,
                                        text: 'Assign Task',
                                    },
                                ];
                                break;
                            case 4:
                                buttons = [
                                    { show: true, disabled: false, text: 'Send to Manager' },
                                    { show: true, disabled: false, text: 'Assign Task' },
                                ];
                                break;
                            case 5:
                                buttons = [
                                    { show: true, disabled: false, text: 'Send to Manager' },
                                ];
                                break;
                            default:
                                break;
                        }
                    } else if (assignedBy === userId) {
                        switch(roleId){
                            case 3:
                                buttons = [
                                    { show: true, disabled: true, text: 'Recommended to Closure'},
                            ];
                            break;
                            case 4:
                                buttons = [
                                    { show: true, disabled: true, text: 'Sent to Manager' },
                            ];
                            break;
                            case 5: 
                            buttons = [
                                { show: true, disabled: true, text: 'Sent to Manager' },
                        ];
                        break;
                            default: break;
                        }
                        // buttons = [
                        //     { show: true, disabled: false, text: 'Recall' },
                        //     { show: true, disabled: true, text: 'Assign Task' },
                        // ];
                    }
                    
                }
            }
            break;
        default:
            buttons = [];
            break;
    }
    return buttons;
};
