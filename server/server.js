const express = require("express");
const {Pool} = require("pg");
const cors = require("cors");
const { pool } = require("./database");

const app = express();

app.use(express.json());

app.use(cors());


// ----------------------------------- Login endpoint --------------------------------
// ------------------------------------------------------------------------------------
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query the database to verify the username and password
    const cno_user = await pool.query('SELECT b.month, b.year, a.user_id, a.state, a.district, a.block1, a.block2, a.nodal_officer_name, b."1st Trimester Registration (%)", b."Institutional Delivery (%)", b."Low Birth Weight (%)", b."NQAS certified health facilities (%)", b."Person screened for Diabetes (%)", b."Person screened for Hypertension (%)", b."Treatment success rate (%)" FROM cno_login_accounts AS a JOIN abp_monthly_data AS b ON a.block1_code = b.block_code WHERE user_name = $1 AND password = $2', [username, password]);

    const nat_user = await pool.query(`
                                        SELECT a.officer, a.user_id, b.month, b.year, b.state,
                                              b."1st Trimester Registration (%)", b."Institutional Delivery (%)",
                                              b."Low Birth Weight (%)", b."NQAS certified health facilities (%)",
                                              b."Person screened for Diabetes (%)", b."Person screened for Hypertension (%)",
                                              b."Treatment success rate (%)"
                                        FROM national_user_login_accounts AS a
                                        CROSS JOIN abp_monthly_data AS b
                                        WHERE a.user_name = $1
                                        AND a.password = $2
                                    `, [username, password]);
    

    if (cno_user.rows.length > 0 && nat_user.rows.length === 0) {

      // Only cno_user has logged in
      console.log("CNO User has logged in");

      // User authenticated, generate a token (you might want to use a proper authentication library here)
      const token = req.body.token;
      const user_type = "cno_user";
      res.send(cno_user);

    } else if (cno_user.rows.length === 0 && nat_user.rows.length > 0) {

        // Only nat_user has logged in
        console.log("National User has logged in");

        // User authenticated, generate a token (you might want to use a proper authentication library here)
        const token = req.body.token;
        const user_type = "nat_user";
        res.send(nat_user);

    } else {
        // Neither user has logged in or invalid credentials
        console.log("Invalid credentials");
    }
  


  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/get-districts-by-state', async (req, res) => {
  // const selectedState = req.query.state;
  const selectedState = req.body.selectedValue;
  // try {
    const rows = await pool.query(`SELECT district FROM abp_monthly_data WHERE state = $1`, [selectedState]);
      res.send(rows);
  // } catch (error) {
  //     console.error('Error executing query', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  // }
});


app.post('/get-blocks-by-districts', async (req, res) => {
  // const selectedState = req.query.state;
  const selectedDistrict = req.body.selectedValue;
  console.log(selectedDistrict, '-- selectedDistrict --');
  // try {
    const rows = await pool.query(`SELECT block FROM abp_monthly_data WHERE district = $1`, [selectedDistrict]);
    console.log(rows);
      res.send(rows);
  // } catch (error) {
  //     console.error('Error executing query', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  // }
});



