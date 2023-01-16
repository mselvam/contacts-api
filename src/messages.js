const amqp = require("crabbitmq");
const maxRetries = 3;
const delay = 1000;

module.exports = async () => {
  try {
    await amqp.assertQueue("on-contact-create", "contact", "contacts.created");
    await amqp.consume(
      "on-contact-create",
      async ({ data: contact }) => {
        try {
          let success = [];
          success.push = contact;
          console.log("Contact accessed...");
          for (let i=1000; i<=60000; i= i + 1000) {
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
