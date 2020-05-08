export function getFileFromFileInput(fileInputId: string): File | null {
  const fileInput = document.getElementById(fileInputId) as HTMLInputElement;

  if (!fileInput) {
    throw new Error("File input form not found.");
  }

  const files = fileInput.files;

  if (!files || files.length === 0) {
    return null;
  }

  return files[0];
}

export function getFileExtension(file: File): string | null {
  if (!file) {
    throw new Error("No file provided");
  }

  const splittedName = file.name.split(".").pop();
  return splittedName ? splittedName : null;
}

export function readFile(file: File): Promise<string | null> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No file provided");
    }

    const reader = new FileReader();
    reader.onloadend = function(evt) {
      if (evt?.target?.readyState == FileReader.DONE) {
        resolve(evt.target.result?.toString());
      } else {
        resolve(null);
      }
    };

    reader.readAsBinaryString(file);
  });
}
