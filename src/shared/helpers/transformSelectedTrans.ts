export const transformSelectedTrans = (selectedTransString: string) => {
    const stringLength = selectedTransString.length;

    if (
        selectedTransString[0] === '[' &&
        selectedTransString[stringLength - 1] === ']'
    ) {
        let trimmedString = selectedTransString
            .replace('[', '')
            .replace(']', '');
        let splitString = trimmedString?.split(",");
        let transformedString: number[] = [];
        if(splitString?.length){
            splitString.forEach(item => {
                transformedString.push(Number(item));
            });
        }
        return transformedString;
    } else {
        return null;
    }
};
