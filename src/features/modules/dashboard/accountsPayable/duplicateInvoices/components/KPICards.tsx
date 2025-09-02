import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';


interface Props {
  title:string;
  value:string;
  type:string;
  color:string;
  icon?:string;
 }

export default function MediaControlCard(props: Props) {


  return (
    <Card sx={{ display: 'flex' , minWidth: "300px", backgroundColor: props.color }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {props.type === "value" ? "$": ""}{props.value}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div" sx={{maxWidth: "120px"}}>
            {props.title}
          </Typography>
        </CardContent>
      </Box>
      
      <CardMedia>
        
      
      {
      props.type === "vendor" ?  <PeopleAltOutlinedIcon fontSize="large" sx={{ height: "100px", width: "100px" }}/> : 
      props.type === "invoice" ?  <ReceiptLongOutlinedIcon fontSize="large" sx={{ height: "100px", width: "100px"}}/> :
      props.type === "value" ?  <RequestQuoteOutlinedIcon fontSize="large" sx={{ height: "100px", width: "100px"}}/> : ""}
        
      </CardMedia>
      
      
    </Card>
  );
}