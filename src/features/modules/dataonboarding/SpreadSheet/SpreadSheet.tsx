import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Ingest from './Components/IngestData';
import Mapping from './Components/Mapping';
import CheckDataHealth from './Components/CheckDataHealth';
import { useState } from 'react';

export default function SpreadSheet() {

    const steps = ['Ingest Data', 'Map Data', 'Check Data Health'];
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});
    const [isShowIngestData, setIsShowIngestData] = React.useState<any>(true);
    const [isShowCheckDataHealth, setIsShowCheckDataHealth] = React.useState<any>(false);
    const [dataHealthMsg, setDataHealthMsg] = React.useState<any>({});
    const [isShowMap, setIsShowMap] = React.useState<any>(false);
    const [uniqIden, setUniqIden] = useState<any>([]);
    const [fileUploadApiRes, setFileUploadApiRes] = useState<any>()
    const [tableRows, setTableRows] = React.useState<any[]>([]);
    const [parsedData, setParsedData] = React.useState<any>([]);
    const [UniqueId, setUniqueId] = React.useState<any>();
    const [open, setOpen] = React.useState<any>(false);
    const [previousMapping, setPreviousMapping] = useState<any>([]);
    const [mappingPayload, setMappingPayload] = useState<any>();
    const [mappingConfig, setMappingConfig] = useState<any>()
    const [healthReportData, setHealthReportData] = useState<any>()
    const [isMappingError, setIsMappingError] = useState<boolean>();
    const [status , setStatus] = useState<any>();

    //Handle stepper steps
    const handleStep = (step: number, label: any) => () => {
        if (label == 'Ingest Data') {
            setIsShowIngestData(true)
            setIsShowMap(false)
            setIsShowCheckDataHealth(false)
        }
        setActiveStep(step);
    }

    //Get data upload file headers
    const getHeader = (data: any[], dataRows: any[]) => {
        setTableRows(data);
        setParsedData(dataRows);
    };

    //Set previous mapping from ingest
    const setPreviousMappingFromIngest = (previousMappings: any[]) => {
        setPreviousMapping([...previousMappings]);
    }
    return (
        <>
            <div className="px-7 pt-7 pb-3 text-base font-raleway font-bold bg-[#F5F5F5]">
                General Ledger Data On-Boarding
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
                <Ingest setActiveStep={setActiveStep} setUniqueId={setUniqueId} getHeads={getHeader} setIsShowMap={setIsShowMap} setIsShowIngestData={setIsShowIngestData} setOpen={setOpen} setPreviousMapping={setPreviousMappingFromIngest} setUniqIden={setUniqIden} setFileUploadApiRes={setFileUploadApiRes} />
                :
                null
            }
            {isShowMap
                ?
                <div className="b-2">
                    <Mapping srcHeaders={tableRows} UniqueId={UniqueId} srcRows={parsedData} setIsShowCheckDataHealth={setIsShowCheckDataHealth} setActiveStep={setActiveStep} setIsShowMap={setIsShowMap} setIsShowIngestData={setIsShowIngestData} setDataHealthMsg={setDataHealthMsg} open={open} setOpen={setOpen} previousMapping={previousMapping} uniqIden={uniqIden} fileUploadApiRes={fileUploadApiRes} setMappingPayload={setMappingPayload} setMappingConfig={setMappingConfig} setHealthReportData={setHealthReportData} setIsMappingError={setIsMappingError} setStatus={setStatus} />
                </div>
                :
                null
            }
            {isShowCheckDataHealth
                ?
                <CheckDataHealth setActiveStep={setActiveStep} setIsShowMap={setIsShowMap} setIsShowCheckDataHealth={setIsShowCheckDataHealth} dataHealthMsg={dataHealthMsg} srcRows={parsedData} mappingPayload={mappingPayload} mappingConfig={mappingConfig} UniqueId={UniqueId}   healthReportData={healthReportData} status = {status} />
                :
                null
            }
            {/* <MappingTableTwo srcHeaders={tableRows} srcRows={parsedData}/> */}
        </>
    )
}


