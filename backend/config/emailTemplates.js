export const EMAIL_VERIFY_TEMPLATE = ``

export const PASSWORD_RESET_TEMPLATE = 
`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Reset</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      font-family: 'Lato', sans-serif;
      color: #000;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background-color: #ffffff;
      border: 1px solid #eee;
    }
    .header, .footer {
      background-color: #150958;
      color: #ffffff;
      text-align: center;
      padding: 30px 20px;
    }
    .content {
      padding: 40px 30px;
      text-align: left;
      font-size: 16px;
      color: #333333;
    }
    .btn {
      display: inline-block;
      padding: 15px 30px;
      background-color: #150958;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: bold;
      border-radius: 5px;
      margin-top: 20px;
    }
    .note {
      font-size: 14px;
      color: #888888;
      margin-top: 40px;
    }
    .contact {
      padding: 30px;
      font-size: 14px;
      color: #eeeeee;
      background-color: #150958;
      text-align: left;
    }
    .contact h4 {
      margin-bottom: 10px;
      color: #ffffff;
    }
    .contact p {
      margin: 2px 0;
    }
    .info-grid {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .info-column {
      width: 48%;
    }
    @media only screen and (max-width: 600px) {
      .info-column {
        width: 100%;
        margin-bottom: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset</h1>
    </div>

    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset your password for the Buixie website.</p>
      <p>To reset your password, please click the button below:</p>

      <a href="{{link}}" class="btn" target="_blank">Reset Password</a>

      <p class="note">If you didn’t request a password reset, you can safely ignore this email.</p>
    </div>

    <div class="contact">
      <div class="info-grid">
        <div class="info-column">
          <h4>Address</h4>
          <p>Nijenborgh 4</p>
          <p>9747 AG, Groningen</p>
          <p>The Netherlands</p>
        </div>
        <div class="info-column">
        <h4>Contact</h4>
        <p><a href="mailto:buixie@gmail.com" style="color: #ffffff; text-decoration: none;">buixie@gmail.com</a></p>
        <p><a href="tel:+31637272558" style="color: #ffffff; text-decoration: none;">+31 6 37 27 25 58</a></p>
        </div>
      </div>
    </div>

    <div class="footer">
      &copy; Buixie. All rights reserved.
    </div>
  </div>
</body>
</html>
`