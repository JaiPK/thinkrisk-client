

export interface ActionButton {
    show: boolean;
    disabled: boolean;
    text: string;
};

export interface workFlowItem {
    assign: ActionButton;
    recall: ActionButton;
    sendToManager: ActionButton;
    sentToManager: ActionButton;
    recommendToClosure: ActionButton;
    close: ActionButton;
}