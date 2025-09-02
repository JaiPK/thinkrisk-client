import { toast } from 'react-toastify';

const isContainSpecialChar = ( value : string) => {
    let containSpecialChar = /<[^>]*>/.test(value);
    if(containSpecialChar){
        toast.error('Provided data is invalid');
    }
    return containSpecialChar;
}

export default isContainSpecialChar;