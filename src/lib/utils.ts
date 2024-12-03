import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { textPayload } from "@/lib/datafunc";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sendWhatsappMessage = async (
  message: string,
  filesData: any,
  recipient: string,
  type: string,
  PHONE_NUMBER_ID: string,
  ACCESS_TOKEN: string
) => {
  if (type == "text") {
    let data = textPayload(recipient, message);
    console.log(data);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
    }
  } else {
    const promises = filesData.map((fileData: any) => {
      console.log(fileData);
      let data = JSON.stringify({
        messaging_product: "whatsapp",
        to: recipient,
        type: type,
        [type]: {
          id: fileData.id,
          caption: fileData.caption,
        },
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        data: data,
      };

      return axios.request(config);
    });

    try {
      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        console.log(JSON.stringify(response.data));
      });
    } catch (error) {
      console.log(error);
    }
  }
};