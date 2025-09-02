import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import SourceMappingTable from './MappingTableSrc'
import TRMappingTable from './MappingTableTR';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Tooltip, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

export interface Props {
  srcHeaders: any;
  srcRows: any;
  setIsShowCheckDataHealth: any
  setActiveStep: any;
  setIsShowMap: any;
  UniqueId: any
  setIsShowIngestData: any;
  setDataHealthMsg: any;
  open: any;
  setOpen: any;
  previousMapping: any[];
  uniqIden: any;
  fileUploadApiRes: any;
  setMappingPayload: any;
  setMappingConfig: any
  setHealthReportData:any;
  setIsMappingError:any;
  setStatus:any
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Mapping(props: Props) {

  const [isUniqueId, setIsUniqueId] = useState(false);
  const [isYesClicked, setIsYesClicked] = useState(false);
  const [isNoClicked, setIsNoClicked] = useState(false)
  const [isCreateId, setIsCreateId] = useState(false);
  const [columnData, setColumnData] = useState([
    {
      column: 'column',
      index: '1',
      icon: ''
    },
    {
      column: 'column',
      index: '2',
      icon: ''
    },
  ])
  const [isShowBackBtn, setIsShowBackBtn] = useState(false)
  const [isShowCreateIdBackBtn, setIsShowCreateIdBackBtn] = useState(false)
  const [indexVal, setIndexVal] = useState<any>(3)
  const [slectedArray, setSelectedArray] = useState<any>([])
  const [finalVal, setFinalVal] = useState<any>([]);
  const [debitFlags, setDebitFlags] = useState<any>();
  const [creditFlags, setCreditFlags] = useState<any>();
  const [columnsVal, setColumnsVal] = useState<any>([]);
  const [apiCallVal, setApiCallVal] = useState<any>();
  const [isShowAutoMapping, setIsShowAutoMapping] = useState(false);
  const [isShowSecondPopUp, setIsShowSecondPopUp] = useState(false);
  const [multipleColumnData, setMultipleColumnData] = useState<any>([]);
  const [isSecondPopup, setIsSecondPopup] = useState(false);
  const [secondPopupFinalVal, setSecondPopupFinalVal] = useState<any>([]);
  const [isShowFirstPopup, setIsShowFirstPopup] = useState(false)
  const [isConfigEmpty, setIsConfigEmpty] = useState(false);
  const [splitedDataArr, setSplitedDataArr] = useState<any>();
  const [index, setIndex] = useState<any>();
  const [mappingVal, SetMappingVal] = useState<any>([])
  const [columnLength, setColumnLength] = useState<any>([])

  const navigate = useNavigate();

  // Back btn functionality
  const handleBack = () => {
    props.setActiveStep(0);
    props.setIsShowMap(false);
    props.setIsShowIngestData(true);
  };
  // Close btn functionality
  const handleClose = () => {
    props.setOpen(false);
    props.setActiveStep(0);
    props.setIsShowMap(false)
    props.setIsShowIngestData(true)
  };
  //Handle popup yes btn
  const handleYes = () => {
    setIsShowBackBtn(true)
    setIsUniqueId(true)
    setIsYesClicked(true)
    setIsNoClicked(false)
  }
  // Handle uniqueId onchange
  const handleChange = (event: SelectChangeEvent) => {
    setApiCallVal(event.target.value as string)

  };
  // Handle multiple column onchange
  const handleColumnChange = (event: SelectChangeEvent) => {
    let arr = apiCallVal.split(',')
    let copyArr = [...arr]
    setColumnLength(copyArr)
    copyArr[index] = event.target.value
    setApiCallVal(copyArr.toString())
  }
  // Handle multiple automapping column onchange
  const handleColumnChange1 = (event: any, index: number) => {
    let arr = apiCallVal.split(',')
    let map = secondPopupFinalVal.split(',')
    let mapCopy = [...map]
    mapCopy[index] = props.srcRows[0][event.target.value]
    setSecondPopupFinalVal(mapCopy.toString())
    let copyArr = [...arr]
    copyArr[index] = event.target.value
    setApiCallVal(copyArr.toString())
    let dataCopy: any = [...multipleColumnData]
    dataCopy[index].value = event.target.value
    setMultipleColumnData(dataCopy)
  }
  // Handle popup no btn
  const handleNo = () => {
    setIsNoClicked(true)
    setIsCreateId(false)
    setIsUniqueId(false)
  }
  // If there is no uniqueid and going to create then show the particular popup
  const createId = () => {
    setIsShowCreateIdBackBtn(true)
    setIsCreateId(true)
    setIsNoClicked(false)
    setIsYesClicked(true)
    setIsNoClicked(true)
  }
  // Add new column
  const AddNewColumn = () => {
    setIndexVal(indexVal + 1)
    let dataCopy: any = [...columnData]
    dataCopy.push({ column: 'column', index: indexVal, icon: <DeleteIcon /> })
    setColumnData(dataCopy)
  }
  // Add new column for automapping
  const AddNewColumn1 = () => {
    let dataCopy: any = [...multipleColumnData]
    dataCopy.push({ column: 'column', index: index + 2, value: '' })
    setMultipleColumnData(dataCopy)
  }
  // Click back btn it's redirect to the content with YES or No btns
  const handleBackBtn = () => {
    setIsShowBackBtn(false)
    setIsUniqueId(false)
    setIsNoClicked(false)
    setIsYesClicked(false)
  }
  // Click back btn it's redirect to the content with Ok btn
  const handleBackBtn1 = () => {
    setColumnsVal([])
    setFinalVal([])
    setIsNoClicked(true)
    setIsCreateId(false)
    setIsShowCreateIdBackBtn(false)
  }
  // Delete btn functionity
  const handleDelete = (index: any) => {
    let arr = [...finalVal]
    let dataCopy: any = [...columnData]
    if (index == 0) {
      setFinalVal(arr)
      setIndexVal(indexVal)
      setColumnData(dataCopy)
    }
    else if (index == 1) {
      setFinalVal(arr)
      setIndexVal(indexVal)
      setColumnData(dataCopy)
    }
    else {
      arr.splice(index, 1)
      setFinalVal(arr)
      setIndexVal(indexVal - 1)
      dataCopy.splice(index, 1)
      setColumnData(dataCopy)

    }
  }
  // Delete btn funtionality for auto mapping
  const handleDelete1 = (index: any) => {
    // let arr = [...secondPopupFinalVal]
    let map = [...mappingVal]
    let mapVal = secondPopupFinalVal.split(',')
    let mapValCopy = [...mapVal]
    let dataCopy: any = [...multipleColumnData]
    let data = apiCallVal.split(',')
    let removeString = data.filter((item: any) => {
      return item !== dataCopy[index].value;
    })
    setApiCallVal(removeString.toString())
    setMultipleColumnData(dataCopy)

    if (index == 0) {
      setSecondPopupFinalVal(mapValCopy.toString())
      setMultipleColumnData(dataCopy)
      setApiCallVal(data.toString())
    }
    else {
      mapValCopy.splice(index, 1)
      setSecondPopupFinalVal(mapValCopy.toString())
      dataCopy.splice(index, 1)
      setMultipleColumnData(dataCopy)
    }

  }
  // Handle dropdown select and getting concadinated id
  const handleSelect = (slectedData: any, index: number) => {
    let copy = [...slectedArray]
    copy[index] = slectedData
    let indexOfItem = slectedData as keyof typeof props.srcRows[0];
    let final = copy.find((item: any) => (
      item === indexOfItem
    ))
    let copyfinal = [...finalVal]
    copyfinal[index] = props.srcRows[0][final]
    setFinalVal(copyfinal)
  }
  // Handle dropdown select for automapping and getting cancadinated id
  const handleSelect1 = (slectedData: any, index: number) => {
    let copy = [...slectedArray]
    copy[index] = slectedData
    let indexOfItem = slectedData as keyof typeof props.srcRows[0];
    let final = copy.find((item: any) => (
      item === indexOfItem
    ))
    let copyfinal = [...secondPopupFinalVal]
    copyfinal[index] = props.srcRows[0][final]
    setSecondPopupFinalVal(copyfinal)
  }
  // Handle confirm btn functionalities(No automapping)
  const handleConfirm = () => {
    // setIsShowAutoMapping(true)
    props.setOpen(false);
    props.setIsShowMap(true)
    
  }
  // Handle confirm btn functionalities for automapping
  const handleConfirm1 = () => {
    setIsSecondPopup(false)
    setIsShowAutoMapping(true)
  }
  // Handle single input automapping confirm btn functionalities
  const singleAutoMappingHandleConfirm = () => {
    setIsShowFirstPopup(false)
    setIsShowAutoMapping(true)
  }
  // Getting file upload api response and based on the config_key storing the value in state
  const fileUploadData = () => {
    console.log("fileupload",props.fileUploadApiRes)
    setApiCallVal('')
    let isConfig = false;
    for (var i = 0; i < props.fileUploadApiRes?.length; i++) {
      //Uniq_Iden key functionalities
      if (props.fileUploadApiRes[i].CONFIG_KEY == "UNIQ_IDEN") {
        isConfig = true;
        let data = "Username,Entry Time"
        setApiCallVal(data)
        let splitedData: any = data.split(',')
        console.log(splitedData,"splitedData")
        //Get automapping data
        for (var i = 0; i < splitedData.length; i++) {
          mappingVal.push(props.srcRows[0][splitedData[i]])
          setSecondPopupFinalVal(mappingVal.toString())
        }
        setSplitedDataArr(splitedData)

        if (splitedData.length > 1) {
          setIsShowSecondPopUp(true)
          setIsSecondPopup(true)
          splitedData.map((data: any, index: any) => {
            multipleColumnData.push({ column: 'Column', index: index + 1, value: data })
            setIndex(index)
          })
        }

        if (splitedData.length == 1) {
          setIsShowFirstPopup(true)
          if (props.srcHeaders.includes(props.fileUploadApiRes[i].CONFIG_VALUE)) {
            setApiCallVal(props.fileUploadApiRes[i].CONFIG_VALUE)
          }
        }
        if (splitedData.length < 1) {
          setIsConfigEmpty(true)
        }
      }
      // Credit flags
      if (props.fileUploadApiRes[i].CONFIG_KEY == "CREDIT_FLAGS") {
        setCreditFlags(props.fileUploadApiRes[i].CONFIG_VALUE)
      }
      // Debit flags
      if (props.fileUploadApiRes[1].CONFIG_KEY == "DEBIT_FLAGS") {
        setDebitFlags(props.fileUploadApiRes[1].CONFIG_VALUE)
      }
    }
    if (isConfig === false) {
      setIsConfigEmpty(true)
    }
  }

  useEffect(() => {
    fileUploadData()
  }, [])
  return (
    <>
      {/* If in api response configs is empty then this content should be rendered(creating new uniqueId) */}
      {isConfigEmpty ?
        <Dialog
          open={props.open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: { borderRadius: 20 }
          }}
        >
          <DialogTitle id="alert-dialog-title">
            <p style={{ fontSize: '15px', fontWeight: 'bold', maxHeight: '6vh' }}>Gl Transaction Data Onboarding</p>
          </DialogTitle>
          <DialogContent >
            <DialogContentText id="alert-dialog-description" >
              {isYesClicked == false && isNoClicked == false
                ?
                <>
                  <Typography display='flex' justifyContent='center' alignItems='center'>Do you have unique id?
                    <Tooltip title='info' placement="top-start"><InfoIcon style={{ fontSize: '17px', color: 'gray' }} /></Tooltip></Typography>
                  <Stack direction="row"
                    spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5vh' }}>
                    <Button variant="contained" size='small' sx={{ borderRadius: '8px' }} onClick={handleYes}>Yes</Button>
                    <Button variant="contained" size='small' sx={{ borderRadius: '8px' }} onClick={handleNo}>No</Button>
                  </Stack>
                </>
                :
                ''
              }
              {isUniqueId
                ?
                <div >
                  <p style={{ display: 'flex' }} >
                    <Typography display=' flex' justifyContent='center' alignItems='center'>Unique Id </Typography>&nbsp; &nbsp;
                    <span>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Unique Id</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={apiCallVal}
                            label='Unique Id'
                            sx={{ width: '18vw', height: '8vh' }}
                            onChange={handleChange}
                          >
                            {props.srcHeaders?.map((src: any) => (
                              <MenuItem value={src}>{src}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </span>
                  </p>
                </div>
                :
                ''
              }
              {
                isNoClicked && isCreateId == false
                  ?
                  <>
                    <Typography display='flex' justifyContent='center' alignItems='center'>Please generate a unique id to proceed further</Typography><Stack direction="row"
                      spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '4vh' }}>
                      <Button variant="contained" size='small' sx={{ borderRadius: '8px' }} onClick={createId}>Ok</Button>
                    </Stack>
                  </>
                  :
                  ''
              }
              {isCreateId
                ?
                <>
                  <Typography sx={{ fontWeight: 'bold', color: 'black' }} display=' flex' justifyContent='center' alignItems='center'>Select columns to generate the unique key</Typography>
                  <div>
                    {columnData.map((data: any, Index: any) => (
                      <p style={{ display: 'flex', marginTop: '6vh' }}>
                        <Typography display=' flex' justifyContent='center' alignItems='center'>{data.column}{data.index}</Typography>&nbsp; &nbsp;
                        <span>
                          <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">Unique Id</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // value={accountDoc}
                                label="Unique Id"
                                sx={{ width: '16vw', height: '8vh' }}
                                onChange={handleColumnChange}
                              >
                                {props.srcHeaders.map((src: any, index: any) => (
                                  <MenuItem value={src} onClick={() => handleSelect(src, Index)}>{src}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        </span>
                        <Button onClick={() => handleDelete(Index)} sx={{ color: 'gray' }}>
                          {data.icon}
                        </Button>
                      </p>
                    ))}
                  </div>
                  <Typography display='flex' justifyContent='end'>
                    <Button onClick={AddNewColumn} sx={{ color: 'gray' }}>
                      <AddCircleOutlineIcon />
                    </Button>
                  </Typography>
                  {finalVal
                    ?
                    <p>concatenated unique id : <span style={{ fontWeight: 'bold', color: 'black' }}>{finalVal}</span></p>
                    :
                    ''
                  }
                </>
                :
                ''
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ marginTop: '-5vh' }}>
            {isShowBackBtn ?
              <>
                <Button onClick={handleConfirm} disabled={!apiCallVal} autoFocus sx={{ textTransform: 'capitalize' }}>
                  confirm
                </Button>
                <Button onClick={handleBackBtn} autoFocus sx={{ textTransform: 'capitalize' }}>
                  back
                </Button>
              </>
              : ''
            }
            {isShowCreateIdBackBtn ?
              <>
                <Button onClick={handleConfirm} autoFocus disabled={columnLength?.length < 2} sx={{ textTransform: 'capitalize' }}>
                  confirm
                </Button>
                <Button onClick={handleBackBtn1} autoFocus sx={{ textTransform: 'capitalize' }}>
                  back
                </Button>
              </>
              : ''
            }
            <Button onClick={handleClose} autoFocus sx={{ textTransform: 'capitalize' }}>
              Cancel
            </Button>

          </DialogActions>
        </Dialog>
        :
        ''
      }
      {/* Single column with automapping */}
      {isShowFirstPopup
        ?
        <Dialog
          open={props.open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: { borderRadius: 20 }
          }}
        >
          <DialogTitle id="alert-dialog-title">
            <p style={{ fontSize: '15px', fontWeight: 'bold', maxHeight: '6vh' }}>Gl Transaction Data Onboarding</p>
          </DialogTitle>
          <DialogContent >
            <DialogContentText id="alert-dialog-description" >

              <div >
                <p style={{ display: 'flex' }} >
                  <Typography display=' flex' justifyContent='center' alignItems='center'>Unique Id </Typography>&nbsp; &nbsp;
                  <span>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Unique Id</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={apiCallVal}
                          label='Unique Id'
                          sx={{ width: '18vw', height: '8vh' }}
                          onChange={handleChange}
                        >
                          {props.srcHeaders?.map((src: any) => (
                            <MenuItem value={src}>{src}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </span>
                </p>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ marginTop: '-5vh' }}>


            <Button onClick={singleAutoMappingHandleConfirm} disabled={!apiCallVal} autoFocus sx={{ textTransform: 'capitalize' }}>
              confirm
            </Button>
            <Button onClick={handleClose} autoFocus sx={{ textTransform: 'capitalize' }}>
              Cancel
            </Button>

          </DialogActions>
        </Dialog>
        :
        ''
      }

      {/* Multiple column with automapping */}
      {isShowSecondPopUp == true
        ?
        <Dialog
          open={isSecondPopup}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: { borderRadius: 20 }
          }}
        >
          <DialogTitle id="alert-dialog-title">
            <p style={{ fontSize: '15px', fontWeight: 'bold', maxHeight: '6vh' }}>Gl Transaction Data Onboarding</p>
          </DialogTitle>
          <DialogContent >
            <DialogContentText id="alert-dialog-description" sx={{ maxHeight: '63vh' }} >
              <>
                <Typography sx={{ fontWeight: 'bold', color: 'black' }} display=' flex' justifyContent='center' alignItems='center'>Select columns to generate the unique key</Typography>
                <div>
                  {multipleColumnData?.map((data: any, Index: any) => (
                    <p style={{ display: 'flex', marginTop: '6vh' }}>
                      <Typography display=' flex' justifyContent='center' alignItems='center'>{data.column}{Index + 1}</Typography>&nbsp; &nbsp;
                      <span>
                        <Box sx={{ minWidth: 120 }}>
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Unique Id</InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={data.value}
                              label="Unique Id"
                              sx={{ width: '16vw', height: '8vh' }}
                              onChange={(e: any) => handleColumnChange1(e, Index)}
                            >
                              {props.srcHeaders.map((src: any, index: any) => (
                                <MenuItem value={src} onClick={() => handleSelect1(src, Index)}>{src}</MenuItem>
                              ))}
                            </Select>

                          </FormControl>
                        </Box>
                      </span>
                      <Button onClick={() => handleDelete1(Index)} sx={{ color: 'gray' }}>
                        {Index == 0 ? '' : <DeleteIcon />}

                        {/* {data.icon} */}
                      </Button>
                    </p>
                  ))}
                </div>
                <Typography display='flex' justifyContent='end'>
                  <Button onClick={AddNewColumn1} sx={{ color: 'gray' }}>
                    <AddCircleOutlineIcon />
                  </Button>
                </Typography>
              </>
            </DialogContentText>
          </DialogContent>
          <div style={{ marginLeft: '4vh' }}>
            {secondPopupFinalVal
              ?
              <p >concatenated unique id : <span style={{ fontWeight: 'bold' }}>{secondPopupFinalVal}</span></p>
              :
              ''
            }
          </div>
          <DialogActions sx={{ marginTop: '-5vh' }}>
            <>
              <Button onClick={handleConfirm1} autoFocus sx={{ textTransform: 'capitalize' }}>
                confirm
              </Button>
            </>
            <Button onClick={handleClose} autoFocus sx={{ textTransform: 'capitalize' }}>
              Cancel
            </Button>

          </DialogActions>
        </Dialog>
        :
        ''
      }
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Item><SourceMappingTable srcheaders={props.srcHeaders} srcrows={props.srcRows} setIsShowCheckDataHealth={props.setIsShowCheckDataHealth} setActiveStep={props.setActiveStep} setIsShowMap={props.setIsShowMap} /></Item>
          </Grid>
          <Grid item xs={5}>
            <Item><TRMappingTable headers={props.srcHeaders} UniqueId={props.UniqueId} setIsShowCheckDataHealth={props.setIsShowCheckDataHealth} setActiveStep={props.setActiveStep} setIsShowMap={props.setIsShowMap} handleback={handleBack} setDataHealthMsg={props.setDataHealthMsg} previousMapping={props.previousMapping} apiCallVal={apiCallVal} debitFlags={debitFlags} creditFlags={creditFlags} setApiCallVal={setApiCallVal} isShowAutoMapping={isShowAutoMapping} setCreditFlags={setCreditFlags} setDebitFlags={setDebitFlags} setMappingPayload={props.setMappingPayload} setMappingConfig={props.setMappingConfig} setHealthReportData={props.setHealthReportData} setIsMappingError={props.setIsMappingError} setStatus={props.setStatus}/></Item>
          </Grid>
        </Grid>

      </Box></>
  );
}