// ----------------------------------- TAB 1 end point --------------------------------
// ------------------------------------------------------------------------------------
app.post('/common-fetch-data', (req, res) => {
  // TOP 5
  const top5Query1 = `SELECT DISTINCT abp_monthly_data.year, abp_monthly_data.block, abp_monthly_data."1st Trimester Registration (%)"
                      FROM abp_monthly_data
                      JOIN (
                          SELECT block, MAX("1st Trimester Registration (%)") AS max_percentage
                          FROM abp_monthly_data
                          WHERE block IS NOT NULL
                            AND "1st Trimester Registration (%)" IS NOT NULL
                            AND "1st Trimester Registration (%)" != ''
                          GROUP BY block
                      ) AS max_percentage_table ON abp_monthly_data.block = max_percentage_table.block
                          AND abp_monthly_data."1st Trimester Registration (%)" = max_percentage_table.max_percentage
                      ORDER BY abp_monthly_data."1st Trimester Registration (%)" DESC
                      LIMIT 5;`;

  const top5Query2 = `SELECT DISTINCT abp_monthly_data.year,abp_monthly_data.block, abp_monthly_data."Institutional Delivery (%)"
                      FROM abp_monthly_data
                      JOIN (
                          SELECT block, MAX("Institutional Delivery (%)") AS max_percentage
                          FROM abp_monthly_data
                          WHERE block IS NOT NULL
                            AND "Institutional Delivery (%)" IS NOT NULL
                            AND "Institutional Delivery (%)" != ''
                          GROUP BY block
                      ) AS max_percentage_table ON abp_monthly_data.block = max_percentage_table.block
                          AND abp_monthly_data."Institutional Delivery (%)" = max_percentage_table.max_percentage
                      ORDER BY abp_monthly_data."Institutional Delivery (%)" DESC
                      LIMIT 5;`;

  const top5Query3 = `SELECT DISTINCT abp_monthly_data.block, abp_monthly_data."Low Birth Weight (%)"
                      FROM abp_monthly_data
                      JOIN (
                          SELECT block, MAX("Low Birth Weight (%)") AS max_percentage
                          FROM abp_monthly_data
                          WHERE block IS NOT NULL
                            AND "Low Birth Weight (%)" IS NOT NULL
                            AND "Low Birth Weight (%)" != ''
                          GROUP BY block
                      ) AS max_percentage_table ON abp_monthly_data.block = max_percentage_table.block
                          AND abp_monthly_data."Low Birth Weight (%)" = max_percentage_table.max_percentage
                      ORDER BY abp_monthly_data."Low Birth Weight (%)" DESC
                      LIMIT 5;`;

const top5Query4 = `SELECT DISTINCT abp_monthly_data.block, abp_monthly_data."NQAS certified health facilities (%)"
                      FROM abp_monthly_data
                      JOIN (
                          SELECT block, MAX("NQAS certified health facilities (%)") AS max_percentage
                          FROM abp_monthly_data
                          WHERE block IS NOT NULL
                            AND "NQAS certified health facilities (%)" IS NOT NULL
                            AND "NQAS certified health facilities (%)" != ''
                          GROUP BY block
                      ) AS max_percentage_table ON abp_monthly_data.block = max_percentage_table.block
                          AND abp_monthly_data."NQAS certified health facilities (%)" = max_percentage_table.max_percentage
                      ORDER BY abp_monthly_data."NQAS certified health facilities (%)" DESC
                      LIMIT 5;`;

  const top5Query5 = `SELECT DISTINCT abp_monthly_data.block, abp_monthly_data."Person screened for Hypertension (%)"
                      FROM abp_monthly_data
                      JOIN (
                          SELECT block, MAX("Person screened for Hypertension (%)") AS max_percentage
                          FROM abp_monthly_data
                          WHERE block IS NOT NULL
                            AND "Person screened for Hypertension (%)" IS NOT NULL
                            AND "Person screened for Hypertension (%)" != ''
                          GROUP BY block
                      ) AS max_percentage_table ON abp_monthly_data.block = max_percentage_table.block
                          AND abp_monthly_data."Person screened for Hypertension (%)" = max_percentage_table.max_percentage
                      ORDER BY abp_monthly_data."Person screened for Hypertension (%)" DESC
                      LIMIT 5;`;


  const top5Query6 = `SELECT DISTINCT block, "Person screened for Diabetes (%)"
                            FROM abp_monthly_data 
                              WHERE block IS NOT NULL 
                                AND "Person screened for Diabetes (%)" IS NOT NULL
                                AND "Person screened for Diabetes (%)" != ''
                                AND "Person screened for Diabetes (%)" ~ '^\\d+(\\.\\d+)?$'
                                  ORDER BY "Person screened for Diabetes (%)" DESC 
                                    LIMIT 5;`;

  const top5Query7 = `SELECT DISTINCT block, "Treatment success rate (%)"
                        FROM abp_monthly_data 
                          WHERE block IS NOT NULL 
                            AND "Treatment success rate (%)" IS NOT NULL
                            AND "Treatment success rate (%)" != ''
                            AND "Treatment success rate (%)" ~ '^\\d+(\\.\\d+)?$'
                            ORDER BY "Treatment success rate (%)" DESC
                              LIMIT 5;`;

  // BOTTOM 5
  // const bottom5Query_1 = 'SELECT DISTINCT block, "1st Trimester Registration (%)" FROM abp_monthly_data WHERE block IS NOT NULL ORDER BY "1st Trimester Registration (%)" ASC LIMIT 5;';
  const bottom5Query_1 = `SELECT DISTINCT BLOCK, "1st Trimester Registration (%)"
                            FROM abp_monthly_data
                              WHERE block IS NOT NULL
                                AND "1st Trimester Registration (%)" IS NOT NULL
                                  AND "1st Trimester Registration (%)" != ''
                                    AND "1st Trimester Registration (%)" ~ '^\\d+(\\.\\d+)?$'
                                      ORDER BY "1st Trimester Registration (%)" ASC
                                        LIMIT 5;`;

  const bottom5Query_2 = `SELECT DISTINCT block, "Institutional Delivery (%)"
                            FROM abp_monthly_data
                              WHERE block IS NOT NULL
                                AND "Institutional Delivery (%)" IS NOT NULL
                                  AND "Institutional Delivery (%)" != ''
                                    AND "Institutional Delivery (%)" ~ '^\\d+(\\.\\d+)?$' 
                                      ORDER BY "Institutional Delivery (%)" ASC
                                        LIMIT 5`;

  const bottom5Query_3 = `SELECT DISTINCT block, "Low Birth Weight (%)" 
                            FROM abp_monthly_data 
                              WHERE block IS NOT NULL 
                                AND "Low Birth Weight (%)" IS NOT NULL 
                                  AND "Low Birth Weight (%)" != '' 
                                    AND "Low Birth Weight (%)" ~ '^\\d+(\\.\\d+)?$' 
                                      ORDER BY "Low Birth Weight (%)" ASC 
                                        LIMIT 5;`;

  const bottom5Query_4 = `SELECT DISTINCT block, "NQAS certified health facilities (%)"
                           FROM abp_monthly_data 
                            WHERE block IS NOT NULL
                              AND "NQAS certified health facilities (%)" IS NOT NULL
                              AND "NQAS certified health facilities (%)" != ''
                              AND "NQAS certified health facilities (%)" ~ '^\\d+(\\.\\d+)?$'
                                ORDER BY "NQAS certified health facilities (%)" ASC 
                                  LIMIT 5;`;

  const bottom5Query_5 = `SELECT DISTINCT block, "Person screened for Hypertension (%)"
                            FROM abp_monthly_data 
                              WHERE block IS NOT NULL
                                AND "Person screened for Hypertension (%)" IS NOT NULL
                                AND "Person screened for Hypertension (%)" != ''
                                AND "Person screened for Hypertension (%)" ~ '^\\d+(\\.\\d+)?$'
                                  ORDER BY "Person screened for Hypertension (%)" ASC 
                                    LIMIT 5;`;

  const bottom5Query_6 = `SELECT DISTINCT block, "Person screened for Diabetes (%)"
                            FROM abp_monthly_data 
                              WHERE block IS NOT NULL 
                                AND "Person screened for Diabetes (%)" IS NOT NULL
                                AND "Person screened for Diabetes (%)" != ''
                                AND "Person screened for Diabetes (%)" ~ '^\\d+(\\.\\d+)?$'
                                  ORDER BY "Person screened for Diabetes (%)" ASC 
                                    LIMIT 5;`;

  const bottom5Query_7 = `SELECT DISTINCT block, "Treatment success rate (%)"
                            FROM abp_monthly_data 
                              WHERE block IS NOT NULL 
                                AND "Treatment success rate (%)" IS NOT NULL
                                AND "Treatment success rate (%)" != ''
                                AND "Treatment success rate (%)" ~ '^\\d+(\\.\\d+)?$'
                                ORDER BY "Treatment success rate (%)" ASC
                                  LIMIT 5;`;

  
  pool.query(`${top5Query1}; ${top5Query2}; ${top5Query3};
                ${top5Query4}; ${top5Query5}; ${top5Query6}; ${top5Query7}; 
                  ${bottom5Query_1}; ${bottom5Query_2}; ${bottom5Query_3}; 
                    ${bottom5Query_4}; ${bottom5Query_5}; ${bottom5Query_6}; ${bottom5Query_7}`)
                      .then(result => {
                        const top5Rows1 = result[0].rows;
                        const top5Rows2 = result[1].rows;
                        const top5Rows3 = result[2].rows;
                        const top5Rows4 = result[3].rows;
                        const top5Rows5 = result[4].rows;
                        const top5Rows6 = result[5].rows;
                        const top5Rows7 = result[6].rows;
                        const bottom5Rows_1 = result[7].rows;
                        const bottom5Rows_2 = result[8].rows;
                        const bottom5Rows_3 = result[9].rows;
                        const bottom5Rows_4 = result[10].rows;
                        const bottom5Rows_5 = result[11].rows;
                        const bottom5Rows_6 = result[12].rows;
                        const bottom5Rows_7 = result[13].rows;

                        res.send({ top5_1: top5Rows1, top5_2: top5Rows2, top5_3: top5Rows3, top5_4: top5Rows4, top5_5: top5Rows5, top5_6: top5Rows6, top5_7: top5Rows7, bottom5_1: bottom5Rows_1, bottom5_2: bottom5Rows_2, bottom5_3: bottom5Rows_3, bottom5_4: bottom5Rows_4, bottom5_5: bottom5Rows_5, bottom5_6: bottom5Rows_6, bottom5_7: bottom5Rows_7  });
                      })
                      .catch(error => {
                        console.error('Error fetching data:', error);
                        res.status(500).json({ error: 'Internal server error' });
                      });
  });



