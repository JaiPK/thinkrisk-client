import * as React from 'react';
import { useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

export default function BasicTable(props: any) {
  const [lostDiscountVal, setLostDiscountVal] = useState<any>('1')
  const [excessPayment, setExcessPayment] = useState('1')
  const [lostDiscountErrorMessage, setLostDiscountErrorMessage] = useState('')
  const [dateSequential, setDateSequential] = useState('1')
  const [excessPaymentErrorMessage, setExcessPaymentErrorMessage] = useState('')
  const [dataSequentialErrorMessage, setDataSequentialErrorMessage] = useState('')
  const [workFlowDeviation, setWorkFlowDeviation] = useState('1')
  const [workFlowDeviationErrorMessage, setWorkFlowDeviationErrorMessage] = useState('')
  const [unfavorable, setUnfavorable] = useState('1')
  const [unfavorableErrorMessage, setUnfavorableErrorMessage] = useState('')
  const [immediatePayments, setImmediatePayments] = useState('1')
  const [immediatePaymentsErrorMessage, setImmediatePaymentsErrorMessage] = useState('')
  const [nextQuarter, setNextQuarter] = useState('1')
  const [unknownVendor, setUnknownVendor] = useState('1')
  const [unknownVendorErrorMessage, setUnknownVendorErrorMessage] = useState('')
  const [unpaidInvoices, setUnpaidInvoices] = useState('1')
  const [unpaidInvoicesErrorMessage, setUnpaidInvoicesErrorMessage] = useState('')
  const [latePayment, setLatePayment] = useState('1')
  const [duplicatePayments, setDuplicatePayments] = useState('1')
  const [duplicatePaymentsErrorMessage, setDuplicatePaymentsErrorMessage] = useState('')
  const [duplicateInvoices, setDuplicateInvoices] = useState('1')
  const [duplicateInvoicesErrorMessage, setDuplicateInvoicesErrorMessage] = useState('')
  const [differentPostingPeriod, setDifferentPostingPeriod] = useState('1')
  const [latePaymentErrorMessage, setLatePaymentErrorMessage] = useState('')
  const [nextQuarterErrorMessage, setNextQuarterErrorMessage] = useState('')
  const [differentPostingPeriodErrorMessage, setDifferentPostingPeriodErrorMessage] = useState('')

  function validateRegex(type: string, validateText: string) {
    const mapping: any = {
      number: /^([1-9]|10)$/,
    }
    return mapping[type].test(validateText)
  }

  var rows: any = [

    {
      name: 'Lost Discount',
      action: (e: any) => {
        if (validateRegex('number', e.target.value)) {
          var newVal = parseInt(e.target.value);
          if (newVal > 10) newVal = 10;
          if (newVal < 1) newVal = 1;
          setLostDiscountVal(newVal)
          setLostDiscountErrorMessage('')
        }
        else {
          setLostDiscountVal('')
          setLostDiscountErrorMessage('Number should be min 1 and max 10')
        }
      },
      value: lostDiscountVal,
      active: '',
      errorMesg: lostDiscountErrorMessage,
      checked: false
    },
    {
      name: 'Excess Payment',
      action: (e: any) => {
        if (validateRegex('number', e.target.value)) {
          setExcessPayment(e.target.value)
          setExcessPaymentErrorMessage('')
        }
        else {
          setExcessPayment('')
          setExcessPaymentErrorMessage('Number should be min 1 and max 10')
        }
      },
      value: excessPayment,
      active: '',
      errorMesg: excessPaymentErrorMessage,
      checked: false
    },
    {
      name: 'Date Sequential Mismatch',
      action: (e: any) => {
        if (validateRegex('number', e.target.value)) {
          setDateSequential(e.target.value)
          setDataSequentialErrorMessage('')
        }
        else {
          setDateSequential('')
          setDataSequentialErrorMessage('Number should be min 1 and max 10')
        }
      },
      value: dateSequential,
      active: '',
      errorMesg: dataSequentialErrorMessage,
      checked: false
    },

    {
      name: 'Work Flow Deviation',
      action: (e: any) => {
        if (validateRegex('number', e.target.value)) {
          setWorkFlowDeviation(e.target.value)
          setWorkFlowDeviationErrorMessage('')
        }
        else {
          setWorkFlowDeviation('')
          setWorkFlowDeviationErrorMessage('Number should be min 1 and max 10')
        }
      },
      value: workFlowDeviation,
      active: '',
      errorMesg: workFlowDeviationErrorMessage,
      checked: false
    },

    {
      name: 'Unfavorable Payment Terms',
      action: (e: any) => {
        if (validateRegex('number', e.target.value)) {
          setUnfavorable(e.target.value)
          setUnfavorableErrorMessage('')
        }
        else {
          setUnfavorable('')
          setUnfavorableErrorMessage('Number should be min 1 and max 10')
        }
      },
      value: unfavorable,
      active: '',
      errorMesg: unfavorableErrorMessage,
      checked: false
    },

    {
      name: 'Immediate Payments',
      action: (e: any) => {
        if (validateRegex('number', e.target.value)) {
          setImmediatePayments(e.target.value)
          setImmediatePaymentsErrorMessage('')
        }
        else {
          setImmediatePayments('')
          setImmediatePaymentsErrorMessage('Number should be min 1 and max 10')
        }
      },
      value: immediatePayments,
      active: '',
      errorMesg: immediatePaymentsErrorMessage,
      checked: false
    },

    {
      name: 'Next Quarter Posting',
      action: (e: any) => {
        if (validateRegex('number', e.target.value)) {
          setNextQuarter(e.target.value)
          setNextQuarterErrorMessage('')
        }
        else {
          setNextQuarter('')
          setNextQuarterErrorMessage('Number should be min 1 and max 10')
        }
      },
      value: nextQuarter,
      active: '',
      errorMesg: nextQuarterErrorMessage,
      checked: false
    },

    {
      name: 'Unknown Vendor',
      action: (e: any) => {
        if (validateRegex('number', e.target.value)) {
          setUnknownVendor(e.target.value)
          setUnknownVendorErrorMessage('')
        }
        else {
          setUnknownVendor('')
          setUnknownVendorErrorMessage('Number should be min 1 and max 10')
        }
      },
      value: unknownVendor,
      active: '',
      errorMesg: unknownVendorErrorMessage,
      checked: false
    },

    {
      name: 'Unpaid Invoices',
      action: (e: any) => {
        if (validateRegex('number', e.target.value)) {
          setUnpaidInvoices(e.target.value)
          setUnpaidInvoicesErrorMessage('')
        }
        else {
          setUnpaidInvoices('')
          setUnpaidInvoicesErrorMessage('Number should be min 1 and max 10')
        }
      },
      value: unpaidInvoices,
      active: '',
      errorMesg: unpaidInvoicesErrorMessage,
      checked: false
    },

    {
      name: 'Late payment',
      action: (e: any) => {
        if (validateRegex('number', e.target.value)) {
          setLatePayment(e.target.value)
          setLatePaymentErrorMessage('')
        }
        else {
          setLatePayment('')
          setLatePaymentErrorMessage('Number should be min 1 and max 10')
        }
      },
      value: latePayment,
      active: '',
      errorMesg: latePaymentErrorMessage,
      checked: false
    },

    {
      name: 'Duplicate Payments',
      action: (e: any) => {
        if (validateRegex('number', e.target.value)) {
          setDuplicatePayments(e.target.value)
          setDuplicatePaymentsErrorMessage('')
        }
        else {
          setDuplicatePayments('')
          setDuplicatePaymentsErrorMessage('Number should be min 1 and max 10')
        }
      },
      value: duplicatePayments,
      active: '',
      errorMesg: duplicatePaymentsErrorMessage,
      checked: false
    },

    {
      name: 'Duplicate Invoices',
      action: (e: any) => {
        if (validateRegex('number', e.target.value)) {
          setDuplicateInvoices(e.target.value)
          setDuplicateInvoicesErrorMessage('')
        }
        else {
          setDuplicateInvoices('')
          setDuplicateInvoicesErrorMessage('Number should be min 1 and max 10')
        }
      },
      value: duplicateInvoices,
      active: '',
      errorMesg: duplicateInvoicesErrorMessage,
      checked: false
    },

    {
      name: 'Different Posting Period',
      action: (e: any) => {
        if (validateRegex('number', e.target.value)) {
          setDifferentPostingPeriod(e.target.value)
          setDifferentPostingPeriodErrorMessage('')
        }
        else {
          setDifferentPostingPeriod('')
          setDifferentPostingPeriodErrorMessage('Number should be min 1 and max 10')
        }
      },
      value: differentPostingPeriod,
      active: '',
      errorMesg: differentPostingPeriodErrorMessage,
      checked: false
    },

    // createData('Lost Discount', 1, 1),
    // createData('Excess Payment', 1, 1),
    // createData('Date Sequential Mismatch', 1, 1),
    // createData('Work Flow Deviation', 1, 1),
    // createData('Unfavorable Payment Terms', 8, 1),
    // createData('Immediate Payments',6,1),
    // createData('Next Quarter Posting',1,1),
    // createData('Unknown Vendor',1,1),
    // createData('Unpaid Invoices',1,1),
    // createData('Late payment',1,1),
    // createData('Duplicate Payments',1,1),
    // createData('Duplicate Invoices',0,0),
    // createData('Different Posting Period',0, 0)
  ];

  const [isChecked, setIsChecked] = useState(rows);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: any) => {
    let copyRows = isChecked
    copyRows[index].checked = event.target.checked;
    setIsChecked([...copyRows]);
  }

  const handleAction = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: any) => {
    let copyRows = [...props.assignWeights]
    var newVal = parseInt(e.target.value);
    if (newVal > 10) newVal = 10;
    if (newVal < 1) newVal = 1;
    copyRows[index].KEYVALUE = newVal
    props.setAssignWeights(copyRows)
  }
  const  toTitleCase =(str:string)=> {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
  const handleRuleCheckbox = (index: any, e: any) => {
    let data = [...props.assignWeights]

    if (e.target.checked == true) {
      data[index].STATUS = 1
    }
    else if (e.target.checked == false) {
      data[index].STATUS = 0
    }
    props.setAssignWeights(data)

  }
  return (
    <TableContainer component={Paper} style={{ height: '450px', maxWidth: '60vw', maxHeight: '60vh', overflow: 'auto' }}>
      <Table aria-label="simple table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="right" style={{ maxWidth: '20vw' }}>Active</TableCell>
            <TableCell align="left">Business Rule</TableCell>
            <TableCell align="left">Weights</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.assignWeights?.map((row: any, index: any) => {
            return (
              <TableRow
                key={row.KEYNAME}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="right"><Checkbox checked={row.STATUS == 1} onClick={(e) => handleRuleCheckbox(index, e)} /></TableCell>
                <TableCell align="left" style={{ maxWidth: '20vw' }}>{toTitleCase(row.KEYNAME.replace(/_/g, ' ').replace(/WEIGHT/g,''))}</TableCell>
                <TableCell align="left">
                  <TextField sx={{ width: "200px", m: 3 }} id="rule-ap-score" disabled={row.STATUS == 0} value={row.STATUS == 0 ? 0 : row.KEYVALUE} label="Rule Risk Score" variant="standard" type="number"
                    onChange={(e) => handleAction(e, index)}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

