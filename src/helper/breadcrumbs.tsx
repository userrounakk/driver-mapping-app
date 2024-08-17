const getBreadCrumbs = (path: string) => {
  switch (path) {
    case "/":
      return "Dashboard";
    case "/plants":
      return "Plants";
    case "/locations":
      return "Locations";
    case "/sellers":
      return "Sellers";
    case "/stores":
      return "Stores";
    default:
      return "Dashboard";
  }
};

export default getBreadCrumbs;
