import SearchParams from "../SearchParams";

type NotificationParams = Partial<{
  content: string;
  type: string;
  notificationTypeId: string;
  unread: string;
}> &
  SearchParams;

export default NotificationParams;
