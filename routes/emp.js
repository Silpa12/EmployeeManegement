var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display employee
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM emp_management ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/emp/index.ejs
            res.render('emp',{data:''});   
        } else {
            // render to views/emp/index.ejs
            res.render('emp',{data:rows});
        }
    });
});

// display add emp page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('emp/add', {
        First_name: '',
        Last_name:'',
        DOB:'',
        Gender:'',
        Password:'',
        Conpass: ''        
    })
})

// add a new employee
router.post('/add', function(req, res, next) {    

    let First_name = req.body.First_name;
    let Last_name = req.body.Last_name;
    let DOB = req.body.DOB;
    let Gender = req.body.Gender;
    let Password = req.body.Password;
    let Conpass = req.body.Conpass;
    let errors = false;

    if(First_name.length === 0 ||Last_name.length===0||DOB.length===0||Gender.length===0||Password.length===0||Conpass.length===0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter details");
        // render to add.ejs with flash message
        res.render('emp/add', {
            First_name: First_name,
            Last_name:Last_name,
            DOB:DOB,
            Gender:Gender,
            Password:Password,
            Conpass:Conpass

        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            First_name: First_name,
            Last_name:Last_name,
            DOB:DOB,
            Gender:Gender,
            Password:Password,
            Conpass:Conpass

        }
        
        // insert query
        dbConn.query('INSERT INTO emp_management SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('emp/add', {
                    First_name: form_data.First_name,
                    Last_name:form_data.Last_name,
                    DOB:form_data.DOB,
                    Gender:form_data.Gender,
                    Password:form_data.Password,
                    Conpass:form_data.Conpass
                                   
                })
            } else {                
                req.flash('success', 'employee successfully added');
                res.redirect('/emp');
            }
        })
    }
})

// display edit emp page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM emp_management WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'employee found with id = ' + id)
            res.redirect('/emp')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('emp/edit', {
                title: 'Edit emp', 
                id: rows[0].id,
                First_name: rows[0].First_name,
                Last_name:rows[0].Last_name,
                DOB:rows[0].DOB,
                Gender:[0].Gender,
                Password:rows[0].Password,
                Conpass:rows[0].Conpass
            
            })
        }
    })
})

// update employee data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let First_name = req.body.First_name;
    let Last_name = req.body.Last_name;
    let DOB = req.body.DOB;
    let Gender = req.body.Gender;
    let Password = req.body.Password;
    let Conpass = req.body.Conpass;
    let errors = false;

    if(First_name.length === 0 ||Last_name.length===0||DOB.length===0||Gender.length===0||Password.length===0||Conpass.length===0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter emp details");
        // render to add.ejs with flash message
        res.render('emp/edit', {
            id: req.params.id,
            First_name: First_name,
            Last_name:Last_name,
            DOB:DOB,
            Gender:Gender,
            Password:Password,
            Conpass:Conpass
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            First_name: First_name,
            Last_name:Last_name,
            DOB:DOB,
            Gender:Gender,
            Password:Password,
            Conpass:Conpass
        }
        // update query
        dbConn.query('UPDATE emp_management SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('emp/edit', {
                    id: req.params.id,
                    First_name: form_data.First_name,
                    Last_name:form_data.Last_name,
                    DOB:form_data.DOB,
                    Gender:form_data.Gender,
                    Password:form_data.Password,
                    Conpass:form_data.Conpass
                    

                })
            } else {
                req.flash('success', 'employee details successfully updated');
                res.redirect('/emp');
            }
        })
    }
})
   
// delete emp
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM emp_management WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to emp page
            res.redirect('/emp')
        } else {
            // set flash message
            req.flash('success', 'employee successfully deleted! ID = ' + id)
            // redirect to  page
            res.redirect('/emp')
        }
    })
})

module.exports = router;