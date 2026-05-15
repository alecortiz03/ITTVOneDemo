import { invoke } from '@tauri-apps/api/core';
export async function fetchGuestWiFiInfo() {
	const response = await invoke('fetch_guest_wifi_info');
	const data = JSON.parse(response);
	return data;
}
