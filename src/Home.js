import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./App.css";
import BarChart from "./components/BarChart";
import VerticalBarChart from "./components/VerticalBarChart";
import LineChart from "./components/LineChart";
import DoughnutChart from "./components/DoughnutChart";
import Speedometer from "./components/Speedometer";
import footer from "./assets/images/footer_abp_dashboard.png";
import Logo from "./assets/images/logo.png";
import digitalIndia from "./assets/images/digital-india.png";
import g20Logo from "./assets/images/g20-logo.png";
import hmisLogo from "./assets/images/hmis.png";
import nrhmLogo from "./assets/images/nrhm-logo.png";
import axios from 'axios';
// import Grid from '@mui/material/Grid'; // Grid version 1
import { useLocation, useNavigate } from 'react-router-dom';
import ReactTable from "./components/ReactTable"; 
import * as XLSX from "xlsx";

import MultipleSelectDropdown from "./dropdowns/kpi_select_dropdown";
import SingleSelectDropdown from "./dropdowns/dropdownBtn";


function Home() {

    const [activeTab, setActiveTab] = useState('home');

    const location = useLocation();

    const newData = location?.state?.message?.rows;

    if (location.state == null){
      window.location.href = '/login'
    }

    const officerName = [...new Set(newData.map(item => item?.nodal_officer_name))]

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    // -----------                        ---------------------------
    // ----------- For unique selections  ---------------------------
    // -----------                        ---------------------------

    const uniqueStates = [...new Set(newData.map(item => item.state))];
    const uniqueDistrict = [...new Set(newData.map(item => item.district))];

    const uniqueBlockObject = [...new Set(newData.reduce((acc, item) => {
                                if (item.block1 !== null) {
                                    acc.push(item.block1);
                                }
                                if (item.block2 !== null) {
                                    acc.push(item.block2);
                                }
                                return acc;
                            }, []))];
                          

    const uniqueBlock = Array.from(uniqueBlockObject);
  
    const uniqueFinancialYear = [...new Set(newData.map(item => item.year))];
    const Months = [...new Set(newData.map(item => item.month))];


    // Assuming you want to update labels, state, district, and data fields
    const updatedUserData1 = {

      labels: newData.map(item => item.Month), // Update with the appropriate property
      state: uniqueStates,
      district: uniqueDistrict, // Update with the appropriate property
      block: uniqueBlock,
      month: Months,
      year: uniqueFinancialYear,
      datasets: [
                  {
                    label: newData.map(item => item.Month),
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


    const extractUniqueStates = (data) => {
    const uniqueStates = [...new Set(data.map((item) => item.state))];
    return uniqueStates.length > 0 ? uniqueStates[0] : ''; // Set the first unique state as the initial state, or an empty string if none
    };

    const extractUniqueDistricts = (data) => {
    const uniqueDistrict = [...new Set(data.map((item) => item.district))];
    return uniqueDistrict.length > 0 ? uniqueDistrict[0] : ''; // Set the first unique district as the initial state, or an empty string if none
    };

    const extractUniqueBlocks = (data) => {
        const uniqueBlock = [...new Set(data.map((item) => item.block1))];
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
      { id: 1, label:'1st Trimester Registration (%)'},
      { id: 2, label:'Institutional Delivery (%)'},
      { id: 3, label:'Low Birth Weight (%)'},
      { id: 4, label:'NQAS certified health facilities (%)'},
      { id: 5, label:'Person screened for Hypertension (%)'},
      { id: 6, label:'Person screened for Diabetes (%)'},
      { id: 7, label:'Treatment success rate (%)'},
    ];


    const tableData = [
      { "1st Trimester Registration (%)": 38.1, "Institutional Delivery (%)": 33.33, "Low Birth Weight (%)": 0, "Percentage Test": 33.33, "Percentage Test": 0  },
      { "1st Trimester Registration (%)": 80, "Institutional Delivery (%)": null, "Low Birth Weight (%)": null,  "Percentage Test": 33.33, "Percentage Test": 0  },
      { "1st Trimester Registration (%)": 60, "Institutional Delivery (%)": 0, "Low Birth Weight (%)": 0,  "Percentage Test": 33.33, "Percentage Test": 0  },
      { "1st Trimester Registration (%)": 80, "Institutional Delivery (%)": 15.15, "Low Birth Weight (%)": 0,  "Percentage Test": 33.33, "Percentage Test": 0  },
      { "1st Trimester Registration (%)": 67.42, "Institutional Delivery (%)": 53.13, "Low Birth Weight (%)": 6.45,  "Percentage Test": 33.33, "Percentage Test": 0  }
    ];

    const chartDataTab3 = {
      national: {
        labels: ['National Avg'],
        datasets: [
          {
            data: [0, 0] ,
            backgroundColor: ['#00e676', '#DDDDDD'],
            hoverBackgroundColor: ['#00e676', '#DDDDDD']
          }
        ]
      },
      state: {
        labels: ['State Avg'],
        datasets: [
          {
            data: [0, 0],
            backgroundColor: ['#00e676', '#DDDDDD'],
            hoverBackgroundColor: ['#00e676', '#DDDDDD']
          }
        ]
      },
      district: {
        labels: ['District Avg'],
        datasets: [
          {
            data: [0, 0],
            backgroundColor: ['#36A2EB', '#DDDDDD'],
            hoverBackgroundColor: ['#36A2EB', '#DDDDDD']
          }
        ]
      },
      block: {
        labels: ['Block Avg'],
        datasets: [
          {
            data: [0, 0],
            backgroundColor: ['#FFCE56', '#DDDDDD'],
            hoverBackgroundColor: ['#FFCE56', '#DDDDDD']
          }
        ]
      }
    };


  // 
  const [selectedState, setSelectedState] = useState(extractUniqueStates(newData));
  const [selectedDistrict, setSelectedDistrict] = useState(extractUniqueDistricts(newData));
  const [selectedBlock, setSelectedBlock] = useState(extractUniqueBlocks(newData));
  const [selectedKPI, setSelectedKPI] = useState([]);
  const [selectedMonth1, setSelectedMonth1] = useState(extractUniqueMonth1(newData));
  const [selectedMonth2, setSelectedMonth2] = useState(extractUniqueMonth2(newData));
  const [selectedFinancialYear, setSelectedFinancialYear] = useState(extractUniqueFinancialYear(newData));
  
  const [trendsDataTab2_1, setTrendsDataTab2_1] = useState({});
  const [trendsDataTab2_2, setTrendsDataTab2_2] = useState({});
  const [trendsDataTab2_3, setTrendsDataTab2_3] = useState({});
  const [trendsDataTab2_4, setTrendsDataTab2_4] = useState({});
  const [trendsDataTab2_5, setTrendsDataTab2_5] = useState({});
  const [trendsDataTab2_6, setTrendsDataTab2_6] = useState({});
  const [trendsDataTab2_7, setTrendsDataTab2_7] = useState({});

  const [trendsDataTab3_1, setTrendsDataTab3_1] = useState(chartDataTab3);
  const [trendsDataTab3_2, setTrendsDataTab3_2] = useState(chartDataTab3);
  const [trendsDataTab3_3, setTrendsDataTab3_3] = useState(chartDataTab3);
  const [trendsDataTab3_4, setTrendsDataTab3_4] = useState(chartDataTab3);
  const [trendsDataTab3_5, setTrendsDataTab3_5] = useState(chartDataTab3);
  const [trendsDataTab3_6, setTrendsDataTab3_6] = useState(chartDataTab3);
  const [trendsDataTab3_7, setTrendsDataTab3_7] = useState(chartDataTab3);

  const [responseTab2Data_block, setresponseTab2Data_block] = useState([]);
  

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
 
    axios.post('http://localhost:4000/fetch-data-tab4', { selectedState, selectedDistrict, selectedBlock, selectedMonth1, selectedMonth2, selectedFinancialYear })
        .then(response => {
            const responseData = response.data;

            // Your mapping logic here
            const updatedUserDataTab4_1 = {
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
                        "#e8418d",
                        "#d4d746",
                        "#f3534b",
                        "#dd33fa",
                      ],
                      borderColor: "black",
                      borderWidth: 2,
                  },
              ],
            };

            const updatedUserDataTab4_2 = {
                labels: responseData.map(item => item.month), // Update with the appropriate property
                state: responseData.map(item => item.state),      // Update with the appropriate property
                district: responseData.map(item => item.district), // Update with the appropriate property
                block: responseData.map(item => item.block),
                month: Months,
                year: responseData.map(item => item.year),
                datasets: [
                            {
                              label: "Institutional Delivery (%)",
                              data: responseData.map(item => item["Institutional Delivery (%)"]),
                              backgroundColor: [
                                "rgba(75,192,192,1)",
                                "#ecf0f1",
                                "#50AF95",
                                "#f3ba2f",
                                "#2a71d0",
                                "#e8418d",
                                "#d4d746",
                                "#f3534b",
                                "#dd33fa",
                              ],
                              borderColor: "black",
                              borderWidth: 2,
                            },
                        ],
              };

              const updatedUserDataTab4_3 = {
                labels: responseData.map(item => item.month), // Update with the appropriate property
                state: responseData.map(item => item.state),      // Update with the appropriate property
                district: responseData.map(item => item.district), // Update with the appropriate property
                block: responseData.map(item => item.block),
                month: Months,
                year: responseData.map(item => item.year),
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
                                "#e8418d",
                                "#d4d746",
                                "#f3534b",
                                "#dd33fa",
                              ],
                              borderColor: "black",
                              borderWidth: 2,
                            },
                          ],
              };

              const updatedUserDataTab4_4 = {
                labels: responseData.map(item => item.month), // Update with the appropriate property
                state: responseData.map(item => item.state),      // Update with the appropriate property
                district: responseData.map(item => item.district), // Update with the appropriate property
                block: responseData.map(item => item.block),
                month: Months,
                year: responseData.map(item => item.year),
                datasets: [
                            {
                              label: " NQAS certified health facilities (%) ",
                              data: responseData.map(item => item["NQAS certified health facilities (%)"]),
                              backgroundColor: [
                                "rgba(75,192,192,1)",
                                "#ecf0f1",
                                "#50AF95",
                                "#f3ba2f",
                                "#2a71d0",
                                "#e8418d",
                                "#d4d746",
                                "#f3534b",
                                "#dd33fa",
                              ],
                              borderColor: "black",
                              borderWidth: 2,
                            },
                          ],
              };

              const updatedUserDataTab4_5 = {
                labels: responseData.map(item => item.month), // Update with the appropriate property
                state: responseData.map(item => item.state),      // Update with the appropriate property
                district: responseData.map(item => item.district), // Update with the appropriate property
                block: responseData.map(item => item.block),
                month: Months,
                year: responseData.map(item => item.year),
                datasets: [
                            {
                              label: " Person screened for Hypertension (%) ",
                              data: responseData.map(item => item["Person screened for Hypertension (%)"]),
                              backgroundColor: [
                                "rgba(75,192,192,1)",
                                "#ecf0f1",
                                "#50AF95",
                                "#f3ba2f",
                                "#2a71d0",
                                "#e8418d",
                                "#d4d746",
                                "#f3534b",
                                "#dd33fa",
                              ],
                              borderColor: "black",
                              borderWidth: 2,
                            },
                          ],
              };

              const updatedUserDataTab4_6 = {
                labels: responseData.map(item => item.month), // Update with the appropriate property
                state: responseData.map(item => item.state),      // Update with the appropriate property
                district: responseData.map(item => item.district), // Update with the appropriate property
                block: responseData.map(item => item.block),
                month: Months,
                year: responseData.map(item => item.year),
                datasets: [
                            {
                              label: " Person screened for Diabetes (%)) ",
                              data: responseData.map(item => item["Person screened for Diabetes (%)"]),
                              backgroundColor: [
                                "rgba(75,192,192,1)",
                                "#ecf0f1",
                                "#50AF95",
                                "#f3ba2f",
                                "#2a71d0",
                                "#e8418d",
                                "#d4d746",
                                "#f3534b",
                                "#dd33fa",
                              ],
                              borderColor: "black",
                              borderWidth: 2,
                            },
                          ],
              };

              const updatedUserDataTab4_7 = {
                labels: responseData.map(item => item.month), // Update with the appropriate property
                state: responseData.map(item => item.state),      // Update with the appropriate property
                district: responseData.map(item => item.district), // Update with the appropriate property
                block: responseData.map(item => item.block),
                month: Months,
                year: responseData.map(item => item.year),
                datasets: [
                            {
                              label: " Treatment success rate (%) ",
                              data: responseData.map(item => item["Treatment success rate (%)"]),
                              backgroundColor: [
                                "rgba(75,192,192,1)",
                                "#ecf0f1",
                                "#50AF95",
                                "#f3ba2f",
                                "#2a71d0",
                                "#e8418d",
                                "#d4d746",
                                "#f3534b",
                                "#dd33fa",
                              ],
                              borderColor: "black",
                              borderWidth: 2,
                            },
                          ],
              };

            // Update the state with the filtered result
            setFilteredData([updatedUserDataTab4_1, updatedUserDataTab4_2, updatedUserDataTab4_3, updatedUserDataTab4_4, updatedUserDataTab4_5, updatedUserDataTab4_6, updatedUserDataTab4_7]);

           
        })
        .catch(error => {
            console.error('Error:', error);
        });
};


