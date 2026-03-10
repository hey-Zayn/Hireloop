const transporter = require('../Config/Nodemailer/nodemailer');

const sendVerificationEmail = async (email, verificationToken) => {
    const mailOptions = {
        from: `HireLoop <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify your email',
        html: `<h1>Welcome to HireLoop</h1><p>Your verification code is: <strong>${verificationToken}</strong></p>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Error sending verification email');
    }
};

const sendPasswordResetEmail = async (email, resetToken) => {
    const mailOptions = {
        from: `HireLoop <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset your password',
        html: `<p>You requested a password reset. Your reset code is: <strong>${resetToken}</strong></p>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending reset email:', error);
        throw new Error('Error sending reset email');
    }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
