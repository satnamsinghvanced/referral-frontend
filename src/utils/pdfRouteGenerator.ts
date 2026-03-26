import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SchedulePlan } from "../types/partner";
import { formatDateToReadable } from "./formatDateToReadable";
import { getDirections } from "../services/mapbox";

export const generateRoutePdf = async (plan: SchedulePlan) => {
  const doc = new jsPDF();
  const accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

  const addFooter = () => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      const footerText = `Page ${i} of ${pageCount} | ${plan.planDetails.name}`;
      doc.text(footerText, 14, 285);
      doc.text(new Date().toLocaleDateString(), 180, 285);
    }
  };

  const activeCoordinateString = (plan.route.routeDetails || [])
    .map((stop: any) => `${stop.address.coordinates.long},${stop.address.coordinates.lat}`)
    .join(";");

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const prefix = import.meta.env.VITE_URL_PREFIX || "";
  const navUrl = `${origin}${prefix}/visit-map?coordinates=${encodeURIComponent(activeCoordinateString)}&optimized=true`;

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 50, 'F');

  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("Route Map Report", 14, 20);

  doc.setFontSize(12);
  doc.setTextColor(203, 213, 225);
  doc.text(plan.planDetails.name, 14, 30);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Scheduled Date: ${formatDateToReadable(plan.route.date, false)}`, 14, 40);

  const statsX = 140;
  doc.setFontSize(9);
  doc.text("Total Distance", statsX, 18);
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(plan.summary.estimatedDistance || "0 mi", statsX, 24);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("Total Est. Time", statsX + 35, 18);
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(plan.summary.estimatedTime || "0h 0m", statsX + 35, 24);

  // doc.setFontSize(11);
  // doc.setTextColor(59, 130, 246);
  // doc.text("Open Live Navigation", statsX, 34);
  // doc.link(statsX, 29, 40, 6, { url: navUrl });
  // doc.setDrawColor(59, 130, 246);
  // doc.setLineWidth(0.2);
  // doc.line(statsX, 35, statsX + 39, 35);

  // Navigation Link Section (Header ke andar)
  const navY = 40; // Text ki vertical position

  doc.setFontSize(11);
  doc.setTextColor(59, 130, 246); // Blue color for link
  doc.text("Open Live Navigation", statsX, navY);

  // Link area: text ke thoda upar se start karke height cover karein
  // doc.link(x, y, width, height, { url })
  doc.link(statsX, navY - 5, 45, 7, { url: navUrl });

  // Underline: Text ke theek niche (navY + 1.5 units)
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.3);
  doc.line(statsX, navY + 1.5, statsX + 41, navY + 1.5);


  let yOffset = 60;

  const stops = plan.route.routeDetails || [];
  let validStops = stops.filter((s: any) =>
    s.address?.coordinates?.lat &&
    s.address?.coordinates?.long &&
    Math.abs(s.address.coordinates.lat) > 0.1 &&
    Math.abs(s.address.coordinates.long) > 0.1
  );

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 4000,
        enableHighAccuracy: true,
      });
    });

    validStops.unshift({
      name: "Current Location",
      address: {
        addressLine1: "Starting Point",
        city: "",
        state: "",
        zip: "",
        coordinates: {
          lat: position.coords.latitude,
          long: position.coords.longitude
        }
      },
      arrivalTime: "Departure",
      departureTime: "Now",
      travelTime: "N/A",
      travelDistance: "0 mi"
    } as any);
  } catch (e) {
    console.warn("Could not retrieve user location for PDF map:", e);
  }

  if (accessToken) {
    if (validStops.length > 1) {
      try {
        const coordsStr = validStops
          .map(s => `${s.address.coordinates.long},${s.address.coordinates.lat}`)
          .join(";");

        let pathLine = "";
        try {
          const dirUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsStr}?geometries=polyline&overview=full&access_token=${accessToken}`;
          const res = await fetch(dirUrl);
          const dirData = await res.json();
          if (dirData?.routes?.length > 0) {
            const polyline = dirData.routes[0].geometry;
            if (polyline) {
              pathLine = `path-6+0d53ff-0.8(${encodeURIComponent(polyline)})`;
            }
          }
        } catch (dirError) {
          console.warn("Could not fetch road-following directions, removing path line.");
        }

        const markers = validStops
          .map((stop, index, arr) => {
            const { lat, long } = stop.address.coordinates;
            let color = "0d53ff";
            if (index === 0) color = "16a34a";
            else if (index === arr.length - 1) color = "dc2626";

            return `pin-l-${index + 1}+${color}(${long},${lat})`;
          })
          .join(",");

        const overlay = pathLine ? `${pathLine},${markers}` : `${markers}`;
        const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${overlay}/auto/600x400?padding=50&access_token=${accessToken}`;

        const dataUri = await new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject("Canvas error");
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
          };
          img.onerror = (e) => {
            console.error("Map load error:", e);
            reject("Image load failed");
          };
          img.src = staticMapUrl;
        });

        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.5);
        doc.rect(13.5, yOffset - 0.5, 183, 101);
        doc.addImage(dataUri, "PNG", 14, yOffset, 182, 100);

        doc.link(14, yOffset, 182, 100, { url: navUrl });

        yOffset += 120;
      } catch (error) {

        console.error("Map Generation Error:", error);
        doc.setFontSize(10);
        doc.setTextColor(220, 38, 38);
        doc.text("Note: High-detail map could not be loaded. Please check Mapbox token and internet.", 14, yOffset);
        yOffset += 15;
      }
    }
  }

  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("Route Schedule & Stops", 14, yOffset - 5);

  const tableData = plan.route.routeDetails.map((stop: any, index, arr) => {
    const nextStop = arr[index + 1];
    return [
      index + 1,
      `${stop.name}\n${stop.address.addressLine1}, ${stop.address.city}, ${stop.address.state} ${stop.address.zip}`,
      stop.arrivalTime || "N/A",
      nextStop ? nextStop.travelTime : "End",
      nextStop ? nextStop.travelDistance : "0 mi",
    ];
  });

  autoTable(doc, {
    startY: yOffset,
    head: [["#", "Name & Address", "Arrival", "Travel to Next", "Distance"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: 255,
      fontSize: 10,
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 95 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 25, halign: 'center' },
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: 40
    },
    margin: { bottom: 25 },
  });
  addFooter();
  const filename = `RouteMap_${plan.planDetails.name.replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
};



