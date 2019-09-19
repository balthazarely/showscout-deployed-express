cconst express = require('express');
const router  = express.Router();
const User    = require('../models/user');
const bcrypt  = require('bcrypt');



//this is adding the data from the favArtists to the db

router.post('/home', async (req, res) => {
 try {
    // console.log(req.body, ' this is req.body');
    // console.log(currentSessionUser, ' current session user in post route')
    // console.log(req.session.userId, " < this is the current usersID")
 
    const foundUser = await User.findById(req.session.userId)

    foundUser.favArtists.push(req.body)
    // console.log("new Fav",req.body )
    foundUser.save(req.body)
    // console.log(foundUser)

    res.json({
      status: {
        code: 201,
        message: "Success"
      },
      data: foundUser
    });

  } catch(err){
    console.log(err);
    res.send(err);
  }
});





// Delete route
router.put('/home/:newFav', (req, res) => {

  console.log("trying to delete a newFav");

  try {

      // const findUser = await User.updateOne(

      //       { _id: req.session.userId },
      //       { $pull: { favArtists: {newFav: req.params.newFav} } },
      //       { multi: true }
      //   )

      console.log("finding user with id of " + req.session.userId);
      User.findById(req.session.userId, (err, foundUser) =>
      {
        if (err)
        {
          console.log(err);
        }
        else {
          //change the user's favArtists array
          
          console.log("found user " + foundUser.username);

          console.log("deleting fav " + req.params.newFav);

          for (let i = 0; i < foundUser.favArtists.length; i++)
          {
            if (foundUser.favArtists[i].newFav == req.params.newFav)
            {
              console.log("found this fav in the user's fav list, deleting it");
              foundUser.favArtists.splice(i, 1);
              break;
            }
          }

          foundUser.save();

          console.log("done");

          res.json({
          status: {
              code: 200,
              message: "resource deleted successfully"
            },
            data: foundUser
          });
        }
      });


      // console.log(findUser)
      // console.log(findUser.favArtists.length, " < after delete")
      // console.log("Deleting this Fav", req.params.newFav )

      
  } catch(err){
    res.send(err);
  }
});



// GET route for user infomation
router.get('/home', async (req, res, next) => {

    try {

      const findUser = await User.findById(req.session.userId);
      console.log("this is the GET user route", findUser )

      
      res.json({
        status: 200,
        data: findUser
      })

    } catch (err){

      res.send(err)

    }
});






router.post('/', async (req, res) => {
   console.log("can you see this?")

  // query the database
  try {
    const foundUser = await User.findOne({username: req.body.username});
    console.log(foundUser, ' foundUser');
  if(foundUser){

    if(bcrypt.compareSync(req.body.password, foundUser.password)){
      req.session.userId = foundUser._id;
      req.session.username = foundUser.username;
      req.session.logged = true;
      console.log(req.session)

      res.json({
        data: {message:"test message"},
        status:  {
            code: 200,
            message: "User Logged In"
          }
      })

    } else {
      res.json({
        status:  {
            code: 200,
            message: 'Username or Password incorrect'
          }
      })
    }
  } else {
    res.json({
        status:  {
            code: 200,
            message: 'Username or Password incorrect'
          }
      })
  }
  } catch(err){
    res.send(err);
  }
});



router.post('/register', async (req, res) => {
  console.log("can you see this?")
  // Encrypt our password
  const password = req.body.password;
  // encrypt our password
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  console.log(hashedPassword)

  req.body.password = hashedPassword;

  // We create our use
  try {
      const createdUser = await User.create(req.body);
      console.log(createdUser, ' created user');

      // set info on the session
      req.session.userId = createdUser._id;
      req.session.username = createdUser.username;
      req.session.location = createdUser.location;
      req.session.logged = true;
      console.log(req.session)

      res.json({
        status:  {
            code: 200,
            message: "User Logged In"
          }
      })
  } catch (err){
    res.send(err)
  }
});

router.get('/', (req, res) => {
  console.log("DEATH TO THE SESSION!")
  req.session.destroy((err) => {
    console.log("logout route hit")
    if(err){
      res.send(err);
    } else {
      res.json({
        status:  {
            code: 200,
            message: "User Logged Out"
          }
      })// back to the homepage
    }
  })

})



module.exports = router;
