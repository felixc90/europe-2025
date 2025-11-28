const getParentPath = (route: string) => {
  const path = route.split("/");

  if (path.length <= 1) {
    return "";
  }

  return path.slice(0, path.length - 1).join("/");
};

export default getParentPath;
