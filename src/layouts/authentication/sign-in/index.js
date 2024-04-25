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

import { useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import MDAlert from "components/MDAlert";
import axios from "axios";
import { ROLE } from "constants/constant";
import { useDispatch } from "react-redux";
import { saveAdmin } from "../../../redux/slices/auth";

function Basic() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [rememberMe, setRememberMe] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", color: "error" });

    const handleSetRememberMe = () => setRememberMe(!rememberMe);

    const handleShowAlert = (message, color) => {
        setAlert({ show: true, message, color });
        setTimeout(() => {
            setAlert({ show: false, message: "", color: "error" });
        }, 2000);
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const values = {};
        for (let [name, value] of formData.entries()) {
            values[name] = value;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/;
        const checkLogin = emailRegex.test(values.email) && passwordRegex.test(values.password);

        if (!checkLogin) {
            setAlert({ show: true, message: "Please enter a valid input", color: "error" });
            setTimeout(() => {
                setAlert({ show: false, message: "", color: "error" });
            }, 2000);
        } else {
            try {
                const result = await axios.post('http://localhost:3003/auth/login', { ...values, role: ROLE.ADMIN });
                if (result.data.statusCode === 200) {
                    dispatch(saveAdmin(result.data.data));
                    handleShowAlert(result.data.message, "success");
                    navigate("/dashboard", { replace: true });
                }
            } catch (error) {
                handleShowAlert(error.response.data.message, "error");
            }
        }
    };

    return (
        <>
            {alert.show &&
                <div style={{ position: "fixed", top: 0, right: 0, zIndex: 1 }}>
                    <MDAlert color={alert.color} dismissible>
                        <MDTypography variant="body2" color="white">
                            {alert.message}
                        </MDTypography>
                    </MDAlert>
                </div>
            }
            <BasicLayout image={bgImage}>
                <Card>
                    <MDBox
                        variant="gradient"
                        bgColor="info"
                        borderRadius="lg"
                        coloredShadow="info"
                        mx={2}
                        mt={-3}
                        p={2}
                        mb={1}
                        textAlign="center"
                    >
                        <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                            Sign in
                        </MDTypography>
                        <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                            <Grid item xs={2}>
                                <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                                    <FacebookIcon color="inherit" />
                                </MDTypography>
                            </Grid>
                            <Grid item xs={2}>
                                <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                                    <GitHubIcon color="inherit" />
                                </MDTypography>
                            </Grid>
                            <Grid item xs={2}>
                                <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                                    <GoogleIcon color="inherit" />
                                </MDTypography>
                            </Grid>
                        </Grid>
                    </MDBox>
                    <MDBox pt={4} pb={3} px={3}>
                        <MDBox component="form" role="form" onSubmit={onSubmit}>
                            <MDBox mb={2}>
                                <MDInput name="email" type="email" label="Email" fullWidth
                                    inputProps={{
                                        pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
                                        title: "Please enter a valid email"
                                    }}
                                />
                            </MDBox>
                            <MDBox mb={2}>
                                <MDInput name="password" type="password" label="Password" fullWidth />
                            </MDBox>
                            <MDBox display="flex" alignItems="center" ml={-1}>
                                <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                                <MDTypography
                                    variant="button"
                                    fontWeight="regular"
                                    color="text"
                                    onClick={handleSetRememberMe}
                                    sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                                >
                                    &nbsp;&nbsp;Remember me
                                </MDTypography>
                            </MDBox>
                            <MDBox mt={4} mb={1}>
                                <MDButton variant="gradient" color="info" fullWidth type="submit">
                                    sign in
                                </MDButton>
                            </MDBox>
                            <MDBox mt={3} mb={1} textAlign="center">
                                <MDTypography variant="button" color="text">
                                    Don&apos;t have an account?{" "}
                                    <MDTypography
                                        component={Link}
                                        to="/authentication/sign-up"
                                        variant="button"
                                        color="info"
                                        fontWeight="medium"
                                        textGradient
                                    >
                                        Sign up
                                    </MDTypography>
                                </MDTypography>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                </Card>
            </BasicLayout>
        </>
    );
}

export default Basic;
