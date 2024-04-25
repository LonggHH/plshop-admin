// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Paper from '@mui/material/Paper';

// Data
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';

// Modal
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import MDAlert from "components/MDAlert";
import MDTypography from "components/MDTypography";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Icon from "@mui/material/Icon";
import { getOrders } from "../../redux/slices/order";
import instanceAxios from "configs/axios";

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

const defaultValuesForm = { open: false, title: "Add", data: [] };

function Orders() {
    const dispatch = useDispatch();

    let orders = useSelector(state => state.order.data);

    let x = [...orders]
    x = x.sort((a, b) => new Date(a.date) - new Date(b.date))
    orders = [...x]

    const [selectStatus, setSelectStatus] = useState("");

    const [formControl, setFormControl] = useState(defaultValuesForm);
    const [alert, setAlert] = useState({ show: false, message: "", color: "error" });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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

    const handleClickEdit = (details) => {
        setFormControl({ open: true, title: "Update", data: details })
    }

    const handleChangeStatus = async (id, status) => {
        try {
            const result = await instanceAxios.post(`/orders/status`, { id, status });
            if (result.data.statusCode === 200) {
                dispatch(getOrders());
            }
        } catch (error) {
            handleShowAlert(error.response.data.message, 'error')
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        handleClose();
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
                <DialogTitle>Details</DialogTitle>
                <DialogContent>
                    <table>
                        <tbody>
                            {formControl.data.map((detail) => (
                                <tr key={detail.id}>
                                    <td style={{ width: 80 }}>
                                        <img width={50} src={detail.variation.image} alt="img" />
                                    </td>
                                    <td style={{ padding: 0 }}>{detail.variation.name}</td>
                                    <td style={{ width: 80, textAlign: "center" }}>{detail.variation.color}</td>
                                    <td style={{ width: 80 }}>${detail.variation.price}</td>
                                    <td style={{ width: 20 }}>{detail.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                                                    label="Category"
                                                    style={{ width: 100, height: 32, color: "red" }}
                                                    onChange={(event) => handleChangeSelectStatus(event.target.value)}
                                                >
                                                    <MenuItem value=''>All</MenuItem>
                                                    <MenuItem value='pending'>Pending</MenuItem>
                                                    <MenuItem value='accept'>Accept</MenuItem>
                                                    <MenuItem value='user_deny'>User Deny</MenuItem>
                                                    <MenuItem value='admin_deny'>Admin Deny</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </MDBox>
                                    <Search>
                                        <SearchIconWrapper>
                                            <SearchIcon />
                                        </SearchIconWrapper>
                                        <StyledInputBase
                                            placeholder="Search…"
                                            inputProps={{ 'aria-label': 'search' }}
                                        />
                                    </Search>
                                </MDBox>
                                <MDBox pt={3}>
                                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                        <TableContainer sx={{ maxHeight: 440 }}>
                                            <Table stickyHeader aria-label="sticky table">
                                                <TableBody>
                                                    {orders
                                                        .filter(order => order.status.includes(selectStatus))
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((row) => {
                                                            const date = new Date(row.date)
                                                            const formattedDate = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                                                            let details = row.details;
                                                            details = details.map((item) => {
                                                                return {
                                                                    ...item,
                                                                    variation: JSON.parse(item.variation)
                                                                }
                                                            })
                                                            return (
                                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                                    <TableCell key="logo" align="center" style={{ width: 160 }}>
                                                                        <MDTypography style={{ fontSize: 14 }}>{row.name}</MDTypography>
                                                                        <MDTypography style={{ fontSize: 14 }}>{row.phone}</MDTypography>
                                                                        <MDTypography style={{ fontSize: 14 }}>{row.email}</MDTypography>
                                                                    </TableCell>
                                                                    <TableCell key="address" align="left">
                                                                        {row.address}
                                                                    </TableCell>
                                                                    <TableCell key="note" align="left">
                                                                        {row.note}
                                                                    </TableCell>
                                                                    <TableCell key="total" align="center">
                                                                        ${row.total}
                                                                    </TableCell>
                                                                    <TableCell key="date" align="center">
                                                                        {formattedDate}
                                                                    </TableCell>
                                                                    <TableCell key="status" align="center">
                                                                        <span style={{ color: `${row.pay && row.status === 'pending' ? "green" : "black"}` }}>{row.status}</span>
                                                                    </TableCell>
                                                                    <TableCell key="action" align="center">
                                                                        <Icon fontSize="small"
                                                                            style={{ marginRight: 12, cursor: "pointer", color: "green" }}
                                                                            onClick={() => handleClickEdit(details)}>
                                                                            edit_icon
                                                                        </Icon>
                                                                        {row.status.includes('pending') &&
                                                                            <>
                                                                                <Icon fontSize="small"
                                                                                    style={{ cursor: "pointer", color: "red" }}
                                                                                    onClick={() => handleChangeStatus(row.id, "accept")}
                                                                                >
                                                                                    price_check
                                                                                </Icon>
                                                                                <Icon fontSize="small"
                                                                                    style={{ cursor: "pointer", color: "red" }}
                                                                                    onClick={() => handleChangeStatus(row.id, "admin_deny")}
                                                                                >
                                                                                    not_interested_icon
                                                                                </Icon></>
                                                                        }
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
                                            count={orders.length}
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

export default Orders;