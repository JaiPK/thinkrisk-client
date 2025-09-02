const callListID = () => {
    const path = window.location.pathname;
    const pathArray = path.split("/")[2];
    return pathArray === "ap" ? 1 : 2;
  };
 
  const getPathValue = (key: any) => {
    const pathHistory = JSON.parse(localStorage.getItem("pathHistory") ?? "{}");
    return pathHistory?.["audit"]?.[key]
  }
  export const getPath = {
    callListID,getPathValue
  };