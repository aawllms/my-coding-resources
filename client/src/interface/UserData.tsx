export interface UserData {
  username: string;
  _id: string;
  email: string;
  savedResources: ResourceData[];
}

export interface ResourceData {
  resourceId: string;
  title: string;
  description: string;
  url: string;
}
