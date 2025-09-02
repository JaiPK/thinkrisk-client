interface Props {
    value: string;
    label: string;
}
const KPICards = (props: Props) => {

    return(
    <div className="border border-solid border-gray-900 rounded text-left h-24 p-5 pt-7 min-w-[130px] h-[60px]">
        <div className="font-bold mb-3">
            {props.label}
        </div>
        <div className="">
            ${props.value}
        </div>

    </div>);
}

export default KPICards;