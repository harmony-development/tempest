export const selectFile = (elem: HTMLInputElement) => {
  return new Promise<File[] | null>((resolve, reject) => {
    const onSelect = (_: Event) => {
      resolve(elem.files && Array.from(elem.files));
      elem.value = "";
    };
    elem.addEventListener("change", onSelect, {
      once: true,
    });
    elem.click();
  });
};
