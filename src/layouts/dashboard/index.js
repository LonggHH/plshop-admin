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
import { Button, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import MDInput from "components/MDInput";
import MixedChart from "examples/Charts/MixedChart";

import Paper from '@mui/material/Paper';

function Dashboard() {
    const { sales, tasks } = reportsLineChartData;

    const brands = useSelector(state => state.brand.data);
    const products = useSelector(state => state.product.data);
    const orders = useSelector(state => state.order.data);
    const accounts = useSelector(state => state.account.data);

    const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
    const [startYear, setStartYear] = useState(2023);
    const [selectYear, setSelectYear] = useState(currentYear);
    const years = [];
    for (let year = startYear; year <= currentYear; year++) {
        years.push(year);
    }


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

    function calculateMonthlyCounts(dataAccounts, year) {
        let monthlyCounts = {};

        // Lặp qua từng đơn hàng
        dataAccounts.forEach(order => {
            // Lấy ra ngày tạo đơn hàng và trích xuất tháng và năm
            let createdAt = new Date(order.createdAt);
            let month = createdAt.getMonth() + 1;
            let orderYear = createdAt.getFullYear();

            // Kiểm tra xem đơn hàng có thuộc năm yêu cầu không
            if (orderYear === year) {
                // Tăng số lượng người tham gia vào hệ thống cho tháng đó
                monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
            }
        });

        return {
            labels: Object.keys(monthlyCounts).map(month => month.toString()),
            datasets: { label: "User", data: Object.values(monthlyCounts) }
        };
    }

    function calculateMonthlyCountsOrders(dataOrders, year) {
        let monthlyCounts = {};

        // Lặp qua từng đơn hàng
        dataOrders.filter((order) => order.status.includes('accept')).forEach(order => {
            // Lấy ra ngày tạo đơn hàng và trích xuất tháng và năm
            let createdAt = new Date(order.date);
            let month = createdAt.getMonth() + 1;
            let orderYear = createdAt.getFullYear();

            // Kiểm tra xem đơn hàng có thuộc năm yêu cầu không
            if (orderYear === year) {
                // Tăng số lượng người tham gia vào hệ thống cho tháng đó
                monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
            }
        });

        return {
            labels: Object.keys(monthlyCounts).map(month => month.toString()),
            datasets: { label: "Order", data: Object.values(monthlyCounts) }
        };
    }

    function calculateMonthlyTotals(orders, year) {
        let monthlyTotals = {};

        // Lặp qua từng đơn hàng
        orders.filter((order) => order.status.includes('accept')).forEach(order => {
            // Lấy ra ngày tạo đơn hàng và trích xuất tháng và năm
            let createdAt = new Date(order.date);
            let month = createdAt.getMonth() + 1;
            let orderYear = createdAt.getFullYear();

            // Kiểm tra xem đơn hàng có thuộc năm yêu cầu không
            if (orderYear === year) {
                // Thêm giá trị đơn hàng vào tổng của tháng đó
                monthlyTotals[month] = (monthlyTotals[month] || 0) + parseFloat(order.total);
            }
        });

        return {
            labels: Object.keys(monthlyTotals).map(month => month.toString()),
            datasets: { label: "$", data: Object.values(monthlyTotals) }
        };
    }

    function formatUSD(amount) {
        return amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2, // Optional: Set the minimum number of decimal places (defaults to 2)
        });
    }

    const [countProductWeek, countProduct, percentProduct] = calculateProducts(products);

    const dbChartAcocunt = calculateMonthlyCounts(accounts, selectYear);

    const dbChartOrder = calculateMonthlyCountsOrders(orders, selectYear);

    const dbChartMoney = calculateMonthlyTotals(orders, selectYear);

    const totalMoneyOrder = orders.reduce((total, item) => { return total += parseFloat(item.total) }, 0);
    const totalMoneyOrderAccept = orders.filter(item => item.status.includes('accept')).reduce((total, item) => { return total += parseFloat(item.total) }, 0);

    function groupSalesByIdAndMonth(salesData) {
        return salesData.reduce((acc, { productId, date }) => {
            const saleDate = new Date(date);
            const year = saleDate.getUTCFullYear();
            const month = saleDate.getUTCMonth() + 1; // getUTCMonth() trả về 0-11, nên cần +1 để ra tháng 1-12

            // Tạo đối tượng cho productId nếu chưa tồn tại
            if (!acc[productId]) {
                acc[productId] = {};
            }

            // Tạo đối tượng cho năm nếu chưa tồn tại
            if (!acc[productId][year]) {
                acc[productId][year] = {};
            }

            // Tạo đối tượng cho tháng nếu chưa tồn tại
            if (!acc[productId][year][month]) {
                acc[productId][year][month] = 0;
            }

            // Tăng số lượng sản phẩm cho tháng tương ứng
            acc[productId][year][month]++;

            return acc;
        }, {});
    }

    function statisticalProducts() {
        let newOrders = [...orders];
        newOrders = newOrders.map((item) => {
            let details = item.details;
            details = details.map(e => { return { ...e, date: item.date } })
            return [...details]
        })
        newOrders = newOrders.flat();
        newOrders = newOrders.map(item => {
            return {
                ...JSON.parse(item.variation),
                date: item.date
            }
        })

        const groupById = newOrders.reduce((acc, obj) => {
            // Nếu acc chưa có một mảng cho id hiện tại, tạo một mảng mới
            if (!acc[obj.productId]) {
                acc[obj.productId] = [];
            }
            // Thêm object hiện tại vào mảng tương ứng với id của nó
            acc[obj.productId].push(obj);
            return acc;
        }, {});

        // Chuyển đối tượng trung gian thành mảng hai chiều
        let result = Object.values(groupById);
        result = result.flat();
        const salesByIdAndMonth = groupSalesByIdAndMonth(result);

        let resultDataYears = []
        for (const iterator in salesByIdAndMonth) {
            const data = {
                prouductId: +iterator,
                year: salesByIdAndMonth[iterator]
            }
            resultDataYears.push(data)
        }

        return resultDataYears;
    }
    const dataProductYears = statisticalProducts();
    // console.log(dataProductYears);

    function getNumberByMonth(data, year, month) {
        if (data[year] && data[year][month]) {
            return data[year][month]
        }
        return null;
    }
    let totalProduct = 0;

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
                                        <span>
                                            {orders.filter(item => item.status.includes('accept')).length}/{orders.length}
                                        </span>
                                        <p>
                                            {formatUSD(totalMoneyOrderAccept)}/{formatUSD(totalMoneyOrder)}
                                        </p>
                                    </div>
                                }
                                percentage={{
                                    color: "success",
                                    amount: `+10%`,
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

                <MDBox mt={2} style={{}}>
                    <div style={{ display: "flex", gap: 24 }}>
                        <span style={{ width: 68 }}>Year: </span>
                        {years.map(year => (
                            <span
                                key={year}
                                style={{
                                    borderRadius: 4,
                                    padding: "0px 5px",
                                    border: "1px solid #333",
                                    backgroundColor: `${selectYear === year ? "#f3d4d4" : ""}`,
                                    cursor: "pointer"
                                }}
                                onClick={() => setSelectYear(year)}
                            >{year}
                            </span>
                        ))}
                    </div>
                    {/* <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
                        <span style={{ width: 68 }}>Month: </span>
                        {Array(12).fill().map((month, index) => (
                            <span style={{ border: "1px solid #333", borderRadius: 4, padding: "0px 5px", minWidth: 40, textAlign: "center" }} key={month}>{index + 1}</span>
                        ))}
                    </div> */}
                </MDBox>

                <MDBox mt={4.5}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={4}>
                            <MDBox mb={3}>
                                <ReportsBarChart
                                    color="info"
                                    title="users"
                                    description={`+ ${dbChartAcocunt.datasets.data.reduce((total, item) => {
                                        return total += item
                                    }, 0)} user`}
                                    date="campaign sent 2 days ago"
                                    chart={dbChartAcocunt}
                                />
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <MDBox mb={3}>
                                <ReportsLineChart
                                    color="success"
                                    title="Orders"
                                    description={
                                        <>
                                            (<strong>+15%</strong>) increase in today sales.
                                        </>
                                    }
                                    date="updated 4 min ago"
                                    chart={dbChartOrder}
                                />
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <MDBox mb={3}>
                                <ReportsLineChart
                                    color="dark"
                                    title="Money"
                                    description="Last Campaign Performance"
                                    date="just updated"
                                    chart={dbChartMoney}
                                />
                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>

                <MDBox>
                    {/* <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={8}>
                            <Projects />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <OrdersOverview />
                        </Grid>
                    </Grid> */}
                    <Paper sx={{ width: '100%' }}>
                        <Table style={{ width: "100%", borderCollapse: "collapse", }}>

                            <TableRow>
                                <th style={{ width: 40, }}>No.</th>
                                <th style={{ width: 800, }}>Product</th>
                                {Array(12).fill().map((_, i) => (
                                    <th key={i} style={{}}>{i + 1}</th>
                                ))}
                                <th style={{ width: 400, }}>Total</th>
                            </TableRow>

                            <TableBody>
                                {dataProductYears.map((product, i) => {
                                    const productFind = products.find(item => item.id === product.prouductId)
                                    let total = 0;
                                    return (
                                        <TableRow key={i} style={{ width: 200, }}>
                                            <TableCell style={{ fontSize: 14 }}>{i + 1}</TableCell>
                                            <TableCell style={{ width: 200, fontSize: 14 }}>{productFind?.name}</TableCell>
                                            {Array(12).fill().map((_, i) => {
                                                const count = getNumberByMonth(product.year, selectYear, i + 1)
                                                total += count
                                                totalProduct += count
                                                return (
                                                    <TableCell key={i} style={{ width: 200, border: "1px solid #333", fontSize: 14, textAlign: "center" }}>
                                                        {count}
                                                    </TableCell>
                                                )
                                            })}
                                            <TableCell style={{ fontSize: 14, textAlign: "center" }}>{total}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>

                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={14} style={{ fontSize: 14, textAlign: "center", fontWeight: "bold" }}>Total number product sale</TableCell>
                                    <TableCell style={{ fontSize: 14, textAlign: "center" }}>{totalProduct}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                        {/* <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={products.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        /> */}
                    </Paper>
                </MDBox>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Dashboard;
