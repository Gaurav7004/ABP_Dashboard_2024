import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "./App.css";
import BarChart from "./components/BarChart";
import HumanChart from "./components/HumanChart";
import BuildingComponent from "./components/BuildingChart";
import DoughnutChart from "./components/DoughnutChart";
import Speedometer from "./components/Speedometer";

import NewLineChart from "./components/NewLineChart";
import ChildChart from "./components/ChildChart";
import ProgressBarComponent from "./components/ProgressBarComponent";
import ThreeDBarChart from "./components/ThreeDBarChart";
import ProgressGaugeComponent from "./components/ProgressGaugeComponent";


import footer from "./assets/images/footer_abp_dashboard.png";
import Logo from "./assets/images/logo.png";
import digitalIndia from "./assets/images/digital-india.png";
import hmisLogo from "./assets/images/hmis.png";
import nrhmLogo from "./assets/images/nrhm-logo.png";
import axios from 'axios';


import ReactTable from "./components/ReactTable"; 
import * as XLSX from "xlsx";

import MultipleSelectDropdown from "./dropdowns/kpi_select_dropdown";
import SingleSelectDropdown from "./dropdowns/dropdownBtn";
import Month_Dropdown from "./dropdowns/Month_Dropdown";

import Swal from 'sweetalert2';


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


    const mappedArray = Months.map((month, index) => {
          return { month: month, index: index };
      });

      console.log(mappedArray, "--mappedArray--")

    // Assuming you want to update labels, state, district, and data fields
    const updatedUserData1 = {

      labels: newData.map(item => item.Month), 
      state: uniqueStates,
      district: uniqueDistrict, 
      block: uniqueBlock,
      month: Months,
      // month: Months,
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

    

    console.log(updatedUserData1, '-- updatedUserData1 --');

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
  const [trendsDataTab3_3, setTrendsDataTab3_3] = useState();
  const [trendsDataTab3_4, setTrendsDataTab3_4] = useState();
  const [trendsDataTab3_5, setTrendsDataTab3_5] = useState();
  const [trendsDataTab3_6, setTrendsDataTab3_6] = useState();
  const [trendsDataTab3_7, setTrendsDataTab3_7] = useState(chartDataTab3);

  const [responseTab2Data_block, setresponseTab2Data_block] = useState([]);
  const [filteredData, setFilteredData] = useState();




// handling user specific block data (TAB 4)
const handleFilterButtonClick = () => {

 
    axios.post('http://localhost:4000/fetch-data-tab4', { selectedState, selectedDistrict, selectedBlock, selectedMonth1, selectedMonth2, selectedFinancialYear })
        .then(response => {
            const responseData = response.data;

            const updatedUserDataTab4_1 = responseData.map(item => (
            {
              label: item.month,
              value: parseFloat(item["1st Trimester Registration (%)"]).toFixed(1)
            }
            ));

            const updatedUserDataTab4_2 = responseData.map(item => (
              {
                label: item.month,
                value: parseFloat(item["Institutional Delivery (%)"]).toFixed(1)
              }
              ));

              const updatedUserDataTab4_3 = responseData.map(item => (
                {
                  label: item.month,
                  value: parseFloat(item["Low Birth Weight (%)"]).toFixed(1)
                }
                ));


              const updatedUserDataTab4_4 = responseData.map(item => (
                {
                  label: item.month,
                  value: parseFloat(item["NQAS certified health facilities (%)"]).toFixed(1)
                }
                ));


              const updatedUserDataTab4_5 = responseData.map(item => (
                {
                  label: item.month,
                  value: parseFloat(item["Person screened for Hypertension (%)"]).toFixed(1)
                }
                ));

              const updatedUserDataTab4_6 = responseData.map(item => (
                {
                  label: item.month,
                  value: parseFloat(item["Person screened for Diabetes (%)"]).toFixed(1)
                }
                ));

              const updatedUserDataTab4_7 = responseData.map(item => (
                {
                  label: item.month,
                  value: parseFloat(item["Treatment success rate (%)"]).toFixed(1)
                }
                ));


              
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

        console.log(response, '-- response --');

        // Your mapping logic here
        const VerticalBarUserDataTop5 = {
            labels: response.data.top5_1.map(item => item.block), // Update with the appropriate property
            datasets: [
                            {
                              label: "Percentage 1st Trimester Registration",
                              data: response.data.top5_1.map(item => parseFloat(item["1st Trimester Registration (%)"]).toFixed(1)),
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
            datasets: [
                            {
                              label: " Institutional Delivery (%) ",
                              data: response.data.top5_2.map(item => parseFloat(item["Institutional Delivery (%)"]).toFixed(1)),
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
            datasets: [
                        {
                          label: " Low Birth Weight (%) ",
                          data: response.data.bottom5_3.map(item => parseFloat(item["Low Birth Weight (%)"]).toFixed(1)),
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
          datasets: [
                          {
                            label: " NQAS certified health facilities (%) ",
                            data: response.data.top5_4.map(item => parseFloat(item["NQAS certified health facilities (%)"]).toFixed(1)),
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
            datasets: [
                            {
                              label: " Person screened for Hypertension (%) ",
                              data: response.data.top5_5.map(item => parseFloat(item["Person screened for Hypertension (%)"]).toFixed(1)),
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
          datasets: [
                      {
                        label: " Person screened for Diabetes (%) ",
                        data: response.data.top5_6.map(item => parseFloat(item["Person screened for Diabetes (%)"]).toFixed(1)),
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

        const VerticalBarUserDataTop5_7 = response.data.top5_7.map(item => ({
          label: item.block,
          percentage: parseFloat(item["Treatment success rate (%)"]).toFixed(1)
        }));
        setCommonFilteredDataTop5_7(VerticalBarUserDataTop5_7); 


        /// -------------------------------- BOTTOM 5 -------------------------
        /// -------------------------------------------------------------------

        // Your mapping logic here
          const VerticalBarUserDataBottom5 = {
            labels: response.data.bottom5_1.map(item => item.block), // Update with the appropriate property
            datasets: [
                            {
                              label: "Percentage 1st Trimester Registration",
                              data: response.data.bottom5_1.map(item => parseFloat(item["1st Trimester Registration (%)"]).toFixed(1)),
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
            datasets: [
                            {
                              label: " Institutional Delivery (%) ",
                              data: response.data.bottom5_2.map(item => parseFloat(item["Institutional Delivery (%)"]).toFixed(1)),
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
                              data: response.data.top5_3.map(item => parseFloat(item["Low Birth Weight (%)"]).toFixed(1)),
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
            datasets: [
                            {
                              label: " NQAS certified health facilities (%) ",
                              data: response.data.bottom5_4.map(item => parseFloat(item["NQAS certified health facilities (%)"]).toFixed(1)),
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
            datasets: [
                            {
                              label: " Person screened for Hypertension (%) ",
                              data: response.data.bottom5_5.map(item => parseFloat(item["Person screened for Hypertension (%)"]).toFixed(1)),
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
            datasets: [
                            {
                              label: " Person screened for Diabetes (%) ",
                              data: response.data.bottom5_6.map(item => parseFloat(item["Person screened for Diabetes (%)"]).toFixed(1)),
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

          const VerticalBarUserDataBottom5_7 = [
            {
              label: response.data.bottom5_7.map(item => item.block)[0], 
              percentage: response.data.bottom5_7.map(item => parseFloat(item["Treatment success rate (%)"]).toFixed(1))[0]
            },
            {
              label: response.data.bottom5_7.map(item => item.block)[1], 
              percentage: response.data.bottom5_7.map(item => parseFloat(item["Treatment success rate (%)"]).toFixed(1))[1]
            },
            {
              label: response.data.bottom5_7.map(item => item.block)[2], 
              percentage: response.data.bottom5_7.map(item => parseFloat(item["Treatment success rate (%)"]).toFixed(1))[2]
            },
            {
              label: response.data.bottom5_7.map(item => item.block)[3], 
              percentage: response.data.bottom5_7.map(item => parseFloat(item["Treatment success rate (%)"]).toFixed(1))[3]
            }
            ,
            {
              label: response.data.bottom5_7.map(item => item.block)[4], 
              percentage: response.data.bottom5_7.map(item => parseFloat(item["Treatment success rate (%)"]).toFixed(1))[4]
            }
          ];
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
          Swal.fire({
            icon: 'error',
            title: 'Please select some KPI',
            // text: error.message,
            confirmButtonText: 'OK'
          });
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
          temp_trendsDataTab2_1 = {
            series: [
              {
                name: ["National Average"],
                data: responseTab2Data_nat.map(item => parseFloat(item["natAvg 1st Trimester Registration"]).toFixed(1)) ,
                month: responseTab2Data_nat.map(item => item["month"]) ,
              },
              {
                name: ["State Average"],
                data: responseTab2Data_state.map(item => parseFloat(item["stAvg 1st Trimester Registration"]).toFixed(1)),
                month: responseTab2Data_state.map(item => item["month"]) ,
              },
              {
                name: ["District Average"],
                data: responseTab2Data_dist.map(item => parseFloat(item["distAvg 1st Trimester Registration"]).toFixed(1)),
                month: responseTab2Data_dist.map(item => item["month"]) ,
              },
              {
                name: ["Block Average"],
                data: responseTab2Data_block.map(item => parseFloat(item["block_avg_1st_tri_reg"]).toFixed(1)),
                month: responseTab2Data_block.map(item => item["month"]) ,
              }
            ]
          };
        }

        if (selectedKPI.includes('Institutional Delivery (%)')){
           temp_trendsDataTab2_2 = {
            series: [
              {
                name: ["National Average"],
                data: responseTab2Data_nat.map(item => parseFloat(item["natAvg Institutional Delivery"]).toFixed(1)) ,
                month: responseTab2Data_nat.map(item => item["month"]) ,
              },
              {
                name: ["State Average"],
                data: responseTab2Data_state.map(item => parseFloat(item["stAvg Institutional Delivery"]).toFixed(1)),
                month: responseTab2Data_state.map(item => item["month"]) ,
              },
              {
                name: ["District Average"],
                data: responseTab2Data_dist.map(item => parseFloat(item["distAvg Institutional Delivery"]).toFixed(1)),
                month: responseTab2Data_dist.map(item => item["month"]) ,
              },
              {
                name: ["Block Average"],
                data: responseTab2Data_block.map(item => parseFloat(item["block_avg_inst_delivery"]).toFixed(1)),
                month: responseTab2Data_block.map(item => item["month"]) ,
              }
            ]
          };
        }

        if (selectedKPI.includes('Low Birth Weight (%)')){
          temp_trendsDataTab2_3 = {
            series: [
              {
                name: ["National Average"],
                data: responseTab2Data_nat.map(item => parseFloat(item["natAvg Low Birth Weight"]).toFixed(1)) ,
                month: responseTab2Data_nat.map(item => item["month"]) ,
              },
              {
                name: ["State Average"],
                data: responseTab2Data_state.map(item => parseFloat(item["stAvg Low Birth Weight"]).toFixed(1)),
                month: responseTab2Data_state.map(item => item["month"]) ,
              },
              {
                name: ["District Average"],
                data: responseTab2Data_dist.map(item => parseFloat(item["distAvg Low Birth Weight"]).toFixed(1)),
                month: responseTab2Data_dist.map(item => item["month"]) ,
              },
              {
                name: ["Block Average"],
                data: responseTab2Data_block.map(item => parseFloat(item["block_avg_low_birth_wt"]).toFixed(1)),
                month: responseTab2Data_block.map(item => item["month"]) ,
              }
            ]
          };
        }

        if (selectedKPI.includes('NQAS certified health facilities (%)')){
          temp_trendsDataTab2_4 = {
            series: [
              {
                name: ["National Average"],
                data: responseTab2Data_nat.map(item => parseFloat(item["natAvg NQAS"]).toFixed(1)) ,
                month: responseTab2Data_nat.map(item => item["month"]) ,
              },
              {
                name: ["State Average"],
                data: responseTab2Data_state.map(item => parseFloat(item["stAvg NQAS"]).toFixed(1)),
                month: responseTab2Data_state.map(item => item["month"]) ,
              },
              {
                name: ["District Average"],
                data: responseTab2Data_dist.map(item => parseFloat(item["distAvg NQAS"]).toFixed(1)),
                month: responseTab2Data_dist.map(item => item["month"]) ,
              },
              {
                name: ["Block Average"],
                data: responseTab2Data_block.map(item => parseFloat(item["block_avg_NQAS"]).toFixed(1)),
                month: responseTab2Data_block.map(item => item["month"]) ,
              }
            ]
          };
        }

        if (selectedKPI.includes('Person screened for Hypertension (%)')){
          temp_trendsDataTab2_5 = {
            series: [
              {
                name: ["National Average"],
                data: responseTab2Data_nat.map(item => parseFloat(item["natAvg Hypertension"]).toFixed(1)) ,
                month: responseTab2Data_nat.map(item => item["month"]) ,
              },
              {
                name: ["State Average"],
                data: responseTab2Data_state.map(item => parseFloat(item["stAvg Hypertension"]).toFixed(1)),
                month: responseTab2Data_state.map(item => item["month"]) ,
              },
              {
                name: ["District Average"],
                data: responseTab2Data_dist.map(item => parseFloat(item["distAvg Hypertension"]).toFixed(1)),
                month: responseTab2Data_dist.map(item => item["month"]) ,
              },
              {
                name: ["Block Average"],
                data: responseTab2Data_block.map(item => parseFloat(item["block_avg_Hypertension"]).toFixed(1)),
                month: responseTab2Data_block.map(item => item["month"]) ,
              }
            ]
          };
        }

        if (selectedKPI.includes('Person screened for Diabetes (%)')){
          temp_trendsDataTab2_6 = {
            series: [
              {
                name: ["National Average"],
                data: responseTab2Data_nat.map(item => parseFloat(item["natAvg Diabetes"]).toFixed(1)) ,
                month: responseTab2Data_nat.map(item => item["month"]) ,
              },
              {
                name: ["State Average"],
                data: responseTab2Data_state.map(item => parseFloat(item["stAvg Diabetes"]).toFixed(1)),
                month: responseTab2Data_state.map(item => item["month"]) ,
              },
              {
                name: ["District Average"],
                data: responseTab2Data_dist.map(item => parseFloat(item["distAvg Diabetes"]).toFixed(1)),
                month: responseTab2Data_dist.map(item => item["month"]) ,
              },
              {
                name: ["Block Average"],
                data: responseTab2Data_block.map(item => parseFloat(item["block_avg_Diabetes"]).toFixed(1)),
                month: responseTab2Data_block.map(item => item["month"]) ,
              }
            ]
          };
        }

        if (selectedKPI.includes('Treatment success rate (%)')){
            temp_trendsDataTab2_7 = {
              series: [
                {
                  name: ["National Average"],
                  data: responseTab2Data_nat.map(item => parseFloat(item["natAvg Treatment success rate"]).toFixed(1)) ,
                  month: responseTab2Data_nat.map(item => item["month"]) ,
                },
                {
                  name: ["State Average"],
                  data: responseTab2Data_state.map(item => parseFloat(item["stAvg Treatment success rate"]).toFixed(1)),
                  month: responseTab2Data_state.map(item => item["month"]) ,
                },
                {
                  name: ["District Average"],
                  data: responseTab2Data_dist.map(item => parseFloat(item["distAvg Treatment success rate"]).toFixed(1)),
                  month: responseTab2Data_dist.map(item => item["month"]) ,
                },
                {
                  name: ["Block Average"],
                  data: responseTab2Data_block.map(item => parseFloat(item["block_avg_treatment_success"]).toFixed(1)),
                  month: responseTab2Data_block.map(item => item["month"]) ,
                }
              ]
            };
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
  const response = await axios.post('http://localhost:4000/fetch-data-tab3', { selectedState, selectedDistrict, selectedBlock, selectedMonth1: selectedMonth1.value, selectedMonth2: selectedMonth2.value, selectedFinancialYear })

  console.log(response, '-- response tab2 -- ');

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

  
  temp_trendsDataTab3_1 = [
    {
      label: 'India', 
      percentage: responseTab3Data_nat.map(item => parseFloat(item["natAvg 1st Trimester Registration"]))[0].toFixed(1)
    },
    {
      label: responseTab3Data_block[0].state,
      percentage: responseTab3Data_state.map(item => parseFloat(item["stAvg 1st Trimester Registration"]))[0].toFixed(1)
    },
    {
      label: responseTab3Data_block[0].district,
      percentage: responseTab3Data_dist.map(item => parseFloat(item["distAvg 1st Trimester Registration"]))[0].toFixed(1)
    },
    {
      label: responseTab3Data_block[0].block,
      percentage: responseTab3Data_block.map(item => parseFloat(item["block_avg_1st_tri_reg"]))[0].toFixed(1)

    }
  ];

  temp_trendsDataTab3_2 = [
    {
    label: 'India', 
    percentage: responseTab3Data_nat.map(item => parseFloat(item["natAvg Institutional Delivery"]))[0].toFixed(1)
    },
    {
      label: responseTab3Data_block[0].state,
      percentage: responseTab3Data_state.map(item => parseFloat(item["stAvg Institutional Delivery"]))[0].toFixed(1)
    },
    {
      label: responseTab3Data_block[0].district,
      percentage: responseTab3Data_dist.map(item => parseFloat(item["distAvg Institutional Delivery"]))[0].toFixed(1)
    },
    {
      label: responseTab3Data_block[0].block,
      percentage: responseTab3Data_block.map(item => parseFloat(item["block_avg_inst_delivery"]))[0].toFixed(1)

    }
  ];

  temp_trendsDataTab3_3 = {
    
      labels: ['India', responseTab3Data_block[0].state, responseTab3Data_block[0].district, responseTab3Data_block[0].block],
      datasets: [
        {
          data: [responseTab3Data_nat.map(item => parseFloat(item["natAvg Low Birth Weight"]))[0].toFixed(1),
                  responseTab3Data_state.map(item => parseFloat(item["stAvg Low Birth Weight"]))[0].toFixed(1),
                    responseTab3Data_dist.map(item => parseFloat(item["distAvg Low Birth Weight"]))[0].toFixed(1),
                    responseTab3Data_block.map(item => parseFloat(item["block_avg_low_birth_wt"]).toFixed(1))[0]],
          backgroundColor: ['#00e676', '#DDDDDD'],
          hoverBackgroundColor: ['#00e676', '#DDDDDD']
        },
      ],
  };

  temp_trendsDataTab3_4 = {
    
    labels: ['India', responseTab3Data_block[0].state, responseTab3Data_block[0].district, responseTab3Data_block[0].block],
    datasets: [
      {
        data: [responseTab3Data_nat.map(item => parseFloat(item["natAvg NQAS"]))[0].toFixed(1),
                responseTab3Data_state.map(item => parseFloat(item["stAvg NQAS"]))[0].toFixed(1),
                  responseTab3Data_dist.map(item => parseFloat(item["distAvg NQAS"]))[0].toFixed(1),
                  responseTab3Data_block.map(item => parseFloat(item["block_avg_nqas"]).toFixed(1))[0]],
        backgroundColor: ['#00e676', '#DDDDDD'],
        hoverBackgroundColor: ['#00e676', '#DDDDDD']
      },
    ],
  };

  temp_trendsDataTab3_5 = {
    
    labels: ['India', responseTab3Data_block[0].state, responseTab3Data_block[0].district, responseTab3Data_block[0].block],
    datasets: [
      {
        data: [responseTab3Data_nat.map(item => parseFloat(item["natAvg Hypertension"]))[0].toFixed(1),
                responseTab3Data_state.map(item => parseFloat(item["stAvg Hypertension"]))[0].toFixed(1),
                  responseTab3Data_dist.map(item => parseFloat(item["distAvg Hypertension"]))[0].toFixed(1),
                  responseTab3Data_block.map(item => parseFloat(item["block_avg_hypertension"]).toFixed(1))[0]],
        backgroundColor: ['#00e676', '#DDDDDD'],
        hoverBackgroundColor: ['#00e676', '#DDDDDD']
      },
    ],
  };

  temp_trendsDataTab3_6 = {
    
    labels: ['India', responseTab3Data_block[0].state, responseTab3Data_block[0].district, responseTab3Data_block[0].block],
    datasets: [
      {
        data: [responseTab3Data_nat.map(item => parseFloat(item["natAvg Diabetes "]))[0].toFixed(1),
                responseTab3Data_state.map(item => parseFloat(item["stAvg Diabetes "]))[0].toFixed(1),
                  responseTab3Data_dist.map(item => parseFloat(item["distAvg Diabetes "]))[0].toFixed(1),
                  responseTab3Data_block.map(item => parseFloat(item["block_avg_diabetes"]).toFixed(1))[0]],
        backgroundColor: ['#00e676', '#DDDDDD'],
        hoverBackgroundColor: ['#00e676', '#DDDDDD']
      },
    ],
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
    [responseTab3Data_block[0].block + ' - ' + responseTab3Data_block.map(item => parseFloat(item["block_avg_treatment_success"]))[0].toFixed(1) + '%']: {
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


  const [tableColumns, setTableColumns] = useState([]);

  const handleToMonthSelect = (selectedValue, selectedIndex) => {

    let monthFormat = {
      'Apr': 1, 
      'May': 2,
      'Jun': 3,
      'Jul': 4,
      'Aug': 5,
      'Sep': 6,
      'Oct': 7,
      'Nov': 8,
      'Dec': 9,
      'Jan': 10,
      'Feb': 11,
      'Mar': 12,
    }

    let month1 = monthFormat[selectedMonth1.value]
    let month2 = monthFormat[selectedValue]

    console.log(selectedMonth1.value, selectedValue, month1, month2, '*** test ****');

    console.log(selectedMonth2, '-- selectedMonth2 --');
    // Check if the selected fromMonth index is after the toMonth index
    if (month1 > month2) {
      alert('From Month cannot be greater than To Month!');
      return
    } 
    else {
      setSelectedMonth2({ index: selectedIndex, value: selectedValue});
    }
  };


  const handleFromMonthSelect = (selectedValue, selectedIndex) => {
    console.log(selectedMonth2, '-- selectedMonth2 --');
    // Check if the selected fromMonth index is after the toMonth index
    if (selectedMonth2 && selectedMonth2.index <= selectedMonth1.index) {
      alert('From Month cannot be greater than To Month*');
    } else {
      setSelectedMonth1({ index: selectedIndex, value: selectedValue });
    }
  };


  return (

    <div>

      <div>

      {/* Header */}
      {/* ------ */}
      <div className="header">
        <div className="header_left">
          <h4 style={{ color: 'DodgerBlue', textAlign: 'left', width: '220px' }}>Aspirational Blocks Programme</h4>
          {/* <img style={{minHeight: "1vh", maxHeight: '10vh', minWidth:"6vw", maxWidth: '12vw'}} src={Logo} alt="Logo"/> */}
          <img style={{ height:'6vh', width:'12vw'}} src={Logo} alt="Logo"/>
        </div>

        <div className="header_right">
          <img  src={hmisLogo} alt="HMIS Logo"/>
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
           

      {/* Tab content */}
      {activeTab === 'home' && (
        <div>
          <label>
            <h1 style={{ justifyContent: 'center', color: 'white', textAlign: 'center', lineHeight: '0.5', backgroundColor: '#25B7B7', padding: '1.2vw', display: 'flex', fontSize: '2vw' }}>100 Lowest Performing Blocks</h1>
          </label>

          <div className="header_new">
            {/* <div className="tile_new"> */}
              <h2 style={{ fontSize:'x-large', width:'50%', padding:'4px',backgroundColor: '#25B7B7' ,color: 'white', textAlign: 'center', lineHeight: '2.5', fontSize: '1.4vw' }} >Top 5 Performer Blocks</h2>
            {/* </div> */}
          </div>
            


          <div className="header_new">

            

            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#25B7B7'}}>Percentage 1st Trimester to Total ANC Registration</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataTop5 && <Speedometer value={commonfilteredDataTop5.datasets[0].data} labels={commonfilteredDataTop5.labels } startColor="blue" endColor="green" maxValue={100} minValue={80}/>}      
              </div>

              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>Health Management Information system (HMIS)</strong></p>}
                {<p>Year : <strong>F.Y. (TEST)</strong></p>}
              </div>
            </div>


            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1.5vw", padding: '28px', color:'white', backgroundColor: '#25B7B7' }}>Percentage Institutional deliveries to total Reported Deliveries</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataTop5_2 && <Speedometer value={commonfilteredDataTop5_2.datasets[0].data} labels={commonfilteredDataTop5_2.labels} startColor="yellow" endColor="green" maxValue={100} minValue={80}/>}
              </div>

              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>Health Management Information system (HMIS)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1.5vw", padding: '28px', color:'white', backgroundColor: '#25B7B7' }}>Percentage Low birth weight babies (less than 2500g)</p></strong>
              </div>
              <div className="doughnut-container">
              {commonfilteredDataTop5_3 && <ChildChart percentages={commonfilteredDataTop5_3.datasets[0].data} labels={commonfilteredDataTop5_3.labels}/>}
              </div>

              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>Health Management Information system (HMIS)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new" style={{justifyContent: 'space-between !important'}}>
                <strong><p style={{ fontSize:"1.5vw", padding: '28px',backgroundColor: '#25B7B7', color:'white' }}>Percentage of NQAS certified facilities</p></strong>
              </div>

              <div className="doughnut-container">
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                  {commonfilteredDataTop5_4 && <BuildingComponent percentages={commonfilteredDataTop5_4.datasets[0].data} labels={commonfilteredDataTop5_4.labels}/>}
                </div>
              </div>

              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>National Health Systems Resource Centre (NHSRC)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1.5vw" , padding: '28px',backgroundColor: '#25B7B7', color:'white'}}>Percentage of person screened for Hypertension against targeted population</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataTop5_5 && <HumanChart percentages={commonfilteredDataTop5_5.datasets[0].data} labels={commonfilteredDataTop5_5.labels }/>}
              </div>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>Non Communicable Diseases (NCD)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1.5vw" , padding: '28px',backgroundColor: '#25B7B7', color:'white'}}>Percentage of person screened for Diabetes against targeted population</p></strong>
              </div>
              <div className="doughnut-container">
              {commonfilteredDataTop5_6 && <HumanChart percentages={commonfilteredDataTop5_6.datasets[0].data} labels={commonfilteredDataTop5_6.labels }/>}
              </div>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>Non Communicable Diseases (NCD)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1.5vw", padding: '28px',backgroundColor: '#25B7B7' , color:'white'}}>Number of TB cases treated successfully in public and private institutions</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataTop5_7 && <ProgressBarComponent chartData={commonfilteredDataTop5_7}/> }
              </div>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>National TB Elimination Programme (NTEP)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>

        </div>


        &nbsp;

        <div className="header_new">
            <h3 style={{ fontSize:'x-large', width:'50%', padding:'4px',backgroundColor: '#25B7B7' ,color: 'white', textAlign: 'center', lineHeight: '2.5', fontSize: '1.4vw' }} >Bottom 5 Performer Blocks</h3>
        </div>

        <div className="header_new">

            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1.5vw", padding: '28px',backgroundColor: '#25B7B7' , color:'white'}}>Percentage 1st Trimester to Total ANC Registration</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataBottom5 && <Speedometer value={commonfilteredDataBottom5.datasets[0].data} labels={commonfilteredDataBottom5.labels} startColor="blue" endColor="green" maxValue={50} minValue={0}/>}
              </div>

              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>Health Management Information system (HMIS)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1.5vw", padding: '28px',backgroundColor: '#25B7B7' , color:'white'}}>Percentage Institutional deliveries to total Reported Deliveries</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataBottom5_2 && <Speedometer value={commonfilteredDataBottom5_2.datasets[0].data} labels={commonfilteredDataBottom5_2.labels} startColor="blue" endColor="green" maxValue={50} minValue={0}/>}
              </div>

              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>Health Management Information system (HMIS)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1.5vw", padding: '28px',backgroundColor: '#25B7B7' , color:'white'}}>Percentage Low birth weight babies (less than 2500g)</p></strong>
              </div>
              <div className="doughnut-container">
                {commonfilteredDataBottom5_3 && <ChildChart percentages={commonfilteredDataBottom5_3.datasets[0].data} labels={commonfilteredDataBottom5_3.labels}/>}
              </div>

              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>Health Management Information system (HMIS)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>

            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1.5vw", padding: '28px',backgroundColor: '#25B7B7' , color:'white'}}>Percentage of NQAS certified facilities</p></strong>
              </div>
              <div className="doughnut-container">
                {/* {commonfilteredDataBottom5_4 && <Speedometer value={commonfilteredDataBottom5_4.datasets[0].data} labels={commonfilteredDataBottom5_4.labels} startColor="blue" endColor="green" maxValue={50} minValue={0}/>} */}
                {commonfilteredDataBottom5_4 && <BuildingComponent percentages={commonfilteredDataBottom5_4.datasets[0].data} labels={commonfilteredDataBottom5_4.labels}/>}
              </div>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>National Health Systems Resource Centre (NHSRC)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1.5vw", padding: '28px',backgroundColor: '#25B7B7' , color:'white'}}>Percentage of person screened for Hypertension against targeted population</p></strong>
              </div>
              <div className="doughnut-container">
              {commonfilteredDataBottom5_5 && <HumanChart percentages={commonfilteredDataBottom5_5.datasets[0].data} labels={commonfilteredDataBottom5_5.labels }/>}
              </div>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>Non Communicable Diseases (NCD)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1.5vw", padding: '28px',backgroundColor: '#25B7B7' , color:'white'}}>Percentage of person screened for Diabetes against targeted population</p></strong>
              </div>
              <div className="doughnut-container">
              {commonfilteredDataBottom5_6 && <HumanChart percentages={commonfilteredDataBottom5_6.datasets[0].data} labels={commonfilteredDataBottom5_6.labels }/>}
              </div>
            </div>

            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize:"1.5vw", padding: '28px',backgroundColor: '#25B7B7' , color:'white'}}>Number of TB cases treated successfully in public and private institutions</p></strong>
              </div>
              <div className="doughnut-container">
                {/* {commonfilteredDataBottom5_7 && <Speedometer value={commonfilteredDataBottom5_7.datasets[0].data} labels={commonfilteredDataBottom5_7.labels} startColor="blue" endColor="green" maxValue={50} minValue={0}/>} */}
                {commonfilteredDataBottom5_7 && <ProgressBarComponent chartData={commonfilteredDataBottom5_7}/> }
              </div>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>National TB Elimination Programme (NTEP)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>

        </div>

        <div style={{textAlign: 'center'}}>
          &nbsp;
          &nbsp;
          <p>** A blank indicates that either the services was not provided or there were no benefeciaries to avail services during that period</p>
        </div>

        &nbsp;

        <div className="header_new">
          <div className="tile_new">
            <h1 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '1.5' }}>
              Welcome<br />
              CNO - {officerName} <br />
              State : {uniqueStates}<br />
              District : {uniqueDistrict} <br /> 
              Block : {uniqueBlock}
            </h1>
          </div>
        </div>

          <div className="header">

            {/* <Card variant="outlined" */}

            <div className="tile_tab1_SC">
                <h2 className="tile-title">27</h2>
                <img className="tile-content" src="https://abp.championsofchange.gov.in/assets/img/anganwadi.svg"></img>
                <p className="tile-content">Sub Center</p>
            </div>
            <div className="tile_tab1_SC">
                <h2 className="tile-title">0</h2>
                <img className="tile-content" src="https://abp.championsofchange.gov.in/assets/img/panchayat.svg"></img>
                <p className="tile-content">Primary Health Center</p>
            </div>
            <div className="tile_tab1_SC">
                <h2 className="tile-title">15</h2>
                <img className="tile-content" src="https://abp.championsofchange.gov.in/assets/img/schools.svg"></img>
                <p className="tile-content">Community Health Center</p>
            </div>
            <div className="tile_tab1_SC">
                <h2 className="tile-title">19</h2>
                <img className="tile-content" src="https://abp.championsofchange.gov.in/assets/img/villages.svg"></img>
                <p className="tile-content">Sub District Hospital</p>
            </div>
            <div className="tile_tab1_SC">
                <h2 className="tile-title">19</h2>
                <img className="tile-content" src="https://abp.championsofchange.gov.in/assets/img/villages.svg"></img>
                <p className="tile-content">District Hospital</p>
            </div>
          </div>

          &nbsp;

        </div>
        )}

      
        {activeTab === 'relativePosition' && (
          <div>
          
            <label>
              <h1 style={{ justifyContent: 'center', color: 'white', textAlign: 'center', lineHeight: '0.5', backgroundColor: '#25B7B7', padding: '1vw', display: 'flex', fontSize: '2vw' }}>Present State of Block Nationwide</h1>
            </label>
     
            <div className="tile">

              <div className="select-container">

                <div>
                  <div><strong><p>State</p></strong></div>
                  <div className="select-item">
                    <SingleSelectDropdown
                      options={updatedUserData1.state.map((state) => ({ value: state, label: state }))}
                      buttonText="-- State --"
                      onSelect={(selectedValue) => setSelectedState(selectedValue)} 
                    />
                  </div>
                </div>

                <div>
                  <div><strong><p>District</p></strong></div>
                  <div className="select-item">
                    <SingleSelectDropdown
                      options={updatedUserData1.district.map((district) => ({ value: district, label: district }))}
                      buttonText="-- District --"
                      onSelect={(selectedValue) => setSelectedDistrict(selectedValue)} 
                    />
                  </div>
                </div>

                <div>
                  <div><strong><p>Block</p></strong></div>
                  <div className="select-item">
                    <SingleSelectDropdown
                      options={updatedUserData1.block.map((block) => ({ value: block, label: block }))}
                      buttonText="-- Block --"
                      onSelect={(selectedValue) => setSelectedBlock(selectedValue)} 
                    />
                  </div>
                </div>

                <div>
                  <div><strong><p>From Month</p></strong></div>
                  <div className="select-item">
                    <Month_Dropdown
                      options={updatedUserData1.month.map((month, index) => ({ index, value: month, label: month}))}
                      buttonText="-- From Month --"
                      onSelect={(selectedValue, selectedIndex) => handleFromMonthSelect(selectedValue, selectedIndex)}
                      selectdMonth1 = {selectedMonth1}
                      selectdMonth2 = {selectedMonth2}
                      selected = {1}
                    />
                  </div>
                </div>

                <div>
                  <div><strong><p>To Month</p></strong></div>
                  <div className="select-item">
                    <Month_Dropdown
                      options={updatedUserData1.month.map((month, index) => ({ index, value: month, label: month }))}
                      buttonText="-- To Month --"
                      onSelect={(selectedValue, selectedIndex) => handleToMonthSelect(selectedValue, selectedIndex)}
                      selectdMonth1 = {selectedMonth1}
                      selectdMonth2 = {selectedMonth2}
                      selected = {2}
                    />
                  </div>
                </div>

                <div>
                  <div><strong><p>Financial Year</p></strong></div>
                  <div className="select-item">
                    <SingleSelectDropdown
                      options={updatedUserData1.year.map((year) => ({ value: year, label: year }))}
                      buttonText="-- Financial Year --"
                      onSelect={(selectedValue) => setSelectedFinancialYear(selectedValue)} 
                    />
                  </div>
                </div>
                  
                <div>
                  <div><p> </p></div>
                  <div className="select-item">
                    <button className="apply-filter-button" onClick={handleFilterButtonClick_TAB3}> Apply Filter </button>
                  </div>
                </div>

              </div>
            </div>
            
       
            <div className="header_new">

              <div className="tile_new">
                <div className="title_new">
                <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#7A63BD'}}>Percentage 1st Trimester to Total ANC Registration</p></strong>
                </div>
                <div className="doughnut-container">
                  {trendsDataTab3_1.length > 0 && <ProgressGaugeComponent chartData={trendsDataTab3_1}/>}
                </div>

                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                  {<p>Data Source : <strong>Health Management Information system (HMIS)</strong></p>}
                  {<p>Year : <strong>F.Y. (test)</strong></p>}
                </div>
              </div>
              
              <div className="tile_new">
                <div className="title_new">
                  <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#7A63BD'}}>Percentage Institutional deliveries to total Reported Deliveries</p></strong>
                </div>
                <div className="doughnut-container">
                  {trendsDataTab3_2.length > 0 && <ProgressGaugeComponent chartData={trendsDataTab3_2}/>} 
                </div>

                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                  {<p>Data Source : <strong>Health Management Information system (HMIS)</strong></p>}
                  {<p>Year : <strong>F.Y. (test)</strong></p>}
                </div>
              </div>
              
              <div className="tile_new">
                <div className="title_new">
                <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#7A63BD'}}>Percentage Low birth weight babies (less than 2500g)</p></strong>
                </div>
                <div className="doughnut-container">
                  {trendsDataTab3_3 && <ChildChart percentages={trendsDataTab3_3.datasets[0].data} labels={trendsDataTab3_3.labels} />}
                </div>

                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                  {<p>Data Source : <strong>Health Management Information system (HMIS)</strong></p>}
                  {<p>Year : <strong>F.Y. (test)</strong></p>}
                </div>
              </div>
       
              <div className="tile_new">
                <div className="title_new">
                <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#7A63BD'}}>Percentage of NQAS certified facilities</p></strong>
                </div>
                <div className="doughnut-container">
                  {trendsDataTab3_4 && <BuildingComponent percentages={trendsDataTab3_4.datasets[0].data} labels={trendsDataTab3_4.labels} />}
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>National Health Systems Resource Centre (NHSRC)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
              </div>
              
              <div className="tile_new">
                <div className="title_new">
                <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#7A63BD'}}>Percentage of person screened for Hypertension against targeted population</p></strong>
                </div>
                <div className="doughnut-container">
                  {trendsDataTab3_5 && <HumanChart percentages={trendsDataTab3_5.datasets[0].data} labels={trendsDataTab3_5.labels} />}
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>Non Communicable Diseases (NCD)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
              </div>
              
              <div className="tile_new">
                <div className="title_new">
                  <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#7A63BD'}}>Percentage of person screened for Diabetes against targeted population</p></strong>
                </div>
                <div className="doughnut-container">
                  {trendsDataTab3_6 && <HumanChart percentages={trendsDataTab3_6.datasets[0].data} labels={trendsDataTab3_6.labels} />}
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                  {<p>Data Source : <strong>Non Communicable Diseases (NCD)</strong></p>}
                  {<p>Year : <strong>F.Y. (test)</strong></p>}
                </div>
              </div> 

            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '30%', alignItems: 'center' }} className="tile_new">
                <div className="title_new">
                <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#7A63BD'}}>Number of TB cases treated successfully in public and private institutionsts</p></strong>
                </div>
                <div className="doughnut-container">
                  {trendsDataTab3_1.length > 0 && <ProgressBarComponent chartData={trendsDataTab3_1}/>}
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                  {<p>Data Source : <strong>National TB Elimination Programme (NTEP)</strong></p>}
                  {<p>Year : <strong>F.Y. (test)</strong></p>}
                </div>
              </div>
            </div>

            <div style={{textAlign: 'center'}}>
              &nbsp;
              &nbsp;
              <p>** A blank indicates that either the services was not provided or there were no benefeciaries to avail services during that period</p>
            </div>

            &nbsp;

          </div>
        )}



      {activeTab === 'monthlyTrends' && (
        
        <div>

       
          <label>
            <h1 style={{ justifyContent: 'center', color: 'white', textAlign: 'center', lineHeight: '0.5', backgroundColor: '#25B7B7', padding: '1vw', display: 'flex', fontSize: '2vw' }}>Trends of Performance of an Indicator</h1>
          </label>
         
            
            <div className="tile">
            
              <div className="select-container">
                <div>
                  <div className="dropdown-header-text"><p>KPI</p></div>
                  <div className="select-item">
                    <MultipleSelectDropdown options={KPI_options} buttonText="-- KPI --" setSelectedKPI={setSelectedKPI} />
                  </div>
                </div>

                <div>
                  <div className="dropdown-header-text"><p>State</p></div>
                  <div className="select-item">
                    <SingleSelectDropdown
                      options={updatedUserData1.state.map((state) => ({ value: state, label: state }))}
                      buttonText="-- State --"
                      onSelect={(selectedValue) => setSelectedState(selectedValue)} // Pass a function to setSelectedItem
                    />
                  </div>
                </div>

                <div>
                  <div className="dropdown-header-text"><p>District</p></div>
                  <div className="select-item">
                    <SingleSelectDropdown
                      options={updatedUserData1.district.map((district) => ({ value: district, label: district }))}
                      buttonText="-- District --"
                      onSelect={(selectedValue) => setSelectedDistrict(selectedValue)} // Pass a function to setSelectedItem
                    />
                  </div>
                </div>

                <div>
                  <div className="dropdown-header-text"><p>Block</p></div>
                  <div className="select-item">
                    <SingleSelectDropdown
                      options={updatedUserData1.block.map((block) => ({ value: block, label: block }))}
                      buttonText="-- Block --"
                      onSelect={(selectedValue) => setSelectedBlock(selectedValue)} // Pass a function to setSelectedItem
                    />
                  </div>
                </div>

                <div>
                  <div className="dropdown-header-text"><p>From Month</p></div>
                  <div className="select-item">
                    <SingleSelectDropdown
                      options={updatedUserData1.month.map((month, index) => ({index, value: month, label: month }))}
                      buttonText="-- From Month --"
                      onSelect={(selectedValue) => setSelectedMonth1(selectedValue)} // Pass a function to setSelectedItem
                    />
                  </div>
                </div>

                <div>
                  <div className="dropdown-header-text"><p>To Month</p></div>
                  <div className="select-item">
                    {/* <SingleSelectDropdown
                      options={updatedUserData1.month.map((month, index) => ({ index, value: month, label: month }))}
                      buttonText="-- To Month --"
                      onSelect={(selectedValue) => setSelectedMonth2(selectedValue)} // Pass a function to setSelectedItem
                    /> */}
                  </div>
                </div>

                <div>
                  <div className="dropdown-header-text"><p>Financial Year</p></div>
                  <div className="select-item">
                    <SingleSelectDropdown
                      options={updatedUserData1.year.map((year) => ({ value: year, label: year }))}
                      buttonText="-- Financial Year --"
                      onSelect={(selectedValue) => setSelectedFinancialYear(selectedValue)} // Pass a function to setSelectedItem
                    />
                  </div>
                </div>

                <div>
                  <div className="dropdown-header-text"><p> </p></div>
                  <div className="select-item">
                    <button className="apply-filter-button" onClick={handleFilterButtonClick_TAB2}> Apply Filter </button>
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
                        <p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#DA5978'}}>Percentage 1st Trimester to Total ANC Registration</p>
                      </strong>
                    </div>
                    <div style={{padding: '10px'}}>
                      {/* <LineChart chartData={trendsDataTab2_1} /> */}
                      <NewLineChart chartData={trendsDataTab2_1} />
                    </div>

                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                      {<p>Data Source : <strong>Health Management Information system (HMIS)</strong></p>}
                      {<p>Year : <strong>F.Y. (test)</strong></p>}
                    </div>
                  </div>
                )} 
                

                {/* Tile 2 */}
                { Object.keys(trendsDataTab2_2).length > 0 && <div className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#DA5978'}}>Percentage Institutional deliveries to total Reported Deliveries</p></strong>
                  </div>
                  <div style={{padding: '10px'}}>
                    <NewLineChart chartData={trendsDataTab2_2}/>
                  </div>

                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                    {<p>Data Source : <strong>Health Management Information system (HMIS)</strong></p>}
                    {<p>Year : <strong>F.Y. (test)</strong></p>}
                  </div>
                </div>}
                

                {/* Tile 3 */}
                { Object.keys(trendsDataTab2_3).length > 0 && <div className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#DA5978'}}>Percentage Low birth weight babies (less than 2500g)</p></strong>
                  </div>
                  <div style={{padding: '10px'}}>
                    <NewLineChart chartData={trendsDataTab2_3}/>
                  </div>

                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                    {<p>Data Source : <strong>Health Management Information system (HMIS)</strong></p>}
                    {<p>Year : <strong>F.Y. (test)</strong></p>}
                  </div>
                </div>}

                {/* Tile 4 */}
                { Object.keys(trendsDataTab2_4).length > 0 &&<div className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#DA5978'}}>Percentage of NQAS certified facilities</p></strong>
                  </div>
                  <div style={{padding: '10px'}}>
                    <NewLineChart chartData={trendsDataTab2_4}/>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                    {<p>Data Source : <strong>National Health Systems Resource Centre (NHSRC)</strong></p>}
                    {<p>Year : <strong>F.Y. (test)</strong></p>}
                  </div>
                </div>}

                {/* Tile 5 */}
                { Object.keys(trendsDataTab2_5).length > 0 &&<div className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#DA5978'}}>Percentage of person screened for Hypertension against targeted population</p></strong>
                  </div>
                  <div style={{padding: '10px'}}>
                    <NewLineChart chartData={trendsDataTab2_5}/>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                    {<p>Data Source : <strong>Non Communicable Diseases (NCD)</strong></p>}
                    {<p>Year : <strong>F.Y. (test)</strong></p>}
                  </div>
                </div>}

                {/* Tile 6 */}
                { Object.keys(trendsDataTab2_6).length > 0 &&<div className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#DA5978'}}>Percentage of person screened for Diabetes against targeted population</p></strong>
                  </div>
                  <div style={{padding: '10px'}}>
                    <NewLineChart chartData={trendsDataTab2_6}/>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                    {<p>Data Source : <strong>Non Communicable Diseases (NCD)</strong></p>}
                    {<p>Year : <strong>F.Y. (test)</strong></p>}
                  </div>
                </div>}
              {/* </div> */}

              {/* Third Row */}
              {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> */}
              { Object.keys(trendsDataTab2_7).length > 0 &&<div style={{ width: '30%', alignItems: 'center' }} className="tile_new">
                  <div className="title_new">
                    <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#DA5978'}}>Number of TB cases treated successfully in public and private institutions</p></strong>
                  </div>
                  <div style={{padding: '10px'}}>
                    <NewLineChart chartData={trendsDataTab2_7}/>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                    {<p>Data Source : <strong>National TB Elimination Programme (NTEP)</strong></p>}
                    {<p>Year : <strong>F.Y. (test)</strong></p>}
                  </div>
                </div>}
              

            </div>  
          </div>

          <div style={{textAlign: 'center'}}>
            &nbsp;
            &nbsp;
            <p>** A blank indicates that either the services was not provided or there were no benefeciaries to avail services during that period</p>
          </div>

          &nbsp;

          <div>
            <label>
              <h1 style={{ justifyContent: 'center', color: 'white', textAlign: 'center', lineHeight: '0.5', backgroundColor: '#25B7B7', padding: '1vw', display: 'flex', fontSize: '2vw' }}>Data Report</h1>
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

        </div>
      )}



      {activeTab === 'blockPerformance' && (
        
        <div>

          <label>
            <h1 style={{ justifyContent: 'center', color: 'white', textAlign: 'center', lineHeight: '0.5', backgroundColor: '#25B7B7', padding: '1vw', display: 'flex', fontSize: '2vw' }}>Block Performance of Indicators</h1>
          </label>

          <div className="tile">

            <div className="select-container">

              <div>
                  <div><strong><p>State</p></strong></div>
                  <div className="select-item">
                    <SingleSelectDropdown
                      options={updatedUserData1.state.map((state) => ({ value: state, label: state }))}
                      buttonText="-- State --"
                      onSelect={(selectedValue) => setSelectedState(selectedValue)} // Pass a function to setSelectedItem
                    />
                  </div>
                </div>

                <div>
                  <div><strong><p>District</p></strong></div>
                  <div className="select-item">
                    <SingleSelectDropdown
                      options={updatedUserData1.district.map((district) => ({ value: district, label: district }))}
                      buttonText="-- District --"
                      onSelect={(selectedValue) => setSelectedDistrict(selectedValue)} // Pass a function to setSelectedItem
                    />
                  </div>
                </div>

                <div>
                  <div><strong><p>Block</p></strong></div>
                  <div className="select-item">
                    <SingleSelectDropdown
                      options={updatedUserData1.block.map((block) => ({ value: block, label: block }))}
                      buttonText="-- Block --"
                      onSelect={(selectedValue) => setSelectedBlock(selectedValue)} // Pass a function to setSelectedItem
                    />
                  </div>
                </div>

                <div>
                  <div><strong><p>From Month</p></strong></div>
                  <div className="select-item">
                    <SingleSelectDropdown
                      options={updatedUserData1.month.map((month, index) => ({ index, value: month, label: month }))}
                      buttonText="-- From Month --"
                      onSelect={(selectedValue) => setSelectedMonth1(selectedValue)} // Pass a function to setSelectedItem
                    />
                  </div>
                </div>

                <div>
                  <div><strong><p>To Month</p></strong></div>
                  <div className="select-item">
                    {/* <SingleSelectDropdown
                      options={updatedUserData1.month.map((month, index) => ({index, value: month, label: month }))}
                      buttonText="-- To Month --"
                      onSelect={(selectedValue) => setSelectedMonth2(selectedValue)} // Pass a function to setSelectedItem
                    /> */}
                  </div>
                </div>

                <div>
                  <div><strong><p>Financial Year</p></strong></div>
                  <div className="select-item">
                    <SingleSelectDropdown
                      options={updatedUserData1.year.map((year) => ({ value: year, label: year }))}
                      buttonText="-- Financial Year --"
                      onSelect={(selectedValue) => setSelectedFinancialYear(selectedValue)} // Pass a function to setSelectedItem
                    />
                  </div>
                </div>

              <div>
                  <div><p> </p></div>
                  <div className="select-item">
                    <button className="apply-filter-button" onClick={handleFilterButtonClick}> Apply Filter </button>
                  </div>
                </div>
              
            </div>  
          </div>

          
          <div className="header_new">

            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#0066B2'}}>Percentage 1st Trimester to Total ANC Registration</p></strong>
              </div>
              <div>
                {filteredData  ? (
                    <ThreeDBarChart data={filteredData[0]}/>
                    ) : (
                        <div className="title_new">
                          <h3 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '2.5' }} >data will display after applying filter</h3>
                        </div>
                    )}
              </div>

              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>Health Management Information system (HMIS)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>

            {/* Tile 2 */}
            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#0066B2'}}>Percentage Institutional deliveries to total Reported Deliveries</p></strong>
              </div>
              <div className="doughnut-container">
                {filteredData  ? (
                    <ThreeDBarChart data={filteredData[1]}/>
                    ) : (
                        <div className="title_new">
                          <h3 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '2.5' }} >data will display after applying filter</h3>
                        </div>
                    )}
              </div>

              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>Health Management Information system (HMIS)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>
            
            {/* Tile 3 */}
            <div className="tile_new">
              <div className="title_new">
              <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#0066B2'}}>Percentage Low birth weight babies (less than 2500g)</p></strong>
              </div>
              <div className="doughnut-container">
              {filteredData  ? (
                    <ThreeDBarChart data={filteredData[2]}/>
                    ) : (
                        <div className="title_new">
                          <h3 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '2.5' }} >data will display after applying filter</h3>
                        </div>
                    )}
              </div>

              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>Health Management Information system (HMIS)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>

            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
              <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#0066B2'}}>Percentage of NQAS certified facilities</p></strong>
              </div>
              <div className="doughnut-container">
              {filteredData  ? (
                    <ThreeDBarChart data={filteredData[3]}/>
                    ) : (
                        <div className="title_new">
                          <h3 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '2.5' }} >data will display after applying filter</h3>
                        </div>
                    )}
              </div>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>National Health Systems Resource Centre (NHSRC)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>

            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
              <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#0066B2'}}>Percentage of person screened for Hypertension against targeted population</p></strong>
              </div>
              <div className="doughnut-container">
              {filteredData  ? (
                    <ThreeDBarChart data={filteredData[4]}/>
                    ) : (
                        <div className="title_new">
                          <h3 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '2.5' }} >data will display after applying filter</h3>
                        </div>
                    )}
              </div>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>Non Communicable Diseases (NCD)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>
            
            {/* Tile 1 */}
            <div className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#0066B2'}}>Percentage of person screened for Diabetes against targeted population</p></strong>
              </div>
              <div className="doughnut-container">
              {filteredData  ? (
                    <ThreeDBarChart data={filteredData[5]}/>
                    ) : (
                        <div className="title_new">
                          <h3 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '2.5' }} >data will display after applying filter</h3>
                        </div>
                    )}
              </div>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>Non Communicable Diseases (NCD)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>

          </div>


          {/* Third Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '30%', alignItems: 'center' }} className="tile_new">
              <div className="title_new">
                <strong><p style={{ fontSize: '1.5vw', padding: '28px', color:'white', backgroundColor: '#0066B2'}}>Number of TB cases treated successfully in public and private institutions</p></strong>
              </div>
              <div className="doughnut-container">
              {filteredData  ? (
                    <ThreeDBarChart data={filteredData[6]}/>
                    ) : (
                        <div className="title_new">
                          <h3 style={{ color: '#4286f4', textAlign: 'center', lineHeight: '2.5' }} >data will display after applying filter</h3>
                        </div>
                    )}
              </div>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1vw'}}>
                {<p>Data Source : <strong>National TB Elimination Programme (NTEP)</strong></p>}
                {<p>Year : <strong>F.Y. (test)</strong></p>}
              </div>
            </div>
          </div>

          <div style={{textAlign: 'center'}}>
            &nbsp;
            &nbsp;
            <p>** A blank indicates that either the services was not provided or there were no benefeciaries to avail services during that period</p>
          </div>

          &nbsp;

        </div>
          
        )}
      </div>

      <div className="footer">
        <img className="footer-image" src={footer} alt="HMIS Footer"/>
      </div>

    </div>
    
  );
}

export default Home;