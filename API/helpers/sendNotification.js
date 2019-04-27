const sendNotification = (transporter, transaction, email, transactionType) => {
  let message;

  if (transactionType === 'credit') {
    message = 'deposited into';
  } else {
    message = 'withdrawn from';
  }

  const mailOptions = {
    from: 'osaukhu.bi@gmail.com',
    to: email,
    subject: 'Your Last Transaction',
    html: `<p>Dear customer, NGN${transaction.amount} was 
    ${message} your account</p>
    <p>Your new balance is NGN${transaction.new_balance}</p>`,
  };

  transporter.sendMail(mailOptions);
};

export default sendNotification;
