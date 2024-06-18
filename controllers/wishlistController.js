const User = require("../models/userModel");
const myCart = require("../models/cartModel");

const addToWishList = async (req, res) => {
  try {
    const productId = req.body.productId;
    const userId = req.session.user;
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { wishlist: { product_id: productId } } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
};
const viewWishList = async (req, res) => {
  try {
    const userId = req.session.user;
    const wishlistProductsPopulated = await User.findById(userId).populate(
      "wishlist.product_id"
    );
    const wishlistProducts = wishlistProductsPopulated.wishlist.map(
      (item) => item.product_id
    );
    const cartProducts = await myCart
      .findOne({ userId: userId })
      .populate("userId");
    let cartCount;
    if (cartProducts) {
      cartCount = cartProducts.products.length;
    }

    const WishlistProduct = await User.findById(userId);
    let WishlistProductCount;
    if (WishlistProduct) {
      WishlistProductCount = WishlistProduct.wishlist.length;
    }

    res.render("wishlist", {
      wishlistProducts,
      cartCount,
      wishlistCount: WishlistProductCount,
      userId,
    });
  } catch (error) {
    console.log(error);
  }
};
const removeFromWishlist = async (req, res) => {
  try {
    const productId = req.query.id;
    const userId = req.session.user;
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { wishlist: { product_id: productId } } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addToWishList,
  viewWishList,
  removeFromWishlist,
};
