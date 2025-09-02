import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Ingest from './Components/IngestData';
import Mapping from './Components/Mapping';
import CheckDataHealth from './Components/CheckDataHealth';
// import MappingTableTwo from './Components/MappingTwo';
import { useState } from 'react';

export default function APSpreadSheet() {
    const steps = ['Ingest Data', 'Map Data', 'Check Data Health'];
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});
    const [isShowIngestData, setIsShowIngestData] = React.useState<any>(true);
    const [isShowCheckDataHealth, setIsShowCheckDataHealth] = React.useState<any>(false);
    const [dataHealthMsg, setDataHealthMsg] = React.useState("");
    const [isShowMap, setIsShowMap] = React.useState<any>(false);

    const handleStep = (step: number, label: any) => () => {
        if (label == 'Ingest Data') {
            setIsShowIngestData(true)
            setIsShowMap(false)
            setIsShowCheckDataHealth(false)
        }
        setActiveStep(step);
    }
    const [tableRows, setTableRows] = React.useState<any[]>([]);
    const [secondTableRows, setSecondTableRows] = React.useState<any[]>([]);
    const [parsedData, setParsedData] = React.useState<any>([]);
    const [secondParsedData, setSecondParsedData] = React.useState<any>([]);
    const [UniqueId, setUniqueId] = React.useState<any>();
    const [UniqueId1, setUniqueId1] = React.useState<any>();
    const [open, setOpen] = useState(false)
    const [jobID, setJobID] = useState<any>();
    const [fileUploadApiRes, setFileUploadApiRes] = useState<any>();
    const [previousMapping, setPreviousMapping] = useState<any>([]);
    const [mappingPayload, setMappingPayload] = useState<any>();
    const [mappingConfig, setMappingConfig] = useState<any>();
    const [checkDataHealth, setCheckDataHealth] = useState<any>();
    const [status , setStatus] = useState<any>();

    // Getting File1 headers
    const getHeader = (data: any[], dataRows: any[]) => {
        setTableRows(data);
        setParsedData(dataRows);
    };

    // Set previous mapping from ingest
    const setPreviousMappingFromIngest = (previousMappings: any[]) => {
        setPreviousMapping([...previousMappings]);
    }

    // Getting file2 headers
    const getSecondHeader = (data: any[], dataRows: any[]) => {
        setSecondTableRows(data);
        setSecondParsedData(dataRows);
    };

    return (
        <>
            <div className="px-7 pt-7 pb-3 text-base font-raleway font-bold bg-[#F5F5F5]">
                Accounts Payable Data On-Boarding
            </div>
            <Box sx={{ maxWidth: '72%', margin: '2.9%', marginLeft: '14%' }} alignItems="center"
                justifyContent="center">
                <Stepper nonLinear activeStep={activeStep}>
                    {steps.map((label, index) => (
                        <Step key={label} completed={completed[index]}>
                            <StepButton color="inherit" onClick={handleStep(index, label)}>
                                {label}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            {isShowIngestData
                ?
                <Ingest setActiveStep={setActiveStep} setUniqueId={setUniqueId} setUniqueId1={setUniqueId1} getHeads={getHeader} getSecondHeads={getSecondHeader} setIsShowMap={setIsShowMap} setIsShowIngestData={setIsShowIngestData} setOpen={setOpen} setJobID={setJobID} setPreviousMapping={setPreviousMappingFromIngest} setFileUploadApiRes={setFileUploadApiRes} />
                :
                null
            }
            {isShowMap
                ?
                <div className="b-2">
                    <Mapping srcHeaders={tableRows} srcHeaders1={secondTableRows} UniqueId={UniqueId} UniqueId1={UniqueId1} jobID={jobID} srcRows={parsedData} srcRows1={secondParsedData} setIsShowCheckDataHealth={setIsShowCheckDataHealth} setActiveStep={setActiveStep} setIsShowMap={setIsShowMap} setIsShowIngestData={setIsShowIngestData} setDataHealthMsg={setDataHealthMsg} open={open} setOpen={setOpen} previousMapping={previousMapping} fileUploadApiRes={fileUploadApiRes} setMappingPayload={setMappingPayload} setCheckDataHealth={setCheckDataHealth} setStatus={setStatus} />
                </div>
                :
                null
            }
            {isShowCheckDataHealth
                ?
                <CheckDataHealth setActiveStep={setActiveStep} setIsShowMap={setIsShowMap} setIsShowCheckDataHealth={setIsShowCheckDataHealth} srcRows={[...parsedData, ...secondParsedData]} dataHealthMsg={dataHealthMsg} mappingPayload={mappingPayload} jobID={jobID} checkDataHealth={checkDataHealth} status={status} />
                :
                null
            }
            {/* <MappingTableTwo srcHeaders={tableRows} srcRows={parsedData}/> */}
        </>
    )
}


