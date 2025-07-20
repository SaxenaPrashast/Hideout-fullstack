function extractLinks(inputString) {
  const urlRegx = /(https?:\/\/[^\s]+)/g;
  const linkArray = [];

  const modifiedString = inputString.replace(urlRegx, (url) => {
    const urlObject = new URL(url);
    const domain = urlObject.hostname;
    linkArray.push(url);

    return `<span class="text-primary underline"><a href="${url}" target="_blank">${domain}</a></span>`;
  });

  return {
    originalString: modifiedString,
    links: linkArray,
  };
}

export default extractLinks;
