export const getSavedResourceIds = () => {
  const savedResourceIds = localStorage.getItem("saved_resources")
    ? JSON.parse(localStorage.getItem("saved_resources")!)
    : [];

  return savedResourceIds;
};

export const saveResourceIds = (resourceIdArr: string[]) => {
  if (resourceIdArr.length) {
    localStorage.setItem("saved_resources", JSON.stringify(resourceIdArr));
  } else {
    localStorage.removeItem("saved_resources");
  }
};

export const removeResourceId = (resourceId: string) => {
  const savedResourceIds = localStorage.getItem("saved_resources")
    ? JSON.parse(localStorage.getItem("saved_resources")!)
    : [];

  const updatedSavedResourceIds = savedResourceIds?.filter(
    (savedResourceId: string) => savedResourceId !== resourceId
  );

  localStorage.setItem(
    "saved_resources",
    JSON.stringify(updatedSavedResourceIds)
  );

  return true;
};
