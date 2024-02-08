const express = require("express");
const {Pool} = require("pg");
const cors = require("cors");
const { pool } = require("./database");

const app = express();

app.use(express.json());

app.use(cors());

console.log('working before post')


// app.get("/home", (req, res) => {
//     res.send("Response received:" + req.body)
// })


// Login endpoint
app.post('/login', async (req, res) => {
  console.log(req.body.username, req.body.password)
  const { username, password } = req.body;

  // try {
    // Query the database to verify the username and password
    // const result = await pool.query('SELECT * FROM cno_login_accounts WHERE user_name = $1 AND password = $2' , [username, password]);
    const result = await pool.query('SELECT * FROM cno_login_accounts AS a JOIN abp_monthly_data AS b ON a.block1_code = b.block_code WHERE user_name = $1 AND password = $2', [username, password]);

    console.log(result)
    
    if (result.rows.length > 0) {
    // User authenticated, generate a token (you might want to use a proper authentication library here)
      const token = req.body.token;

      res.send(result);

      // console.log(result.rows[0].user_name, result.rows[0].password, result.rows[0].block1_code)
      

    // } else {
    //   // User not found or invalid credentials
    //   res.status(401).json({ error: 'Invalid credentials' });
    }
  // } catch (error) {
  //   console.error('Error during login:', error);
  //   res.status(500).json({ error: 'Internal server error' });
  // }
});



// app.post('/common-fetch-data', (req, res) => {
//   pool.query('SELECT DISTINCT blockname, "Percentage 1st Trimester Registration" FROM abp_monthly_data ORDER BY "Percentage 1st Trimester Registration" DESC LIMIT 5;')
//     .then(Top5 => {
//       console.log(Top5.rows, '------ TOP 5 -------------');
//       res.send(Top5.rows);
//     })
//     .catch(error => {
//       console.error('Error fetching data:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     });

// });



app.post('/common-fetch-data', (req, res) => {
  const top5Query1 = 'SELECT DISTINCT blockname, "Percentage 1st Trimester Registration" FROM abp_monthly_data ORDER BY "Percentage 1st Trimester Registration" DESC LIMIT 5;';
  const top5Query2 = 'SELECT DISTINCT blockname, "Percentage Institutional Delivery" FROM abp_monthly_data ORDER BY "Percentage Institutional Delivery" DESC LIMIT 5;';
  const top5Query3 = 'SELECT DISTINCT blockname, "Percentage Low Birth Weight" FROM abp_monthly_data ORDER BY "Percentage Low Birth Weight" DESC LIMIT 5;';
  const bottom5Query_1 = 'SELECT DISTINCT blockname, "Percentage 1st Trimester Registration" FROM abp_monthly_data ORDER BY "Percentage 1st Trimester Registration" ASC LIMIT 5;';
  const bottom5Query_2 = 'SELECT DISTINCT blockname, "Percentage Institutional Delivery" FROM abp_monthly_data ORDER BY "Percentage Institutional Delivery" ASC LIMIT 5;';
  const bottom5Query_3 = 'SELECT DISTINCT blockname, "Percentage Low Birth Weight" FROM abp_monthly_data ORDER BY "Percentage Low Birth Weight" ASC LIMIT 5;';

  pool.query(`${top5Query1}; ${top5Query2}; ${top5Query3}; ${bottom5Query_1}; ${bottom5Query_2}; ${bottom5Query_3}`)
    .then(result => {
      const top5Rows1 = result[0].rows;
      const top5Rows2 = result[1].rows;
      const top5Rows3 = result[2].rows;
      const bottom5Rows_1 = result[3].rows;
      const bottom5Rows_2 = result[4].rows;
      const bottom5Rows_3 = result[5].rows;

      console.log(top5Rows1, '------ TOP 5 -------------');
      console.log(bottom5Rows_1, '------ BOTTOM 5 -------------');

      res.send({ top5_1: top5Rows1, top5_2: top5Rows2, top5_3: top5Rows3, bottom5_1: bottom5Rows_1, bottom5_2: bottom5Rows_2, bottom5_3: bottom5Rows_3  });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

  



// Query the database to fetch data based on the filters
// Data fetching endpoint
app.post('/fetch-data', async (req, res) => {
  console.log(req, '-- this is req /fetch-data');
  // try {
    // Extract filters from the request (you may want to validate or sanitize the input)
    const { selectedState, selectedDistrict, selectedBlock } = req.body;

    // Query the database to fetch data based on the filters
    // const query = 'SELECT * FROM abp_monthly_data WHERE "State" = $1 AND "District" = $2 AND "blockname" = $3';
    values = [selectedState, selectedDistrict, selectedBlock];

    // const result = await pool.query(query, values, (err, result) => {

    //   console.log(values, '-- result -- before if @@@@');

    //   if (err) {
    //     console.error('Error executing query:', err);
    //     return res.status(500).json({ error: 'Internal server error' });
    //   }
    // });

    const result = await pool.query('SELECT * FROM abp_monthly_data WHERE "State" = $1 AND "District" = $2 AND "blockname" = $3', [selectedState, selectedDistrict, selectedBlock]);


    // Check if any rows were returned
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }

    // Send the fetched data
    res.send(result);

    // console.log(result, '-- result --');

  // } catch (error) {
  //   console.error('Error fetching data:', error);
  //   res.status(500).json({ error: 'Internal server error' });
  // }
});



app.get('/State', (req, res)=>{
    pool.query(`Select DISTINCT state FROM cno_login_accounts`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    pool.end;
})
pool.connect();

app.get('/District', (req, res)=>{
  pool.query(`Select DISTINCT district FROM cno_login_accounts`, (err, result)=>{
      if(!err){
          res.send(result.rows);
      }
  });
  pool.end;
})
pool.connect();

app.get('/Block', (req, res)=>{
  pool.query(`Select DISTINCT block FROM cno_login_accounts`, (err, result)=>{
      if(!err){
          res.send(result.rows);
      }
  });
  pool.end;
})
pool.connect();

// app.post("/login", (req, res) => {
//     const username = req.body["username"]
//     const password = req.body["password"]
//     console.log("Username : " + username);
//     console.log("Password : " + password);

//     const insertSTMT = `INSERT INTO accounts (username, password) VALUES ('${username}', '${password}');`;

//     pool.query(insertSTMT)
//         .then(response => {
//             console.log("DATA SAVED");
//             console.log(response);
//             res.send("Data saved successfully"); // Corrected res.send method
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).send("Error saving data"); // You might want to handle errors more gracefully
//         });

//     console.log(req.body);
//     // res,send("Response Received : " + req.body); // This line seems incorrect, you can remove it
// });

app.listen(4000, () => console.log("server on localhost:4000, it's listening ..."));
