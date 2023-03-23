import SearchParams from "../SearchParams";

type NotificationTypeParams = Partial<{
  name: string;
}> &
  SearchParams;

export default NotificationTypeParams;