// ----------------------------------- TAB 2 end point --------------------------------
// ------------------------------------------------------------------------------------
app.post('/fetch-data-tab2', async (req, res) => {

  // Extract filters from the request (you may want to validate or sanitize the input)
  const { selectedState, selectedDistrict, selectedBlock, selectedMonth1, selectedMonth2, selectedFinancialYear, selectedKPI } = req.body;

  // Query the database to fetch data based on the filters
  const values = [selectedState, selectedDistrict, selectedBlock];

  let result_KPI = '';
  for (let i = 0; i < selectedKPI.length; i++) {
    result_KPI += `m."${selectedKPI[i]}"`;
    if (i < (selectedKPI.length) - 1) {
      result_KPI += ', ';
    }
  }

  const monthNames = [
    'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'
  ];

  // Find the index of month1 and month2
  const index1 = monthNames.indexOf(selectedMonth1);
  const index2 = monthNames.indexOf(selectedMonth2);

  // Check if both months are valid
  if (index1 === -1 || index2 === -1) {
    return '';
  }

  // Generate the list of months between month1 and month2
  let result_month = '';
  for (let i = index1; i <= index2; i++) {
    result_month += `'${monthNames[i]}'`;
    if (i < index2) {
      result_month += ', ';
    }
  }

  const query = `
  SELECT  
    m.state, 
    m.district, 
    m.block, 
    m.month, 
    m.year,
    ${result_KPI},

    ROUND(
      (CASE 
        WHEN SUM(CASE WHEN m."No of PW Regd for ANC 1st Trimester" ~ '^[0-9.]+$' THEN m."No of PW Regd for ANC 1st Trimester"::numeric END) != 0 
        THEN (SUM(CASE WHEN m."No of PW Regd for ANC 1st Trimester" ~ '^[0-9.]+$' THEN m."No of PW Regd for ANC 1st Trimester"::numeric END) / NULLIF(SUM(CASE WHEN m."No of PW Regd for ANC" ~ '^[0-9.]+$' THEN m."No of PW Regd for ANC"::numeric END), 0)) * 100 
        ELSE NULL 
      END), 1) AS "Percentage 1st Trimester to Total ANC Registration",

    ROUND(
      (CASE 
        WHEN (SUM(CASE WHEN m."No of Insti Deliveries Conducted" ~ '^[0-9.]+$' THEN m."No of Insti Deliveries Conducted"::numeric END) + SUM(CASE WHEN m."No of Home Deliveries Conducted by SBA" ~ '^[0-9.]+$' THEN m."No of Home Deliveries Conducted by SBA"::numeric END) + SUM(CASE WHEN m."No of Home Deliveries Conducted by Non SBA" ~ '^[0-9.]+$' THEN m."No of Home Deliveries Conducted by Non SBA"::numeric END)) != 0 
        THEN ((SUM(CASE WHEN m."No of Insti Deliveries Conducted" ~ '^[0-9.]+$' THEN m."No of Insti Deliveries Conducted"::numeric END)) / NULLIF((SUM(CASE WHEN m."No of Insti Deliveries Conducted" ~ '^[0-9.]+$' THEN m."No of Insti Deliveries Conducted"::numeric END) + SUM(CASE WHEN m."No of Home Deliveries Conducted by SBA" ~ '^[0-9.]+$' THEN m."No of Home Deliveries Conducted by SBA"::numeric END) + SUM(CASE WHEN m."No of Home Deliveries Conducted by Non SBA" ~ '^[0-9.]+$' THEN m."No of Home Deliveries Conducted by Non SBA"::numeric END)), 0)) * 100 
        ELSE NULL 
      END), 1) AS "Percentage Institutional deliveries to Total Reported Deliveries",

    ROUND(
      (CASE 
        WHEN SUM(CASE WHEN m."No of newborn weighed at birth" ~ '^[0-9.]+$' THEN m."No of newborn weighed less than 2500g"::numeric END) != 0 
        THEN (SUM(CASE WHEN m."No of newborn weighed less than 2500g" ~ '^[0-9.]+$' THEN m."No of newborn weighed less than 2500g"::numeric END) / NULLIF(SUM(CASE WHEN m."No of newborn weighed at birth" ~ '^[0-9.]+$' THEN m."No of newborn weighed at birth"::numeric END), 0)) * 100 
        ELSE NULL 
      END), 1) AS "Percentage Low birth weight babies (less than 2500g)",

    ROUND(
      (CASE 
        WHEN SUM(CASE WHEN m."No of targeted facilities for NQAS" ~ '^[0-9.]+$' THEN m."NQAS Certified facilities"::numeric END) != 0 
        THEN (SUM(CASE WHEN m."NQAS Certified facilities" ~ '^[0-9.]+$' THEN m."NQAS Certified facilities"::numeric END) / NULLIF(SUM(CASE WHEN m."No of targeted facilities for NQAS" ~ '^[0-9.]+$' THEN m."No of targeted facilities for NQAS"::numeric END), 0)) * 100 
        ELSE NULL 
      END), 1) AS "Percentage of NQAS certified facilities",

    ROUND(
      (CASE 
        WHEN SUM(CASE WHEN m."Total Eligible Pop 30 plus" ~ '^[0-9.]+$' THEN m."No of persons screened for Diabetes"::numeric END) != 0 
        THEN (SUM(CASE WHEN m."No of persons screened for Diabetes" ~ '^[0-9.]+$' THEN m."No of persons screened for Diabetes"::numeric END) / NULLIF(SUM(CASE WHEN m."Total Eligible Pop 30 plus" ~ '^[0-9.]+$' THEN m."Total Eligible Pop 30 plus"::numeric END), 0)) * 100 
        ELSE NULL 
      END), 1) AS "Percentage of person screened for Diabetes against targeted population",

    ROUND(
      (CASE 
        WHEN SUM(CASE WHEN m."Total Eligible Pop 30 plus" ~ '^[0-9.]+$' THEN m."No of persons screened for Hypertension"::numeric END) != 0 
        THEN (SUM(CASE WHEN m."No of persons screened for Hypertension" ~ '^[0-9.]+$' THEN m."No of persons screened for Hypertension"::numeric END) / NULLIF(SUM(CASE WHEN m."Total Eligible Pop 30 plus" ~ '^[0-9.]+$' THEN m."Total Eligible Pop 30 plus"::numeric END), 0)) * 100 
        ELSE NULL 
      END), 1) AS "Percentage of person screened for Hypertension against targeted population",

    ROUND(
      (CASE 
        WHEN SUM(CASE WHEN m."Notification" ~ '^[0-9.]+$' THEN m."TreatmentSuccess"::numeric END) != 0 
        THEN (SUM(CASE WHEN m."TreatmentSuccess" ~ '^[0-9.]+$' THEN m."TreatmentSuccess"::numeric END) / NULLIF(SUM(CASE WHEN m."Notification" ~ '^[0-9.]+$' THEN m."Notification"::numeric END), 0)) * 100 
        ELSE NULL 
      END), 1) AS "Number of TB cases treated successfully in public and private institutions",

    m."No of PW Regd for ANC 1st Trimester",
    m."No of PW Regd for ANC",
    m."No of Insti Deliveries Conducted",
    m."No of Home Deliveries Conducted by SBA",
    m."No of Home Deliveries Conducted by Non SBA",
    m."No of newborn weighed at birth",
    m."No of newborn weighed less than 2500g",
    m."No of targeted facilities for NQAS",
    m."NQAS Certified facilities",
    m."Total Eligible Pop 30 plus",
    m."No of persons screened for Diabetes",
    m."No of persons screened for Hypertension",
    m."Notification",
    m."TreatmentSuccess"

  FROM 
    abp_monthly_data AS m
  WHERE 
    m.state = $1
    AND m.district = $2
    AND m.block = $3
    AND m.month IN (${result_month})
    AND m.year = $4
  GROUP BY
    m.state, 
    m.district, 
    m.block, 
    m.month, 
    m.year,
    ${result_KPI},
    m."No of PW Regd for ANC 1st Trimester",
    m."No of PW Regd for ANC",
    m."No of Insti Deliveries Conducted",
    m."No of Home Deliveries Conducted by SBA",
    m."No of Home Deliveries Conducted by Non SBA",
    m."No of newborn weighed at birth",
    m."No of newborn weighed less than 2500g",
    m."No of targeted facilities for NQAS",
    m."NQAS Certified facilities",
    m."Total Eligible Pop 30 plus",
    m."No of persons screened for Diabetes",
    m."No of persons screened for Hypertension",
    m."Notification",
    m."TreatmentSuccess"
  ORDER BY
    CASE m.month
      WHEN 'Jan' THEN 1
      WHEN 'Feb' THEN 2
      WHEN 'Mar' THEN 3
      WHEN 'Apr' THEN 4
      WHEN 'May' THEN 5
      WHEN 'Jun' THEN 6
      WHEN 'Jul' THEN 7
      WHEN 'Aug' THEN 8
      WHEN 'Sep' THEN 9
      WHEN 'Oct' THEN 10
      WHEN 'Nov' THEN 11
      WHEN 'Dec' THEN 12
    END;
`;



const national_avg_query = `
                            SELECT 
                            m.month, 
                              na."natAvg 1st Trimester Registration",
                              na."natAvg Institutional Delivery",
                              na."natAvg Low Birth Weight",
                              na."natAvg Hypertension",
                              na."natAvg Diabetes ",
                              na."natAvg NQAS",
                              na."natAvg Treatment success rate"
                            FROM 
                              abp_monthly_data AS m, abp_national_avg as na
                            WHERE
                              m.month IN (${result_month})
                            GROUP BY 
                              m.month, 
                              na."natAvg 1st Trimester Registration",
                              na."natAvg Institutional Delivery",
                              na."natAvg Low Birth Weight",
                              na."natAvg Hypertension",
                              na."natAvg Diabetes ",
                              na."natAvg NQAS",
                              na."natAvg Treatment success rate"
                            ORDER BY
                            CASE m.month
                                WHEN 'Jan' THEN 1
                                WHEN 'Feb' THEN 2
                                WHEN 'Mar' THEN 3
                                WHEN 'Apr' THEN 4
                                WHEN 'May' THEN 5
                                WHEN 'Jun' THEN 6
                                WHEN 'Jul' THEN 7
                                WHEN 'Aug' THEN 8
                                WHEN 'Sep' THEN 9
                                WHEN 'Oct' THEN 10
                                WHEN 'Nov' THEN 11
                                WHEN 'Dec' THEN 12
                            END
                            ;
                          `;

  const state_avg_query = `
                            SELECT 
                              m.state, 
                              m.month,
                              sa."stAvg 1st Trimester Registration",
                              sa."stAvg Institutional Delivery",
                              sa."stAvg Low Birth Weight",
                              sa."stAvg Hypertension",
                              sa."stAvg Diabetes ",
                              sa."stAvg NQAS",
                              sa."stAvg Treatment success rate"
                            FROM 
                              abp_monthly_data AS m
                            LEFT JOIN 
                              abp_state_avg AS sa 
                            ON 
                              m.state = sa.state
                            WHERE 
                              m.state = $1
                              AND m.district = $2
                              AND m.block = $3
                              AND m.month IN (${result_month})
                              AND m.year = $4
                            GROUP BY 
                              m.state, 
                              m.month,
                              sa."stAvg 1st Trimester Registration",
                              sa."stAvg Institutional Delivery",
                              sa."stAvg Low Birth Weight",
                              sa."stAvg Hypertension",
                              sa."stAvg Diabetes ",
                              sa."stAvg NQAS",
                              sa."stAvg Treatment success rate"
                            ORDER BY
                              CASE m.month
                                  WHEN 'Jan' THEN 1
                                  WHEN 'Feb' THEN 2
                                  WHEN 'Mar' THEN 3
                                  WHEN 'Apr' THEN 4
                                  WHEN 'May' THEN 5
                                  WHEN 'Jun' THEN 6
                                  WHEN 'Jul' THEN 7
                                  WHEN 'Aug' THEN 8
                                  WHEN 'Sep' THEN 9
                                  WHEN 'Oct' THEN 10
                                  WHEN 'Nov' THEN 11
                                  WHEN 'Dec' THEN 12
                              END
                              ;
                            `;

  const district_avg_query = `
                              SELECT 
                                m.state, 
                                m.district,
                                m.month,
                                da."distAvg 1st Trimester Registration",
                                da."distAvg Institutional Delivery",
                                da."distAvg Low Birth Weight",
                                da."distAvg Hypertension",
                                da."distAvg Diabetes ",
                                da."distAvg NQAS",
                                da."distAvg Treatment success rate"
                              FROM 
                                abp_monthly_data AS m
                              LEFT JOIN 
                                abp_district_avg AS da 
                              ON 
                                m.state = da.state AND m.district = da.district
                              WHERE 
                                m.state = $1
                                AND m.district = $2
                                AND m.block = $3
                                AND m.month IN (${result_month})
                                AND m.year = $4
                              GROUP BY 
                                m.state, 
                                m.district,
                                m.month,
                                da."distAvg 1st Trimester Registration",
                                da."distAvg Institutional Delivery",
                                da."distAvg Low Birth Weight",
                                da."distAvg Hypertension",
                                da."distAvg Diabetes ",
                                da."distAvg NQAS",
                                da."distAvg Treatment success rate"
                                ;
                              `;

  const parameters = [...values, selectedFinancialYear];

  // Execute the query
  const block_avg_result = await pool.query(query, parameters);

  const national_avg_result = await pool.query(national_avg_query);

  const state_avg_result = await pool.query(state_avg_query, parameters);

  const district_avg_result = await pool.query(district_avg_query, parameters);



    // Check if any rows were returned
    if (block_avg_result.rows.length === 0) {
        return res.status(404).json({ error: 'No data found' });
    }

    // Send the fetched data
    res.json({'national_avg_result': national_avg_result.rows, 'block_avg_result' : block_avg_result.rows, 'state_avg_result' : state_avg_result.rows, 'district_avg_result' : district_avg_result.rows});

});


