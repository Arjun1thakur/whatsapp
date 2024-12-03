export const videoPayload = (recipient: string, fileID: string, caption: string) => {
    return JSON.stringify({
      messaging_product: "whatsapp",
      to: recipient,
      type: "video",
      video: {
        id: fileID,
        caption: caption,
      },
    });
  };

export const imagePayload = (recipient: string, fileID: string, caption: string = "") => {
  return JSON.stringify({
    messaging_product: "whatsapp",
    to: recipient,
    type: "image",
    image: {
      id: fileID,
      caption: caption,
    },
  });
};

export const docPayload = (recipient: string, fileID: string) => {
  return JSON.stringify({
    messaging_product: "whatsapp",
    to: recipient,
    type: "document",
    document: {
      id: fileID,
    },
  });
};
export const textPayload = (recipient: string, text: string) => {
  return JSON.stringify({
    messaging_product: "whatsapp",
    to: recipient,
    type: "text",
    text: {
      preview_url: true,
      body: text,
    },
  });
};
