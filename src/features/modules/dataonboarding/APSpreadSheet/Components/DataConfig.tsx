import { Button, FormControlLabel, Paper, Radio, Stack, Typography } from "@mui/material"


export default function DataConfig() {
    return (
        <Paper sx={{ width: '30vw', margin: 'auto', padding: 4, marginTop: '10%' }}>
            <form>
                <Typography sx={{ fontWeight: 'bold' }}>EXIS_UNIQ_IDEN </Typography>
                <p>
                    <FormControlLabel value="True" control={<Radio />} label="True" />
                    <span>
                        <FormControlLabel value="False" control={<Radio />} label="False" />
                    </span>
                </p>
                <Typography sx={{ fontWeight: 'bold' }}>MANUAL_ENTRY</Typography>
                <p>
                    <FormControlLabel value="True" control={<Radio />} label="True" />
                    <span>
                        <FormControlLabel value="False" control={<Radio />} label="False" />
                    </span>
                </p>
                <Stack direction="row" spacing={2} style={{ display: 'flex', float: 'right', marginTop: '2%' }}>
                    <Button sx={{ borderRadius: '10px' }} variant="contained" >
                        Submit
                    </Button>
                </Stack>
            </form>
        </Paper>
    )
}