// ----------------------------------- TAB 3 end point --------------------------------
// ------------------------------------------------------------------------------------
app.post('/fetch-data-tab3', async (req, res) => {

  // Extract filters from the request (you may want to validate or sanitize the input)
  const { selectedState, selectedDistrict, selectedBlock, selectedMonth1, selectedMonth2, selectedFinancialYear} = req.body;

  // Query the database to fetch data based on the filters
  const values = [selectedState, selectedDistrict, selectedBlock, selectedMonth1, selectedMonth2];

  console.log(values, '-- values tab 3 --');

  const query_tab3 = `
  SELECT 
    m.state, 
    m.district, 
    m.block, 
    m.year,
    (CASE 
      WHEN SUM(CASE WHEN m."No of PW Regd for ANC 1st Trimester" ~ '^[0-9.]+$' THEN m."No of PW Regd for ANC 1st Trimester"::numeric END) != 0 
      THEN (SUM(CASE WHEN m."No of PW Regd for ANC 1st Trimester" ~ '^[0-9.]+$' THEN m."No of PW Regd for ANC 1st Trimester"::numeric END) / NULLIF(SUM(CASE WHEN m."No of PW Regd for ANC" ~ '^[0-9.]+$' THEN m."No of PW Regd for ANC"::numeric END), 0)) * 100 
      ELSE NULL 
  END) AS block_avg_1st_tri_reg,
  (CASE 
      WHEN (SUM(CASE WHEN m."No of Insti Deliveries Conducted" ~ '^[0-9.]+$' THEN m."No of Insti Deliveries Conducted"::numeric END) + SUM(CASE WHEN m."No of Home Deliveries Conducted by SBA" ~ '^[0-9.]+$' THEN m."No of Home Deliveries Conducted by SBA"::numeric END) + SUM(CASE WHEN m."No of Home Deliveries Conducted by Non SBA" ~ '^[0-9.]+$' THEN m."No of Home Deliveries Conducted by Non SBA"::numeric END)) != 0 
      THEN ((SUM(CASE WHEN m."No of Insti Deliveries Conducted" ~ '^[0-9.]+$' THEN m."No of Insti Deliveries Conducted"::numeric END)) / NULLIF((SUM(CASE WHEN m."No of Insti Deliveries Conducted" ~ '^[0-9.]+$' THEN m."No of Insti Deliveries Conducted"::numeric END) + SUM(CASE WHEN m."No of Home Deliveries Conducted by SBA" ~ '^[0-9.]+$' THEN m."No of Home Deliveries Conducted by SBA"::numeric END) + SUM(CASE WHEN m."No of Home Deliveries Conducted by Non SBA" ~ '^[0-9.]+$' THEN m."No of Home Deliveries Conducted by Non SBA"::numeric END)), 0)) * 100 
      ELSE NULL 
  END) AS block_avg_inst_delivery,
  (CASE 
      WHEN SUM(CASE WHEN m."No of newborn weighed at birth" ~ '^[0-9.]+$' THEN m."No of newborn weighed less than 2500g"::numeric END) != 0 
      THEN (SUM(CASE WHEN m."No of newborn weighed less than 2500g" ~ '^[0-9.]+$' THEN m."No of newborn weighed less than 2500g"::numeric END) / NULLIF(SUM(CASE WHEN m."No of newborn weighed at birth" ~ '^[0-9.]+$' THEN m."No of newborn weighed at birth"::numeric END), 0)) * 100 
      ELSE NULL 
  END) AS block_avg_low_birth_wt,
  (CASE 
      WHEN SUM(CASE WHEN m."No of targeted facilities for NQAS" ~ '^[0-9.]+$' THEN m."NQAS Certified facilities"::numeric END) != 0 
      THEN (SUM(CASE WHEN m."NQAS Certified facilities" ~ '^[0-9.]+$' THEN m."NQAS Certified facilities"::numeric END) / NULLIF(SUM(CASE WHEN m."No of targeted facilities for NQAS" ~ '^[0-9.]+$' THEN m."No of targeted facilities for NQAS"::numeric END), 0)) * 100 
      ELSE NULL 
  END) AS block_avg_NQAS,
  (CASE 
      WHEN SUM(CASE WHEN m."Total Eligible Pop 30 plus" ~ '^[0-9.]+$' THEN m."No of persons screened for Diabetes"::numeric END) != 0 
      THEN (SUM(CASE WHEN m."No of persons screened for Diabetes" ~ '^[0-9.]+$' THEN m."No of persons screened for Diabetes"::numeric END) / NULLIF(SUM(CASE WHEN m."Total Eligible Pop 30 plus" ~ '^[0-9.]+$' THEN m."Total Eligible Pop 30 plus"::numeric END), 0)) * 100 
      ELSE NULL 
  END) AS block_avg_Diabetes,
  (CASE 
      WHEN SUM(CASE WHEN m."Total Eligible Pop 30 plus" ~ '^[0-9.]+$' THEN m."No of persons screened for Hypertension"::numeric END) != 0 
      THEN (SUM(CASE WHEN m."No of persons screened for Hypertension" ~ '^[0-9.]+$' THEN m."No of persons screened for Hypertension"::numeric END) / NULLIF(SUM(CASE WHEN m."Total Eligible Pop 30 plus" ~ '^[0-9.]+$' THEN m."Total Eligible Pop 30 plus"::numeric END), 0)) * 100 
      ELSE NULL 
  END) AS block_avg_Hypertension,
  (CASE 
      WHEN SUM(CASE WHEN m."Notification" ~ '^[0-9.]+$' THEN m."TreatmentSuccess"::numeric END) != 0 
      THEN (SUM(CASE WHEN m."TreatmentSuccess" ~ '^[0-9.]+$' THEN m."TreatmentSuccess"::numeric END) / NULLIF(SUM(CASE WHEN m."Notification" ~ '^[0-9.]+$' THEN m."Notification"::numeric END), 0)) * 100 
      ELSE NULL 
  END) AS block_avg_treatment_success
FROM 
    abp_monthly_data AS m
WHERE 
    m.state = $1
    AND m.district = $2
    AND m.block = $3
    AND (
      (m.month BETWEEN $4 AND $5) OR
      (m.month BETWEEN $5 AND $4) 
    )
    AND m.year = $6
GROUP BY
    m.state, 
    m.district, 
    m.block, 
    m.year
  `;

  const national_avg_query_tab3 = `
  SELECT 
  m.month, 
    na."natAvg 1st Trimester Registration",
    na."natAvg Institutional Delivery",
    na."natAvg Low Birth Weight",
    na."natAvg Hypertension",
    na."natAvg Diabetes ",
    na."natAvg NQAS",
    na."natAvg Treatment success rate"
  FROM 
    abp_monthly_data AS m, abp_national_avg as na
  GROUP BY 
    m.month, 
    na."natAvg 1st Trimester Registration",
    na."natAvg Institutional Delivery",
    na."natAvg Low Birth Weight",
    na."natAvg Hypertension",
    na."natAvg Diabetes ",
    na."natAvg NQAS",
    na."natAvg Treatment success rate";
  `;

  const state_avg_query_tab3 = `
  SELECT 
    m.state, 
    m.month,
    sa."stAvg 1st Trimester Registration",
    sa."stAvg Institutional Delivery",
    sa."stAvg Low Birth Weight",
    sa."stAvg Hypertension",
    sa."stAvg Diabetes ",
    sa."stAvg NQAS",
    sa."stAvg Treatment success rate"
  FROM 
    abp_monthly_data AS m
  LEFT JOIN 
    abp_state_avg AS sa 
  ON 
    m.state = sa.state
  WHERE 
    m.state = $1
    AND m.district = $2
    AND m.block = $3
    AND m.month BETWEEN $4 AND $5
    AND m.year = $6
  GROUP BY 
    m.state, 
    m.month,
    sa."stAvg 1st Trimester Registration",
    sa."stAvg Institutional Delivery",
    sa."stAvg Low Birth Weight",
    sa."stAvg Hypertension",
    sa."stAvg Diabetes ",
    sa."stAvg NQAS",
    sa."stAvg Treatment success rate"
    ;
  `;

  const district_avg_query_tab3 = `
  SELECT 
    m.state, 
    m.district,
    m.month,
    da."distAvg 1st Trimester Registration",
    da."distAvg Institutional Delivery",
    da."distAvg Low Birth Weight",
    da."distAvg Hypertension",
    da."distAvg Diabetes ",
    da."distAvg NQAS",
    da."distAvg Treatment success rate"
  FROM 
    abp_monthly_data AS m
  LEFT JOIN 
    abp_district_avg AS da 
  ON 
    m.state = da.state AND m.district = da.district
  WHERE 
    m.state = $1
    AND m.district = $2
    AND m.block = $3
    AND m.month BETWEEN $4 AND $5
    AND m.year = $6
  GROUP BY 
    m.state, 
    m.district,
    m.month,
    da."distAvg 1st Trimester Registration",
    da."distAvg Institutional Delivery",
    da."distAvg Low Birth Weight",
    da."distAvg Hypertension",
    da."distAvg Diabetes ",
    da."distAvg NQAS",
    da."distAvg Treatment success rate"
    ;
  `;

  const parameters = [...values, selectedFinancialYear];

  // Execute the query
  const block_avg_result_tab3 = await pool.query(query_tab3, parameters);

  const national_avg_result_tab3 = await pool.query(national_avg_query_tab3);

  const state_avg_result_tab3 = await pool.query(state_avg_query_tab3, parameters);

  const district_avg_result_tab3 = await pool.query(district_avg_query_tab3, parameters);

    // Check if any rows were returned
    if (block_avg_result_tab3.rows.length === 0) {
        return res.status(404).json({ error: 'No data found' });
    }

    // Send the fetched data
    res.json({'national_avg_result_tab3': national_avg_result_tab3.rows, 
              'block_avg_result_tab3' : block_avg_result_tab3.rows, 
              'state_avg_result_tab3' : state_avg_result_tab3.rows, 
              'district_avg_result_tab3' : district_avg_result_tab3.rows});

});


