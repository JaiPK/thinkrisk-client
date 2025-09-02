import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import SourceMappingTable from './MappingTableSrc'
import TRMappingTable from './MappingTableTR';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Tooltip, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

import { useEffect, useState } from 'react';

export interface Props {
  srcHeaders: any;
  srcHeaders1: any;
  srcRows: any;
  srcRows1: any;
  setIsShowCheckDataHealth: any
  setActiveStep: any;
  setIsShowMap: any;
  previousMapping: any[];
  UniqueId: any
  UniqueId1: any
  setIsShowIngestData: any;
  setDataHealthMsg: any;
  open: any;
  setOpen: any;
  jobID: any;
  fileUploadApiRes: any[];
  setMappingPayload: any
  setCheckDataHealth: any;
  setStatus: any
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Mapping(props: Props) {

  const handleBack = () => {
    props.setActiveStep(0);
    props.setIsShowMap(false);
    props.setIsShowIngestData(true);
  };
  const [open, setOpen] = React.useState(false);
  const [isShowBackBtn, setIsShowBackBtn] = useState(false)
  const [isUniqueId, setIsUniqueId] = useState(false);
  const [isYesClicked, setIsYesClicked] = useState(false);
  const [isNoClicked, setIsNoClicked] = useState(false)
  const [isCreateId, setIsCreateId] = useState(false);
  const [apiCallVal, setApiCallVal] = useState<any>();
  const [secondFileApiCallVal, setSecondFileApiCallVal] = useState<any>();
  const [isShowCreateIdBackBtn, setIsShowCreateIdBackBtn] = useState(false);
  const [isShowSecondFileCreateIdBackBtn, setIsShowSecondFileCreateIdBackBtn] = useState(false);
  const [finalVal, setFinalVal] = useState<any>([]);
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
  const [secondFileColumnData, setSecondFileColumnData] = useState([
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
  const [indexVal, setIndexVal] = useState<any>(3);
  const [secondFileIndexVal, setSecondFileIndexVal] = useState<any>(3)
  const [slectedArray, setSelectedArray] = useState<any>([])
  const [firstVal, setFirstVal] = useState('')
  const [accountDoc, setAccountDoc] = useState<any>([])
  const [isShowAutoMapping, setIsShowAutoMapping] = useState(false)
  const [columnsVal, setColumnsVal] = useState<any>([]);
  const [isSecondFileOpen, setIsSecondFileOpen] = useState(false);
  const [isSecondFileYesClicked, setIsSecondFileYesClicked] = useState(false)
  const [isSecondFileNoClicked, setIsSecondFileNoClicked] = useState(false)
  const [isSecondFileCreateId, setIsSecondFileCreateId] = useState(false)
  const [isSecondFileUniqueId, setIsSecondFileUniqueId] = useState(false)
  const [isSecondFileShowBackBtn, setIsSecondFileShowBackBtn] = useState(false)
  const [secondFilefinalVal, setSecondFileFinalVal] = useState<any>([]);
  const [isShowSecondPopUp, setIsShowSecondPopUp] = useState(false);
  const [multipleColumnData, setMultipleColumnData] = useState<any>([]);
  const [multipleIndexVal, setMultipleIndexVal] = useState<any>(0);
  const [isShowAutoMappingFile1, setIsShowAutoMappingFile1] = useState(false);
  const [creditFlags, setCreditFlags] = useState<any>()
  const [debitFlags, setDebitFlags] = useState<any>();
  const [isShowAutoMappingFile2, setIsShowAutoMappingFile2] = useState(false);
  const [autoMappingFile2MultipleColumnData, setAutoMappingFile2MultipleColumnData] = useState<any>([])
  const [file2AccDoc, setFile2AccDoc] = useState<any>([]);
  const [isShowFirstPopup, setIsShowFirstPopup] = useState(false);
  const [isConfigEmpty, setIsConfigEmpty] = useState(false);
  const [index, setIndex] = useState<any>();
  const [mappingVal, setMappingVal] = useState<any>([]);

  // Handle file1 close btn functionality
  const handleClose = () => {
    props.setOpen(false);
    props.setActiveStep(0);
    props.setIsShowMap(false)
    props.setIsShowIngestData(true)
  };
  // Handle file2 close btn functionality
  const handleSecondFileClose = () => {
    props.setOpen(false);
    props.setActiveStep(0);
    props.setIsShowMap(false)
    props.setIsShowIngestData(true)
  };
  // Handle yes btn functionality
  const handleYes = () => {
    setIsShowBackBtn(true)
    setIsUniqueId(true)
    setIsYesClicked(true)
    setIsNoClicked(false)
  }
  // Handle no btn functionality
  const handleNo = () => {
    setIsNoClicked(true)
    setIsCreateId(false)
    setIsUniqueId(false)
  }
  // Handle file1 onchange
  const handleChange = (event: SelectChangeEvent) => {
    let val = event.target.value as string
    setApiCallVal(val)

  };

  // Handle file2 onchange
  const handleSecondFileChange = (event: SelectChangeEvent) => {
    let val = event.target.value as string
    setSecondFileApiCallVal(val)

  };
  // If there is no unique id and going to create then show the particular popup
  const createId = () => {
    setIsShowCreateIdBackBtn(true)
    setIsCreateId(true)
    setIsNoClicked(false)
    setIsYesClicked(true)
    setIsNoClicked(true)
  }
  // Handle delete btn fuctinalities (No automapping)
  const handleDelete = (index: any) => {
    let arr = [...finalVal]
    let dataCopy: any = [...columnData]
    if (index == 0) {
      setFinalVal(arr)
      setIndexVal(indexVal)
      setSecondFileColumnData(dataCopy)
    }
    else if (index == 1) {
      setFinalVal(arr)
      setIndexVal(indexVal)
      setSecondFileColumnData(dataCopy)
    }
    else {
      arr.splice(index, 1)
      setFinalVal(arr)
      setIndexVal(indexVal - 1)
      dataCopy.splice(index, 1)
      setSecondFileColumnData(dataCopy)

    }
  }
  // Handle file1 automapping delete btn functionalities
  const handleAutoMappingFile1Delete = (index: any) => {
    let mapVal = finalVal.split(',')
    let mapValCopy = [...mapVal]
    // let arr = [...finalVal]
    let dataCopy: any = [...multipleColumnData]
    let data = apiCallVal.split(',')
    let removeString = data.filter((item: any) => {
      return item !== dataCopy[index].value;
    })
    setApiCallVal(removeString.toString())
    setMultipleColumnData(dataCopy)
    if (index == 0) {
      setFinalVal(mapValCopy.toString())
      // setFinalVal(arr)
      // setIndexVal(indexVal)
      setMultipleColumnData(dataCopy)
    }
    mapValCopy.splice(index, 1)
    setFinalVal(mapValCopy.toString())
    // arr.splice(index, 1)
    // setFinalVal(arr)
    // setIndexVal(indexVal - 1)
    dataCopy.splice(index, 1)
    setMultipleColumnData(dataCopy)

  }
  // Handle file2 automapping delete btn functionalities
  const handleAutoMappingFile2Delete = (index: any) => {
    let mapVal = secondFilefinalVal.split(',')
    let mapValCopy = [...mapVal]
    // let arr = [...secondFilefinalVal]
    let dataCopy: any = [...autoMappingFile2MultipleColumnData]
    let data = secondFileApiCallVal.split(',')
    let removeString = data.filter((item: any) => {
      return item !== dataCopy[index].value;
    })
    setSecondFileApiCallVal(removeString.toString())
    setAutoMappingFile2MultipleColumnData(dataCopy)
    if (index == 0) {
      setSecondFileFinalVal(mapValCopy.toString())
      // setIndexVal(indexVal)
      setAutoMappingFile2MultipleColumnData(dataCopy)
    }
    mapValCopy.splice(index, 1)
    setSecondFileFinalVal(mapValCopy.toString())
    // setIndexVal(indexVal - 1)
    dataCopy.splice(index, 1)
    setAutoMappingFile2MultipleColumnData(dataCopy)

  }
  // Handle dropdown select and getting cancadinated id (no automapping)
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
    setFirstVal(props.srcRows[0][indexOfItem])
  }
  // Handle autmapping dropdown select and getting cancadinated id
  const handleSecondFileSelect = (slectedData: any, index: number) => {
    let copy = [...slectedArray]
    copy[index] = slectedData
    let indexOfItem = slectedData as keyof typeof props.srcRows[0];
    let final = copy.find((item: any) => (
      item === indexOfItem
    ))
    let copyfinal = [...secondFilefinalVal]
    copyfinal[index] = props.srcRows[0][final]
    setSecondFileFinalVal(copyfinal)
    setFirstVal(props.srcRows[0][indexOfItem])
  }
  // Add new column (no automapping)
  const AddNewColumn = () => {
    setIndexVal(indexVal + 1)
    let dataCopy: any = [...columnData]
    dataCopy.push({ column: 'column', index: indexVal, icon: <DeleteIcon /> })
    setColumnData(dataCopy)
  }
  // Add new column for file1 automapping 
  const AddAutoMappingFile1NewColumn = () => {
    setIndex(index + 1)
    // setMultipleIndexVal(multipleIndexVal + 1)
    let dataCopy: any = [...multipleColumnData]
    dataCopy.push({ column: 'column', index: index + 2, value: '' })
    setMultipleColumnData(dataCopy)
  }
  // Add new column for file2 automapping 
  const AddAutoMappingFile2NewColumn = () => {
    // setMultipleIndexVal(multipleIndexVal + 1)
    let dataCopy: any = [...autoMappingFile2MultipleColumnData]
    dataCopy.push({ column: 'column', index: indexVal, value: '', icon: <DeleteIcon /> })
    setAutoMappingFile2MultipleColumnData(dataCopy)
  }
  // Handle multiple column onchange
  const handleColumnChange = (event: SelectChangeEvent) => {
    let val = event.target.value as string
    accountDoc.push(val)
    setApiCallVal(accountDoc.toString())
  }
  // handle onchange functionalities for file1 automapping
  const handleAutoMappingFile1ColumnChange = (event: any, index: number) => {
    let map = finalVal.split(',')
    let mapCopy = [...map]
    mapCopy[index] = props.srcRows[0][event.target.value]
    setFinalVal(mapCopy.toString())
    let arr = apiCallVal.split(',')
    let copyArr = [...arr]
    copyArr[index] = event.target.value
    setApiCallVal(copyArr.toString())
    let dataCopy: any = [...multipleColumnData]
    dataCopy[index].value = event.target.value
    setMultipleColumnData(dataCopy)
  }
  // handle onchange functionalities for file2 automapping
  const handleAutoMappingFile2ColumnChange = (event: any, index: number) => {
    let map = secondFilefinalVal.split(',')
    let mapCopy = [...map]
    mapCopy[index] = props.srcRows[0][event.target.value]
    setSecondFileFinalVal(mapCopy.toString())
    let arr = secondFileApiCallVal.split(',')
    let copyArr = [...arr]
    copyArr[index] = event.target.value
    setSecondFileApiCallVal(copyArr.toString());
    let dataCopy: any = [...autoMappingFile2MultipleColumnData]
    dataCopy[index].value = event.target.value
    setAutoMappingFile2MultipleColumnData(dataCopy)
  }
  // Handle confirm btn functionality (no automapping)
  const handleConfirm = () => {
    setIsShowAutoMapping(true)
    props.setOpen(false);
    //setIsSecondFileOpen(true)
    props.setIsShowMap(true)
    setIsYesClicked(true)
    setIsNoClicked(true)

  }
  // Handle single column file1 automapping confirm btn
  const singleAutoMappingHandleConfirm = () => {
    props.setOpen(false);
    // setIsSecondFileOpen(true)
    // props.setIsShowMap(true)
    // setIsYesClicked(true)
    // setIsNoClicked(true)
  }
  // Handle single column file2 automapping confirm btn
  const handleSingleMappingSecondFileConfirm = () => {
    setIsSecondFileOpen(false)
    setIsShowAutoMapping(true)
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
  // Handle multiple column file1 automapping confirm btn
  const handleAutoMappingFile1Confirm = () => {
    //setIsShowAutoMappingFile2(true)
    setIsShowAutoMappingFile1(false)
    // setIsShowAutoMapping(true)
  }
  // Handle multiple column file2 automapping confirm btn
  const handleAutoMappingFile2Confirm = () => {
    setIsShowAutoMappingFile2(false)
    setIsShowAutoMapping(true)
    // setIsSecondPopup(false)
    // setIsShowAutoMapping(true)
  }
  // Getting file upload api response and based on the config_key storing the value in state
  const fileUploadData = () => {
    let isConfig = false;
    for (var i = 0; i < props.fileUploadApiRes.length; i++) {
      if (props.fileUploadApiRes[i].CONFIG_KEY === "UNIQ_IDEN") {
        //Uniq_Iden key functionalities
        isConfig = true;
        let data = props.fileUploadApiRes[i].CONFIG_VALUE
        setApiCallVal(data)
        setSecondFileApiCallVal(data)
        let splitedData: any = data.split(',')
        console.log(splitedData, "splitedData")

        //Get automapping data
        for (var j = 0; j < splitedData.length; j++) {
          mappingVal.push(props.srcRows[0][splitedData[j]])
          setSecondFileFinalVal(mappingVal.toString())
          setFinalVal(mappingVal.toString())
        }

        if (splitedData.length > 1) {
          setIsShowSecondPopUp(true)
          setIsConfigEmpty(false)
          setIsShowAutoMappingFile1(true)
          splitedData.map((data: any, index: any) => {
            setIndex(index)
            multipleColumnData.push({ column: 'Column', index: index + 1, value: data })
            autoMappingFile2MultipleColumnData.push({ column: 'Column', index: multipleIndexVal, value: data, icon: "" })
          })
        }

        if (splitedData.length == 1) {
          setIsShowSecondPopUp(false)
          setIsShowFirstPopup(true)
          setIsConfigEmpty(false)
          if (props.srcHeaders.includes(props.fileUploadApiRes[j].CONFIG_VALUE)) {
            setApiCallVal(props.fileUploadApiRes[j].CONFIG_VALUE)
            setSecondFileApiCallVal(props.fileUploadApiRes[j].CONFIG_VALUE)
          }
        }
        if (splitedData.length < 1) {
          setIsConfigEmpty(true)
        }
      }
      // Credit flags
      if (props.fileUploadApiRes[i]?.CONFIG_KEY === 'CREDIT_FLAGS') {
        setCreditFlags(props.fileUploadApiRes[i].CONFIG_VALUE)
      }
      // Debit flags
      if (props.fileUploadApiRes[i].CONFIG_KEY === 'DEBIT_FLAGS') {
        setDebitFlags(props.fileUploadApiRes[i].CONFIG_VALUE)
      }
    }
    if (isConfig === false) {
      setIsConfigEmpty(true)
    }
  }
  useEffect(() => {
    if (props.fileUploadApiRes)
      fileUploadData()
    else return;
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
            <p style={{ fontSize: '15px', fontWeight: 'bold', maxHeight: '6vh' }}>Ap Transaction File1 Data Onboarding</p>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {isYesClicked == false && isNoClicked == false
                ?
                <>
                  <Typography display='flex' justifyContent='center' alignItems='center'>Do you have unique id?
                    <Tooltip title='info' placement="top-start">
                      <InfoIcon style={{ fontSize: '17px', color: 'gray' }} /></Tooltip>
                  </Typography>
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
                    <Typography display=' flex' justifyContent='center' alignItems='center'>Unique Id</Typography>&nbsp; &nbsp;
                    <span>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Unique Id</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={apiCallVal}
                            label="Unique Id"
                            sx={{ width: '16vw', height: '8vh' }}
                            onChange={handleChange}
                          >
                            {props.srcHeaders.map((src: any) => (
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
          <DialogActions>
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
                <Button onClick={handleConfirm} autoFocus disabled={accountDoc?.length < 2} sx={{ textTransform: 'capitalize' }}>
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

      {/* File1 Single column with automapping */}
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
            <p style={{ fontSize: '15px', fontWeight: 'bold', maxHeight: '6vh' }}>Ap Transaction File1 Data Onboarding</p>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">

              <div >
                <p style={{ display: 'flex' }} >
                  <Typography display=' flex' justifyContent='center' alignItems='center'>Unique Id</Typography>&nbsp; &nbsp;
                  <span>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Unique Id</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={apiCallVal}
                          label="Unique Id"
                          sx={{ width: '16vw', height: '8vh' }}
                          onChange={handleChange}
                        >
                          {props.srcHeaders.map((src: any) => (
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
          <DialogActions>
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
      {/* File1 multiple column with automapping */}
      {isShowAutoMappingFile1
        ?
        <Dialog
          open={isShowAutoMappingFile1}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: { borderRadius: 20 }
          }}
        >
          <DialogTitle id="alert-dialog-title">
            <p style={{ fontSize: '15px', fontWeight: 'bold', maxHeight: '6vh' }}>Ap Transaction File1 Data Onboarding</p>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <>
                <Typography sx={{ fontWeight: 'bold', color: 'black' }} display=' flex' justifyContent='center' alignItems='center'>Select columns to generate the unique key</Typography>
                <div>
                  {multipleColumnData.map((data: any, Index: any) => (
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
                              onChange={(e: any) => handleAutoMappingFile1ColumnChange(e, Index)}
                            >
                              {props.srcHeaders.map((src: any, index: any) => (
                                <MenuItem value={src} onClick={() => handleSelect(src, Index)}>{src}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </span>
                      <Button onClick={() => handleAutoMappingFile1Delete(Index)} sx={{ color: 'gray' }}>
                        {Index == 0 ? '' : <DeleteIcon />}
                      </Button>
                    </p>
                  ))}
                </div>
                <Typography display='flex' justifyContent='end'>
                  <Button onClick={AddAutoMappingFile1NewColumn} sx={{ color: 'gray' }}>
                    <AddCircleOutlineIcon />
                  </Button>
                </Typography>
                {finalVal
                  ?
                  <p>concatenated unique id : <span style={{ fontWeight: 'bold', color: 'black' }}>{finalVal}&nbsp;</span></p>
                  :
                  ''
                }
              </>

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAutoMappingFile1Confirm} autoFocus sx={{ textTransform: 'capitalize' }}>
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
      {/* File2 Single column with automapping  */}
      {isSecondFileOpen ?
        <Dialog
          open={isSecondFileOpen}
          onClose={handleSecondFileClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: { borderRadius: 20 }
          }}
        >
          <DialogTitle id="alert-dialog-title">
            <p style={{ fontSize: '15px', fontWeight: 'bold', maxHeight: '6vh' }}>Ap Transaction File2 Data Onboarding</p>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">

              <div >
                <p style={{ display: 'flex' }} >
                  <Typography display=' flex' justifyContent='center' alignItems='center'>Unique Id</Typography>&nbsp; &nbsp;
                  <span>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Unique Id</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={secondFileApiCallVal}
                          label="Unique Id"
                          sx={{ width: '16vw', height: '8vh' }}
                          onChange={handleSecondFileChange}
                        >
                          {props.srcHeaders1.map((src: any) => (
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
          <DialogActions>

            <Button onClick={handleSingleMappingSecondFileConfirm} disabled={!secondFileApiCallVal} autoFocus sx={{ textTransform: 'capitalize' }}>
              confirm
            </Button>
            <Button onClick={handleSecondFileClose} autoFocus sx={{ textTransform: 'capitalize' }}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        :
        ''
      }
      {/* File2 multiple column with automapping */}
      {isShowAutoMappingFile2
        ?
        <Dialog
          open={isShowAutoMappingFile2}
          onClose={handleSecondFileClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: { borderRadius: 20 }
          }}
        >
          <DialogTitle id="alert-dialog-title">
            <p style={{ fontSize: '15px', fontWeight: 'bold', maxHeight: '6vh' }}>Ap Transaction File2 Data Onboarding</p>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <>
                <Typography sx={{ fontWeight: 'bold', color: 'black' }} display=' flex' justifyContent='center' alignItems='center'>Select columns to generate the unique key</Typography>
                <div>
                  {autoMappingFile2MultipleColumnData.map((data: any, Index: any) => (
                    <p style={{ display: 'flex', marginTop: '6vh' }}>
                      <Typography display=' flex' justifyContent='center' alignItems='center'>{data.column}{Index + 1}</Typography>&nbsp; &nbsp;
                      <span>
                        <Box sx={{ minWidth: 120 }}>
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Unique Id</InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Unique Id"
                              sx={{ width: '16vw', height: '8vh' }}
                              value={data.value}
                              onChange={(e: any) => handleAutoMappingFile2ColumnChange(e, Index)}
                            >
                              {props.srcHeaders1.map((src: any, index: any) => (
                                <MenuItem value={src} onClick={() => handleSecondFileSelect(src, Index)}>{src}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </span>
                      <Button onClick={() => handleAutoMappingFile2Delete(Index)} sx={{ color: 'gray' }}>
                        {Index == 0 ? '' : <DeleteIcon />}
                      </Button>
                    </p>
                  ))}
                </div>
                <Typography display='flex' justifyContent='end'>
                  <Button onClick={AddAutoMappingFile2NewColumn} sx={{ color: 'gray' }}>
                    <AddCircleOutlineIcon />
                  </Button>
                </Typography>
                {secondFilefinalVal
                  ?
                  <p>concatenated unique id : <span style={{ fontWeight: 'bold', color: 'black' }}>{secondFilefinalVal}</span></p>
                  :
                  ''
                }
              </>
            </DialogContentText>
          </DialogContent>
          <DialogActions>

            <>
              <Button onClick={handleAutoMappingFile2Confirm} autoFocus sx={{ textTransform: 'capitalize' }}>
                confirm
              </Button>
            </>
            <Button onClick={handleSecondFileClose} autoFocus sx={{ textTransform: 'capitalize' }}>
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
            <Item><SourceMappingTable srcheaders={props.srcHeaders} srcrows={props.srcRows} srcheaders1={props.srcHeaders1} srcrows1={props.srcRows1} setIsShowCheckDataHealth={props.setIsShowCheckDataHealth} setActiveStep={props.setActiveStep} setIsShowMap={props.setIsShowMap} /></Item>
          </Grid>
          <Grid item xs={5}>

            <Item><TRMappingTable setApiCallVal={setApiCallVal} secondFileApiCallVal={secondFileApiCallVal} apiCallVal={apiCallVal} isShowAutoMapping={isShowAutoMapping} headers={props.srcHeaders} headers1={props.srcHeaders1} UniqueId={props.UniqueId} UniqueId1={props.UniqueId1} setIsShowCheckDataHealth={props.setIsShowCheckDataHealth} setActiveStep={props.setActiveStep} setIsShowMap={props.setIsShowMap} handleback={handleBack} setDataHealthMsg={props.setDataHealthMsg} jobID={props.jobID} previousMapping={props.previousMapping} setDebitFlags={setDebitFlags} setCreditFlags={setCreditFlags} creditFlags={creditFlags} debitFlags={debitFlags} setMappingPayload={props.setMappingPayload} setCheckDataHealth={props.setCheckDataHealth} setStatus={props.setStatus} /></Item>
          </Grid>
        </Grid>

      </Box>

    </>
  );
}