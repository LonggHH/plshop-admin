// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
//
import Avatar from '@mui/material/Avatar';
import MDButton from "components/MDButton";

// modal
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled, alpha } from '@mui/material/styles';
import { uploadImage } from "../../common/upload";
import MDAlert from "components/MDAlert";
import instanceAxios from "../../configs/axios";
import { useSelector, useDispatch } from "react-redux";
import { getVariationByProductId } from "../../redux/slices/variation";
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Icon from "@mui/material/Icon";
import { useNavigate } from "react-router-dom";

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

function Variations() {
    const product = JSON.parse(localStorage.getItem("product_variation")) || {};

    const { columns, rows } = authorsTableData();
    const { columns: pColumns, rows: pRows } = projectsTableData();

    const dispatch = useDispatch();
    const variations = useSelector(state => state.variation.data);
    const [formControl, setFormControl] = useState(defaultValuesForm);
    const [imageUrl, setImageUrl] = useState();
    const [showError, setShowError] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", color: "error" });

    const handleClose = () => {
        setImageUrl();
        setFormControl(defaultValuesForm);
    };

    const handleShowAlert = (message, color) => {
        setAlert({ show: true, message, color });
        setTimeout(() => {
            setAlert({ show: false, message: "", color: "error" });
        }, 2000);
    }

    const handleClickOpen = () => {
        setFormControl(pre => ({ ...pre, open: true }));
    };

    const handleFileChange = async (e) => {
        const url = await uploadImage(e.target.files[0]);
        setImageUrl(url);
    }

    const handleClickEdit = (variation) => {
        setFormControl({ open: true, title: "Update", data: variation })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = {};
        for (let [name, value] of formData.entries()) {
            values[name] = value;
        }

        values.price = parseFloat(values.price);
        values.stock = parseInt(values.stock);

        if (values.price <= 0 || values.stock <= 0) {
            setShowError(true);
            setTimeout(() => { setShowError(false) }, 2000);
            return;
        }

        if (formControl.title === "Update") {

            const dataUpdate = { ...values, image: imageUrl || formControl.data.image, id: formControl.data.id };

            try {
                const result = await instanceAxios.put(`/variations/update`, dataUpdate);
                if (result.data.statusCode === 200) {
                    handleShowAlert(result.data.message, "success")
                }
            } catch (error) {
                handleShowAlert(error.response.data.message, "error")
            }
            dispatch(getVariationByProductId(product.id))
            handleClose()
            return;
        }

        const data = { ...values, image: imageUrl, product_id: product.id };
        try {
            const result = await instanceAxios.post(`/variations/create`, data);
            if (result.data.statusCode === 201) {
                handleShowAlert(result.data.message, "success")
            }
        } catch (error) {
            handleShowAlert(error.response.data.message, "error")
        }
        dispatch(getVariationByProductId(product.id))
        handleClose()
    }

    const handleDelete = async (id) => {
        try {
            const result = await instanceAxios.delete(`/variations/${id}`);
            if (result.data.statusCode === 200) {
                handleShowAlert(result.data.message, "success")
            }
        } catch (error) {
            console.log(error);
            handleShowAlert(error.response.data.message, "error")
        }
        dispatch(getVariationByProductId(product.id))
        handleClose()
    }

    useEffect(() => {
        dispatch(getVariationByProductId(product.id));
    }, [])

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
                <DialogTitle>{formControl.title} Variation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Be careful when updating this information, making sure you remember your information.
                    </DialogContentText>

                    <TextField
                        autoFocus required margin="dense" type="text"
                        id="color" name="color" label="Color" variant="standard"
                        defaultValue={formControl.data?.color}
                    />

                    <TextField
                        required margin="dense" type="text" style={{ marginLeft: 12, marginRight: 12 }}
                        id="price" name="price" label="Price" variant="standard"
                        defaultValue={formControl.data?.price}
                    />

                    <TextField
                        required margin="dense" type="number"
                        id="stock" name="stock" label="Stock" variant="standard"
                        defaultValue={formControl.data?.stock}
                    />

                    <TextField
                        required margin="dense" type="text" disabled
                        id="sold" label="Sold" variant="standard"
                        sx={{ marginLeft: 1, marginRight: 3 }}
                        defaultValue={formControl.data?.sold}
                    />

                    <FormControl sx={{ minWidth: 80 }}>
                        <Avatar style={{ width: 120, height: 'fit-content', marginTop: 12 }} alt="Avatar"
                            src={imageUrl || formControl.data?.image}
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
                                <MDBox pt={1} pb={1} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <Avatar
                                        alt="Avatar"
                                        src={product.defaultImage}
                                        variant="rounded"
                                        style={{ width: 120, height: 'fit-content', marginTop: 12 }}
                                    />
                                    <span style={{ backgroundColor: "#66d9ff", border: "1px solid #66d9ff", borderRadius: 4, height: "fit-content", color: "white" }}>{product.name}</span>
                                    <span style={{ backgroundColor: "#00ff55", border: "1px solid #00ff55", borderRadius: 4, height: "fit-content", color: "white" }}>{product.brand.name}</span>
                                    <span style={{ backgroundColor: "pink", border: "1px solid pink", borderRadius: 4, height: "fit-content", color: "white" }}>${product.price}</span>
                                </MDBox>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={3}
                                    px={2}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                >
                                    <MDButton size="small" onClick={handleClickOpen}>Add</MDButton>
                                </MDBox>
                                <MDBox pt={3}>
                                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                        <TableContainer sx={{ maxHeight: 440 }}>
                                            <Table stickyHeader aria-label="sticky table">
                                                <TableBody>
                                                    {variations
                                                        .map((row) => {
                                                            return (
                                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                                    <TableCell key="logo" align="center">
                                                                        <Avatar variant="rounded" alt="Avatar" src={row.image}
                                                                            style={{ width: 50, height: 'fit-content' }} />
                                                                    </TableCell>
                                                                    <TableCell key="name" align="left">
                                                                        <span style={{ color: `${row.color}` }}>{row.color}</span>
                                                                    </TableCell>
                                                                    <TableCell key="stock" align="left">
                                                                        {row.stock}
                                                                    </TableCell>
                                                                    <TableCell key="stock" align="left">
                                                                        {row.sold}
                                                                    </TableCell>
                                                                    <TableCell key="price" align="center">
                                                                        ${row.price}
                                                                    </TableCell>
                                                                    <TableCell key="actions" align="center">
                                                                        <Icon fontSize="small"
                                                                            style={{ marginRight: 12, cursor: "pointer", color: "green" }}
                                                                            onClick={() => handleClickEdit(row)}
                                                                        >
                                                                            edit_icon
                                                                        </Icon>
                                                                        <Icon fontSize="small"
                                                                            style={{ cursor: "pointer", color: "red" }}
                                                                            onClick={() => handleDelete(row.id)}
                                                                        >
                                                                            delete_icon
                                                                        </Icon>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
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

export default Variations;