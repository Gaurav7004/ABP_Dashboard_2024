import { useState, useEffect } from "react";
import "./App.css";
import BarChart from "./components/BarChart";
import VerticalBarChart from "./components/VerticalBarChart";
import LineChart from "./components/LineChart";
import PieChart from "./components/PieChart";
import TrendsChart from "./components/TrendsChart";
import { UserData } from "./Data";
import Login from "./login_component/login";
import Logo from "./assets/images/logo.png";
import digitalIndia from "./assets/images/digital-india.png";
import g20Logo from "./assets/images/g20-logo.png";
import hmisLogo from "./assets/images/hmis.png";
import nrhmLogo from "./assets/images/nrhm-logo.png";
import axios from 'axios';
// import Grid from '@mui/material/Grid'; // Grid version 1
import DropdownButton from "./dropdowns/dropdownBtn";
import { useLocation } from 'react-router-dom'; 


function Home() {

    const location = useLocation();

    const newData = location?.state?.message?.rows;

    const officerName = [...new Set(newData.map(item => item?.nodal_officer_name))]
    // console.log(newData);


    const [activeTab, setActiveTab] = useState('home');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

  const uniqueStates = [...new Set(newData.map(item => item.state))];
const uniqueDistrict = [...new Set(newData.map(item => item.district))];
// const uniqueBlock = [...new Set(newData.map(item => item.block1 + item.block2 ))];

const uniqueBlockObject = [...new Set(newData.reduce((acc, item) => {
    acc.push(item.block1);
    acc.push(item.block2);
    return acc;
  }, []))
];

const uniqueBlock = Array.from(uniqueBlockObject);


// Assuming you want to update labels, state, district, and data fields
const updatedUserData1 = {

  labels: newData.map(item => item.Month), // Update with the appropriate property
  // state: newData.map(item => item.state),      // Update with the appropriate property
  state: uniqueStates,
  district: uniqueDistrict, // Update with the appropriate property
  block: uniqueBlock,
  datasets: [
                  {
                    label: " Percentage 1st Trimester Registration ",
                    data: newData.map(item => item["Percentage 1st Trimester Registration"]),
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
  datasets: [
                  {
                    label: " Percentage Institutional Deliveries ",
                    data: newData.map(item => item["Percentage Institutional Delivery"]),
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
  datasets: [
                  {
                    label: " Percentage Low Birth Weight ",
                    data: newData.map(item => item["Percentage Low Birth Weight"]),
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

  //   const [selectedState, setSelectedState] = useState(newData.filter((item) => {item.state;}));
  const [selectedState, setSelectedState] = useState(extractUniqueStates(newData));
  const [selectedDistrict, setSelectedDistrict] = useState(extractUniqueDistricts(newData));
  const [selectedBlock, setSelectedBlock] = useState(extractUniqueBlocks(newData));


  const [filteredData, setFilteredData] = useState({
        labels: [],
        state: [],
        district: [],
        block: [],
        datasets: [],
    });

const [indicator, setIndicator] = useState([]);
const [month, setMonth] = useState([]);


const [CommonFilteredData, setCommonFilteredData] = useState([]);
// handling common data
const handleCommonData = () => {
    axios.post('http://localhost:4000/common-fetch-data', { indicator, month })
    .then(response => {
        const commonResponseData = response.data.rows;

        console.log(commonResponseData, '******** commonResponseData ***********')

        // Your mapping logic here
        const commonData = {
            labels: commonResponseData.map(item => item.Block),
            state: commonResponseData.map(item => item.State),
            block: commonResponseData.map(item => item.Block),
            datasets: [
                {
                    label: " Percentage 1st Trimester Registration ",
                    data: commonResponseData.map(item => item["Percentage 1st Trimester Registration"]),
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

        setCommonFilteredData(commonData);

    })
};

// handling user specific block data
const handleFilterButtonClick = () => {
    axios.post('http://localhost:4000/fetch-data', { selectedState, selectedDistrict, selectedBlock })
        .then(response => {
            const responseData = response.data.rows;

            // Your mapping logic here
            const updatedUserData1 = {
                labels: responseData.map(item => item.Month),
                state: responseData.map(item => item.State),
                district: responseData.map(item => item.District),
                block: responseData.map(item => item.Block),
                datasets: [
                    {
                        label: " Percentage 1st Trimester Registration ",
                        data: responseData.map(item => item["Percentage 1st Trimester Registration"]),
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
                                  data: responseData.map(item => item["Percentage Institutional Delivery"]),
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
                                  label: " Percentage Low Birth Weight ",
                                  data: responseData.map(item => item["Percentage Low Birth Weight"]),
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

            console.log(updatedUserData1, '-----updatedUserData1-------==');
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
    
    const fetchData = async () => {
    //   try {
        const response = await axios.post('http://localhost:4000/common-fetch-data');
        // setData(response.data);
        console.log(response.data.bottom5, '--- useEffect ----');

        // Your mapping logic here
        const VerticalBarUserDataTop5 = {
            labels: response.data.top5_1.map(item => item.blockname), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " Percentage 1st Trimester Registration ",
                              data: response.data.top5_1.map(item => item["Percentage 1st Trimester Registration"]),
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
            labels: response.data.top5_2.map(item => item.blockname), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " Percentage Institutional Delivery ",
                              data: response.data.top5_2.map(item => item["Percentage Institutional Delivery"]),
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
            labels: response.data.bottom5_3.map(item => item.blockname), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " Percentage Low Birth Weight ",
                              data: response.data.bottom5_3.map(item => item["Percentage Low Birth Weight"]),
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
            labels: response.data.bottom5_1.map(item => item.blockname), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " Percentage 1st Trimester Registration ",
                              data: response.data.bottom5_1.map(item => item["Percentage 1st Trimester Registration"]),
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
            labels: response.data.bottom5_2.map(item => item.blockname), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " Percentage Institutional Delivery ",
                              data: response.data.bottom5_2.map(item => item["Percentage Institutional Delivery"]),
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
            labels: response.data.top5_3.map(item => item.blockname), // Update with the appropriate property
            // state: response.data.map(item => item.State),      // Update with the appropriate property
            // district: response.data.map(item => item.District), // Update with the appropriate property
            // block: response.data.map(item => item.Block),
            datasets: [
                            {
                              label: " Percentage Low Birth Weight ",
                              data: response.data.top5_3.map(item => item["Percentage Low Birth Weight"]),
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

          console.log(VerticalBarUserDataBottom5, '******* VerticalBarUserDataBottom ******')

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
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "State Average",
        data: [71.45, 71.45, 71.45, 71.45, 71.45],
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "Block Average",
        data: [61.45, 63.5, 60.45, 59.05, 58.49],
        fill: false,
        borderColor: "rgb(255, 99, 130)",
        tension: 0.1,
      },
      // Add more datasets as needed
    ],
  };
  



  return (

    <div>

      {/* Header */}
      {/* ------ */}
      <div className="header">
        <div className="header_left">
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
        {/* <button
          className={`tab ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => handleTabClick('home')}
        >
          Home
          
        </button> */}

        <a className={`left ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => handleTabClick('home')} href="#">Home</a>

        <a
          className={`left ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => handleTabClick('trends')}
        >
          Trends
        </a>

        <a
          className={`left ${activeTab === 'blockPerformance' ? 'active' : ''}`}
          onClick={() => handleTabClick('blockPerformance')}
        >
          Block Performance
        </a>

        <a href="#" className="right">Log out</a>
      </div>

      <h2 className="header-dropdown">CNO - {officerName}</h2>

      {/* Tab content */}
      {activeTab === 'home' && (
        <div>

          <div className="header-dropdown">
            {/* Content for the Home tab */}
              {/* <div className="dropdown"> */}
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

                <h3> Select District: </h3>
                <div>
                    <select onChange={(e) => setSelectedDistrict(e.target.value)} value={selectedDistrict}>
                        {updatedUserData1.district.map((district, index) => (
                            <option key={index} value={district}>
                                {district}
                            </option>
                            ))}
                    </select>
                </div>

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

                <h3> Select Period: </h3>
                <div>
                    <select onChange={handleStateChange} value={selectedDistrict || ""}>
                        <option >
                        {/* {updatedUserData1.block.map((block) => (
                            <option>
                                {block}
                            </option>
                            ))} */}
                            2023
                        </option>
                    </select>
                </div>

                <div>
                  <button className="button" onClick={handleFilterButtonClick}> Search </button>
                </div>

              {/* </div> */}

                {/* <div className="main">
                  <div style={{ width: 900 }}>
                    <BarChart chartData={userData} />
                  </div>
                  <div style={{ width: 900 }}>
                    <LineChart chartData={userData} />
                  </div>
                  <div style={{ width: 700, height: 500 }}>
                    <PieChart chartData={userData} />
                  </div>
                </div> */}

              {/* --------------- End ------------- */}
          </div>

          <div className="header">
            <div className="tile">
              <div className="header">
                <h2 className="tile-title">27</h2>
                <img src="https://abp.championsofchange.gov.in/assets/img/anganwadi.svg"></img>
              </div>
              <p className="tile-content">Number of Anganwadi Centers</p>
            </div>
            <div className="tile">
              <div className="header">
                <h2 className="tile-title">0</h2>
                <img src="https://abp.championsofchange.gov.in/assets/img/panchayat.svg"></img>
              </div>
              <p className="tile-content">Number of Gram Panchayats</p>
            </div>
            <div className="tile">
              <div className="header">
                <h2 className="tile-title">15</h2>
                <img src="https://abp.championsofchange.gov.in/assets/img/schools.svg"></img>
              </div>
              <p className="tile-content">Number of Schools</p>
            </div>
            <div className="tile">
              <div className="header">
                <h2 className="tile-title">19</h2>
                <img src="https://abp.championsofchange.gov.in/assets/img/villages.svg"></img>
              </div>
              <p className="tile-content">Number of Villages</p>
            </div>
          </div>

          <div className="header">
            <img src="https://abp.championsofchange.gov.in/assets/img/titlebottom.svg"></img>
          </div>

          <div className="header">
            <div className="row">
              <div className="tile">

                <p>Top 5 Performer Blocks</p>

                <div className="header">
                    {/* {commonfilteredData && commonfilteredData[0] && commonfilteredData[0].labels ? (
                        <VerticalBarChart chartData={commonfilteredData[0]} />
                        ) : (
                        <p>Data not available</p>
                    )} */}
                    <VerticalBarChart chartData={commonfilteredDataTop5} />
                </div>

                <div className="header">
                    {/* {filteredData && filteredData[0] && filteredData[0].labels ? (
                        <VerticalBarChart chartData={filteredData[0]} />
                        ) : (
                        <p>Data not available</p>
                    )} */}
                    <VerticalBarChart chartData={commonfilteredDataTop5_2} />
                </div>

                <div className="header">
                    {/* {filteredData && filteredData[0] && filteredData[0].labels ? (
                        <VerticalBarChart chartData={filteredData[0]} />
                        ) : (
                        <p>Data not available</p>
                    )} */}
                    <VerticalBarChart chartData={commonfilteredDataTop5_3} />
                </div>

              </div>
            </div>
          </div>


          <div className="header">
            <div className="row">
              <div className="tile">

                <p>Bottom 5 Performer Blocks</p>

                <div className="header">
                {/* {filteredData && filteredData[0] && filteredData[0].labels ? (
                        <VerticalBarChart chartData={filteredData[0]} />
                        ) : (
                        <p>Data not available</p>
                    )} */}
                    <VerticalBarChart chartData={commonfilteredDataBottom5} />
                </div>

                <div className="header">
                    {/* {filteredData && filteredData[0] && filteredData[0].labels ? (
                        <VerticalBarChart chartData={filteredData[0]} />
                        ) : (
                        <p>Data not available</p>
                    )} */}
                    <VerticalBarChart chartData={commonfilteredDataBottom5_2} />
                </div>

                <div className="header">
                    {/* {filteredData && filteredData[0] && filteredData[0].labels ? (
                        <VerticalBarChart chartData={filteredData[0]} />
                        ) : (
                        <p>Data not available</p>
                    )} */}
                    <VerticalBarChart chartData={commonfilteredDataBottom5_3} />
                </div>

              </div>
            </div>
          </div>
    

          <div className="header">
            <div className="row">
              <div className="tile">
                <div className="header">
                  <img src="https://abp.championsofchange.gov.in/assets/img/block_profile/health_i1.svg"></img>
                  <h2 className="tile-title">Percentage 1st Trimester Registration</h2>
                </div> 
                <div className="header">
                    {filteredData && filteredData[0] && filteredData[0].labels ? (
                        <BarChart chartData={filteredData[0]} />
                        ) : (
                        <p>Data not available</p>
                    )}
                </div>
              </div>
              {/* <div className="tile">
                <div className="header">
                    <img src="https://abp.championsofchange.gov.in/assets/img/block_profile/health_i1.svg"></img>
                    <h2 className="tile-title">Percentage Institutional Deliveries</h2>
                  </div> 
                  <div className="header">
                    <BarChart chartData={updatedUserData1} />
                  </div>
                </div> */}
            </div>
            
            <div className="row">

              <div className="tile">
                <div className="header">
                  <img src="https://abp.championsofchange.gov.in/assets/img/block_profile/health_i1.svg"></img>
                  <h2 className="tile-title">Percentage Institutional Deliveries</h2>
                </div>
                <div className="header">
                    {filteredData && filteredData[1] && filteredData[1].labels ? (
                        <LineChart chartData={filteredData[1]} />
                        ) : (
                        <p>Data not available</p>
                    )}
                </div>
              </div>

              {/* <div className="tile">
                <div className="header">
                    <img src="https://abp.championsofchange.gov.in/assets/img/block_profile/health_i1.svg"></img>
                    <h2 className="tile-title">Percentage Hypertension</h2>
                </div>
                <div className="header">
                  <LineChart chartData={updatedUserData2} />
                </div>
              </div> */}
            </div>
            
            <div className="row">
              <div className="tile">
                <h2 className="tile-title">Percentage Low Birth Weight</h2>
                <img src="https://abp.championsofchange.gov.in/assets/img/block_profile/health_i1.svg"></img>
                <div>
                    {filteredData && filteredData[2] && filteredData[2].labels ? (
                        <PieChart chartData={filteredData[2]} />
                        ) : (
                        <p>Data not available</p>
                    )}
                </div>
              </div>
              {/* <div className="tile">
                <h2 className="tile-title">Percentage Treatment success rate</h2>
                <img src="https://abp.championsofchange.gov.in/assets/img/block_profile/health_i1.svg"></img>
                <div>
                  <LineChart chartData={updatedUserData3} />
                </div>
              </div> */}
            </div>
            
          </div>

        </div>
        )}


      {activeTab === 'trends' && (
        <div>
            <div className="header">
                {/* Content for the Trends tab */}
                <h1>Trends of Performance of an Indicator</h1>
            </div>

          <div className="header">
            <div className="header-dropdown">
            {/* Content for the Home tab */}
              {/* <div className="dropdown"> */}
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
                <h3> Select Period: </h3>
                <div>
                    <select onChange={handleStateChange} value={selectedDistrict || ""}>
                        <option >
                        {/* {updatedUserData1.block.map((block) => (
                            <option>
                                {block}
                            </option>
                            ))} */}
                            2023
                        </option>
                    </select>
                </div>
                <h3> Select Indicator: </h3>
                <div>
                    <select onChange={handleStateChange} value={selectedDistrict || ""}>
                        <option >
                        {/* {updatedUserData1.block.map((block) => (
                            <option>
                                {block}
                            </option>
                            ))} */}
                            Indicator data needs to be connected ...
                        </option>
                    </select>
                </div>
                <div>
                <button className="button" onClick={handleFilterButtonClick}> Search </button>
                </div>
              </div>
            </div>

          <div className="header" style={{ width: 900 }}>
            <LineChart chartData={trends_data}/>
                {/* {filteredData && filteredData[2] && filteredData[2].labels ? (
                    <TrendsChart chartData={TrendschartData} />
                    ) : (
                    <p>Data not available</p>
                )} */}
          </div>
        </div>
      )}

      {activeTab === 'blockPerformance' && (
        <div>
          {/* Content for the Trends tab */}
          <h1>Block Performance of an Indicator</h1>
          <p>TEST DISPLAY</p>
          <div style={{ width: 900 }}>
            <LineChart chartData={updatedUserData2} />
          </div>
        </div>
      )}
      

      {/* <div className="footer">
        <h2 >TEST DASHBOARD HMIS</h2>
      </div> */}

      <div className="footer">
        <h2>TEST DASHBOARD HMIS</h2>
      </div>
    </div>
    
  );
}

export default Home;