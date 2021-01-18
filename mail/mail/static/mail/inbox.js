document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);



  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Send email on form submit
  document.querySelector('#compose-form').addEventListener('submit', () => send_email());

}


send_email = () => {
  event.preventDefault()
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
    })
  })
    .then(response => response.json())
    .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent')
      //alert("first print")
    });

}

function load_mailbox(mailbox) {
  //event.preventDefault()
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';


  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      //console.log(emails)
      emails.forEach(email => {
        //console.log(email)
        let new_email = document.createElement('div');
        new_email.id = `${email.id}`;
        let sender = document.createElement('div');
        sender.innerHTML = `<strong>FROM  :</strong> ${email.sender}`;
        let subject = document.createElement('div');
        subject.innerHTML = `<strong>subject :</strong>  ${email.subject}`;
        let date = document.createElement('div');
        date.innerHTML = `<strong>Time :</strong>${email.timestamp}`;
        let recipients = document.createElement('div');
        recipients.innerHTML = `TO : ${email.recipients}`;


        //add sender,subject,recipients,date in new_email
        if (mailbox === 'inbox') {
          new_email.append(sender);
        } else {
          new_email.append(recipients);
        }

        new_email.append(subject);
        new_email.append(date);
        new_email.append(document.createElement('hr'));

        document.querySelector('#emails-view').append(new_email);

        new_email.addEventListener('click', () => loadEmail(email.id));

      })

    })


}

function loadEmail(email_id) {


  // Show the email and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  document.querySelector('#email-view').innerHTML = '';

  fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      // Print email
      console.log(email);

      // ... do something else with email ...
      let sender = document.createElement('div');
      sender.innerHTML = `sender : ${email.sender}`;

      let subject = document.createElement('div');
      subject.innerHTML = `subject : ${email.subject}`;

      let date = document.createElement('div');
      date.innerHTML = `${email.timestamp}`;

      let body = document.createElement('div');
      body.innerHTML = `body : ${email.body}`;

      let recipients = document.createElement('div');
      recipients.innerHTML = `recipients : ${email.recipients}`;

      let archived = document.createElement('button');
      archived.innerHTML = `archive `;
      archived.className = 'btn btn-sm btn-outline-primary ml-1';
      archived.addEventListener('click', () => archive(email.id))

      let unarchived = document.createElement('button');
      unarchived.innerHTML = `unarchive `;
      unarchived.className = 'btn btn-sm btn-outline-primary ml-1';
      unarchived.addEventListener('click', () => unarchive(email.id))

      let reply = document.createElement('button');
      reply.className = 'btn btn-sm btn-outline-primary';
      reply.innerHTML = 'Reply';
      reply.addEventListener('click', () => reply_email(email.sender, email.subject))

      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          read: true
        })
      });

      document.querySelector('#email-view').append(sender);
      document.querySelector('#email-view').append(recipients);
      document.querySelector('#email-view').append(subject);
      document.querySelector('#email-view').append(body);
      document.querySelector('#email-view').append(date);
      document.querySelector('#email-view').append(reply);

      if (email.archived === false) {
        document.querySelector('#email-view').append(archived);
      } else {
        document.querySelector('#email-view').append(unarchived);
      }

    });
}

function archive(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  });
  load_mailbox('inbox')
}

function unarchive(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: false
    })
  });
  load_mailbox('inbox')
}


function reply_email(recipient, subject) {
  
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = `${recipient}`;
  if (subject.substring(0,2) != 'RE') {
    document.querySelector('#compose-subject').value = `RE: ${subject}`;
  } else {
    document.querySelector('#compose-subject').value = `${subject}`;
  }
  document.querySelector('#compose-body').value = ``;

  document.querySelector('#compose-form').addEventListener('submit', () => send_email());
}






