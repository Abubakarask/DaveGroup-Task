const User = require("../models/User");
const { sendEmail } = require("../middlewares/sendEmail");
const crypto = require("crypto");

let otp;
exports.signup = async (req, res) => {
  try {
    console.log(req.body)
    const {name, username, email} = req.body;
    console.log(email);

    let user = await User.findOne({ email });
    console.log(user);
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    otp = Math.floor(100000 + Math.random() * 900000);
    const message = `Your OTP for registeration is ${otp}`
    console.log("j")
    try {
      await sendEmail({
        email: email,
        subject: "OTP Authentication",
        message
      });

      res.status(200).json({
          success: true,
          message: `Email sent to ${user.email}`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
    });
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.register = async (req, res) => {
  try {
    console.log(req.body);
    const { email, Receivedotp } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // const myCloud = await cloudinary.v2.uploader.upload(avatar, {
    //   folder: "avatars",
    // });
    if (Receivedotp === otp) {
      user = await User.create({
        email
      });

      const token = await user.generateToken();

      const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.status(201).cookie("token", token, options).json({
        success: true,
        user,
        token,
      });

    } else {
      res.status(500).json({
        success: false,
        message: "Incorrect OTP",
      });
    }

    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select("+password")

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "Logged out",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.accout = async(req, res) => {
  try {
    {username, name, email, role, status, company}

    const user = await User.findOne({ email })
      .select("+password")
    
    user.name = name
    user.username = username
    user.email = email
    user.role = role
    user.status = status
    user.company = company

    
  } catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
}
}

exports.security = async (req, res) => {
  try {
    const {currentPassword, password, conPassword} = req.body;

    if (currentPassword === user.password) {
      if (password === conPassword) {
        user.password = password
      } else {
        res.status(400).json({
          success: false,
          message: "Both the Password doesn't"
      });
      }
    } else {
      res.status(500).json({
        success: false,
        message: "Incorrect Current Password"
    });
    }

    res.status(200).json({
      success: true,
      message: "Successfully Changed Password"
  });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
  });
  }
}

exports.info  = async (req, res) => {
  try {
    const {bio, dob, website, languages, phone, country, gender} = req.body

    user.bio = bio
    user.birthdate = dob
    user.website = website
    user.languages =languages
    user.phone = phone
    user.country = country
    user.gender = gender

    res.status(200).json({
      success: true,
      user
  });
    
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
  });
  }
}

exports.myProfile = async (req, res) => {
  try {
      const user = await User.findById(req.user._id).populate("posts");
      
      res.status(200).json({
          success: true,
          user
      });
      
  } catch (error) {
      res.status(500).json({
          success: false,
          message: error.message
      });
  }
}