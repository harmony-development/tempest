export const selectFile = (elem: HTMLInputElement) => {
  return new Promise<FileList | null>((resolve, reject) => {
    const onSelect = (_: Event) => {
      resolve(elem.files);
      elem.removeEventListener("change", onSelect);
    };
    elem.addEventListener("change", onSelect);
    elem.click();
  });
};
