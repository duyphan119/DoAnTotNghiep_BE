import QueryParams from "../QueryParams";

type SettingWebsiteParams = Partial<{
  key: string;
}> &
  QueryParams;

export default SettingWebsiteParams;