// ----------------- common data states ----------------
// -----------------------------------------------------
const [commonfilteredDataTop5, setCommonFilteredDataTop5] = useState();

const [commonfilteredDataTop5_2, setCommonFilteredDataTop5_2] = useState();

const [commonfilteredDataTop5_3, setCommonFilteredDataTop5_3] = useState();

const [commonfilteredDataTop5_4, setCommonFilteredDataTop5_4] = useState();

const [commonfilteredDataTop5_5, setCommonFilteredDataTop5_5] = useState();

const [commonfilteredDataTop5_6, setCommonFilteredDataTop5_6] = useState();

const [commonfilteredDataTop5_7, setCommonFilteredDataTop5_7] = useState();

const [commonfilteredDataBottom5, setCommonFilteredDataBottom5] = useState();

const [commonfilteredDataBottom5_2, setCommonFilteredDataBottom5_2] = useState();

const [commonfilteredDataBottom5_3, setCommonFilteredDataBottom5_3] = useState();

const [commonfilteredDataBottom5_4, setCommonFilteredDataBottom5_4] = useState();

const [commonfilteredDataBottom5_5, setCommonFilteredDataBottom5_5] = useState();

const [commonfilteredDataBottom5_6, setCommonFilteredDataBottom5_6] = useState();

const [commonfilteredDataBottom5_7, setCommonFilteredDataBottom5_7] = useState();


// -------------------------- -COMMON DATA TAB 1 -------------------
// -----------------------------------------------------------------

