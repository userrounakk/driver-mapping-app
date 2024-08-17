"use server";

import { BASE_URL } from "@/const/const";

const baseUrl = BASE_URL + "/driver";

async function sendResponse(response: any) {
  if (response.ok) {
    const res = await response.json();
    console.log("[RESPONSE] -->", res);
    return {
      error: false,
      response: res,
    };
  }
  if (!response.ok) {
    const error = await response.json();
    console.log("[ERROR] -->", error);
    return {
      error: true,
      status: response.status,
      message: error,
    };
  }
}

export const getDrivers = async (
  token: string,
  page: number = 1
): Promise<any> => {
  try {
    const response = await fetch(`${baseUrl}?page=${page}`, {
      headers: {
        authorization: `${token}`,
      },
      cache: "no-store",
    });
    return await sendResponse(response);
  } catch (error: any) {
    console.log("Error =>", error);
    return {
      error: true,
      status: 500,
      message: error.message,
    };
  }
};

export const addDriver = async (token: string, data: any) => {
  try {
    const response = await fetch(`${baseUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify(data),
    });
    return await sendResponse(response);
  } catch (error: any) {
    console.log("Error =>", error);
    return {
      error: true,
      status: 500,
      message: error.message,
    };
  }
};

export const searchDriver = async (
  token: string,
  query: string
): Promise<any> => {
  try {
    const response = await fetch(`${baseUrl}/search?type=name&name=${query}`, {
      method: "GET",
      headers: {
        authorization: `${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    return await sendResponse(response);
  } catch (error: any) {
    console.log("Error =>", error);
    return {
      error: true,
      status: 500,
      message: error.message,
    };
  }
};
