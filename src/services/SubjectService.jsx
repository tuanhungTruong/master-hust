import { firestore } from "../config/firebase";
import { all, create, getData } from "./BaseService";

export async function getSubjectsByTopicId(topicId) {
    // Get the topic reference
  const topicRef = firestore.doc(`topics/${topicId}`);

  // Create a query to filter posts by topic reference
  const query = await all("subjects","name").where("topicRef", "==", topicRef);

  const data = getData(query);
  return data;
}

export async function createSubject({ topicId, name }) {
  const topicRef = firestore.doc(`topics/${topicId}`)

  const subjectData = {
    name: name, 
    topicRef: topicRef
  }

  create("subjects", subjectData)
}

