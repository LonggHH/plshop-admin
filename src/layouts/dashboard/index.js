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

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useSelector } from "react-redux";

function Dashboard() {
    const { sales, tasks } = reportsLineChartData;

    const brands = useSelector(state => state.brand.data);
    const products = useSelector(state => state.product.data);
    const orders = useSelector(state => state.order.data);
    const accounts = useSelector(state => state.account.data);

    function calculateProducts(dataArray) {
        const currentDate = new Date();
        const firstDayOfWeek = new Date(currentDate);
        firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        firstDayOfWeek.setHours(0, 0, 0, 0);
        const filteredData = dataArray.filter(item => {
            const itemDate = new Date(item.createdAt);
            return itemDate >= firstDayOfWeek && itemDate <= currentDate;
        });
        const percent = parseInt(filteredData.length / dataArray.length * 100);
        return [filteredData.length, dataArray.length, percent];
    }

    function calculateOrders(dataArray) {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        const filteredData = dataArray.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= firstDayOfMonth && itemDate <= currentDate && item.status;
        });

        const totalMoneyLastMonth = filteredData.reduce((total, item) => total + parseFloat(item.total), 0);
        const countOrderLastMonth = filteredData.length;

        const dataAccept = filteredData.filter((item) => item.status === 'accept');

        const totalMoneyHave = dataAccept.reduce((total, item) => total + parseFloat(item.total), 0);
        const countOrderHave = dataAccept.length;

        const percentMoney = (totalMoneyHave / totalMoneyLastMonth * 100).toFixed(2);

        return [countOrderHave, countOrderLastMonth, totalMoneyHave.toFixed(2), totalMoneyLastMonth.toFixed(2), parseInt(percentMoney)];
    }

    const [countProductWeek, countProduct, percentProduct] = calculateProducts(products);
    const [countOrderHave, countOrderLastMonth, totalMoneyHave, totalMoneyLastMonth, percentMoney] = calculateOrders(orders);


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox py={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="dark"
                                icon="weekend"
                                title="Products"
                                count={`${countProductWeek} / ${countProduct}`}
                                percentage={{
                                    color: "success",
                                    amount: `+${percentProduct}%`,
                                    label: "than lask week",
                                }}
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                icon="leaderboard"
                                title="Bills"
                                count={
                                    <div style={{ fontSize: 14 }}>
                                        <span>{countOrderHave} / {countOrderLastMonth}</span>
                                        <p>${totalMoneyHave} / ${totalMoneyLastMonth}</p>
                                    </div>
                                }
                                percentage={{
                                    color: "success",
                                    amount: `+${percentMoney}%`,
                                    label: "than last month",
                                }}
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="success"
                                icon="store"
                                title="Brands"
                                count={brands.length}
                                percentage={{
                                    color: "success",
                                    amount: "+1%",
                                    label: "than yesterday",
                                }}
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="primary"
                                icon="person_add"
                                title="Users"
                                count={`+${accounts.length}`}
                                percentage={{
                                    color: "success",
                                    amount: "",
                                    label: "Just updated",
                                }}
                            />
                        </MDBox>
                    </Grid>
                </Grid>
                <MDBox mt={4.5}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={4}>
                            <MDBox mb={3}>
                                <ReportsBarChart
                                    color="info"
                                    title="website views"
                                    description="Last Campaign Performance"
                                    date="campaign sent 2 days ago"
                                    chart={reportsBarChartData}
                                />
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <MDBox mb={3}>
                                <ReportsLineChart
                                    color="success"
                                    title="daily sales"
                                    description={
                                        <>
                                            (<strong>+15%</strong>) increase in today sales.
                                        </>
                                    }
                                    date="updated 4 min ago"
                                    chart={sales}
                                />
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <MDBox mb={3}>
                                <ReportsLineChart
                                    color="dark"
                                    title="completed tasks"
                                    description="Last Campaign Performance"
                                    date="just updated"
                                    chart={tasks}
                                />
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>
                {/* <MDBox>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={8}>
                            <Projects />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <OrdersOverview />
                        </Grid>
                    </Grid>
                </MDBox> */}
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Dashboard;
