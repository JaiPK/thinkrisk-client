
const isNumeric = (value:any) => {
    if (value < 0) value = value * -1;
    if (/^-{0,1}\d+$/.test(value)) {
        return true;
    } else if (/^\d+\.\d+$/.test(value)) {
        return true;
    } else {
        return false;
    }
};

const numberSuffixPipe = (labelValue: number, digit: number = 2) => {
     // Nine Zeroes for Billions
     return Math.abs(Number(labelValue)) >= 1.0e+9

     ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(digit) + "B"
     // Six Zeroes for Millions 
     : Math.abs(Number(labelValue)) >= 1.0e+6
 
     ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(digit) + "M"
     // Three Zeroes for Thousands
     : Math.abs(Number(labelValue)) >= 1.0e+3
 
     ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(digit) + "K"
 
     : Math.abs(Number(labelValue));
}

export default numberSuffixPipe;