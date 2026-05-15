export const generateGoogleMapsRouteUrl = (routeData: any) => {
  if (routeData.length < 2) {
    return "Route requires at least two stops.";
  }
  const getFullAddress = (addressObj: any) => {
    const parts = [
      addressObj.addressLine1,
      addressObj.city,
      addressObj.state,
      addressObj.zip,
    ].filter((part) => part);
    return parts.join(", ");
  };
  const originAddress = getFullAddress(routeData[0].address);
  const destinationAddress = getFullAddress(
    routeData[routeData.length - 1].address
  );
  const waypoints = routeData
    .slice(1, -1)
    .map((stop: any) => getFullAddress(stop.address));
  const encodedOrigin = encodeURIComponent(originAddress);
  const encodedDestination = encodeURIComponent(destinationAddress);
  let url = `https://www.google.com/maps/dir/${encodedOrigin}/${encodedDestination}`;
  if (waypoints.length > 0) {
    const allStops = routeData.map((stop: any) => getFullAddress(stop.address));
    const encodedAllStops = allStops
      .map((addr: any) => encodeURIComponent(addr))
      .join("/");
    url = `https://www.google.com/maps/dir/${encodedAllStops}`;
  }
  return url;
};
