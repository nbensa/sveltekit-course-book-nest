export async function convertFileToBase64(file: File): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64string = reader.result?.toString().split(",")[1];
      if (base64string) {
        resolve(base64string);
      } else {
        reject("Failed to convert file to base64");
      }
    };

    reader.onerror = () => {
      reject("Error reading file");
    };

    reader.readAsDataURL(file);
  });
}
