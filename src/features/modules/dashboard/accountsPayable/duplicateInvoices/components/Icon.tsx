import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
interface Props {
    icon:String;
   }

export default function Icon(props: Props) {
    if (props.icon === "vendor") {
        return 
          <PeopleAltOutlinedIcon fontSize="large" sx={{ height: "100px", width: "100px"}}/>
        
      }
      else if (props.icon === "invoice") {
        return 
          <ReceiptLongOutlinedIcon fontSize="large" sx={{ height: "100px", width: "100px"}}/>
        
      }
      else if (props.icon === "value") {
        return 
          <RequestQuoteOutlinedIcon fontSize="large" sx={{ height: "100px", width: "100px"}}/>
        
      }
      else {
        return 
            <RequestQuoteOutlinedIcon fontSize="large" sx={{ height: "100px", width: "100px"}}/>
        
      };
}