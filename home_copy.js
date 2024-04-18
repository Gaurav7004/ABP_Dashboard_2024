import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./App.css";
import BarChart from "./components/BarChart";
import VerticalBarChart from "./components/VerticalBarChart";
import LineChart from "./components/LineChart";
import PieChart from "./components/PieChart";
import TrendsChart from "./components/TrendsChart";
import DoughnutChart from "./components/DoughnutChart";
import { UserData } from "./Data";
import Login from "./login_component/login";
import footer from "./assets/images/footer_abp_dashboard.png";
import Logo from "./assets/images/logo.png";
import digitalIndia from "./assets/images/digital-india.png";
import g20Logo from "./assets/images/g20-logo.png";
import hmisLogo from "./assets/images/hmis.png";
import nrhmLogo from "./assets/images/nrhm-logo.png";
import axios from 'axios';
// import Grid from '@mui/material/Grid'; // Grid version 1
import multiSelectDropdownButton from "./dropdowns/dropdownBtn";
import { useLocation, useNavigate } from 'react-router-dom';
import ReactTable from "./components/ReactTable"; 
import * as XLSX from "xlsx";

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import MultipleSelectDropdown from "./dropdowns/multi_select_dropdown";


function Home() {

    const [activeTab, setActiveTab] = useState('home');

    const location = useLocation();

    const newData = location?.state?.message?.rows;

    console.log(newData, ' +++ New Data +++ ');

    const officerName = [...new Set(newData.map(item => item?.nodal_officer_name))]
    // console.log(newData);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    // -----------                        ---------------------------
    // ----------- For unique selections  ---------------------------
    // -----------                        ---------------------------

    const uniqueStates = [...new Set(newData.map(item => item.state))];
    const uniqueDistrict = [...new Set(newData.map(item => item.district))];

    const uniqueBlockObject = [...new Set(newData.reduce((acc, item) => {
                                acc.push(item.block1);
                                acc.push(item.block2);
                                return acc;
                              }, []))
                            ];

  const uniqueBlock = Array.from(uniqueBlockObject);
  const uniqueFinancialYear = [...new Set(newData.map(item => item.year))];
  const Months = [...new Set(newData.map(item => item.month))];


// Assuming you want to update labels, state, district, and data fields
const updatedUserData1 = {

  labels: newData.map(item => item.Month), // Update with the appropriate property
  // state: newData.map(item => item.state),      // Update with the appropriate property
  state: uniqueStates,
  district: uniqueDistrict, // Update with the appropriate property
  block: uniqueBlock,
  month: Months,
  year: uniqueFinancialYear,
  datasets: [
              {
                label: " 1st Trimester Registration (%) ",
                data: newData.map(item => item["1st Trimester Registration (%)"]),
                backgroundColor: [
                  "rgba(75,192,192,1)",
                  "#ecf0f1",
                  "#50AF95",
                  "#f3ba2f",
                  "#2a71d0",
                ],
                borderColor: "black",
                borderWidth: 2,
              },
            ],
};


const updatedUserData2 = {

  labels: newData.map(item => item.Month), // Update with the appropriate property
  state: newData.map(item => item.state),      // Update with the appropriate property
  district: newData.map(item => item.district), // Update with the appropriate property
  block: uniqueBlock,
  month: Months,
  year: uniqueFinancialYear,
  datasets: [
                  {
                    label: " Percentage Institutional Deliveries ",
                    data: newData.map(item => item["Institutional Delivery (%)"]),
                    backgroundColor: [
                      "rgba(75,192,192,1)",
                      "#ecf0f1",
                      "#50AF95",
                      "#f3ba2f",
                      "#2a71d0",
                    ],
                    borderColor: "black",
                    borderWidth: 2,
                  },
                ],
};



const updatedUserData3 = {

  labels: newData.map(item => item.Month), // Update with the appropriate property
  state: newData.map(item => item.state),      // Update with the appropriate property
  district: newData.map(item => item.district), // Update with the appropriate property
  block: uniqueBlock,
  month: Months,
  year: uniqueFinancialYear,
  datasets: [
                  {
                    label: " Low Birth Weight (%) ",
                    data: newData.map(item => item["Low Birth Weight (%)"]),
                    backgroundColor: [
                      "rgba(75,192,192,1)",
                      "#ecf0f1",
                      "#50AF95",
                      "#f3ba2f",
                      "#2a71d0",
                    ],
                    borderColor: "black",
                    borderWidth: 2,
                  },
                ],
};


    const extractUniqueStates = (data) => {
    const uniqueStates = [...new Set(data.map((item) => item.state))];
    return uniqueStates.length > 0 ? uniqueStates[0] : ''; // Set the first unique state as the initial state, or an empty string if none
    };

    const extractUniqueDistricts = (data) => {
    const uniqueDistrict = [...new Set(data.map((item) => item.district))];
    return uniqueDistrict.length > 0 ? uniqueDistrict[0] : ''; // Set the first unique district as the initial state, or an empty string if none
    };

    const extractUniqueBlocks = (data) => {
        const uniqueBlock = [...new Set(data.map((item) => item.block))];
        return uniqueBlock.length > 0 ? uniqueBlock[0] : ''; // Set the first unique district as the initial state, or an empty string if none
        };

    const extractUniqueMonth1 = (data) => {
      const uniqueMonth1 = [...new Set(data.map((item) => item.month))];
      return uniqueMonth1.length > 0 ? uniqueMonth1[0] : ''; // Set the first unique district as the initial state, or an empty string if none
      };

    const extractUniqueMonth2 = (data) => {
      const uniqueMonth2 = [...new Set(data.map((item) => item.month))];
      return uniqueMonth2.length > 0 ? uniqueMonth2[0] : ''; // Set the first unique district as the initial state, or an empty string if none
      };

    const extractUniqueFinancialYear = (data) => {
      const uniqueFinancialYear = [...new Set(data.map((item) => item.year))];
      return uniqueFinancialYear.length > 0 ? uniqueFinancialYear[0] : ''; // Set the first unique district as the initial state, or an empty string if none
      };


    const KPI_options = [
      { id: 1, label:"1st Trimester Registration (%)"},
      { id: 2, label:"Institutional Delivery (%)"},
      { id: 3, label:"Low Birth Weight (%)"},
      { id: 4, label:"NQAS certified health facilities (%)"},
      { id: 5, label:"Person screened for Hypertension (%)"},
      { id: 6, label:"Person screened for Diabetes (%)"},
      { id: 7, label:"Treatment success rate (%)"},
    ];


  // 
  const [selectedState, setSelectedState] = useState(extractUniqueStates(newData));
  const [selectedDistrict, setSelectedDistrict] = useState(extractUniqueDistricts(newData));
  const [selectedBlock, setSelectedBlock] = useState(extractUniqueBlocks(newData));
  const [selectedKPI, setSelectedKPI] = useState([]);
  const [selectedMonth1, setSelectedMonth1] = useState(extractUniqueMonth1(newData));
  const [selectedMonth2, setSelectedMonth2] = useState(extractUniqueMonth2(newData));
  const [selectedFinancialYear, setelectedFinancialYear] = useState(extractUniqueFinancialYear(newData));

  const [trendsDataTab2, setTrendsDataTab2] = useState({
    labels: newData.map(item => item.month),
    state: [],
    district: [],
    block: [],
    month: [],
    year: [],
    datasets: [
      {
        label: "National Average",
        data: newData.map(item => item.month),
        fill: false,
        borderColor: "#4dff4d",
        borderWidth: 2,
        tension: 0.1,
      },
      {
        label: "State Average",
        data: [],
        fill: false,
        borderColor: "#ffff00",
        borderWidth: 2,
        tension: 0.1,
      },
      {
        label: "District Average",
        data: [],
        fill: false,
        borderColor: "#ffff00",
        borderWidth: 2,
        tension: 0.1,
      },
      {
        label: "Block Average",
        data: [],
        fill: false,
        borderColor: "#ff6600",
        borderWidth: 2,
        tension: 0.1,
      },
    ],
  });
  

  const [filteredData, setFilteredData] = useState({
        labels: [],
        state: [],
        district: [],
        block: [],
        datasets: [],
    });

const [indicator, setIndicator] = useState([]);
const [month, setMonth] = useState([]);



// handling user specific block data (TAB 4)
const handleFilterButtonClick = () => {
    axios.post('http://localhost:4000/fetch-data', { selectedState, selectedDistrict, selectedBlock, selectedMonth1, selectedMonth2, selectedFinancialYear })
        .then(response => {
            const responseData = response.data.rows;

            // Your mapping logic here
            const updatedUserData1 = {
              labels: responseData.map(item => item.month),
              state: responseData.map(item => item.state),
              district: responseData.map(item => item.district),
              block: responseData.map(item => item.block),
              month: Months,
              year: responseData.map(item => item.year),
              datasets: [
                  {
                      label: " 1st Trimester Registration (%) ",
                      data: responseData.map(item => item["1st Trimester Registration (%)"]),
                      backgroundColor: [
                          "rgba(75,192,192,1)",
                          "#ecf0f1",
                          "#50AF95",
                          "#f3ba2f",
                          "#2a71d0",
                      ],
                      borderColor: "black",
                      borderWidth: 2,
                  },
              ],
            };

            const updatedUserData2 = {
                labels: responseData.map(item => item.Month), // Update with the appropriate property
                state: responseData.map(item => item.State),      // Update with the appropriate property
                district: responseData.map(item => item.District), // Update with the appropriate property
                block: responseData.map(item => item.Block),
                datasets: [
                            {
                              label: " Percentage Institutional Deliveries ",
                              data: responseData.map(item => item["Institutional Delivery (%)"]),
                              backgroundColor: [
                                "rgba(75,192,192,1)",
                                "#ecf0f1",
                                "#50AF95",
                                "#f3ba2f",
                                "#2a71d0",
                              ],
                              borderColor: "black",
                              borderWidth: 2,
                            },
                        ],
              };

              const updatedUserData3 = {
                labels: responseData.map(item => item.Month), // Update with the appropriate property
                state: responseData.map(item => item.State),      // Update with the appropriate property
                district: responseData.map(item => item.District), // Update with the appropriate property
                block: responseData.map(item => item.Block),
                datasets: [
                            {
                              label: " Low Birth Weight (%) ",
                              data: responseData.map(item => item["Low Birth Weight (%)"]),
                              backgroundColor: [
                                "rgba(75,192,192,1)",
                                "#ecf0f1",
                                "#50AF95",
                                "#f3ba2f",
                                "#2a71d0",
                              ],
                              borderColor: "black",
                              borderWidth: 2,
                            },
                          ],
              };

            // Update the state with the filtered result
            setFilteredData([updatedUserData1, updatedUserData2, updatedUserData3]);

            // console.log(updatedUserData1, '-----updatedUserData1-------==');
        })
        .catch(error => {
            console.error('Error:', error);
        });
};



  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);
  };

  const handleBlockChange = (event) => {
    const selectedBlock = event.target.value;

    // Update the state for the selected block
    setSelectedBlock(selectedBlock);
  };

  const TrendschartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    dataset1: [65, 59, 80, 81, 56, 55, 40], // Data for Dataset 1
    dataset2: [28, 48, 40, 19, 86, 27, 90], // Data for Dataset 2
  };


