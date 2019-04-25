const nodemailer = require("nodemailer");

function password_mail(host,username, email, key){
    
  var link = `http://${host}/password/${key}`;
  var subject = "Hypertube: forgotten password";
  var body = '<table bgcolor="#ffffff" class="content" align="center" cellpadding="0" cellspacing="0" border="0" style="width:100%"><tbody>' +
                  '<tr><td align="center" valign="top">' +
                      '<table border="0" cellpadding="0" cellspacing="0" width="100%" id="templateContainerMiddle" style="margin-bottom:30px"> <tbody>'+
                          '<tr><td valign="top" class="bodyContent" mc:edit="body_content" style="color:#3f3c3b; text-align:center">'+
                              '<h3 style="color:#3f3c3b ;margin-bottom: 0px; margin-top: 20px; text-transform: capitalize;">Hi '+username+',</h3>'+
                              '<p style="color:#3f3c3b;margin-top: 10px;margin-bottom: 30px;"><span style="color:#3f3c3b"></span>Oops it seems that you lost your password.<br><span style="color:#3f3c3b"> Don&apos;t worry you can reset it by clicking on the link below.</span></p>'+
                              '<a href="'+link+'" style="background-color:#E59500;padding: 10px 20px;color: white;border-radius: 0.25rem;letter-spacing: 1px;text-decoration: none;text-transform: uppercase;margin-top: 0p;">Restore password</a>' +
                          '</td></tr>'+
                      '</tbody> </table>' + 
                  '</td></tr>'+
              '</tbody></table>';
  send_mail(email, subject,body);
}

function send_mail(email, subject, body){

  let transporter = nodemailer.createTransport();
  var mailOptions = {
  from: 'hypertube@no-reply.com',
  to: email,
  subject: subject,
  html:   '<table style="width:100%; border-collapse: collapse; border-spacing: 0;" align="center" ><tbody>'+
              '<tr><td>' +
                  '<table width="600" align="center" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;font-family:Helvetica,Arial,sans-serif;letter-spacing:0;table-layout:fixed"><tbody>' +
                      '<tr><td align="center" valign="top">' +
                          '<table border="0" cellpadding="0" cellspacing="0" width="100%" id="templateContainerImageFull" style="/* min-height:15px; */"><tbody>' +
                              '<tr><td valign="top" class="bodyContentImageFull" mc:edit="body_content_01">'+
                                  '<p style="text-align:center;margin:0;padding:0;float:right;width:100%;"><img src="https://lh3.googleusercontent.com/jYuJgZ09dRG7yCQ0TcoHGK6nOICG39LLHP8aRj0BqkjX8O7IRF4GSKRaEfRq0vhl71hcbrsSJX6cxNK8s9wF64Njnr4D2CAxNHjRPB_97YHbYxxCD0PXh6kioN5dHBvehOxfJMr3IX4sDCnMUufgettV6_p1ABqOUDr-45zb5Gp3QzhVdX40eZMPnZzlh8s8KOaTEkJyZ1O-luuJRYxl6NeNCdnMOsTQv6gkKhxHuInYg8XrI8joOQ4IdfWjn5qYCq1S161jbHcpgYHcSL90vluJOUNZo6fv7kgXLwpZ6UjDbnWrstR2WDpEvyP-HlXdBILDNz9mhcQOs6pRLNVVDSpWeuE940saLeheJmto7jFKHj1I259KPkfkGBpA0MejRffziczlSDl7MsFXTstam8FQ8YEjs-B-PMg9DMUjzTB8jdNNKdpBBV1q62GEGF1ErRJQ-L_KvcpQFku9C8jQ7Jx3wEa_5BjyidvPR5f2H3FMjDHFsnYep9wJgNL5CMuSPVE-Tv2tcdFBpQDNF9TAU3I8HLn3TZsqZu_5lfiutVxKJOEL_Zl4U07xAPs0RJ6fr70Zj3rlKxzz9_k-ZtP3vE9PNPjqeIjCV48Sd7yNoryvHUNvCY-3bh9AGYkJ8yMXWoFAhukf4YzpMksGPAhSXrAlKvhxgM9uBprs0PRjN25QI8CdJ_2bMOxy8O8IaV1RyoDMPf8UPqJkL9i868dFExVc=w1839-h1185-no" style="display:block;margin:0;padding:0;border:0;height: 200px;object-fit: cover; width: 100%;filter: grayscale(40%);"></p>' +
                              '</td></tr>'+
                          '</tbody></table>' +
                      '</td></tr>'+

                      '<tr><td>' + 
                      body +
                      '</td></tr>' + 
                  
                      '<tr><td align="center" valign="top">'+
                          '<table bgcolor="#FFFFFF" border="0" cellspacing="0" cellpadding="0" width="100%"><tbody>' +
                              '<tr><td width="100%" bgcolor="#ffffff" style="text-align:left; padding-left:0px;border-top: 1px dashed grey;padding-top: 10px;">' +
                                  '<p style="color:grey; font-family:Arial, Helvetica, sans-serif; font-size:11px; line-height:14px; margin-top:0; margin-bottom:15px; padding:0; font-weight:normal; text-align:center">This email was sent from a notification-only address that cannot accept incoming email. Please do not reply to this message. Copyright 2019 Hypertube. All Rights Reserved. </p>' +
                              '</td></tr>' + 
                          '</tbody></table>'+
                      '</td></tr>' +
                  '</tbody></table>' +
              '</td></tr></tbody></table>' 
  };

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      } else {
          console.log('Email sent');
      }
  });
}

module.exports = {
    password_mail,  
}