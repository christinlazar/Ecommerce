const { error } = require("console");
const Banner = require("../models/bannerModel");
const fs = require("fs");
const loadAddbanner = async (req, res) => {
  try {
    const banner = await Banner.find({});
    const currentRoute = "/admin/addbanner";
    res.render("addbanner", { banner, currentRoute });
  } catch (error) {
    console.log(error);
  }
};
const addBannerDetails = async (req, res) => {
  try {
    const { title, description, startingDate, endingDate } = req.body;
    const images = req.files;
    const image = images.map((element) => element.filename);
    const banner = new Banner({
      title: title,
      description: description,
      image: image,
      startDate: startingDate,
      endDate: endingDate,
    });
    const savedbanner = await banner.save();
    res.redirect("/admin/addbanner");
  } catch (error) {
    console.log(error);
  }
};
const loadEditBanner = async (req, res) => {
  try {
    const bannerId = req.query.id;
    req.session.bannerId = bannerId;
    const bannerIs = await Banner.findOne({ _id: bannerId });
    res.render("editbanner", { bannerIs });
  } catch (error) {
    console.log(error);
  }
};
const deleteBanner = async (req, res) => {
  try {
    const bannerId = req.body.bannerId;
    const index = req.body.index;
    const banner = await Banner.findById(bannerId);
    const bannerToDelete = banner.image[index];
    fs.unlink(bannerToDelete, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("succees");
      }
    });
    banner.image.splice(index, 1);
    await Banner.create(banner);
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
};
const verifyEditBanner = async (req, res) => {
  try {
    const bannerId = req.session.bannerId;
    const { title, description, startingDate, endingDate } = req.body;
    const images = req.files;
    const newImages = images.map((el) => el.filename);
    if (newImages.length > 0) {
      await Banner.updateOne(
        { _id: bannerId },
        { $push: { image: { $each: newImages } } }
      );
    }
    await Banner.findByIdAndUpdate(bannerId, {
      $set: {
        title: title,
        description: description,
        startDate: startingDate,
        endDate: endingDate,
      },
    });
    res.redirect("/admin/addbanner");
  } catch (error) {
    console.log(error);
  }
};
const blockBanner = async (req, res) => {
  try {
    const bannerId = req.body.bannerId;
    await Banner.findOneAndUpdate(
      { _id: bannerId },
      { $set: { isActive: false } }
    );
    res.status(200).json({ succces: true });
  } catch (error) {
    console.log(error);
  }
};
const unBlockBanner = async (req, res) => {
  try {
    const bannerId = req.body.bannerId;
    await Banner.findOneAndUpdate(
      { _id: bannerId },
      { $set: { isActive: true } }
    );
    res.status(200).json({ succces: true });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  loadAddbanner,
  addBannerDetails,
  loadEditBanner,
  deleteBanner,
  verifyEditBanner,
  blockBanner,
  unBlockBanner,
};
