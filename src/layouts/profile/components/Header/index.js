/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import burceMars from "assets/images/bruce-mars.jpg";
import backgroundImage from "assets/images/bg-profile.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { saveAdmin, setFormEditProfile } from "../../../../redux/slices/auth";
import { GENDER } from "constants/constant";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { uploadImage } from "common/upload";
import { emailPattern, usernamePattern, phonePattern } from "constants/regex";
import instanceAxios from "configs/axios";

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

function Header({ children }) {
    const account = useSelector(state => state.auth.data);
    console.log(account);
    const formControl = useSelector(state => state.auth.form);
    const [imageUrl, setImageUrl] = useState(account.imagePath);
    const [showError, setShowError] = useState(false);
    const dispatch = useDispatch();
    const [tabsOrientation, setTabsOrientation] = useState("horizontal");
    const [tabValue, setTabValue] = useState(0);

    const handleFileChange = async (e) => {
        const url = await uploadImage(e.target.files[0]);
        setImageUrl(url);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const values = {};
        for (let [name, value] of formData.entries()) {
            values[name] = value;
        }

        const { name, email, phone } = values;
        const check = usernamePattern.test(name) && emailPattern.test(email) && phonePattern.test(phone);
        if (!check) {
            setShowError(true);
            setTimeout(() => { setShowError(false) }, 2000);
            return;
        }
        const data = { imagePath: imageUrl, ...values };
        const result = await instanceAxios.put('/accounts/update', data);
        dispatch(saveAdmin(result.data.data));
        handleClose();
    };

    const handleClose = () => {
        dispatch(setFormEditProfile({ isOpen: false }));
        setImageUrl(account.imagePath);
    };

    useEffect(() => {
        // A function that sets the orientation state of the tabs.
        function handleTabsOrientation() {
            return window.innerWidth < breakpoints.values.sm
                ? setTabsOrientation("vertical")
                : setTabsOrientation("horizontal");
        }

        /** 
         The event listener that's calling the handleTabsOrientation function when resizing the window.
        */
        window.addEventListener("resize", handleTabsOrientation);

        // Call the handleTabsOrientation function to set the state with the initial value.
        handleTabsOrientation();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleTabsOrientation);
    }, [tabsOrientation]);

    const handleSetTabValue = (event, newValue) => setTabValue(newValue);

    return (
        <>
            <MDBox position="relative" mb={5}>
                {
                    formControl.isOpen &&
                    <Dialog
                        open={formControl.isOpen}
                        onClose={handleClose}
                        PaperProps={{
                            component: 'form',
                            onSubmit: onSubmit,
                        }}
                    >
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Be careful when updating this information, making sure you remember your information.
                            </DialogContentText>
                            <TextField autoFocus margin="dense"
                                id="name" name="name" label="Username"
                                type="text" fullWidth variant="standard"
                                defaultValue={account.name}
                            />
                            <TextField margin="dense"
                                id="phone" name="phone" label="Phone"
                                type="text" fullWidth variant="standard"
                                defaultValue={account.phone}
                            />
                            <TextField margin="dense"
                                id="email" name="email" label="Email"
                                type="email" fullWidth variant="standard"
                                defaultValue={account.email}
                            />
                            <MDBox mb={2} />
                            <FormControl sx={{ minWidth: 80 }}>
                                <InputLabel id="demo-simple-select-autowidth-label">Gender</InputLabel>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    name="gender"
                                    autoWidth
                                    defaultValue={account.gender}
                                    label="Gender"
                                    style={{ width: 200, height: 40 }}
                                >
                                    {GENDER.map(gender => <MenuItem value={gender.value}>{gender.label}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ ml: 2, minWidth: 80 }}>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                    style={{ color: "white", }}
                                >
                                    Upload file
                                    <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
                                </Button>
                                <Avatar style={{ width: 100, height: 'fit-content', marginTop: 12 }} alt="Avatar" src={imageUrl} />
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
                }

                <MDBox
                    display="flex"
                    alignItems="center"
                    position="relative"
                    minHeight="18.75rem"
                    borderRadius="xl"
                    sx={{
                        backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
                            `${linearGradient(
                                rgba(gradients.info.main, 0.6),
                                rgba(gradients.info.state, 0.6)
                            )}, url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "50%",
                        overflow: "hidden",
                    }}
                />
                <Card
                    sx={{
                        position: "relative",
                        mt: -8,
                        mx: 3,
                        py: 2,
                        px: 2,
                    }}
                >
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <MDAvatar src={account.imagePath} alt="profile-image" size="xl" shadow="sm" />
                        </Grid>
                        <Grid item>
                            <MDBox height="100%" mt={0.5} lineHeight={1}>
                                <MDTypography variant="h5" fontWeight="medium">
                                    {account.name}
                                </MDTypography>
                                <MDTypography variant="button" color="text" fontWeight="regular">
                                    CEO / Co-Founder
                                </MDTypography>
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
                            <AppBar position="static">
                                <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                                    <Tab
                                        label="App"
                                        icon={
                                            <Icon fontSize="small" sx={{ mt: -0.25 }}>
                                                home
                                            </Icon>
                                        }
                                    />
                                    <Tab
                                        label="Message"
                                        icon={
                                            <Icon fontSize="small" sx={{ mt: -0.25 }}>
                                                email
                                            </Icon>
                                        }
                                    />
                                    <Tab
                                        label="Settings"
                                        icon={
                                            <Icon fontSize="small" sx={{ mt: -0.25 }}>
                                                settings
                                            </Icon>
                                        }
                                    />
                                </Tabs>
                            </AppBar>
                        </Grid>
                    </Grid>
                    {children}
                </Card>
            </MDBox>
        </>
    );
}

// Setting default props for the Header
Header.defaultProps = {
    children: "",
};

// Typechecking props for the Header
Header.propTypes = {
    children: PropTypes.node,
};

export default Header;
