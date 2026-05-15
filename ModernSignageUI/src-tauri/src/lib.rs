#[tauri::command]
async fn fetch_rss_feed() -> Result<String, String> {
    let url = "https://www.youtube.com/feeds/videos.xml?user=CNETTV";

    let response = reqwest::get(url)
        .await
        .map_err(|error| error.to_string())?;

    let xml = response
        .text()
        .await
        .map_err(|error| error.to_string())?;

    Ok(xml)
}

#[tauri::command]
async fn fetch_guest_wifi_info() -> Result<String, String> {
    let url = "https://eva.eduroam.ca/sms/macewan/HCgABMkR9DGEK5ubhdayemZN.json";

    let response = reqwest::get(url)
        .await
        .map_err(|error| error.to_string())?;

    let json = response
        .text()
        .await
        .map_err(|error| error.to_string())?;

    Ok(json)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            fetch_rss_feed,
            fetch_guest_wifi_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}