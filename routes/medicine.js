var express = require('express');
var router = express.Router();
const paginate=require('express-paginate')

medicine=require('../models/medicine.js')

/* GET users listing. */



//
router.get('/dashboard', async function(req, res){
    const [ table, itemCount ] = await Promise.all([
        medicine.find({}).limit(req.query.limit).skip(req.skip),
        medicine.countDocuments({})
    ]);
    const pageCount = Math.ceil(itemCount / req.query.limit);
   
    res.render('table', {
        table: table,
        pageCount,
        itemCount,
        pages: paginate.getArrayPages(req)(4, pageCount, req.query.page)
    });
});




router.get('/dashboard/addmedicine', function(req, res) {
  res.render('addmedicine')
});



router.post('/dashboard/addmedicine/confirm', function(req, res) {
  msg=new medicine({name:req.body.name,category:req.body.category})
  msg.save()
  res.redirect('/user/dashboard')
});




router.get('/dashboard/search', async function(req, res) {
    search=req.query.search
    console.log(search)
    result=new RegExp("^" + search, "i");
     const [ table, itemCount ] = await Promise.all([
        medicine.find({name: { $regex: result }}).limit(req.query.limit).skip(req.skip),
        medicine.countDocuments({name: { $regex: result }})
    ]);
    const pageCount = Math.ceil(itemCount / req.query.limit);
   
    if(itemCount==0)
    {
        res.render('norecord')
    }
    else
    {
        res.render('table', {
        table: table,
        pageCount,
        itemCount,
        pages: paginate.getArrayPages(req)(4, pageCount, req.query.page)
    });
    }
});






router.get('/dashboard/about', function(req, res) {
  res.render('about')
});





router.get('/dashboard/contact', function(req, res) {
  res.render('contact')
});

router.get('/dashboard/edit/:id', async function(req, res) {
  medicine.findById(req.params.id)
        .then((data) => {
            res.render('edit', {data
            });
        })
        .catch((error) => {
            // Handle any other errors that might occur during the database query
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });

});

router.get('/dashboard/view/:id', async function(req,res){
  medicine.findById(req.params.id)
        .then((data) => {
            res.render('view', {data});
        })
        .catch((error) => {
            // Handle any other errors that might occur during the database query
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
})

router.delete('/dashboard/delete/:id', async function(req,res){
  console.log('hello')
  medicine.deleteOne({_id:req.params.id}).then(()=>{res.json({deletion:'success'});console.log('SUCCESS')}).catch(err=>{console.log(err)})

})


router.post('/dashboard/editmedicine/:id', (req, res) => {
  const updateFields = {
    name: req.body.name,
    category: req.body.category
  };

  const query = { _id: req.params.id };

  medicine.updateOne(query, updateFields)
    .then(() => {
      console.log("Update success");
      res.redirect('/user/dashboard')
    })
    .catch((err) => {
      console.error("Update error:", err);
      res.status(500).send("Update error");
    });
});





module.exports = router;
