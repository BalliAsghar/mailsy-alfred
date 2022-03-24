import alfy from "alfy";
import axios from "axios";

const createAccount = async () => {
  // grab the token from config
  const token = alfy.config.get("token");

  // if token exists, then show messages
  if (token) {
    alfy.output([
      {
        title: "Account Exists",
        subtitle: "You already have an account",
        arg: "You already have an account",
        icon: {
          path: "./icons/paper-plane-red.png",
        },
      },
    ]);
    return;
  }

  // get the available email domains
  const { data } = await axios.get("https://api.mail.tm/domains?page=1");

  // get the first domain
  const domain = data["hydra:member"][0].domain;

  // generate a random email address
  const email = `${Math.random().toString(36).substring(7)}@${domain}`;

  // generate a random password
  const password = Math.random().toString(36).substring(7);

  // create the account

  try {
    const { data } = await axios.post("https://api.mail.tm/accounts", {
      address: email,
      password,
    });

    // get Jwt token
    const { data: token } = await axios.post("https://api.mail.tm/token", {
      address: email,
      password,
    });

    // save the token and account id to config
    alfy.config.set("token", token.token);
    alfy.config.set("accountId", data.id);

    // show messages
    alfy.output([
      {
        title: "Account Created",
        subtitle: email,
        arg: email,
      },
    ]);
  } catch (error) {
    alfy.output([
      {
        title: "Error",
        subtitle: error.response.data.message,
        icon: {
          path: "./icons/paper-plane-red.png",
        },
      },
    ]);
  }
};

const deleteAccount = async () => {
  const token = alfy.config.get("token");

  if (!token) {
    alfy.output([
      {
        title: "You don't have an account",
        subtitle: "create one first",
        icon: {
          path: "./icons/paper-plane-red.png",
        },
      },
    ]);
    return;
  }

  try {
    const id = alfy.config.get("accountId");
    await axios.delete(`https://api.mail.tm/accounts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // remove the token from config
    alfy.config.set("token", null);

    // show messages
    alfy.output([
      {
        title: "Account Deleted",
        subtitle: "Your account has been deleted",
        arg: "Your account has been deleted",
      },
    ]);
  } catch (error) {
    alfy.output([
      {
        title: "Error",
        subtitle: error.response.data.message,
        icon: {
          path: "./icons/paper-plane-red.png",
        },
      },
    ]);
  }
};

const showMessages = async () => {
  const token = alfy.config.get("token");

  if (!token) {
    alfy.output([
      {
        title: "You don't have an account",
        subtitle: "create one first",
        arg: "You don't have an account",
        icon: {
          path: "./icons/paper-plane-red.png",
        },
      },
    ]);
    return;
  }

  try {
    const { data } = await axios.get("https://api.mail.tm/messages", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // get the emails
    const emails = data["hydra:member"];

    if (emails.length === 0) {
      alfy.output([
        {
          title: "No Emails",
          subtitle: "You have no Emails",
          icon: {
            path: "./icons/paper-plane-red.png",
          },
        },
      ]);
      return;
    }

    const items = emails.map((email) => {
      return {
        title:
          email.from.address +
          " - " +
          new Date(email.createdAt).toLocaleString(),
        subtitle: email.subject,
        arg: email.id,
        icon: {
          path: "./icons/email.png",
        },
      };
    });

    alfy.output(items);
  } catch (error) {
    alfy.output([
      {
        title: "Error!!",
        subtitle: error.message,
      },
    ]);
  }
};

const showMe = async () => {
  const token = alfy.config.get("token");
  const accountId = alfy.config.get("accountId");

  if (!token) {
    alfy.output([
      {
        title: "You don't have an account",
        subtitle: "create one first",
        icon: {
          path: "./icons/paper-plane-red.png",
        },
      },
    ]);
    return;
  }

  try {
    // get the account details
    const { data } = await axios.get(
      `https://api.mail.tm/accounts/${accountId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // show the account details
    alfy.output([
      {
        title: data.address,
        subtitle: "Created at: " + new Date(data.createdAt).toLocaleString(),
        arg: data.address,
        icon: {
          path: "./icons/profile.png",
        },
      },
    ]);
  } catch (error) {
    alfy.output([
      {
        title: "Error!!",
        subtitle: error.message,
        icon: {
          path: "./icons/paper-plane-red.png",
        },
      },
    ]);
  }
};

const utils = {
  createAccount,
  deleteAccount,
  showMessages,
  showMe,
};

export default utils;
