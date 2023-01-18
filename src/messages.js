const amqp = require("crabbitmq");
const maxRetries = 3;
const delay = 1000;

module.exports = async () => {
  try {
    await amqp.assertQueue('on-contact-alert', 'contact', 'contact.alert');
    await amqp.consume('on-contact-alert', async ({ data: contact }) => {
      try {
        console.log('contacts alert created...', contact)
        return contact;
      } catch (e) {
        return e;
      }
    }, { maxRetries, delay });
    await amqp.assertQueue("on-contact-create", "contact", "contacts.created");
    await amqp.consume(
      "on-contact-create",
      async ({ data: contact }) => {
        try {
          let success = [];
          success.push = contact;
          console.log("Contact accessed...", contact);
          for (let i=(60*1000); i<=(60*60*1000); i= i + (60*1000)) {
            await amqp.delayedPublish(
                "contact",
                "contact.alert",
                { data: contact },
                { delay: i }
              );
          }
          return success;
        } catch (e) {
          return e;
        }
      },
      { maxRetries, delay }
    );
  } catch (e) {
    return e;
  }
};
