const { User } = require('../../models/user');

const { RequestError, sendEmail } = require('../../helpers');

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!email) {
    throw RequestError(400, 'Missing required field email');
  }

  if (!user) {
    throw RequestError(404, 'User not found');
  }

  if (user.verify) {
    throw RequestError(400, 'Verification has already been passed');
  }

  const mail = {
    to: email,
    subject: 'Confirmation of registration on the website',
    html: `<a href="http://localhost:3000/api/auth/verify/${user.verificationToken}" target="_blank">Click to confirm email</a>`,
  };
  await sendEmail(mail);

  res.json({
    message: 'Email verify resend',
  });
};

module.exports = resendVerifyEmail;
