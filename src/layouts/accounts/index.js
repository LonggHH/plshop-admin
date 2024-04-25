// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import MDButton from "components/MDButton";
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';

// Modal
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadImage } from "common/upload";
import { usernamePattern } from "constants/regex";
import MDAlert from "components/MDAlert";
import MDTypography from "components/MDTypography";
import { getBrands } from "../../redux/slices/brand";
import instanceAxios from "../../configs/axios";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { render } from "react-dom";
import Icon from "@mui/material/Icon";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { getAccounts } from "../../redux/slices/account";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.80),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.90),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    height: 32,
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const defaultValuesForm = { open: false, title: "Add", data: null };

function Accounts() {
    const dispatch = useDispatch();

    // const categories = useSelector(state => state.category.data.filter(cate => cate.active));

    const [selectStatus, setSelectStatus] = useState("");
    const accounts = useSelector(state => state.account.data);

    const [formControl, setFormControl] = useState(defaultValuesForm);
    const [alert, setAlert] = useState({ show: false, message: "", color: "error" });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [keyword, setKeyword] = useState("");

    const handleChangeSelectStatus = (value) => {
        setSelectStatus(value)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const handleShowAlert = (message, color) => {
        setAlert({ show: true, message, color });
        setTimeout(() => {
            setAlert({ show: false, message: "", color: "error" });
        }, 2000);
    }

    const handleClose = () => {
        setFormControl(defaultValuesForm);
    };

    const handleClickEdit = (account) => {
        const orderAccept = account.orders.filter((order) => order.status === 'accept')
        const moneyOrderAccept = orderAccept.reduce((total, item) => {
            return total += parseFloat(item.total);
        }, 0)

        setFormControl({
            open: true, title: "Update", data: {
                id: account.id,
                name: account.name,
                active: account.active,
                orderAcceptLength: orderAccept.length,
                moneyOrderAccept: moneyOrderAccept.toFixed(2),
            }
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = {};
        for (let [name, value] of formData.entries()) {
            values[name] = value;
        }

        const active = values.active === 'true' ? true : false;
        const data = { active, id: formControl.data.id }

        if (formControl.title === "Update") {

            try {
                const result = await instanceAxios.put(`/accounts/change-status`, data);
                if (result.data.statusCode === 200) {
                    handleShowAlert(result.data.message, "success")
                }
            } catch (error) {
                handleShowAlert(error.response.data.message, "error")
            }
            dispatch(getAccounts())
            handleClose()
            return;
        }
    }

    const handleChangeKeyword = (e) => {

    }

    return (
        <>

            {alert.show &&
                <div style={{ position: "fixed", top: 120, right: 0, zIndex: 999 }}>
                    <MDAlert color={alert.color} dismissible>
                        <MDTypography variant="body2" color="white">
                            {alert.message}
                        </MDTypography>
                    </MDAlert>
                </div>
            }

            <Dialog
                open={formControl.open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: onSubmit,
                }}
            >
                <DialogTitle>Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Be careful when updating this information, making sure you remember your information.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        disabled
                        defaultValue={formControl.data?.name}
                    />

                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        // id="name"
                        // name="name"
                        label="Buy"
                        type="text"
                        fullWidth
                        variant="standard"
                        disabled
                        defaultValue={`${formControl.data?.orderAcceptLength} - $${formControl.data?.moneyOrderAccept}`}
                    />

                    {
                        formControl.title === "Update" &&
                        <FormControl mt={4}>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="active"
                                defaultValue={formControl.data.active}
                            >
                                <FormControlLabel value={true} control={<Radio />} label="Active" />
                                <FormControlLabel value={false} control={<Radio />} label="Disable" />
                            </RadioGroup>
                        </FormControl>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Subscribe</Button>
                </DialogActions>
            </Dialog>

            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Card>
                                <MDBox
                                    mx={2} mt={-3} py={3} px={2}
                                    display="flex" justifyContent="space-between" alignItems="center"
                                    variant="gradient" bgColor="info"
                                    borderRadius="lg" coloredShadow="info"
                                >
                                    <MDBox>
                                        <Box sx={{ minWidth: 100 }}>
                                            <FormControl fullWidth>
                                                <InputLabel style={{ color: "white", height: 32 }} id="demo-simple-select-label">Status</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Status"
                                                    style={{ width: 100, height: 32, color: "red" }}
                                                    onChange={(event) => handleChangeSelectStatus(event.target.value)}
                                                >
                                                    <MenuItem value={''}>All</MenuItem>
                                                    <MenuItem value={true}>Active</MenuItem>
                                                    <MenuItem value={false}>Disable</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </MDBox>
                                    <Search>
                                        <SearchIconWrapper>
                                            <SearchIcon />
                                        </SearchIconWrapper>
                                        <StyledInputBase
                                            value={keyword}
                                            placeholder="Search…"
                                            inputProps={{ 'aria-label': 'search' }}
                                            onChange={(e) => setKeyword(e.target.value)}
                                        />
                                    </Search>
                                </MDBox>
                                <MDBox pt={3}>
                                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                        <TableContainer sx={{ maxHeight: 440 }}>
                                            <Table stickyHeader aria-label="sticky table">
                                                <TableBody>
                                                    {accounts
                                                        .filter((account) => {
                                                            if (typeof selectStatus === 'string') {
                                                                return true
                                                            } else {
                                                                if (account.active === selectStatus) {
                                                                    return true
                                                                } else {
                                                                    return false
                                                                }
                                                            }
                                                        })
                                                        .filter((account) => account.name.toLowerCase().includes(keyword.trim().toLowerCase()))
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((row) => {
                                                            return (
                                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                                    <TableCell key="logo" align="center">
                                                                        <Avatar variant="rounded" alt="Avatar" src={row.imagePath}
                                                                            style={{ width: 50, height: 'fit-content' }} />
                                                                    </TableCell>
                                                                    <TableCell key="logo" align="left">
                                                                        {row.name}
                                                                    </TableCell>
                                                                    <TableCell key="email" align="center">
                                                                        {row.email}
                                                                    </TableCell>
                                                                    <TableCell key="phone" align="center">
                                                                        {row.phone}
                                                                    </TableCell>
                                                                    <TableCell key="gender" align="center">
                                                                        {row.gender}
                                                                    </TableCell>
                                                                    <TableCell key="logo" align="center">
                                                                        {row.active ? <span style={{ color: "green" }}>Active</span> : <span style={{ color: "red" }}>Disable</span>}
                                                                    </TableCell>
                                                                    <TableCell key="logo" align="center">
                                                                        <Icon fontSize="small"
                                                                            style={{ marginRight: 12, cursor: "pointer", color: "green" }}
                                                                            onClick={() => handleClickEdit(row)}>
                                                                            edit_icon
                                                                        </Icon>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <TablePagination
                                            rowsPerPageOptions={[10, 25, 100]}
                                            component="div"
                                            count={accounts.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </Paper>
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
                <Footer />
            </DashboardLayout>
        </>
    );
}

export default Accounts;