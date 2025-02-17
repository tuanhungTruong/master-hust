import { all, getData } from "./BaseService";

export async function getAllTopics() {
  const query = all("topics", "name");
  const data = getData(query);
  return data;
}
