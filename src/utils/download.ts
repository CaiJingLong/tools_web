export function clickButtonToDownloadBlobText(text: string, filename: string) {
  // Create a link element, hide it, direct it towards the blob, and then 'click' it programatically
  const element = document.createElement('a');
  element.style.display = 'none';
  element.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
