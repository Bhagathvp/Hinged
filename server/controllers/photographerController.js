const Admin = require('../models/adminModel')
const User = require('../models/userModel')
const Vendor = require('../models/vendorModel')
const Services = require('../models/services')
const Photographer = require('../models/photography')
const {saveImage} = require('../Frameworks/utils/cloudinaryImage')
require('dotenv').config();


const asyncHandler = require('express-async-handler')

const getAllPhotographers = asyncHandler(async(req,res)=>{
    const AlPhotographers = await Photographer.find()
    if(AlPhotographers){

        const sub = AlPhotographers.filter((photographer)=>photographer.subscription===true)
        const noSub = AlPhotographers.filter((photographer)=>photographer.subscription!==true)
        console.log(sub,'subbbbbbbbbbbbbbbbb',noSub)
        const shuffledSubArray = [...sub];
            for (let i = shuffledSubArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSubArray[i], shuffledSubArray[j]] = [shuffledSubArray[j], shuffledSubArray[i]];
            }
        const shuffledNoSubArray = [...noSub];
            for (let i = shuffledNoSubArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledNoSubArray[i], shuffledNoSubArray[j]] = [shuffledNoSubArray[j], shuffledNoSubArray[i]];
            }
        const AllPhotographers =[...shuffledSubArray,...shuffledNoSubArray]
        console.log(AllPhotographers,'<==final All photographers')

        res.status(200).json({
            AllPhotographers
        })
    }else{
        res.status(400)
        throw new Error('no photographers found')
    }
})



const searchPhotographers = asyncHandler(async(req,res)=>{
    const {searchQuery,selectedBudgets} = req.query;
    console.log(searchQuery,'searching....');
    console.log(selectedBudgets,'filtering....');

    const AllPhotographers = await Photographer.find({})

    if(AllPhotographers && !selectedBudgets){

        const FilteredPhotographers = AllPhotographers.filter((photographer) =>
            photographer.brand.toLowerCase().includes(searchQuery.toLowerCase())
            );
  
        const sub = FilteredPhotographers.filter((photographer)=>photographer.subscription===true)
        const noSub = FilteredPhotographers.filter((photographer)=>photographer.subscription!==true)
        console.log(sub,'subbbbbbbbbbbbbbbbb',noSub)
        const shuffledSubArray = [...sub];
            for (let i = shuffledSubArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSubArray[i], shuffledSubArray[j]] = [shuffledSubArray[j], shuffledSubArray[i]];
            }
        const shuffledNoSubArray = [...noSub];
            for (let i = shuffledNoSubArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledNoSubArray[i], shuffledNoSubArray[j]] = [shuffledNoSubArray[j], shuffledNoSubArray[i]];
            }
        const filteredPhotographers =[...shuffledSubArray,...shuffledNoSubArray]

        console.log(filteredPhotographers,'<==final filtered photographers');
        
        res.status(200).json({
            filteredPhotographers
        })
    }else if(AllPhotographers && selectedBudgets){

        // Filter photographers based on budget and search query
        const FilteredPhotographers = AllPhotographers.filter((photographer) => {
            const amount = photographer.amount;
            const isBudgetFriendly = selectedBudgets.includes('Budget_Friendly');
            const isValueForMoney = selectedBudgets.includes('Value_For_Money');
            const isPremium = selectedBudgets.includes('Premium');
            const isLuxury = selectedBudgets.includes('Luxury');

            if (isBudgetFriendly && amount <= 100000) {
                return photographer.brand.toLowerCase().includes(searchQuery.toLowerCase());
            }

            if (isValueForMoney && amount > 100000 && amount <= 200000) {
                return photographer.brand.toLowerCase().includes(searchQuery.toLowerCase());
            }
            if (isPremium && amount > 200000 && amount <= 300000) {
                return photographer.brand.toLowerCase().includes(searchQuery.toLowerCase());
            }
            if (isLuxury && amount > 300000) {
                return  photographer.brand.toLowerCase().includes(searchQuery.toLowerCase());
            }
        });
        
        const sub = FilteredPhotographers.filter((photographer)=>photographer.subscription===true)
        const noSub = FilteredPhotographers.filter((photographer)=>photographer.subscription!==true)
        console.log(sub,'subbbbbbbbbbbbbbbbb',noSub)
        const shuffledSubArray = [...sub];
            for (let i = shuffledSubArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSubArray[i], shuffledSubArray[j]] = [shuffledSubArray[j], shuffledSubArray[i]];
            }
        const shuffledNoSubArray = [...noSub];
            for (let i = shuffledNoSubArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledNoSubArray[i], shuffledNoSubArray[j]] = [shuffledNoSubArray[j], shuffledNoSubArray[i]];
            }
        const filteredPhotographers =[...shuffledSubArray,...shuffledNoSubArray]

        console.log(filteredPhotographers,'<==final filtered photographers');
        res.status(200).json({
            filteredPhotographers
        })
    }else{
        res.status(400)
        throw new Error('no photographers found')
    }
})

