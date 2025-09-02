import * as React from 'react';
import { useEffect, useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import axios from '../../../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateAccounts } from '../../gl-slice/GLSlice';

interface Props {
  levelNumber: string;
  setIsButtonEnable: any;
  setUpdatedLevel: any
  isSaveBtnClicked: any;
  chartAccInitalVal: any
}
interface Item {
  title: string;
  subitems?: Item[];
  ACCOUNT_CODE?: string;
  id?: number;
}
export default function AccountLevelSelectLabels(props: Props) {

  const [level, setLevel] = React.useState<any>(props.levelNumber);
  const [currentData, setCurrentData] = useState<any>()

  const Axios = axios;
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const GET_ACCOUNT_GROUPS_URL = "v1/config/getaccountgroupsall";


  useEffect(() => {
    setLevel(props.levelNumber);
  }, [props.levelNumber]);


  const handleChange = (event: SelectChangeEvent) => {
    setCurrentData(event.target.value)
    setLevel(event.target.value);
    props.setUpdatedLevel(event.target.value)
    props.setIsButtonEnable(true)
  };
  let chartOfAccount = localStorage.getItem('chartOfAccHLimit')

  const removeAccountCode = (item: Item, level = 0) => {
    if (level > Number(chartOfAccount)) {
      return;
    }
    if (!item.title) {
      item.title = item.id!.toString();
    }
    if (item.subitems) {
      item.subitems = item.subitems.filter(subitem => {
        if (subitem.ACCOUNT_CODE) {
          return false;
        }
        removeAccountCode(subitem, level + 1);
        return true;
      });
    }
  };

  let id = 1;
  const addId = (item: Item) => {
    item.id = id++;
    if (item.subitems) {
      item.subitems.forEach(subitem => addId(subitem));
    }
  };
  const clean = (data: any[]) => {
    const free: any[] = [];
    data.map((item) => {
      const modifiedObject = { ...item }
      addId(modifiedObject)
      removeAccountCode(modifiedObject)
      free.push(modifiedObject);
    });

    dispatch(updateAccounts(free));
  };

  const getAccountGroupsAll = async () => {
    try {
      const response = await Axios.get(GET_ACCOUNT_GROUPS_URL, {
        headers: {
          Authorization: localStorage.getItem(
            "TR_Token"
          ) as string,
        },
      });

      if (response.data.data.length) {
        clean(response.data.data);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };
  useEffect(() => {
    console.log(props.isSaveBtnClicked, "props.isSaveBtnClicked")
    if (props.isSaveBtnClicked == true) {
      if (currentData) {
        console.log(props.chartAccInitalVal, "val", currentData)
        // if (props.chartAccInitalVal !== currentData) {
        getAccountGroupsAll()
        // }

      }
    }
  }, [props.isSaveBtnClicked, currentData])
  return (
    <div>
      <FormControl sx={{ minWidth: 120, mt: 5 }}>
        <InputLabel id="level-label">Chart of Account</InputLabel>
        <Select
          labelId="level-label"
          id="level-label"
          value={level}
          label="Depth of Acount"
          onChange={handleChange}
        >
          {/* <MenuItem value={"1"}>1</MenuItem> */}
          <MenuItem value={"2"}>2</MenuItem>
          <MenuItem value={"3"}>3</MenuItem>
          <MenuItem value={"4"}>4</MenuItem>
          <MenuItem value={"5"}>5</MenuItem>


        </Select>
        <FormHelperText>HIERARCHY LIMIT</FormHelperText>
      </FormControl>
    </div>
  );
}
