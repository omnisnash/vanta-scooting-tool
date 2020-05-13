export function getFileExtension(file: File): string | null {
  if (!file) {
    throw new Error("No file provided");
  }

  const splittedName = file.name.split(".").pop();
  return splittedName ? splittedName : null;
}

export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No file provided");
    }

    const reader = new FileReader();
    reader.onloadend = function (evt) {
      if (evt?.target?.readyState === FileReader.DONE) {
        resolve(evt.target.result?.toString());
      } else {
        resolve("");
      }
    };

    reader.readAsBinaryString(file);
  });
}
