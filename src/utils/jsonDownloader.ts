export const downloadJson = (data: object, filename: string): void => {
  if (!data || Object.keys(data).length === 0) {
    console.error("Cannot download empty or null data.");
    return;
  }

  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    const safeFilename = filename.trim().replace(/\s+/g, "_");
    a.download = `${safeFilename}.json`;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating or downloading JSON file:", error);
  }
};