const [commonfilteredDataTop5, setCommonFilteredDataTop5] = useState({
    labels: [],
    datasets: [],
});

const [commonfilteredDataTop5_2, setCommonFilteredDataTop5_2] = useState({
    labels: [],
    datasets: [],
});

const [commonfilteredDataTop5_3, setCommonFilteredDataTop5_3] = useState({
    labels: [],
    datasets: [],
});

const [commonfilteredDataBottom5, setCommonFilteredDataBottom5] = useState({
    labels: [],
    datasets: [],
});

const [commonfilteredDataBottom5_2, setCommonFilteredDataBottom5_2] = useState({
    labels: [],
    datasets: [],
});

const [commonfilteredDataBottom5_3, setCommonFilteredDataBottom5_3] = useState({
    labels: [],
    datasets: [],
});

useEffect(() => {

    // const fetchData_ = async () => {

    // };
    
    const fetchData = async () => {
    //   try {
        const response = await axios.post('http://localhost:4000/common-fetch-data');
        // setData(response.data);
        // console.log(response.data.top5, '--- useEffect ----');

        // Your mapping logic here
        const VerticalBarUserDataTop5 = {
            labels: response.data.top5_1.map(item => item.block), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " 1st Trimester Registration (%) ",
                              data: response.data.top5_1.map(item => item["1st Trimester Registration (%)"]),
                              backgroundColor: [
                                "rgba(75,192,192,1)",
                                "#ecf0f1",
                                "#50AF95",
                                "#f3ba2f",
                                "#2a71d0",
                              ],
                              borderColor: "black",
                              borderWidth: 2,
                            },
                          ],
          };
          setCommonFilteredDataTop5(VerticalBarUserDataTop5); 


        // Your mapping logic here
        const VerticalBarUserDataTop5_2 = {
            labels: response.data.top5_2.map(item => item.block), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " Institutional Delivery (%) ",
                              data: response.data.top5_2.map(item => item["Institutional Delivery (%)"]),
                              backgroundColor: [
                                "rgba(75,192,192,1)",
                                "#ecf0f1",
                                "#50AF95",
                                "#f3ba2f",
                                "#2a71d0",
                              ],
                              borderColor: "black",
                              borderWidth: 2,
                            },
                          ],
          };
          setCommonFilteredDataTop5_2(VerticalBarUserDataTop5_2); 


        // Your mapping logic here
        const VerticalBarUserDataTop5_3 = {
            labels: response.data.bottom5_3.map(item => item.block), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " Low Birth Weight (%) ",
                              data: response.data.bottom5_3.map(item => item["Low Birth Weight (%)"]),
                              backgroundColor: [
                                "rgba(75,192,192,1)",
                                "#ecf0f1",
                                "#50AF95",
                                "#f3ba2f",
                                "#2a71d0",
                              ],
                              borderColor: "black",
                              borderWidth: 2,
                            },
                          ],
          };
          setCommonFilteredDataTop5_3(VerticalBarUserDataTop5_3); 


        // Your mapping logic here
        const VerticalBarUserDataBottom5 = {
            labels: response.data.bottom5_1.map(item => item.block), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " 1st Trimester Registration (%) ",
                              data: response.data.bottom5_1.map(item => item["1st Trimester Registration (%)"]),
                              backgroundColor: [
                                "rgba(75,192,192,1)",
                                "#ecf0f1",
                                "#50AF95",
                                "#f3ba2f",
                                "#2a71d0",
                              ],
                              borderColor: "black",
                              borderWidth: 2,
                            },
                          ],
          };
          setCommonFilteredDataBottom5(VerticalBarUserDataBottom5); 

          const VerticalBarUserDataBottom5_2 = {
            labels: response.data.bottom5_2.map(item => item.block), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " Institutional Delivery (%) ",
                              data: response.data.bottom5_2.map(item => item["Institutional Delivery (%)"]),
                              backgroundColor: [
                                "rgba(75,192,192,1)",
                                "#ecf0f1",
                                "#50AF95",
                                "#f3ba2f",
                                "#2a71d0",
                              ],
                              borderColor: "black",
                              borderWidth: 2,
                            },
                          ],
          };
          setCommonFilteredDataBottom5_2(VerticalBarUserDataBottom5_2); 


          const VerticalBarUserDataBottom5_3 = {
            labels: response.data.top5_3.map(item => item.block), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " Low Birth Weight (%) ",
                              data: response.data.top5_3.map(item => item["Low Birth Weight (%)"]),
                              backgroundColor: [
                                "rgba(75,192,192,1)",
                                "#ecf0f1",
                                "#50AF95",
                                "#f3ba2f",
                                "#2a71d0",
                              ],
                              borderColor: "black",
                              borderWidth: 2,
                            },
                          ],
          };
          setCommonFilteredDataBottom5_3(VerticalBarUserDataBottom5_3); 

          // console.log(VerticalBarUserDataBottom5, '******* VerticalBarUserDataBottom ******')

        // } catch (error) {
        //         console.error('Error fetching data:', error);
    //   }
    };

    fetchData();
}, []);