useEffect(() => {
    
    const fetchData = async () => {
    //   try {
        const response = await axios.post('http://localhost:4000/common-fetch-data');

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
        const VerticalBarUserDataTop5_4 = {
          labels: response.data.top5_4.map(item => item.block), // Update with the appropriate property
          // state: response.data.map(item => item.State),      // Update with the appropriate property
          // district: response.data.map(item => item.District), // Update with the appropriate property
          // block: response.data.map(item => item.Block),
          datasets: [
                          {
                            label: " NQAS certified health facilities (%) ",
                            data: response.data.top5_4.map(item => item["NQAS certified health facilities (%)"]),
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
        setCommonFilteredDataTop5_4(VerticalBarUserDataTop5_4); 

          // Your mapping logic here
          const VerticalBarUserDataTop5_5 = {
            labels: response.data.top5_5.map(item => item.block), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " Person screened for Hypertension (%) ",
                              data: response.data.top5_5.map(item => item["Person screened for Hypertension (%)"]),
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
          setCommonFilteredDataTop5_5(VerticalBarUserDataTop5_5); 

        // Your mapping logic here
        const VerticalBarUserDataTop5_6 = {
          labels: response.data.top5_6.map(item => item.block), // Update with the appropriate property
          // state: response.data.map(item => item.State),      // Update with the appropriate property
          // district: response.data.map(item => item.District), // Update with the appropriate property
          // block: response.data.map(item => item.Block),
          datasets: [
                          {
                            label: " Person screened for Diabetes (%) ",
                            data: response.data.top5_6.map(item => item["Person screened for Diabetes (%)"]),
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
        setCommonFilteredDataTop5_6(VerticalBarUserDataTop5_6); 

        // Your mapping logic here
        const VerticalBarUserDataTop5_7 = {
          labels: response.data.top5_7.map(item => item.block), // Update with the appropriate property
          // state: response.data.map(item => item.State),      // Update with the appropriate property
          // district: response.data.map(item => item.District), // Update with the appropriate property
          // block: response.data.map(item => item.Block),
          datasets: [
                          {
                            label: " Treatment success rate (%) ",
                            data: response.data.top5_7.map(item => item["Treatment success rate (%)"]),
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
        setCommonFilteredDataTop5_7(VerticalBarUserDataTop5_7); 


        /// -------------------------------- BOTTOM 5 -------------------------
        /// -------------------------------------------------------------------

        // Your mapping logic here
        const VerticalBarUserDataBottom5 = {
            labels: response.data.bottom5_1.map(item => item.block), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " 1st Trimester Registration (%) ",
                              data: response.data.bottom5_1.map(item => parseFloat(item["1st Trimester Registration (%)"])),
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
            datasets: [
                            {
                              label: " Low Birth Weight (%) ",
                              data: response.data.top5_3.map(item => parseFloat(item["Low Birth Weight (%)"])),
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

          const VerticalBarUserDataBottom5_4 = {
            labels: response.data.bottom5_4.map(item => item.block), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " NQAS certified health facilities (%) ",
                              data: response.data.bottom5_4.map(item => item["NQAS certified health facilities (%)"]),
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
          setCommonFilteredDataBottom5_4(VerticalBarUserDataBottom5_4); 

          const VerticalBarUserDataBottom5_5 = {
            labels: response.data.bottom5_5.map(item => item.block), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " Person screened for Hypertension (%) ",
                              data: response.data.bottom5_5.map(item => item["Person screened for Hypertension (%)"]),
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
          setCommonFilteredDataBottom5_5(VerticalBarUserDataBottom5_5); 

          const VerticalBarUserDataBottom5_6 = {
            labels: response.data.bottom5_6.map(item => item.block), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " Person screened for Diabetes (%) ",
                              data: response.data.bottom5_6.map(item => item["Person screened for Diabetes (%)"]),
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
          setCommonFilteredDataBottom5_6(VerticalBarUserDataBottom5_6); 

          const VerticalBarUserDataBottom5_7 = {
            labels: response.data.bottom5_7.map(item => item.block), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " Treatment success rate (%) ",
                              data: response.data.bottom5_7.map(item => item["Treatment success rate (%)"]),
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
          setCommonFilteredDataBottom5_7(VerticalBarUserDataBottom5_7);

        // } catch (error) {
        //         console.error('Error fetching data:', error);
    //   }
    };

    fetchData();
}, []);


// handling user specific block data (TAB 2)
const handleFilterButtonClick_TAB2 = async () => {
  // try {

        if (selectedKPI.length === 0) {
          alert('Please select some KPI');
          return 
        }

        const response = await axios.post('http://localhost:4000/fetch-data-tab2', { selectedKPI, selectedState, selectedDistrict, selectedBlock, selectedMonth1, selectedMonth2, selectedFinancialYear })
        
        const responseTab2Data_block = response.data.block_avg_result;

        setresponseTab2Data_block(responseTab2Data_block);

        const responseTab2Data_nat = response.data.national_avg_result;
        const responseTab2Data_state = response.data.state_avg_result;
        const responseTab2Data_dist = response.data.district_avg_result;

        let keys_responseTab2Data_block = Object.keys(responseTab2Data_block[0]);

        

        let temp_val = [] 

        keys_responseTab2Data_block.map((item) => {
          temp_val.push(
            {
              Header: item,
              accessor: item
            }
          )
          return item
        })

        setTableColumns(temp_val);


        let temp_trendsDataTab2_1 = {};
        let temp_trendsDataTab2_2 = {};
        let temp_trendsDataTab2_3 = {};
        let temp_trendsDataTab2_4 = {};
        let temp_trendsDataTab2_5 = {};
        let temp_trendsDataTab2_6 = {};
        let temp_trendsDataTab2_7 = {};

        if (selectedKPI.includes('1st Trimester Registration (%)')){
          temp_trendsDataTab2_1 = ({
            labels: responseTab2Data_block.map(item => item.month),
            // state: [],
            // district: [],
            // block: [],
            // month: [],
            // year: [],
            datasets: [
              {
                label: "National Average",
                data: responseTab2Data_nat.map(item => parseFloat(item["natAvg 1st Trimester Registration"])) ,
                fill: false,
                borderColor: "#4dff4d",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "State Average",
                data: responseTab2Data_state.map(item => parseFloat(item["stAvg 1st Trimester Registration"])),
                fill: false,
                borderColor: "#ffff00",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "District Average",
                data: responseTab2Data_dist.map(item => parseFloat(item["distAvg 1st Trimester Registration"])),
                fill: false,
                borderColor: "#1338BE",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "Block Average",
                data: responseTab2Data_block.map(item => parseFloat(item["block_avg_1st_tri_reg"])),
                fill: false,
                borderColor: "#ff6600",
                borderWidth: 2,
                tension: 0.1,
              },
            ],
          });
        }

        if (selectedKPI.includes('Institutional Delivery (%)')){
           temp_trendsDataTab2_2 = ({
            labels: responseTab2Data_block.map(item => item.month),
            // state: [],
            // district: [],
            // block: [],
            // month: [],
            // year: [],
            datasets: [
              {
                label: "National Average",
                data: responseTab2Data_nat.map(item => parseFloat(item["natAvg Institutional Delivery"])),
                fill: false,
                borderColor: "#4dff4d",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "State Average",
                data: responseTab2Data_state.map(item => parseFloat(item["stAvg Institutional Delivery"])),
                fill: false,
                borderColor: "#ffff00",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "District Average",
                data: responseTab2Data_dist.map(item => parseFloat(item["distAvg Institutional Delivery"])),
                fill: false,
                borderColor: "#1338BE",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "Block Average",
                data: responseTab2Data_block.map(item => parseFloat(item["block_avg_inst_delivery"])),
                fill: false,
                borderColor: "#ff6600",
                borderWidth: 2,
                tension: 0.1,
              },
            ],
          });
        }

        if (selectedKPI.includes('Low Birth Weight (%)')){
          temp_trendsDataTab2_3 = ({
            labels: responseTab2Data_block.map(item => item.month),
            // state: [],
            // district: [],
            // block: [],
            // month: [],
            // year: [],
            datasets: [
              {
                label: "National Average",
                data: responseTab2Data_nat.map(item => parseFloat(item["natAvg Low Birth Weight"])),
                fill: false,
                borderColor: "#4dff4d",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "State Average",
                data: responseTab2Data_state.map(item => parseFloat(item["stAvg Low Birth Weight"])),
                fill: false,
                borderColor: "#ffff00",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "District Average",
                data: responseTab2Data_dist.map(item => parseFloat(item["distAvg Low Birth Weight"])),
                fill: false,
                borderColor: "#1338BE",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "Block Average",
                data: responseTab2Data_block.map(item => parseFloat(item["block_avg_low_birth_wt"])),
                fill: false,
                borderColor: "#ff6600",
                borderWidth: 2,
                tension: 0.1,
              },
            ],
          });

        }

        if (selectedKPI.includes('NQAS certified health facilities (%)')){
          temp_trendsDataTab2_4 = ({
            labels: responseTab2Data_block.map(item => item.month),
            // state: [],
            // district: [],
            // block: [],
            // month: [],
            // year: [],
            datasets: [
              {
                label: "National Average",
                data: responseTab2Data_nat.map(item => parseFloat(item["natAvg NQAS"])),
                fill: false,
                borderColor: "#4dff4d",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "State Average",
                data: responseTab2Data_state.map(item => parseFloat(item["stAvg NQAS"])),
                fill: false,
                borderColor: "#ffff00",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "District Average",
                data: responseTab2Data_dist.map(item => parseFloat(item["distAvg NQAS"])),
                fill: false,
                borderColor: "#1338BE",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "Block Average",
                data: responseTab2Data_block.map(item => parseFloat(item["block_avg_NQAS"])),
                fill: false,
                borderColor: "#ff6600",
                borderWidth: 2,
                tension: 0.1,
              },
            ],
          });
        }

        if (selectedKPI.includes('Person screened for Hypertension (%)')){
          temp_trendsDataTab2_5 = ({
            labels: responseTab2Data_block.map(item => item.month),
            // state: [],
            // district: [],
            // block: [],
            // month: [],
            // year: [],
            datasets: [
              {
                label: "National Average",
                data: responseTab2Data_nat.map(item => parseFloat(item["natAvg Hypertension"])),
                fill: false,
                borderColor: "#4dff4d",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "State Average",
                data: responseTab2Data_state.map(item => parseFloat(item["stAvg Hypertension"])),
                fill: false,
                borderColor: "#ffff00",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "District Average",
                data: responseTab2Data_dist.map(item => parseFloat(item["distAvg Hypertension"])),
                fill: false,
                borderColor: "#1338BE",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "Block Average",
                data: responseTab2Data_block.map(item => parseFloat(item["block_avg_Hypertension"])),
                fill: false,
                borderColor: "#ff6600",
                borderWidth: 2,
                tension: 0.1,
              },
            ],
          });
        }

        if (selectedKPI.includes('Person screened for Diabetes (%)')){
          temp_trendsDataTab2_6 = ({
            labels: responseTab2Data_block.map(item => item.month),
            // state: [],
            // district: [],
            // block: [],
            // month: [],
            // year: [],
            datasets: [
              {
                label: "National Average",
                data: responseTab2Data_nat.map(item => parseFloat(item["natAvg Diabetes "])),
                fill: false,
                borderColor: "#4dff4d",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "State Average",
                data: responseTab2Data_state.map(item => parseFloat(item["stAvg Diabetes "])),
                fill: false,
                borderColor: "#ffff00",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "District Average",
                data: responseTab2Data_dist.map(item => parseFloat(item["distAvg Diabetes "])),
                fill: false,
                borderColor: "#1338BE",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "Block Average",
                data: responseTab2Data_block.map(item => parseFloat(item["block_avg_Diabetes "])),
                fill: false,
                borderColor: "#ff6600",
                borderWidth: 2,
                tension: 0.1,
              },
            ],
          });
        }

        if (selectedKPI.includes('Treatment success rate (%)')){
            temp_trendsDataTab2_7 = ({
            labels: responseTab2Data_block.map(item => item.month),
            // state: [],
            // district: [],
            // block: [],
            // month: [],
            // year: [],
            datasets: [
              {
                label: "National Average",
                data: responseTab2Data_nat.map(item => parseFloat(item["natAvg Treatment success rate"])),
                fill: false,
                borderColor: "#4dff4d",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "State Average",
                data: responseTab2Data_state.map(item => parseFloat(item["stAvg Treatment success rate"])),
                fill: false,
                borderColor: "#ffff00",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "District Average",
                data: responseTab2Data_dist.map(item => parseFloat(item["distAvg Treatment success rate"])),
                fill: false,
                borderColor: "#1338BE",
                borderWidth: 2,
                tension: 0.1,
              },
              {
                label: "Block Average",
                data: responseTab2Data_block.map(item => parseFloat(item["block_avg_treatment_success"])),
                fill: false,
                borderColor: "#ff6600",
                borderWidth: 2,
                tension: 0.1,
              },
            ],
          });
        }
          
          
        setTrendsDataTab2_1(temp_trendsDataTab2_1);
        setTrendsDataTab2_2(temp_trendsDataTab2_2);
        setTrendsDataTab2_3(temp_trendsDataTab2_3);
        setTrendsDataTab2_4(temp_trendsDataTab2_4);
        setTrendsDataTab2_5(temp_trendsDataTab2_5);
        setTrendsDataTab2_6(temp_trendsDataTab2_6);
        setTrendsDataTab2_7(temp_trendsDataTab2_7);



    // });

  
  // } catch (error) {
  //   console.error('Error fetching data:', error);
  // }
};


// handling user specific block data (TAB 3)
const handleFilterButtonClick_TAB3 = async () => {
  const response = await axios.post('http://localhost:4000/fetch-data-tab3', { selectedState, selectedDistrict, selectedBlock, selectedMonth1, selectedMonth2, selectedFinancialYear })

  const responseTab3Data_block = response.data.block_avg_result_tab3;
  const responseTab3Data_nat = response.data.national_avg_result_tab3;
  const responseTab3Data_state = response.data.state_avg_result_tab3;
  const responseTab3Data_dist = response.data.district_avg_result_tab3;

  let temp_trendsDataTab3_1 = {};
  let temp_trendsDataTab3_2 = {};
  let temp_trendsDataTab3_3 = {};
  let temp_trendsDataTab3_4 = {};
  let temp_trendsDataTab3_5 = {};
  let temp_trendsDataTab3_6 = {};
  let temp_trendsDataTab3_7 = {};

  
  temp_trendsDataTab3_1 = {
    
    ['India' + ' - ' + responseTab3Data_nat.map(item => parseFloat(item["natAvg 1st Trimester Registration"]))[0] + '%']: {
      labels: ['National Avg'],
      datasets: [
        {
          data: [responseTab3Data_nat.map(item => parseFloat(item["natAvg 1st Trimester Registration"]))[0], 100 - responseTab3Data_nat.map(item => parseFloat(item["natAvg 1st Trimester Registration"]))[0]],
          backgroundColor: ['#00e676', '#DDDDDD'],
          hoverBackgroundColor: ['#00e676', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].state + ' - ' + responseTab3Data_state.map(item => parseFloat(item["stAvg 1st Trimester Registration"]))[0] + '%']: {
      labels: ['State Avg'],
      datasets: [
        {
          data: [responseTab3Data_state.map(item => parseFloat(item["stAvg 1st Trimester Registration"]))[0], 100 - responseTab3Data_state.map(item => parseFloat(item["stAvg 1st Trimester Registration"]))[0]],
          backgroundColor: ['brown', '#DDDDDD'],
          hoverBackgroundColor: ['brown', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].district + ' - ' + responseTab3Data_dist.map(item => parseFloat(item["distAvg 1st Trimester Registration"]))[0] + '%']: {
      labels: ['District Avg'],
      datasets: [
        {
          data: [responseTab3Data_dist.map(item => parseFloat(item["distAvg 1st Trimester Registration"]))[0], 100 - responseTab3Data_dist.map(item => parseFloat(item["distAvg 1st Trimester Registration"]))[0]],
          backgroundColor: ['#36A2EB', '#DDDDDD'],
          hoverBackgroundColor: ['#36A2EB', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].block + ' - ' + responseTab3Data_block.map(item => parseFloat(item["block_avg_1st_tri_reg"]))[0].toFixed(2) + '%']: {
      labels: ['Block Avg'],
      datasets: [
        {
          data: [responseTab3Data_block.map(item => parseFloat(item["block_avg_1st_tri_reg"]))[0].toFixed(2), 100 - responseTab3Data_block.map(item => parseFloat(item["block_avg_1st_tri_reg"]))[0]],
          backgroundColor: ['#E44D2A', '#DDDDDD'],
          hoverBackgroundColor: ['#E44D2A', '#DDDDDD']
        }
      ]
    }

  };

  temp_trendsDataTab3_2 = {
    
    ['India' + ' - ' + responseTab3Data_nat.map(item => parseFloat(item["natAvg Institutional Delivery"]))[0] + '%']: {
      labels: ['National Avg'],
      datasets: [
        {
          data: [responseTab3Data_nat.map(item => parseFloat(item["natAvg Institutional Delivery"]))[0], 100 - responseTab3Data_nat.map(item => parseFloat(item["natAvg Institutional Delivery"]))[0]],
          backgroundColor: ['#00e676', '#DDDDDD'],
          hoverBackgroundColor: ['#00e676', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].state + ' - ' + responseTab3Data_state.map(item => parseFloat(item["stAvg Institutional Delivery"]))[0] + '%']: {
      labels: ['State Avg'],
      datasets: [
        {
          data: [responseTab3Data_state.map(item => parseFloat(item["stAvg Institutional Delivery"]))[0], 100 - responseTab3Data_state.map(item => parseFloat(item["stAvg Institutional Delivery"]))[0]],
          backgroundColor: ['brown', '#DDDDDD'],
          hoverBackgroundColor: ['brown', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].district + ' - ' + responseTab3Data_dist.map(item => parseFloat(item["distAvg Institutional Delivery"]))[0] + '%']: {
      labels: ['District Avg'],
      datasets: [
        {
          data: [responseTab3Data_dist.map(item => parseFloat(item["distAvg Institutional Delivery"]))[0], 100 - responseTab3Data_dist.map(item => parseFloat(item["distAvg Institutional Delivery"]))[0]],
          backgroundColor: ['#36A2EB', '#DDDDDD'],
          hoverBackgroundColor: ['#36A2EB', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].block + ' - ' + responseTab3Data_block.map(item => parseFloat(item["block_avg_inst_delivery"]))[0].toFixed(2) + '%']: {
      labels: ['Block Avg'],
      datasets: [
        {
          data: [responseTab3Data_block.map(item => parseFloat(item["block_avg_inst_delivery"]))[0], 100 - responseTab3Data_block.map(item => parseFloat(item["block_avg_inst_delivery"]))[0]],
          backgroundColor: ['#E44D2A', '#DDDDDD'],
          hoverBackgroundColor: ['#E44D2A', '#DDDDDD']
        }
      ]
    }

  };

  temp_trendsDataTab3_3 = {
    
    ['India' + ' - ' + responseTab3Data_nat.map(item => parseFloat(item["natAvg Low Birth Weight"]))[0] + '%']: {
      labels: ['National Avg'],
      datasets: [
        {
          data: [responseTab3Data_nat.map(item => parseFloat(item["natAvg Low Birth Weight"]))[0], 100 - responseTab3Data_nat.map(item => parseFloat(item["natAvg Low Birth Weight"]))[0]],
          backgroundColor: ['#00e676', '#DDDDDD'],
          hoverBackgroundColor: ['#00e676', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].state + ' - ' + responseTab3Data_state.map(item => parseFloat(item["stAvg Low Birth Weight"]))[0] + '%']: {
      labels: ['State Avg'],
      datasets: [
        {
          data: [responseTab3Data_state.map(item => parseFloat(item["stAvg Low Birth Weight"]))[0], 100 - responseTab3Data_state.map(item => parseFloat(item["stAvg Low Birth Weight"]))[0]],
          backgroundColor: ['brown', '#DDDDDD'],
          hoverBackgroundColor: ['brown', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].district + ' - ' + responseTab3Data_dist.map(item => parseFloat(item["distAvg Low Birth Weight"]))[0] + '%']: {
      labels: ['District Avg'],
      datasets: [
        {
          data: [responseTab3Data_dist.map(item => parseFloat(item["distAvg Low Birth Weight"]))[0], 100 - responseTab3Data_dist.map(item => parseFloat(item["distAvg Low Birth Weight"]))[0]],
          backgroundColor: ['#36A2EB', '#DDDDDD'],
          hoverBackgroundColor: ['#36A2EB', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].block + ' - ' + responseTab3Data_block.map(item => parseFloat(item["block_avg_low_birth_wt"]))[0].toFixed(2) + '%']: {
      labels: ['Block Avg'],
      datasets: [
        {
          data: [responseTab3Data_block.map(item => parseFloat(item["block_avg_low_birth_wt"]))[0], 100 - responseTab3Data_block.map(item => parseFloat(item["block_avg_low_birth_wt"]))[0]],
          backgroundColor: ['#E44D2A', '#DDDDDD'],
          hoverBackgroundColor: ['#E44D2A', '#DDDDDD']
        }
      ]
    }

  };

  temp_trendsDataTab3_4 = {
    
    ['India' + ' - ' + responseTab3Data_nat.map(item => parseFloat(item["natAvg NQAS"]))[0] + '%']: {
      labels: ['National Avg'],
      datasets: [
        {
          data: [responseTab3Data_nat.map(item => parseFloat(item["natAvg NQAS"]))[0], 100 - responseTab3Data_nat.map(item => parseFloat(item["natAvg NQAS"]))[0]],
          backgroundColor: ['#00e676', '#DDDDDD'],
          hoverBackgroundColor: ['#00e676', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].state + ' - ' + responseTab3Data_state.map(item => parseFloat(item["stAvg NQAS"]))[0] + '%']: {
      labels: ['State Avg'],
      datasets: [
        {
          data: [responseTab3Data_state.map(item => parseFloat(item["stAvg NQAS"]))[0], 100 - responseTab3Data_state.map(item => parseFloat(item["stAvg NQAS"]))[0]],
          backgroundColor: ['#00e676', '#DDDDDD'],
          hoverBackgroundColor: ['#00e676', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].district + ' - ' + responseTab3Data_dist.map(item => parseFloat(item["distAvg NQAS"]))[0] + '%']: {
      labels: ['District Avg'],
      datasets: [
        {
          data: [responseTab3Data_dist.map(item => parseFloat(item["distAvg NQAS"]))[0], 100 - responseTab3Data_dist.map(item => parseFloat(item["distAvg NQAS"]))[0]],
          backgroundColor: ['brown', '#DDDDDD'],
          hoverBackgroundColor: ['brown', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].block + ' - ' + responseTab3Data_block.map(item => parseFloat(item["block_avg_nqas"]))[0].toFixed(2) + '%']: {
      labels: ['Block Avg'],
      datasets: [
        {
          data: [responseTab3Data_block.map(item => parseFloat(item["block_avg_nqas"]))[0], 100 - responseTab3Data_block.map(item => parseFloat(item["block_avg_nqas"]))[0]],
          backgroundColor: ['#E44D2A', '#DDDDDD'],
          hoverBackgroundColor: ['#E44D2A', '#DDDDDD']
        }
      ]
    }

  };

  temp_trendsDataTab3_5 = {
    
    ['India' + ' - ' + responseTab3Data_nat.map(item => parseFloat(item["natAvg Hypertension"]))[0] + '%']: {
      labels: ['National Avg'],
      datasets: [
        {
          data: [responseTab3Data_nat.map(item => parseFloat(item["natAvg Hypertension"]))[0], 100 - responseTab3Data_nat.map(item => parseFloat(item["natAvg Hypertension"]))[0]],
          backgroundColor: ['#00e676', '#DDDDDD'],
          hoverBackgroundColor: ['#00e676', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].state + ' - ' + responseTab3Data_state.map(item => parseFloat(item["stAvg Hypertension"]))[0] + '%']: {
      labels: ['State Avg'],
      datasets: [
        {
          data: [responseTab3Data_state.map(item => parseFloat(item["stAvg Hypertension"]))[0], 100 - responseTab3Data_state.map(item => parseFloat(item["stAvg Hypertension"]))[0]],
          backgroundColor: ['brown', '#DDDDDD'],
          hoverBackgroundColor: ['brown', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].district + ' - ' + responseTab3Data_dist.map(item => parseFloat(item["distAvg Hypertension"]))[0] + '%']: {
      labels: ['District Avg'],
      datasets: [
        {
          data: [responseTab3Data_dist.map(item => parseFloat(item["distAvg Hypertension"]))[0], 100 - responseTab3Data_dist.map(item => parseFloat(item["distAvg Hypertension"]))[0]],
          backgroundColor: ['#36A2EB', '#DDDDDD'],
          hoverBackgroundColor: ['#36A2EB', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].block + ' - ' + responseTab3Data_block.map(item => parseFloat(item["block_avg_hypertension"]))[0].toFixed(2) + '%']: {
      labels: ['Block Avg'],
      datasets: [
        {
          data: [responseTab3Data_block.map(item => parseFloat(item["block_avg_hypertension"]))[0], 100 - responseTab3Data_block.map(item => parseFloat(item["block_avg_hypertension"]))[0]],
          backgroundColor: ['#E44D2A', '#DDDDDD'],
          hoverBackgroundColor: ['#E44D2A', '#DDDDDD']
        }
      ]
    }

  };

  temp_trendsDataTab3_6 = {
    
    ['India' + ' - ' + responseTab3Data_nat.map(item => parseFloat(item["natAvg Diabetes "]))[0] + '%']: {
      labels: ['National Avg'],
      datasets: [
        {
          data: [responseTab3Data_nat.map(item => parseFloat(item["natAvg Diabetes "]))[0], 100 - responseTab3Data_nat.map(item => parseFloat(item["natAvg Diabetes "]))[0]],
          backgroundColor: ['#00e676', '#DDDDDD'],
          hoverBackgroundColor: ['#00e676', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].state + ' - ' + responseTab3Data_state.map(item => parseFloat(item["stAvg Diabetes "]))[0] + '%']: {
      labels: ['State Avg'],
      datasets: [
        {
          data: [responseTab3Data_state.map(item => parseFloat(item["stAvg Diabetes "]))[0], 100 - responseTab3Data_state.map(item => parseFloat(item["stAvg Diabetes "]))[0]],
          backgroundColor: ['brown', '#DDDDDD'],
          hoverBackgroundColor: ['brown', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].district + ' - ' + responseTab3Data_dist.map(item => parseFloat(item["distAvg Diabetes "]))[0] + '%']: {
      labels: ['District Avg'],
      datasets: [
        {
          data: [responseTab3Data_dist.map(item => parseFloat(item["distAvg Diabetes "]))[0], 100 - responseTab3Data_dist.map(item => parseFloat(item["distAvg Diabetes "]))[0]],
          backgroundColor: ['#36A2EB', '#DDDDDD'],
          hoverBackgroundColor: ['#36A2EB', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].block + ' - ' + responseTab3Data_block.map(item => parseFloat(item["block_avg_diabetes"]))[0].toFixed(2) + '%']: {
      labels: ['Block Avg'],
      datasets: [
        {
          data: [responseTab3Data_block.map(item => parseFloat(item["block_avg_diabetes"]))[0], 100 - responseTab3Data_block.map(item => parseFloat(item["block_avg_diabetes"]))[0]],
          backgroundColor: ['#E44D2A', '#DDDDDD'],
          hoverBackgroundColor: ['#E44D2A', '#DDDDDD']
        }
      ]
    }

  };

  temp_trendsDataTab3_7 = {
    
    ['India' + ' - ' + responseTab3Data_nat.map(item => parseFloat(item["natAvg Treatment success rate"]))[0] + '%']: {
      labels: ['National Avg'],
      datasets: [
        {
          data: [responseTab3Data_nat.map(item => parseFloat(item["natAvg Treatment success rate"]))[0], 100 - responseTab3Data_nat.map(item => parseFloat(item["natAvg Treatment success rate"]))[0]],
          backgroundColor: ['#00e676', '#DDDDDD'],
          hoverBackgroundColor: ['#00e676', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].state + ' - ' + responseTab3Data_state.map(item => parseFloat(item["stAvg Treatment success rate"]))[0] + '%']: {
      labels: ['State Avg'],
      datasets: [
        {
          data: [responseTab3Data_state.map(item => parseFloat(item["stAvg Treatment success rate"]))[0], 100 - responseTab3Data_state.map(item => parseFloat(item["stAvg Treatment success rate"]))[0]],
          backgroundColor: ['brown', '#DDDDDD'],
          hoverBackgroundColor: ['brown', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].district + ' - ' + responseTab3Data_dist.map(item => parseFloat(item["distAvg Treatment success rate"]))[0] + '%']: {
      labels: ['District Avg'],
      datasets: [
        {
          data: [responseTab3Data_dist.map(item => parseFloat(item["distAvg Treatment success rate"]))[0], 100 - responseTab3Data_dist.map(item => parseFloat(item["distAvg Treatment success rate"]))[0]],
          backgroundColor: ['#36A2EB', '#DDDDDD'],
          hoverBackgroundColor: ['#36A2EB', '#DDDDDD']
        }
      ]
    },
    [responseTab3Data_block[0].block + ' - ' + responseTab3Data_block.map(item => parseFloat(item["block_avg_treatment_success"]))[0].toFixed(2) + '%']: {
      labels: ['Block Avg'],
      datasets: [
        {
          data: [responseTab3Data_block.map(item => parseFloat(item["block_avg_treatment_success"]))[0], 100 - responseTab3Data_block.map(item => parseFloat(item["block_avg_treatment_success"]))[0]],
          backgroundColor: ['#E44D2A', '#DDDDDD'],
          hoverBackgroundColor: ['#E44D2A', '#DDDDDD']
        }
      ]
    }

  };

  setTrendsDataTab3_1(temp_trendsDataTab3_1);
  setTrendsDataTab3_2(temp_trendsDataTab3_2);
  setTrendsDataTab3_3(temp_trendsDataTab3_3);
  setTrendsDataTab3_4(temp_trendsDataTab3_4);
  setTrendsDataTab3_5(temp_trendsDataTab3_5);
  setTrendsDataTab3_6(temp_trendsDataTab3_6);
  setTrendsDataTab3_7(temp_trendsDataTab3_7);

};

  
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform any logout logic, such as clearing local storage, etc.
    // For example, to clear token from localStorage:
    localStorage.removeItem('token');

    // Redirect to the login page
    navigate('/login');
  };

  

  const exportToExcel = () => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = "data_export";

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(responseTab2Data_block);
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


  const speedValue = 0; // Example speed value


  
  // Define columns for the table
  const columns_1 = [
    {
      Header: "1st Trimester Registration (%)",
      accessor: "1st Trimester Registration (%)"
    },
    {
      Header: "Institutional Delivery (%)",
      accessor: "Institutional Delivery (%)"
    },
    {
      Header: "Low Birth Weight (%)",
      accessor: "Low Birth Weight (%)"
    }
  ];


  const [tableColumns, setTableColumns] = useState([]);


  return (

    <div>

      {/* Header */}
      {/* ------ */}
      <div className="header">
        <div className="header_left">
          <h4 style={{ color: 'DodgerBlue', textAlign: 'left', width: '200px' }}>Aspirational Blocks Programme</h4>
          <img src={Logo} style={{ width: '30%' }} alt="Logo"/>
        </div>

        <div className="header_right">
          <img src={hmisLogo} alt="HMIS Logo"/>
          {/* <img style={{ width: '190px' }} src={g20Logo} alt="G20 Logo" /> */}
          <img src={digitalIndia} alt="Digital India Logo" />
          <img src={nrhmLogo} alt="NRHM Logo" />
        </div> 
      </div>

      <div>
        <div className="navbar" style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <button className={`button ${activeTab === 'home' ? 'active_tab' : ""}`} onClick={() => handleTabClick('home')}>Home</button>
            <button className={`button ${activeTab === 'monthlyTrends' ? 'active_tab' : ""}`} onClick={() => handleTabClick('monthlyTrends')}>Monthly Trends</button>
            <button className={`button ${activeTab === 'relativePosition' ? 'active_tab' : ""}`} onClick={() => handleTabClick('relativePosition')}>Relative Position of Block</button>
            <button className={`button ${activeTab === 'blockPerformance' ? 'active_tab' : ""}`} onClick={() => handleTabClick('blockPerformance')}>Block Performance</button>
          </div>

          <p style={{color: '#fff'}}>
                Welcome - {officerName}
          </p>

          {/* Log out button */}
          <button className="button" onClick={() => handleLogout('logout')}>Log out</button>
        </div>
      </div>
           
      {/* <h2 className="header" style={{ color: 'DodgerBlue' }}> </h2> */}

      {/* Tab content */}
      {activeTab === 'home' && (
        <div>
          <label>
            <h1 style={{ justifyContent: 'center', color: '#4286f4', textAlign: 'center', lineHeight: '0.5', backgroundColor: '#ddd', padding: '30px', display: 'flex' }}>100 Lowest Performing Blocks</h1>
          </label>


          <div className="header">
            <img style={{ width: "100%" }} src="https://abp.championsofchange.gov.in/assets/img/titlebottom.svg"></img>
          </div>

          <div className="header_new">
            <div className="tile_new">
              <h3 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '1.5' }} >Top 5 Performer Blocks</h3>
            </div>
          </div>
            


          <div className="header_new">

            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>1st Trimester Registration (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataTop5 && <Speedometer value={commonfilteredDataTop5.datasets[0].data} labels={commonfilteredDataTop5.labels }/>}
              </div>
            </div>


            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>Institutional Delivery (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataTop5_2 && <Speedometer value={commonfilteredDataTop5_2.datasets[0].data} labels={commonfilteredDataTop5_2.labels} />}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>Low Birth Weight (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataTop5_3 && <Speedometer value={commonfilteredDataTop5_3.datasets[0].data} labels={commonfilteredDataTop5_3.labels} invertColors={[false, false, true, false, false]} />}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>NQAS certified health facilities (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataTop5_4 && <Speedometer value={commonfilteredDataTop5_4.datasets[0].data} labels={commonfilteredDataTop5_4.labels} />}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>Hypertension (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataTop5_5 && <Speedometer value={commonfilteredDataTop5_5.datasets[0].data} labels={commonfilteredDataTop5_5.labels} />}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>Diabetes (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataTop5_6 && <Speedometer value={commonfilteredDataTop5_6.datasets[0].data} labels={commonfilteredDataTop5_6.labels} />}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>Treatment success rate (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataTop5_7 && <Speedometer value={commonfilteredDataTop5_7.datasets[0].data} labels={commonfilteredDataTop5_7.labels} />}
              </div>
            </div>


        </div>


        <div className="header">
          <img style={{ width: "100%" }} src="https://abp.championsofchange.gov.in/assets/img/titlebottom.svg"></img>
        </div>

        <div className="header_new">
          <div className="tile_new">
            <h3 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '1.5' }} >Bottom 5 Performer Blocks</h3>
          </div>
        </div>

        <div className="header_new">

            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>1st Trimester Registration (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataBottom5 && <Speedometer value={commonfilteredDataBottom5.datasets[0].data} labels={commonfilteredDataBottom5.labels} />}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>Institutional Delivery (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataBottom5_2 && <Speedometer value={commonfilteredDataBottom5_2.datasets[0].data} labels={commonfilteredDataBottom5_2.labels} />}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>Low Birth Weight (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataBottom5_3 && <Speedometer value={commonfilteredDataBottom5_3.datasets[0].data} labels={commonfilteredDataBottom5_3.labels} />}
              </div>
            </div>

            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>NQAS certified health facilities (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataBottom5_4 && <Speedometer value={commonfilteredDataBottom5_4.datasets[0].data} labels={commonfilteredDataBottom5_4.labels} />}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>Hypertension (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataBottom5_5 && <Speedometer value={commonfilteredDataBottom5_5.datasets[0].data} labels={commonfilteredDataBottom5_5.labels} />}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>Diabetes (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataBottom5_6 && <Speedometer value={commonfilteredDataBottom5_6.datasets[0].data} labels={commonfilteredDataBottom5_6.labels} />}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>Treatment success rate (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataBottom5_7 && <Speedometer value={commonfilteredDataBottom5_7.datasets[0].data} labels={commonfilteredDataBottom5_7.labels} />}
              </div>
            </div>

        </div>

        <div className="header">
          <img style={{ width: "100%" }} src="https://abp.championsofchange.gov.in/assets/img/titlebottom.svg"></img>
        </div>  

        <div className="header_new">
          <div className="tile_new">
            <h1 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '1.5' }}>
              Welcome<br />
              CNO - {officerName} <br />
              {uniqueStates}, {uniqueDistrict} , {uniqueBlock}
            </h1>
          </div>
        </div>

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
            <img style={{ width: "100%" }} src="https://abp.championsofchange.gov.in/assets/img/titlebottom.svg"></img>
          </div>

        </div>
        )}

      
        {activeTab === 'relativePosition' && (
          <div>

          
            <label>
              <h1 style={{ justifyContent: 'center', color: '#4286f4', textAlign: 'center', lineHeight: '0.5', backgroundColor: '#ddd', padding: '30px', display: 'flex' }}>Present State of Block Nationwide</h1>
            </label>
     
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
                  <select onChange={(e) => setSelectedFinancialYear(e.target.value)} value={selectedFinancialYear}>
                    {updatedUserData1.year.map((year, index) => (
                    <option key={index} value={year}>
                        {year}
                    </option>
                    ))}
                  </select>   
                </div>

                <div className="select-item">
                  <button className="login-button" onClick={handleFilterButtonClick_TAB3}>
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
                  <DoughnutChart chartData={trendsDataTab3_1}/>
                </div>
              </div>
              
              {/* Tile 2 */}
              <div className="tile_new">
                <div className="title_new">
                  <strong><p style={{ fontSize:"1vw" }}>Institutional Delivery (%)</p></strong>
                </div>
                <div className="doughnut-container">
                  <DoughnutChart chartData={trendsDataTab3_2}/>
                </div>
              </div>
              
              {/* Tile 3 */}
              <div className="tile_new">
                <div className="title_new">
                  <strong><p style={{ fontSize:"1vw" }}>Low Birth Weight (%)</p></strong>
                </div>
                <div className="doughnut-container">
                  <DoughnutChart chartData={trendsDataTab3_3}/>
                </div>
              </div>
       
              {/* Tile 4 */}
              <div className="tile_new">
                <div className="title_new">
                  <strong><p style={{ fontSize:"1vw" }}>NQAS certified health facilities (%)</p></strong>
                </div>
                <div className="doughnut-container">
                  <DoughnutChart chartData={trendsDataTab3_4}/>
                </div>
              </div>
              
              {/* Tile 5 */}
              <div className="tile_new">
                <div className="title_new">
                  <strong><p style={{ fontSize:"1vw" }}>Hypertension (%)</p></strong>
                </div>
                <div className="doughnut-container">
                  <DoughnutChart chartData={trendsDataTab3_5}/>
                </div>
              </div>
              
              {/* Tile 6 */}
              <div className="tile_new">
                <div className="title_new">
                  <strong><p style={{ fontSize:"1vw" }}>Diabetes (%)</p></strong>
                </div>
                <div className="doughnut-container">
                  <DoughnutChart chartData={trendsDataTab3_6}/>
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
                  <DoughnutChart chartData={trendsDataTab3_7} />
                </div>
                  </div>
            </div>

            <div className="header">
              <img style={{ width: "100%" }} src="https://abp.championsofchange.gov.in/assets/img/titlebottom.svg"></img>
            </div>

          </div>
        )}



      {activeTab === 'monthlyTrends' && (
        
        <div>

       
          <label>
            <h1 style={{ justifyContent: 'center', color: '#4286f4', textAlign: 'center', lineHeight: '0.5', backgroundColor: '#ddd', padding: '30px', display: 'flex' }}>Trends of Performance of an Indicator</h1>
          </label>
         
            
          {/* <div className="header"> */}
            <div className="tile">
              <div className="select-container">

                <div className="select-item">
                  <MultipleSelectDropdown options={KPI_options} buttonText="Select KPI(s)" setSelectedKPI={setSelectedKPI} />
                </div>

                <div>
                  <SingleSelectDropdown
                    options={updatedUserData1.state.map((state) => ({ value: state, label: state }))}
                    buttonText="Select State"
                    onSelect={(selectedValue) => setSelectedState(selectedValue)} // Pass a function to setSelectedItem
                  />
                </div>


                {/* <div className="select-item">
                  <h3 > Select State: </h3>
                  <div style={{ height: "20px" }}>
                    <select onChange={(e) => setSelectedState(e.target.value)} value={selectedState}>
                      {updatedUserData1.state.map((state, index) => (
                        <option key={index} value={state}>
                            {state}
                        </option>
                        ))}
                    </select>
                  </div>
                </div> */}
              

                <div className="select-item">
                  <h3> Select District: </h3>
                  <div style={{ height: "20px" }}>
                      <select onChange={(e) => setSelectedDistrict(e.target.value)} value={selectedDistrict}>
                          {updatedUserData1.district.map((district, index) => (
                            <option key={index} value={district}>
                                {district}
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

                {/* <div>
                  <SingleSelectDropdown
                    options={updatedUserData1.block.map((block) => ({ value: block, label: block }))}
                    buttonText="Select Block"
                    onSelect={(selectedValue) => setSelectedBlock(selectedValue)}
                  />
                </div> */}

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
                      <select>
                          <option >
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
                {Object.keys(trendsDataTab2_1).length > 0 && (
                  <div className="tile_new">
                    <div className="title_new">
                      <strong>
                        <p style={{ fontSize: "1vw" }}>1st Trimester Registration (%)</p>
                      </strong>
                    </div>
                    <div className="doughnut-container">
                      <LineChart chartData={trendsDataTab2_1} />
                    </div>
                  </div>
                )} 
                

                {/* Tile 2 */}
                { Object.keys(trendsDataTab2_2).length > 0 && <div className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize:"1vw" }}>Institutional Delivery (%)</p></strong>
                  </div>
                  <div className="doughnut-container">
                    <LineChart chartData={trendsDataTab2_2}/>
                  </div>
                </div>}

                {/* Tile 3 */}
                { Object.keys(trendsDataTab2_3).length > 0 && <div className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize:"1vw" }}>Low Birth Weight (%) (%)</p></strong>
                  </div>
                  <div className="doughnut-container">
                    <LineChart chartData={trendsDataTab2_3}/>
                  </div>
                </div>}

                {/* Tile 4 */}
                { Object.keys(trendsDataTab2_4).length > 0 &&<div className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize:"1vw" }}>NQAS certified health facilities (%)</p></strong>
                  </div>
                  <div className="doughnut-container">
                    <LineChart chartData={trendsDataTab2_4}/>
                  </div>
                </div>}

                {/* Tile 5 */}
                { Object.keys(trendsDataTab2_5).length > 0 &&<div className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize:"1vw" }}>Hypertension (%)</p></strong>
                  </div>
                  <div className="doughnut-container">
                    <LineChart chartData={trendsDataTab2_5}/>
                  </div>
                </div>}

                {/* Tile 6 */}
                { Object.keys(trendsDataTab2_6).length > 0 &&<div className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize:"1vw" }}>Diabetes (%)</p></strong>
                  </div>
                  <div className="doughnut-container">
                    <LineChart chartData={trendsDataTab2_6}/>
                  </div>
                </div>}
              {/* </div> */}

              {/* Third Row */}
              {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> */}
              { Object.keys(trendsDataTab2_7).length > 0 &&<div style={{ width: '30%', alignItems: 'center' }} className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize:"1vw" }}>Treatment success rate (%)</p></strong>
                  </div>
                  <div className="doughnut-container">
                    <LineChart chartData={trendsDataTab2_7}/>
                  </div>
                </div>}
              {/* </div> */}

              {/* If the condition is false, render the message */}
              {Object.keys(trendsDataTab2_1).length === 0 && Object.keys(trendsDataTab2_2).length === 0 && Object.keys(trendsDataTab2_3).length === 0 && Object.keys(trendsDataTab2_4).length === 0 && Object.keys(trendsDataTab2_5).length === 0 && Object.keys(trendsDataTab2_6).length === 0 && Object.keys(trendsDataTab2_7).length === 0 &&(
                  <div className="tile_new" style={{flexBasis: '100%'}}>
                    <div className="title_new">
                      <h3 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '10.5'  }} >data will display after search</h3>
                    </div>
                  </div>
                )}

            </div>  
          </div>

          <div className="header">
            <img style={{ width: "100%" }} src="https://abp.championsofchange.gov.in/assets/img/titlebottom.svg"></img>
          </div>

          <div>
            <label>
              <h1 style={{ justifyContent: 'center', color: '#4286f4', textAlign: 'center', lineHeight: '0.5', backgroundColor: '#ddd', padding: '30px', display: 'flex' }}>Data Report</h1>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around' }} >
            <button className="button" onClick={exportToExcel}>Export Data Report</button>
          </div>

          &nbsp;

          <div style={{ overflow: 'scroll', border: "solid 1px blue", width: "100%" }}> 
            {tableColumns.length > 0 && responseTab2Data_block.length > 0 && <ReactTable data={responseTab2Data_block} columns={tableColumns} />}  
          </div>

          &nbsp;

          <div className="header">
            <img style={{ width: "100%" }} src="https://abp.championsofchange.gov.in/assets/img/titlebottom.svg"></img>
          </div>

        </div>
      )}



      {activeTab === 'blockPerformance' && (
        
        <div>

          <label>
            <h1 style={{ justifyContent: 'center', color: '#4286f4', textAlign: 'center', lineHeight: '0.5', backgroundColor: '#ddd', padding: '30px', display: 'flex' }}>Block Performance of Indicators</h1>
          </label>

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
            </div>

            <div className="select-container">
              <div className="select-item">
                <h3>Select District:</h3>
                <select
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  value={selectedDistrict}
                >
                  {updatedUserData1.district.map((state, index) => (
                    <option key={state} value={selectedDistrict}>
                      {selectedDistrict}
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
                  {updatedUserData1.block.map((selectedBlock, index) => (
                    <option key={index} value={selectedBlock}>
                      {selectedBlock}
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
                <select>
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
                      <div className="title_new">
                        <h3 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '2.5' }} >data will display after search</h3>
                      </div>
                  )}
              </div>
            </div>

            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>Institutional Delivery (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {filteredData && filteredData[1] && filteredData[1].labels ? (
                      <BarChart chartData={filteredData[1]} />
                      ) : (
                        <div className="title_new">
                          <h3 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '2.5' }} >data will display after search</h3>
                        </div>
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
                        <div className="title_new">
                          <h3 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '2.5' }} >data will display after search</h3>
                        </div>
                  )}
              </div>
            </div>

            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1vw" }}>NQAS certified health facilities (%)</p></strong>
              </div>
              <div className="doughnut-container">
                {filteredData && filteredData[0] && filteredData[0].labels ? (
                      <BarChart chartData={filteredData[3]} />
                      ) : (
                        <div className="title_new">
                          <h3 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '2.5' }} >data will display after search</h3>
                        </div>
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
                      <BarChart chartData={filteredData[4]} />
                      ) : (
                        <div className="title_new">
                          <h3 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '2.5' }} >data will display after search</h3>
                        </div>
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
                      <BarChart chartData={filteredData[5]} />
                      ) : (
                        <div className="title_new">
                          <h3 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '2.5' }} >data will display after search</h3>
                        </div>
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
                        <BarChart chartData={filteredData[6]} />
                        ) : (
                          <div className="title_new">
                            <h3 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '2.5' }} >data will display after search</h3>
                          </div>
                  )}
              </div>
            </div>
          </div>

          <div className="header">
            <img style={{ width: "100%" }} src="https://abp.championsofchange.gov.in/assets/img/titlebottom.svg"></img>
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