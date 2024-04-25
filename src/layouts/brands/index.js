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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    display: 'flex',
    justifyContent: 'space-between'
}));

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const defaultValuesForm = { open: false, title: "Add", data: null };

function Brands() {
    const dispatch = useDispatch();

    const categories = useSelector(state => state.category.data.filter(cate => cate.active));
    const [selectCategory, setSelectCategory] = useState("");
    const brands = useSelector(state => state.brand.data.filter(brand => brand.category.name.includes(selectCategory)));

    const [formControl, setFormControl] = useState(defaultValuesForm);
    const [imageUrl, setImageUrl] = useState();
    const [showError, setShowError] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", color: "error" });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [keyword, setKeyword] = useState("");

    const handleChangeSelectCategory = (value) => {
        setSelectCategory(value)
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

    const handleFileChange = async (e) => {
        const url = await uploadImage(e.target.files[0]);
        setImageUrl(url);
    }

    const handleClickOpen = () => {
        setFormControl(pre => ({ ...pre, open: true }));
    };

    const handleClose = () => {
        setImageUrl();
        setFormControl(defaultValuesForm);
    };

    const handleDelete = async (id) => {
        try {
            const result = await instanceAxios.delete(`/brands/${id}`);
            if (result.data.statusCode === 200) {
                handleShowAlert(result.data.message, "success")
            }
        } catch (error) {
            handleShowAlert(error.response.data.message, "error")
        }
        dispatch(getBrands())
        handleClose()
    }

    const handleClickEdit = (brand) => {
        setFormControl({ open: true, title: "Update", data: brand })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = {};
        for (let [name, value] of formData.entries()) {
            values[name] = value;
        }

        if (formControl.title === "Update") {

            const check = usernamePattern.test(values.name);
            if (!check) {
                setShowError(true);
                setTimeout(() => { setShowError(false) }, 2000);
                return;
            }

            let dataUpdate = { ...formControl.data, ...values };
            if (imageUrl) {
                dataUpdate.logo = imageUrl
            }

            dataUpdate.category_id = parseInt(dataUpdate.category_id);
            delete dataUpdate.category;
            dataUpdate.active = dataUpdate.active === "true" ? true : false;

            try {
                const result = await instanceAxios.put(`/brands/update`, dataUpdate);
                if (result.data.statusCode === 200) {
                    handleShowAlert(result.data.message, "success")
                }
            } catch (error) {
                handleShowAlert(error.response.data.message, "error")
            }
            dispatch(getBrands())
            handleClose()
            return;
        }

        const check = usernamePattern.test(values.name) && imageUrl && values.category_id;
        if (!check) {
            setShowError(true);
            setTimeout(() => { setShowError(false) }, 2000);
            return;
        }

        const data = { ...values, logo: imageUrl };
        data.category_id = parseInt(data.category_id);

        try {
            const result = await instanceAxios.post("/brands/create", data);
            if (result.data.statusCode === 201) {
                handleShowAlert(result.data.message, "success")
            }
        } catch (error) {
            console.log(error);
            handleShowAlert(error.response.data.message, "error")
        }
        dispatch(getBrands())
        handleClose()
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
                <DialogTitle>Subscribe</DialogTitle>
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
                        defaultValue={formControl.data?.name}
                    />

                    <FormControl sx={{ minWidth: 80 }}>
                        <Avatar style={{ width: 100, height: 'fit-content', marginTop: 12 }} alt="Avatar"
                            src={imageUrl || formControl.data?.logo}
                            variant="rounded" />
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                            style={{ color: "white", marginTop: 10 }}
                            size="small"
                        >
                            Upload file
                            <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
                        </Button>
                    </FormControl>

                    <FormControl fullWidth style={{ marginTop: 12 }}>
                        <InputLabel id="demo-simple-select-label-cate" style={{ height: 32 }}>Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label-cate"
                            id="demo-simple-select"
                            label="Category"
                            style={{ height: 32 }}
                            name="category_id"
                            defaultValue={formControl.title === "Update" ? formControl.data.category.id : null}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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

                    {
                        showError &&
                        <DialogContentText style={{ color: "red" }}>
                            Data field pattern mismatch.
                        </DialogContentText>
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
                                    <MDButton size="small" onClick={handleClickOpen}>Add</MDButton>
                                    <MDBox>
                                        <Box sx={{ minWidth: 100 }}>
                                            <FormControl fullWidth>
                                                <InputLabel style={{ color: "white", height: 32 }} id="demo-simple-select-label">Category</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Category"
                                                    style={{ width: 100, height: 32, color: "red" }}
                                                    onChange={(event) => handleChangeSelectCategory(event.target.value)}
                                                >
                                                    <MenuItem value={''}>All</MenuItem>
                                                    {categories.map(cate => (
                                                        <MenuItem key={cate.id} value={cate.name}>{cate.name}</MenuItem>
                                                    ))}
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
                                                    {brands
                                                        .filter((item) => item.name.toLowerCase().includes(keyword.trim().toLowerCase()))
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((row) => {
                                                            return (
                                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                                    <TableCell key="logo" align="center">
                                                                        <Avatar variant="rounded" alt="Avatar" src={row.logo}
                                                                            style={{ width: 50, height: 'fit-content' }} />
                                                                    </TableCell>
                                                                    <TableCell key="name" align="left">
                                                                        {row.name}
                                                                    </TableCell>
                                                                    <TableCell key="active" align="center">
                                                                        {row.active ? "Active" : "Disable"}
                                                                    </TableCell>
                                                                    <TableCell key="category" align="center">
                                                                        {row.category.name}
                                                                    </TableCell>
                                                                    <TableCell key="action" align="center">
                                                                        <Icon fontSize="small"
                                                                            style={{ marginRight: 12, cursor: "pointer", color: "green" }}
                                                                            onClick={() => handleClickEdit(row)}>
                                                                            edit_icon
                                                                        </Icon>
                                                                        <Icon fontSize="small"
                                                                            style={{ cursor: "pointer", color: "red" }}
                                                                            onClick={() => handleDelete(row.id)}>
                                                                            delete_icon
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
                                            count={brands.length}
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

export default Brands;