// Example usage in your component
const trends_data  = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "National Average",
        data: [79.42, 79.42, 79.42, 79.42, 79.42],
        fill: false,
        borderColor: "#4dff4d",
        tension: 0.1,
      },
      {
        label: "State Average",
        data: [71.45, 71.45, 71.45, 71.45, 71.45],
        fill: false,
        borderColor: "#ffff00",
        tension: 0.1,
      },
      {
        label: "Block Average",
        data: [61.45, 63.5, 60.45, 59.05, 58.49],
        fill: false,
        borderColor: "#ff6600",
        tension: 0.1,
      },
      // Add more datasets as needed
    ],
  };



// handling user specific block data (TAB 2)
const handleFilterButtonClick_TAB2 = async () => {
  // try {

  const response = await axios.post('http://localhost:4000/fetch-data-tab2', {selectedKPI, selectedState, selectedDistrict, selectedBlock, selectedMonth1, selectedMonth2, selectedFinancialYear })
      .then(response => {
          const responseTab2Data = response.data.rows;
          console.log(responseTab2Data, '--- TAB 2 --- RESPONSE ---'); // Do something with the fetched data

          const trendsDataTab2 = {
            labels: responseTab2Data.map(item => item.month),
            // state: [],
            // district: [],
            // block: [],
            // month: [],
            // year: [],
            datasets: [
              {
                label: "National Average",
                data: responseTab2Data.map(item => parseFloat(item["1st Trimester Registration (%)"])),
                fill: false,
                borderColor: "#4dff4d",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "State Average",
                data: [4,5],
                fill: false,
                borderColor: "#ffff00",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "District Average",
                data: responseTab2Data.map(item => parseFloat(item["1st Trimester Registration (%)"])),
                fill: false,
                borderColor: "#ffff00",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "Block Average",
                data: responseTab2Data.map(item => parseFloat(item["1st Trimester Registration (%)"])),
                fill: false,
                borderColor: "#ff6600",
                borderWidth: 2,
                tension: 0.1,
              },
            ],
          };

          setTrendsDataTab2(trendsDataTab2);

    });

  
  // } catch (error) {
  //   console.error('Error fetching data:', error);
  // }
};


  
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform any logout logic, such as clearing local storage, etc.
    // For example, to clear token from localStorage:
    localStorage.removeItem('token');

    // Redirect to the login page
    navigate('/login');
  };

  const tableData = [
    { "1st Trimester Registration (%)": 38.1, "Institutional Delivery (%)": 33.33, "Low Birth Weight (%)": 0 },
    { "1st Trimester Registration (%)": 80, "Institutional Delivery (%)": null, "Low Birth Weight (%)": null },
    { "1st Trimester Registration (%)": 60, "Institutional Delivery (%)": 0, "Low Birth Weight (%)": 0 },
    { "1st Trimester Registration (%)": 80, "Institutional Delivery (%)": 15.15, "Low Birth Weight (%)": 0 },
    { "1st Trimester Registration (%)": 67.42, "Institutional Delivery (%)": 53.13, "Low Birth Weight (%)": 6.45 }
  ];

  const exportToExcel = () => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = "data_export";

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Create blob and download link
    const blob = new Blob([excelBuffer], { type: fileType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName + fileExtension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (

    <div>

      {/* Header */}
      {/* ------ */}
      <div className="header">
        <div className="header_left">
          <h2 style={{ color: 'DodgerBlue', textAlign: 'left' }}>Aspirational Blocks Programme</h2>
          <img src={Logo} alt="Logo"/>
        </div>
        <div className="header_right">
          <img src={hmisLogo} alt="HMIS Logo"/>
          <img src={g20Logo} alt="G20 Logo" />
          <img src={digitalIndia} alt="Digital India Logo" />
          <img src={nrhmLogo} alt="NRHM Logo" />
        </div> 
      </div>

      <div className="navbar">
        {/* Tabs */}

        <button className="button" onClick={() => handleTabClick('home')}>Home</button>
        <button className="button" onClick={() => handleTabClick('trends')}>Monthly Trends</button>
        <button className="button" onClick={() => handleTabClick('relative_position')}>Relative Position of Block</button>
        <button className="button" onClick={() => handleTabClick('blockPerformance')}>Block Performance</button>

        <button className="button" onClick={() => handleLogout('logout')}>Log out</button>
      </div>

      
           
      {/* <h2 className="header" style={{ color: 'DodgerBlue' }}> </h2> */}

      {/* Tab content */}
      {activeTab === 'home' && (
        <div>
          <label style={{ backgroundColor: 'yellow' }}>
            <h1 style={{ color: '#29B6F6', textAlign: 'center', lineHeight: '0.5' }}>100 Lowest Performing Blocks</h1>
          </label>

          
          <div className="header">
            <div className="row">
            
              <p style={{ color: '#29B6F6', textAlign: 'center', lineHeight: '0.5' }}>Top 5 Performer Blocks</p>
              <div className="tile">
                <div className="tile">
                  <VerticalBarChart chartData={commonfilteredDataTop5} />
                </div>

                <div className="tile">
                  <VerticalBarChart chartData={commonfilteredDataTop5_2} />
                </div>

                <div className="tile">
                  <VerticalBarChart chartData={commonfilteredDataTop5_3} />
                </div>
              </div>
          </div>
        </div>


        <div className="header">
            <div className="row">
                <p style={{ color: '#29B6F6', textAlign: 'center', lineHeight: '0.5' }}>Bottom 5 Performer Blocks</p>
              <div className="tile">
                <div className="tile">
                  <VerticalBarChart chartData={commonfilteredDataBottom5} />
                </div>
                <div className="tile">
                  <VerticalBarChart chartData={commonfilteredDataBottom5_2} />
                </div>
                <div className="tile">
                  <VerticalBarChart chartData={commonfilteredDataBottom5_3} />
                </div>

              </div>
            </div>
        </div>

      <h1 style={{ color: '#29B6F6', textAlign: 'center', lineHeight: '1.5' }}>
        Welcome<br />
        CNO - {officerName}
      </h1>

          <div className="header">

            {/* <Card variant="outlined" */}

            <div className="tile">
                <h2 className="tile-title">27</h2>
                <img className="tile-content" src="https://abp.championsofchange.gov.in/assets/img/anganwadi.svg"></img>
                <p className="tile-content">Sub Center</p>
            </div>
            <div className="tile">
                <h2 className="tile-title">0</h2>
                <img className="tile-content" src="https://abp.championsofchange.gov.in/assets/img/panchayat.svg"></img>
                <p className="tile-content">Primary Health Center</p>
            </div>
            <div className="tile">
                <h2 className="tile-title">15</h2>
                <img className="tile-content" src="https://abp.championsofchange.gov.in/assets/img/schools.svg"></img>
                <p className="tile-content">Community Health Center</p>
            </div>
            <div className="tile">
                <h2 className="tile-title">19</h2>
                <img className="tile-content" src="https://abp.championsofchange.gov.in/assets/img/villages.svg"></img>
                <p className="tile-content">Sub District Hospital</p>
            </div>
            <div className="tile">
                <h2 className="tile-title">19</h2>
                <img className="tile-content" src="https://abp.championsofchange.gov.in/assets/img/villages.svg"></img>
                <p className="tile-content">District Hospital</p>
            </div>
          </div>

          <div className="header">
            <img src="https://abp.championsofchange.gov.in/assets/img/titlebottom.svg"></img>
          </div>
    

      

        </div>
        )}

      
        {activeTab === 'relative_position' && (
          <div>

            <div className="tile">

              <div className="select-container">
                <div className="select-item">
                  <h3>Select State:</h3>
                  <select
                    onChange={(e) => setSelectedState(e.target.value)}
                    value={selectedState}
                  >
                    {updatedUserData1.state.map((state, index) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="select-item">
                  <h3>Select District:</h3>
                  <select
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    value={selectedDistrict}
                  >
                    {updatedUserData1.district.map((district, index) => (
                      <option key={index} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="select-item">
                  <h3>Select Block:</h3>
                  <select
                    onChange={(e) => setSelectedBlock(e.target.value)}
                    value={selectedBlock}
                  >
                    {updatedUserData1.block.map((block, index) => (
                      <option key={index} value={block}>
                        {block}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="select-item">
                  <h3>From Month:</h3>
                  <select onChange={(e) => setSelectedMonth1(e.target.value)} value={selectedMonth1}>
                    {updatedUserData1.month.map((month, index) => (
                    <option key={index} value={month}>
                        {month}
                    </option>
                    ))}
                  </select>
                </div>

                <div className="select-item">
                  <h3>To Month:</h3>
                  <select onChange={(e) => setSelectedMonth2(e.target.value)} value={selectedMonth2}>
                    {updatedUserData1.month.map((month, index) => (
                    <option key={index} value={month}>
                        {month}
                    </option>
                    ))}
                  </select> 
                </div>

                <div className="select-item">
                  <h3>Financial Year:</h3>
                  <select onChange={handleStateChange} value={selectedDistrict || ""}>
                    <option>2023-24</option>
                  </select>  
                </div>

                <div className="select-item">
                  <button className="login-button" onClick={handleFilterButtonClick}>
                    Search
                  </button>
                </div>

              </div>
              </div>
            
            {/* First Row */}
            <div className="header_new">
              {/* Tile 1 */}
              <div className="tile_new">
                <div className="title_new">
                  <strong><p style={{ fontSize:"1vw" }}>1st Trimester Registration (%)</p></strong>
                </div>
                <div className="doughnut-container">
                  <DoughnutChart />
                </div>
              </div>
              
              {/* Tile 2 */}
              <div className="tile_new">
                <div className="title_new">
                  <strong><p style={{ fontSize:"1vw" }}>Institutional Delivery (%)</p></strong>
                </div>
                <div className="doughnut-container">
                  <DoughnutChart />
                </div>
              </div>
              
              {/* Tile 3 */}
              <div className="tile_new">
                <div className="title_new">
                  <strong><p style={{ fontSize:"1vw" }}>Low Birth Weight (%)</p></strong>
                </div>
                <div className="doughnut-container">
                  <DoughnutChart />
                </div>
              </div>
            </div>

            {/* Second Row */}
            <div className="header_new">
              {/* Tile 4 */}
              <div className="tile_new">
                <div className="title_new">
                  <strong><p style={{ fontSize:"1vw" }}>NQAS certified health facilities (%)</p></strong>
                </div>
                <div className="doughnut-container">
                  <DoughnutChart />
                </div>
              </div>
              
              {/* Tile 5 */}
              <div className="tile_new">
                <div className="title_new">
                  <strong><p style={{ fontSize:"1vw" }}>Hypertension (%)</p></strong>
                </div>
                <div className="doughnut-container">
                  <DoughnutChart />
                </div>
              </div>
              
              {/* Tile 6 */}
              <div className="tile_new">
                <div className="title_new">
                  <strong><p style={{ fontSize:"1vw" }}>Diabetes (%)</p></strong>
                </div>
                <div className="doughnut-container">
                  <DoughnutChart />
                </div>
              </div>
            </div>

            {/* Third Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '30%', alignItems: 'center' }} className="tile_new">
                <div className="title_new">
                  <strong><p style={{ fontSize:"1vw" }}>Treatment success rate (%)</p></strong>
                </div>
                <div className="doughnut-container">
                  <DoughnutChart />
                </div>
              </div>
            </div>

          </div>
        )}



      {activeTab === 'trends' && (
        
        <div>

          <div className="header">
            <h1 style={{ color: 'DodgerBlue', textAlign: 'center', lineHeight: '0.5' }}>Trends of Performance of an Indicator</h1>
          </div>

          
          

            
          {/* <div className="header"> */}
            <div className="tile">
              <div className="select-container">

                  <div className="select-item">
                    <MultipleSelectDropdown options={KPI_options} buttonText="Select KPI" setSelectedKPI={setSelectedKPI} />
                  </div>

                  <div className="select-item">
                    <h3> Select State: </h3>
                    <div style={{ height: "20px" }}>
                      <select onChange={(e) => setSelectedState(e.target.value)} value={selectedState}>
                        {updatedUserData1.state.map((state, index) => (
                          <option key={state} value={selectedState}>
                              {selectedState}
                          </option>
                          ))}
                      </select>
                    </div>
                  </div>
                

                  <div className="select-item">
                    <h3> Select District: </h3>
                    <div style={{ height: "20px" }}>
                        <select onChange={(e) => setSelectedDistrict(e.target.value)} value={selectedDistrict}>
                            {updatedUserData1.state.map((state, index) => (
                              <option key={state} value={selectedDistrict}>
                                  {selectedDistrict}
                              </option>
                              ))}
                        </select>
                    </div>
                  </div>

                  <div className="select-item">
                    <h3> Select Block: </h3>
                    <div>
                      <select onChange={(e) => setSelectedBlock(e.target.value)} value={selectedBlock}>
                          {updatedUserData1.block.map((block, index) => (
                          <option key={index} value={block}>
                              {block}
                          </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="select-item">
                    <h3> From Month: </h3>
                    <div>
                      <select onChange={(e) => setSelectedMonth1(e.target.value)} value={selectedMonth1}>
                        {updatedUserData1.month.map((month, index) => (
                        <option key={index} value={month}>
                            {month}
                        </option>
                        ))}
                      </select>
                    </div>
                  </div> 

                  <div className="select-item">
                    <h3> To Month: </h3>
                    <div>
                      <select onChange={(e) => setSelectedMonth2(e.target.value)} value={selectedMonth2}>
                          {updatedUserData1.month.map((month, index) => (
                          <option key={index} value={month}>
                              {month}
                          </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="select-item">
                    <h3> Financial Year: </h3>
                    <div>
                        <select onChange={handleStateChange} value={selectedDistrict || ""}>
                            <option >
                            {/* {updatedUserData1.block.map((block) => (
                                <option>
                                    {block}
                                </option>
                                ))} */}
                                2023-24
                            </option>
                        </select>
                    </div>
                  </div>

                  <div className="select-item">   
                    <div>
                      <button className="login-button" onClick={handleFilterButtonClick_TAB2}> Plot </button>
                    </div>
                  </div>
                  
                  </div>
           
              </div>

            <div>
              <div className="header_new">

                {/* Tile 1 */}
                <div className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize:"1vw" }}>1st Trimester Registration (%)</p></strong>
                  </div>
                  <div className="doughnut-container">
                    <LineChart chartData={trends_data}/>
                  </div>
                </div>

                {/* Tile 2 */}
                <div className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize:"1vw" }}>Institutional Delivery (%) (%)</p></strong>
                  </div>
                  <div className="doughnut-container">
                    <LineChart chartData={trendsDataTab2}/>
                  </div>
                </div>

                {/* Tile 3 */}
                <div className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize:"1vw" }}>Low Birth Weight (%) (%)</p></strong>
                  </div>
                  <div className="doughnut-container">
                    <LineChart chartData={trendsDataTab2}/>
                  </div>
                </div>
              </div>

              <div className="header_new">

                {/* Tile 4 */}
                <div className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize:"1vw" }}>NQAS certified health facilities (%)</p></strong>
                  </div>
                  <div className="doughnut-container">
                    <LineChart chartData={trendsDataTab2}/>
                  </div>
                </div>
                {/* Tile 5 */}
                <div className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize:"1vw" }}>Hypertension (%)</p></strong>
                  </div>
                  <div className="doughnut-container">
                    <LineChart chartData={trendsDataTab2}/>
                  </div>
                </div>
                {/* Tile 6 */}
                <div className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize:"1vw" }}>Diabetes (%)</p></strong>
                  </div>
                  <div className="doughnut-container">
                    <LineChart chartData={trendsDataTab2}/>
                  </div>
                </div>
              </div>
            </div>

          {/* Third Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '30%', alignItems: 'center' }} className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>Treatment success rate (%)</p></strong>
              </div>
              <div className="doughnut-container">
                <LineChart chartData={trendsDataTab2}/>
              </div>
            </div>
          </div>

          <div>
            <h1>Data Table</h1>
            <button onClick={exportToExcel}>Export</button>
            <ReactTable data={tableData} />
              
          </div>

        </div>
      )}



      {activeTab === 'blockPerformance' && (
        
        <div>

          <div className="tile">

            <div className="select-container">
              <div className="select-item">
                <h3>Select State:</h3>
                {/* <select
                  onChange={(e) => setSelectedState(e.target.value)}
                  value={selectedState}
                >
                  {updatedUserData1.state.map((state, index) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select> */}

                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">State</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedState}
                      label="state"
                      onChange={(e) => setSelectedState(e.target.value)}
                    >
                      {updatedUserData1.state.map((state, index) => (
                        <MenuItem key={state} value={state}>
                          {state}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
              </div>
            </div>


          


            <div className="select-container">
              <div className="select-item">
                <h3>Select District:</h3>
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">District</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedBlock}
                      label="state"
                      onChange={(e) => setSelectedBlock(e.target.value)}
                    >
                      {updatedUserData1.district.map((district, index) => (
                        <MenuItem key={district} value={district}>
                          {district}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </div>

              <div className="select-item">
                <h3>Select Block:</h3>
                <select
                  onChange={(e) => setSelectedBlock(e.target.value)}
                  value={selectedBlock}
                >
                  {updatedUserData1.block.map((block, index) => (
                    <option key={index} value={block}>
                      {block}
                    </option>
                  ))}
                </select>
              </div>

              <div className="select-item">
                <h3>From Month:</h3>
                  <select onChange={(e) => setSelectedMonth1(e.target.value)} value={selectedMonth1}>
                    {updatedUserData1.month.map((month, index) => (
                    <option key={index} value={month}>
                        {month}
                    </option>
                    ))}
                  </select>
              </div>

              <div className="select-item">
                <h3>To Month:</h3>
                  <select onChange={(e) => setSelectedMonth2(e.target.value)} value={selectedMonth2}>
                    {updatedUserData1.month.map((month, index) => (
                    <option key={index} value={month}>
                        {month}
                    </option>
                    ))}
                  </select>
              </div>

              <div className="select-item">
                <h3>Financial Year:</h3>
                <select onChange={handleStateChange} value={selectedDistrict || ""}>
                  <option>2023-34</option>
                </select>  
              </div>

              <div className="select-item">
                <button className="login-button" onClick={handleFilterButtonClick}>
                  Search
                </button>
              </div>
              
            </div>  
          </div>

          
          <div className="header_new">

            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>1st Trimester Registration (%)</p></strong>
              </div>
              <div className="tile-content">
                {filteredData && filteredData[0] && filteredData[0].labels ? (
                      <BarChart chartData={filteredData[0]} />
                      ) : (
                      <p>data will display after search</p>
                  )}
              </div>
            </div>

            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>Institutional Delivery (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {filteredData && filteredData[0] && filteredData[0].labels ? (
                      <BarChart chartData={filteredData[1]} />
                      ) : (
                      <p>data will display after search</p>
                  )}
              </div>
            </div>
            
            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>Low Birth Weight (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {filteredData && filteredData[0] && filteredData[0].labels ? (
                      <BarChart chartData={filteredData[2]} />
                      ) : (
                      <p>data will display after search</p>
                  )}
              </div>
            </div>

          </div>


          <div className="header_new">

            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>NQAS certified health facilities (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {filteredData && filteredData[0] && filteredData[0].labels ? (
                      <BarChart chartData={filteredData[0]} />
                      ) : (
                      <p>data will display after search</p>
                  )}
              </div>
            </div>

            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>Hypertension (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {filteredData && filteredData[0] && filteredData[0].labels ? (
                      <BarChart chartData={filteredData[1]} />
                      ) : (
                      <p>data will display after search</p>
                  )}
              </div>
            </div>
            
            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>Diabetes (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {filteredData && filteredData[0] && filteredData[0].labels ? (
                      <BarChart chartData={filteredData[2]} />
                      ) : (
                      <p>data will display after search</p>
                  )}
              </div>
            </div>
          </div>


          {/* Third Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '30%', alignItems: 'center' }} className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>Treatment success rate (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {filteredData && filteredData[0] && filteredData[0].labels ? (
                        <BarChart chartData={filteredData[2]} />
                        ) : (
                        <p>data will display after search</p>
                    )}
              </div>
            </div>
          </div>

        </div>
          
      )}
      

      {/* <div className="footer">
        <h2 >TEST DASHBOARD HMIS</h2>
      </div> */}

      <div className="footer">
        <img className="footer-image" src={footer} alt="HMIS Footer"/>
      </div>
    </div>
    
  );
}

export default Home;