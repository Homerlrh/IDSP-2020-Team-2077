const aws = require("aws-sdk"),
	multer = require("multer"),
	multerS3 = require("multer-s3");

aws.config.update({
	secretAccessKey: process.env.IAM_SECRET,
	accessKeyId: process.env.IAM_KEY,
	region: "us-west-2",
});

const s3 = new aws.S3();

exports.upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: "apple-clone",
		key: function (req, file, cb) {
			console.log(`${file} uploaded`);
			cb(null, file.originalname); //use Date.now() for unique file keys
		},
	}),
});
