import * as React from 'react';

import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import ClearIcon from '@mui/icons-material/Clear';

export default function Tags(props: any) {

  const suspicious = props.getSuspiciousKey;
  const round = props.getRoundOffData;

  // const handleSuspiciousDelete = (suspicious: any, index: any) => {
  //   console.log(index,"index")
  //   let deleteSuspicious = [...suspicious]
  //   deleteSuspicious.splice(index, 1);
  //   props.setGetSuspiciousKey(deleteSuspicious)
  // };

  const handleDelete = (data: any, index: any, name: any) => () => {
    if (name == 'deleteRound') {
      let deleteData = [...round]
      deleteData.splice(index, 1);
      props.setGetRoundOffData(deleteData);
    }
    else if (name == 'deleteSuspicious') {
      let deleteSuspicious = [...suspicious];
      deleteSuspicious.splice(index, 1);
      props.setGetSuspiciousKey(deleteSuspicious)
    }
    else { }
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: '65vw' }}>
      {props.name === 'round'
        ?
        <Autocomplete
          multiple
          id="tags-filled"
          options={[]}
          defaultValue={round || null}
          value={round || null}
          freeSolo
          disableClearable
          renderTags={(value, getTagProps) =>
            value?.map((option: string, index: number) => (
              <Chip variant="filled" label={option} {...getTagProps({ index })}
                onDelete={handleDelete(round, index, 'deleteRound')}
              />
            ))
          }
          onChange={(e) => props.handleRound(e)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="filled"
              label=""
              placeholder="New Keyword"
            />
          )}
        />
        :
        <Autocomplete
          multiple
          id="tags-filled"
          options={[]}
          defaultValue={suspicious || null}
          value={suspicious || null}
          freeSolo
          disableClearable
          renderTags={(value, getTagProps) =>
            value?.map((option: string, index: number) => (
              <Chip variant="filled" label={option} {...getTagProps({ index })}
                onDelete={handleDelete(suspicious, index, 'deleteSuspicious')}
              />
            ))

          }
          onChange={(e) => props.handleSuspiciousKey(e)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="filled"
              label=""
              placeholder="New Keyword"
            />
          )}
        />
      }
    </Stack>
  );
}




