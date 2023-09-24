import Notification from '../models/notification.js';
import { sendNotification } from '../utils/pushNotifcations.js';

export async function createNotification(
  userID,
  title,
  body,
  type,
  pushID,
  photo,
  screenName,
  params
) {
  if (pushID) {
    sendNotification(pushID, title, body, type, screenName, params);
  }
  const notification = new Notification({
    user: userID,
    title,
    body,
    type,
    photo,
  });
  return notification.save();
}
