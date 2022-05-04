
const collegeModel = require('../models/collegeModel');
const internModel = require('../models/internModel')
const jwt = require("jsonwebtoken");
//const { validString } = require("../utils/validation")

const createColleges = async (req, res) => {
  try {

    let names = /^[a-zA-Z ]{2,30}$/.test(req.body.name)
    let fullName = req.body.fullName
    let logoLink = req.body.logoLink
    
    let data = await collegeModel.findOne({name: req.body.name})

    if(req.body.name === undefined || req.body.fullName === undefined || req.body.logoLink === undefined){
      return res.status(400).send({status: false, message: "invalid request ! please provide details"})
    }else if(!req.body.name){
      res.status(400).send({status: false, message: "Name is missing"})
      console.log(req.body.name)
    }else if(!req.body.fullName){
      res.status(400).send({status: false, message: "fullName is missing"})
    }else if(!req.body.logoLink){
      res.status(400).send({status: false, message: "LogoLink is missing"})
    }else if(names == false){
      res.status(400).send({status: false, message: "please inter valid name"})
    }else if(fullName == 0){
      res.status(400).send({status: false, message: "please inter valid fullName"})
    }else if(logoLink == false){
      res.status(400).send({status: false, message: "please inter valid link"})
    }else if(!data){
      let value  = req.body
      let valueCreate = await collegeModel.create(value)
      res.status(200).send({status: true, data: valueCreate})
    }else if(data){
      res.status(400).send({massage: "Name is alrady exist"})
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
}

//===================================College DETAILS===================================

const collegeDetails = async (req, res) => {
  try {
      let collegeName = req.query.collegeName;
      if (!collegeName) return res.status(400).send({ status: false, message: "Enter College Name" });
      //if (validString.test(collegeName)) return res.status(400).send({ status: false, message: "Enter a valid college name" })

      let getCollegeData = await collegeModel.findOne({ name: collegeName, isDeleted: false }).select({ name: 1, fullName: 1, logoLink: 1 });
      if (!getCollegeData) return res.status(404).send({ status: false, message: "College not found! check the name and try again" });

      let { ...data } = getCollegeData._doc

      let getInterns = await internModel.find({ collegeId: data._id, isDeleted: false }).select({ name: 1, email: 1, mobile: 1 });
      if (!getInterns) return res.status(404).send({ status: false, message: "No interns available" });

      delete (data._id);
      data.interests = getInterns;

      res.status(200).send({ status: true, message: "All okk", data: data });
  } catch (err) {
      res.status(500).send({ status: false, message: err.message })
  }
}

module.exports = {
  createColleges,
  collegeDetails
}

// const loginAuthor = async function (req, res) {
//   try {
//     let email = req.body.email;
//     let password = req.body.password;
//     if(!email && !password){
//       res.status(400).send({msg:"email and password must be present in body"})
//     }
//     let getData = req.body;
//     if (Object.keys(getData).length == 0) return res.status(400).send({ status: false, msg: "Data is required to add a Author" });
//     let author = await Author.findOne({ email: email, password: password });
//     if (!author)
//       return res.status(404).send({
//         status: false,
//         msg: "email or the password is not corerct",
//       });
//     let token = jwt.sign(
//       {
//         authorid: author._id.toString(),
//         organisation: "FunctionUp",
//       },
//       "functionup-uranium"
//     );
//     res.setHeader("x-api-key", token);
//     console.log(token);
//     res.status(201).send({ status: true, data: token });
//   }
//   catch (err) {
//     res.status(500).send({ msg: "Error", error: err.message })
//   }
// };



