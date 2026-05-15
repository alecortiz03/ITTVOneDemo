import { getScreens } from "@/Services/API/API";

export async function loadScreenData() {
  try {
    return await getScreens();
  } catch (error) {
    console.error("Error fetching screens:", error);
    return [];
  }
}