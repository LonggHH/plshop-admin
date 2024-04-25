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
import brand, { getBrands } from "../../redux/slices/brand";
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
import { productNamePattern } from "constants/regex";
import { getProducts } from "../../redux/slices/products";
import { useNavigate } from "react-router-dom";

import { checkImage } from "./checkImage"

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

function Products() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const categories = useSelector(state => state.category.data.filter(cate => cate.active));
    const [selectCategory, setSelectCategory] = useState("");
    const brands = useSelector(state =>
        state.brand.data
            .filter(brand => brand.category.name.includes(selectCategory))
            .filter(b => b.active)
    );
    const [selectBrand, setSelectBrand] = useState("");
    const products = useSelector(state => state.product.data
        .filter(p => p.brand.name.includes(selectBrand))
    );

    const [formControl, setFormControl] = useState(defaultValuesForm);
    const [imageUrl, setImageUrl] = useState();
    const [imagesUrl, setImagesUrl] = useState(["", "", ""]);
    const [showError, setShowError] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", color: "error" });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangeSelectCategory = (value) => {
        setSelectCategory(value)
    }

    const handleChangeSelectBrand = (value) => {
        setSelectBrand(value)
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

    const handleFileSChange = async (e, i) => {
        const url = await uploadImage(e.target.files[0]);

        if (formControl.title === "Update") {
            try {
                const result = await instanceAxios.put('/products/update-image', { ...formControl.data.images[i], image_path: url });
                if (result.data.statusCode === 200) {
                    handleShowAlert(result.data.message, "success")
                }

                const linksImage = [...imagesUrl]
                linksImage[i] = url
                setImagesUrl(linksImage);
            } catch (error) {
                handleShowAlert(error.response.data.message, "error")
            }
            return;
        }

        const linksImage = [...imagesUrl]
        linksImage[i] = url
        setImagesUrl(linksImage);
    }

    const handleClickOpen = () => {
        setFormControl(pre => ({ ...pre, open: true }));
    };

    const handleClose = () => {
        setImageUrl();
        setImagesUrl(["", "", ""]);
        setFormControl(defaultValuesForm);
    };

    const handleDelete = async (id) => {
        try {
            const result = await instanceAxios.delete(`/products/${id}`);
            if (result.data.statusCode === 200) {
                // console.log(result.data);
                handleShowAlert(result.data.message, "success")
            }
        } catch (error) {
            handleShowAlert(error.response.data.message, "error")
        }
        dispatch(getProducts())
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

            const check = productNamePattern.test(values.name);
            if (!check) {
                setShowError(true);
                setTimeout(() => { setShowError(false) }, 2000);
                return;
            }

            let dataUpdate = { ...formControl.data, ...values };
            if (imageUrl) {
                dataUpdate.default_image = imageUrl
            } else {
                dataUpdate.default_image = formControl.data.defaultImage
            }

            dataUpdate.active = dataUpdate.active === "true" ? true : false;
            dataUpdate.discount_percentage = parseInt(dataUpdate.discount_percentage);
            dataUpdate.brand_id = parseInt(dataUpdate.brand_id);
            dataUpdate.price = parseFloat(dataUpdate.price)

            delete dataUpdate.images;
            delete dataUpdate.brand;
            delete dataUpdate.averageRating;
            delete dataUpdate.discountPercentage;
            delete dataUpdate.createdAt;
            delete dataUpdate.defaultImage;

            try {
                const result = await instanceAxios.put(`/products/update`, dataUpdate);
                if (result.data.statusCode === 201) {
                    handleShowAlert(result.data.message, "success")
                }
            } catch (error) {
                handleShowAlert(error.response.data.message, "error")
            }
            dispatch(getProducts())
            handleClose()
            return;
        }

        const check = productNamePattern.test(values.name) && imageUrl && values.brand_id;
        if (!check) {
            setShowError(true);
            setTimeout(() => { setShowError(false) }, 2000);
            return;
        }

        const data = { ...values, default_image: imageUrl, images: imagesUrl };
        data.discount_percentage = parseInt(data.discount_percentage);
        data.brand_id = parseInt(data.brand_id);
        data.price = parseFloat(data.price)

        try {
            const result = await instanceAxios.post("/products/create", data);
            if (result.data.statusCode === 201) {
                handleShowAlert(result.data.message, "success")
            }
        } catch (error) {
            // console.log(error);
            handleShowAlert(error.response.data.message, "error")
        }
        dispatch(getProducts())
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
                <DialogTitle>{formControl.title} Product</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Be careful when updating this information, making sure you remember your information.
                    </DialogContentText>

                    <TextField
                        autoFocus required margin="dense" type="text"
                        id="name" name="name" label="Name" fullWidth variant="standard"
                        defaultValue={formControl.data?.name}
                    />

                    <TextField
                        autoFocus required margin="dense" type="text"
                        id="price" name="price" label="Price" variant="standard"
                        defaultValue={formControl.data?.price || 0}
                    />

                    <TextField
                        autoFocus required margin="dense" type="number"
                        id="discount_percentage" name="discount_percentage" label="Discount Percentage" variant="standard"
                        defaultValue={formControl.data?.discountPercentage || 0}
                    />

                    <TextField
                        autoFocus required margin="dense" type="text" disabled
                        id="average_rating" label="Average Rating" variant="standard"
                        defaultValue={formControl.data?.average_rating || 0}
                        sx={{ marginLeft: 1, marginRight: 3 }}
                    />

                    <FormControl sx={{ minWidth: 80 }}>
                        <Avatar style={{ width: 120, height: 'fit-content', marginTop: 12 }} alt="Avatar"
                            src={imageUrl || formControl.data?.defaultImage}
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
                        <InputLabel id="demo-simple-select-label-brand" style={{ height: 32 }}>Brand</InputLabel>
                        <Select
                            labelId="demo-simple-select-label-brand"
                            id="demo-simple-select"
                            label="Brand"
                            style={{ height: 32 }}
                            name="brand_id"
                            defaultValue={formControl.title === "Update" ? formControl.data.brand.id : null}
                        >
                            {brands.map((b) => (
                                <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 80 }}>
                        <Avatar style={{ width: 120, height: 'fit-content', marginTop: 12 }} alt="Avatar"
                            src={imagesUrl[0] || formControl.data?.images[0]?.image_path}
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
                            <VisuallyHiddenInput type="file" accept="image/*" onChange={(e) => handleFileSChange(e, 0)} />
                        </Button>
                    </FormControl>

                    <FormControl sx={{ minWidth: 80, marginLeft: 3, marginRight: 3 }}>
                        <Avatar style={{ width: 120, height: 'fit-content', marginTop: 12 }} alt="Avatar"
                            src={imagesUrl[1] || formControl.data?.images[1]?.image_path}
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
                            <VisuallyHiddenInput type="file" accept="image/*" onChange={(e) => handleFileSChange(e, 1)} />
                        </Button>
                    </FormControl>

                    <FormControl sx={{ minWidth: 80 }}>
                        <Avatar style={{ width: 120, height: 'fit-content', marginTop: 12 }} alt="Avatar"
                            src={imagesUrl[2] || formControl.data?.images[2]?.image_path}
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
                            <VisuallyHiddenInput type="file" accept="image/*" onChange={(e) => handleFileSChange(e, 2)} />
                        </Button>
                    </FormControl>

                    <TextField
                        autoFocus required margin="dense" type="text" multiline minRows={4}
                        id="specifications" name="specifications" label="Specifications" fullWidth variant="standard"
                        defaultValue={formControl.data?.specifications}
                    />

                    <TextField
                        autoFocus required margin="dense" type="text" multiline minRows={4}
                        id="description" name="description" label="Description" fullWidth variant="standard"
                        defaultValue={formControl.data?.description}
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
                                        <Box sx={{ minWidth: 100, display: "flex", gap: 1 }}>
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
                                            <FormControl fullWidth>
                                                <InputLabel style={{ color: "white", height: 32 }} id="demo-simple-select-label">Brand</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Brand"
                                                    style={{ width: 150, height: 32, color: "red" }}
                                                    onChange={(event) => handleChangeSelectBrand(event.target.value)}
                                                >
                                                    <MenuItem value={''}>All</MenuItem>
                                                    {brands.map(brand => (
                                                        <MenuItem key={brand.id} value={brand.name}>{brand.name}</MenuItem>
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
                                                    {products
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((row, index) => {
                                                            return (
                                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                                    <TableCell key="index" align="left">
                                                                        {index + 1}
                                                                    </TableCell>
                                                                    <TableCell key="logo" align="center">
                                                                        <Avatar variant="rounded" alt="Avatar" src={row.defaultImage}
                                                                            style={{ width: 50, height: 'fit-content' }} />
                                                                    </TableCell>
                                                                    <TableCell key="name" align="left">
                                                                        {row.name}
                                                                    </TableCell>
                                                                    <TableCell key="description" align="center">
                                                                        {row.description.substring(0, 30) + `${row.description.length > 30 ? "..." : ""}`}
                                                                    </TableCell>
                                                                    <TableCell key="specifications" align="center">
                                                                        {row.specifications.substring(0, 30) + `${row.specifications.length > 30 ? "..." : ""}`}
                                                                    </TableCell>
                                                                    <TableCell key="brand" align="center">
                                                                        {row.brand.name}
                                                                    </TableCell>
                                                                    <TableCell key="price" align="center">
                                                                        ${row.price}
                                                                    </TableCell>
                                                                    <TableCell key="active" align="center">
                                                                        {row.active ? "Active" : "Disable"}
                                                                    </TableCell>
                                                                    <TableCell key="actions" align="center">
                                                                        <Icon fontSize="small"
                                                                            style={{ marginRight: 12, cursor: "pointer", color: "blue" }}
                                                                            onClick={() => {
                                                                                localStorage.setItem("product_variation", JSON.stringify(row))
                                                                                navigate('/variations')
                                                                            }}
                                                                        >
                                                                            fork_right_icon
                                                                        </Icon>
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
                                            count={products.length}
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

export default Products;