// ----------------------------------- TAB 4 end point --------------------------------
// ------------------------------------------------------------------------------------
app.post('/fetch-data-tab4', async (req, res) => {

  // Extract filters from the request (you may want to validate or sanitize the input)
  const { selectedState, selectedDistrict, selectedBlock, selectedMonth1, selectedMonth2, selectedFinancialYear } = req.body;

  // Query the database to fetch data based on the filters
  const values = [selectedState, selectedDistrict, selectedBlock];

  const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Find the index of month1 and month2
  const index1 = monthNames.indexOf(selectedMonth1);
  const index2 = monthNames.indexOf(selectedMonth2);

  // Check if both months are valid
  if (index1 === -1 || index2 === -1) {
    return '';
  }

  // Generate the list of months between month1 and month2
  let result_month = '';
  for (let i = index1; i <= index2; i++) {
    result_month += `'${monthNames[i]}'`;
    if (i < index2) {
      result_month += ', ';
    }
  }

  const query = `
  SELECT * 
  FROM abp_monthly_data 
  WHERE state = $1 
      AND district = $2 
      AND block = $3 
      AND month IN (${result_month}) 
      AND year = $4
  `;

  // const parameters = [...values, ...result_month, selectedFinancialYear];
  const parameters = [...values, selectedFinancialYear];

  try {
      // Execute the query
      const result = await pool.query(query, parameters);

      // Check if any rows were returned
      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'No data found' });
      }

      // Send the fetched data
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



pool.connect();

app.listen(4000, () => console.log("server on localhost:4000, it's listening ..."));
