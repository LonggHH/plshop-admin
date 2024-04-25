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
import MDButton from "components/MDButton";

// Modal
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from "react";
import { usernamePattern } from "constants/regex";
import { useSelector, useDispatch } from "react-redux";
import instanceAxios from "configs/axios";
import MDAlert from "components/MDAlert";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Typography from '@mui/material/Typography';
import Icon from "@mui/material/Icon";
import { getCategories } from "../../redux/slices/category";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const defaultValuesForm = { open: false, title: "Add", data: null };


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    display: 'flex',
    justifyContent: 'space-between'
}));

function Categories() {

    const categories = useSelector(state => state.category.data);

    const dispatch = useDispatch();
    const [formControl, setFormControl] = useState(defaultValuesForm);
    const [showError, setShowError] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", color: "error" });

    const handleShowAlert = (message, color) => {
        setAlert({ show: true, message, color });
        setTimeout(() => {
            setAlert({ show: false, message: "", color: "error" });
        }, 2000);
    }

    const handleClickOpen = () => {
        setFormControl(pre => ({ ...pre, open: true }));
    };

    const handleClose = () => {
        setFormControl(defaultValuesForm);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = {};
        for (let [name, value] of formData.entries()) {
            values[name] = value;
        }

        const check = usernamePattern.test(values.name);
        if (!check) {
            setShowError(true);
            setTimeout(() => { setShowError(false) }, 2000);
            return;
        }

        if (formControl.title === "Update") {
            const data = { ...formControl.data, ...values };
            data.active = data.active === 'true' ? true : false;

            try {
                const result = await instanceAxios.put(`/categories/update`, data);
                if (result.data.statusCode === 200) {
                    handleShowAlert(result.data.message, "success")
                }
            } catch (error) {
                handleShowAlert(error.response.data.message, "error")
            }
            dispatch(getCategories())
            handleClose()
            return;
        }

        try {
            const result = await instanceAxios.post("/categories/create", values);
            if (result.data.statusCode === 201) {
                handleShowAlert(result.data.message, "success")
            }
        } catch (error) {
            handleShowAlert(error.response.data.message, "error")
        }
        dispatch(getCategories())
        handleClose()
    }

    const handleDeleteCategory = async (id) => {
        try {
            const result = await instanceAxios.delete(`/categories/${id}`);
            console.log(result);
            if (result.data.statusCode === 200) {
                handleShowAlert(result.data.message, "success")
            }
        } catch (error) {
            console.log(error);
            handleShowAlert(error.response.data.message, "error")
        }
        dispatch(getCategories())
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
                disableBackdropClick={true}
                PaperProps={{
                    component: 'form',
                    onSubmit: onSubmit,
                }}
            >
                <DialogTitle>{formControl.title} Category</DialogTitle>
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
                    {
                        showError &&
                        <DialogContentText style={{ color: "red" }}>
                            Data field pattern mismatch.
                        </DialogContentText>
                    }
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
                                    mx={2}
                                    mt={-3}
                                    py={3}
                                    px={2}
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                >
                                    <MDButton onClick={handleClickOpen}>Add</MDButton>
                                </MDBox>

                                <Grid container spacing={2} pt={3} pb={1}>
                                    {
                                        categories.map(category => (
                                            <Grid item xs={3} key={category.id}>
                                                <Item >
                                                    <Box style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                        <Avatar variant="rounded">
                                                            <AssignmentIcon />
                                                        </Avatar>
                                                        <Typography variant="h5" gutterBottom
                                                            style={{ opacity: `${category.active ? 1 : 0.5}` }}
                                                        >
                                                            {category.name}
                                                        </Typography>
                                                    </Box>
                                                    <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <Icon
                                                            fontSize="small"
                                                            sx={{ color: "green", cursor: "pointer" }}
                                                            onClick={() => setFormControl({ open: true, title: "Update", data: category })}
                                                        >
                                                            edit_icon
                                                        </Icon>
                                                        <Icon
                                                            fontSize="small"
                                                            sx={{ color: "red", cursor: "pointer" }}
                                                            onClick={() => handleDeleteCategory(category.id)}
                                                        >
                                                            delete_icon
                                                        </Icon>
                                                    </Box>
                                                </Item>
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
                <Footer />
            </DashboardLayout>
        </>
    );
}

export default Categories;