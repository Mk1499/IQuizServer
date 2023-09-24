import axios from 'axios';

const pushKey = process.env.FCMKey;

export async function sendNotification(
  pushID,
  title,
  body,
  type,
  screenName,
  params
) {
  const headers = {
    Authorization: `key=${pushKey}`,
  };
  const url = 'https://fcm.googleapis.com/fcm/send';
  const reqBody = {
    to: pushID,
    notification: {
      title,
      body,
    },
    data: {
      type,
      navigation: screenName ? true : false,
      screenName,
      params,
    },
  };

  return axios.post(url, reqBody, {
    headers,
  });
}
