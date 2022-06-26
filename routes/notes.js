const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    let userid = req.user.id;
    let notes = await Notes.find({ user: userid });
    console.log(notes);
    res.send(notes);
  } catch (error) {
    res.status(400).json("internal servor error");
    console.log(error);
  }
});
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Title must have atleast 3 characters").isLength({ min: 3 }),
    body("description", "Description must have atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        // 400 is status for bad request which will be send in this if errrors array is not empty
      }
      try {
        let userid = req.user.id;
        let data = await Notes.create({
          user: userid,
          title: req.body.title,
          description: req.body.description,
          tag: req.body.tag,
        });
        res.send(data);
      } catch (error) {
        res.status(400).json("internal servor error");
        console.log(error);
      }
    } catch (error) {
      console.log("not working");
    }
    console.log("working");
  }
);
// usually we do put request for updating a note.
router.put("/updatenote/:id",fetchuser, async(req,res)=>
{
  try {
    let note={
      title:req.body.title,
      description:req.body.description,
      tag:req.body.tag
    };
    let input=await Notes.findById(req.params.id);
    if(!input)
    {
      return res.status(400).send("Bad Request");
    }
    if(input.user.toString()!=req.user.id)
    {
      //iska matlab koi unauthorised banda aagaya hai access karne kisi aur user ka note.
      return res.status(401).send("Access Denied");
    }
    note=await Notes.findByIdAndUpdate(req.params.id,{$set: note},{new:true});
    res.status(200).json(note);
  } 
  catch (error) {
    console.log(error);
  }
})
router.delete("/deletenote/:id",fetchuser, async(req,res)=>{
    let input=await Notes.findById(req.params.id);
    if(!input)
    {
      return res.status(400).send("Bad Request");
    }
    if(input.user.toString()!=req.user.id)
    {
      //iska matlab koi unauthorised banda aagaya hai access karne kisi aur user ka note.
      return res.status(401).send("Access Denied");
    }
    let note=await Notes.findByIdAndDelete(req.params.id);
    res.send("Deleted",note);
})
module.exports = router;