const getPhotoProfile = asyncHandler(async(req,res)=>{
    const { id } = req.query;
    console.log(id); 
    const photographer = await Photographer.findOne({_id:id})
    console.log(photographer);
    if(photographer){
        res.status(200).json({
            photographer
        })
    }else{
        res.status(400)
        throw new Error('no photographers found')
    }
    
})

const getPhotographers = asyncHandler(async(req,res)=>{

    const {id} = req.body;
    const photographers = await Photographer.find({vendor_id:id})
    if(photographers){
        res.status(200).json({
            photographers
        })
    }else{
        res.status(400)
        throw new Error('no photographers found')
    }
    
})

//add photographers
const addPhotographer = asyncHandler(async(req,res)=>{
    const {id,category,brand,baseCity,contact,number,price} = req.body;
    const idExists = await Photographer.find({id:id});
    if(idExists){
        idExists.map((idExist)=>{
            if(idExist.brand.replace(/\s/g, '') === brand.replace(/\s/g, '')){
                res.status(401).json({message: 'category with the same brand already added'})
                throw new Error('Category already present');
            }
        })
        
    }
        const categoryAdded = await Photographer.create({
            vendor_id: id,
            brand,
            contact_name: contact,
            mobile: number,
            amount: price,
            base_city: baseCity
        })

        if(categoryAdded){
            const photographers = await Photographer.find({vendor_id:id})
            res.status(201).json({
                photographers
            })
        }else{
            res.status(400)
            throw new Error('Invalid details')
        }

})


//edit photographer
const editPhotographer = asyncHandler(async(req,res)=>{

    const cloudImg= await saveImage(req.file?.buffer)
    const {id,category,brand,baseCity,contact,number,price} = req.body;

    const categoryAdded = await Photographer.findOneAndUpdate(
        { vendor_id : id, brand },
        {
          $set: {
            base_city: baseCity,
            contact_name: contact,
            mobile: number,
            amount: price,
          },$push:{
            images: cloudImg?.secure_url
          }
        },
        { new: true } 
      );
      
    if(categoryAdded){
        const photographers = await Photographer.find({vendor_id:id})
        res.status(201).json({
            photographers
        })
    }else{
        res.status(400)
        throw new Error('Invalid details')
    }

})

const bookedPhotographers = asyncHandler(async(req,res)=>{
    const {id} = req.query
    const photographer = await Photographer.findOne({_id:id});
    if(photographer){
        res.status(200).json(photographer);
    }else{
        res.status(400).json("No services Found")
    }
})

const addReview = asyncHandler(async(req,res)=>{
    const {userId,id,comment} = req.body;
    const user = await User.findOne({_id:userId});
    if(user){
        const photographer = await Photographer.findOne({_id:id});
        photographer.reviews.push({
            name: user.name,
            imageUrl: user.imageUrl,
            comment
        })
        const reviewAdded=await photographer.save({new:true});
        if(reviewAdded){
            res.status(200).json({
                reviewAdded,
                message:"review added successfully"})
        }else{
            res.status(400).json('review not added')
        }
    }else{
        res.status(400).json('user does not exist');
    }
})

const addOffer = asyncHandler(async(req,res)=>{
    const {offer,id} = req.body;
    const setOffer = await Photographer.findOneAndUpdate({_id: id},{$set:{offer}},{new: true});
    if(setOffer){
    const photographers = await Photographer.find({_id: id});
        res.status(200).json({
            photographers,
            message:'offer added'
        })
    }else{
        res.status(400).json('action failed');
    }
})

const clearOffer = asyncHandler(async(req,res)=>{
    const {id} = req.body;
    const clearOffer = await Photographer.findOneAndUpdate({_id: id},{$set:{offer:0}},{new: true});
    
    if(clearOffer){
        res.status(200).json({
            photographers: [clearOffer],
            message:'offer cleared'
        })
    }else{
        res.status(400).json('action failed');
    }
})

module.exports = {
    getAllPhotographers,
    getPhotoProfile,
    getPhotographers,
    addPhotographer,
    editPhotographer,
    searchPhotographers,
    bookedPhotographers,
    addReview,
    addOffer,
    clearOffer
}