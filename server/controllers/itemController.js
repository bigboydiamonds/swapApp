const db = require('../models/SwapModel');
const itemController = {};
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'swapme', 
  api_key: '664311791237882', 
  api_secret: 'QSaAUgEMAaUhC-Jl5q6oIqk9SYI' 
});

itemController.saveImage = async (req, res, next) =>{
  const {item_id}= req.params;
  const {user_id, imgURL} = res.locals
  const text = `INSERT image(img_url, item_id, user_id)
                VALUES ($1, $2, $3)
                RETURNING *`
  const values = [imgURL, item_id, user_id]
  await db.query(text, values)
  .then(response => {
    console.log(`this is the response in saveImage:`, response)
    next();
  })

}

//ANOTHER MIDDLEWARE TO GET THE USER_ID FROM THE ITEM TABLE 
itemController.getUserId= async (req,res, next) =>{
  const {item_id} = req.params;
  const text = `SELECT user_id FROM item i WHERE i.item_id = $1 RETURNING user_id`
  const values = [item_id];
  await db.query(text, values)
  .then(response => {
    console.log('this is the response in getUserId:',response);
    res.locals.user_id = response.rows[0];
    next();
  })
  .catch(err =>{
    return next(err);
  })
}

//adding the image to cloudinary 
itemController.addImage = (req, res, next) => {
  // const image = req.files;
  // console.log('image:', image)
  // return next();
  const values = Object.values(req.files)
  // console.log(values)
  const promises = values.map(image => cloudinary.uploader.upload(image.path))
  Promise
    .all(promises)
    .then(results => {
    // console.log('results url' , results[0].url)
      res.locals.imgURL = results[0].url 
      next();
    })
    .catch(err => {
      console.log(err);
      })
}

//getting all the items & their respective images 
itemController.getItems = (req, res, next) => {
  //send a url 
}




module.exports = itemController;
