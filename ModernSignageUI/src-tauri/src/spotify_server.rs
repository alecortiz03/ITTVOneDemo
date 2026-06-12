use axum::{
    extract::{Path, Query, State},
    response::{Html, Redirect},
    routing::get,
    Router,
};
use serde::{Deserialize, Serialize};
use std::{
    net::SocketAddr,
    sync::{Arc, Mutex},
};

const SPOTIFY_CONNECT_PIN: &str = "123456";
const SPOTIFY_CLIENT_ID: &str = "a0b6eccbad264d52829f00e37f758224";
const SPOTIFY_CLIENT_SECRET: &str = "53dbf64fbcfd472ab5817fc89bf21367";

#[derive(Clone)]
struct AppState {
    access_token: Arc<Mutex<Option<String>>>,
}

#[derive(Deserialize)]
struct SpotifyCallback {
    code: String,
}

#[derive(Deserialize)]
struct SpotifyTokenResponse {
    access_token: String,
}

#[derive(Serialize)]
struct TokenStatus {
    access_token: Option<String>,
}

pub async fn start_spotify_server() {
    let state = AppState {
        access_token: Arc::new(Mutex::new(None)),
    };

    let app = Router::new()
        .route("/", get(root))
        .route("/connect", get(connect_page))
        .route("/connect/:pin", get(check_pin))
        .route("/spotify/callback", get(spotify_callback))
        .route("/spotify/token", get(get_token))
        .route("/spotify/logout", get(logout))
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));

    println!("Spotify server listening on http://{}", addr);
    println!("Spotify testing callback: {}/spotify/callback", get_base_url());

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind Spotify server");

    axum::serve(listener, app)
        .await
        .expect("Spotify server crashed");
}

async fn root() -> &'static str {
    "Spotify server is running!"
}

async fn connect_page() -> Html<String> {
    Html(
        r#"
        <html>
        <body style="font-family: Arial; text-align: center; margin-top: 100px;">
            <h1>Connect Spotify</h1>
            <p>Enter the Spotify Connect PIN</p>

            <input id="pin" type="password" placeholder="PIN" style="font-size: 24px; padding: 10px;" />
            <br><br>

            <button onclick="checkPin()" style="font-size: 24px; padding: 10px 20px;">
                Continue
            </button>

            <script>
                function checkPin() {
                    const pin = document.getElementById('pin').value;
                    window.location.href = '/connect/' + pin;
                }
            </script>
        </body>
        </html>
        "#
        .to_string(),
    )
}

async fn check_pin(Path(pin): Path<String>) -> Redirect {
    if pin != SPOTIFY_CONNECT_PIN {
        return Redirect::to("/connect");
    }

    let redirect_uri = format!("{}/spotify/callback", get_base_url());

    println!("Spotify redirect_uri: {}", redirect_uri);

    let scopes = [
        "streaming",
        "user-read-email",
        "user-read-private",
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing",
    ]
    .join(" ");

    let spotify_url = format!(
        "https://accounts.spotify.com/authorize?client_id={}&response_type=code&redirect_uri={}&scope={}",
        SPOTIFY_CLIENT_ID,
        encode_uri_component(&redirect_uri),
        encode_uri_component(&scopes)
    );

    Redirect::to(&spotify_url)
}

async fn spotify_callback(
    State(state): State<AppState>,
    Query(query): Query<SpotifyCallback>,
) -> Html<String> {
    let redirect_uri = format!("{}/spotify/callback", get_base_url());

    println!("Spotify callback redirect_uri: {}", redirect_uri);

    let body = format!(
        "grant_type=authorization_code&code={}&redirect_uri={}&client_id={}&client_secret={}",
        encode_uri_component(&query.code),
        encode_uri_component(&redirect_uri),
        encode_uri_component(SPOTIFY_CLIENT_ID),
        encode_uri_component(SPOTIFY_CLIENT_SECRET)
    );

    let client = reqwest::Client::new();

    let response = client
        .post("https://accounts.spotify.com/api/token")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body(body)
        .send()
        .await;

    let Ok(response) = response else {
        return Html("<h1>Spotify token request failed</h1>".to_string());
    };

    if !response.status().is_success() {
        let error_text = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown Spotify error".to_string());

        return Html(format!(
            "<h1>Spotify token request failed</h1><pre>{}</pre>",
            error_text
        ));
    }

    let token_result = response.json::<SpotifyTokenResponse>().await;

    let Ok(token) = token_result else {
        return Html("<h1>Could not read Spotify token</h1>".to_string());
    };

    *state.access_token.lock().unwrap() = Some(token.access_token);

    Html(
        r#"
        <h1>Spotify Connected!</h1>
        <p>You can go back to the TV now.</p>
        "#
        .to_string(),
    )
}

async fn get_token(State(state): State<AppState>) -> axum::Json<TokenStatus> {
    axum::Json(TokenStatus {
        access_token: state.access_token.lock().unwrap().clone(),
    })
}

async fn logout(State(state): State<AppState>) -> Html<String> {
    *state.access_token.lock().unwrap() = None;

    Html(
        r#"
        <h1>Spotify Logged Out</h1>
        <p>You can now connect a different Spotify account.</p>
        "#
        .to_string(),
    )
}

fn get_base_url() -> String {
    "http://127.0.0.1:3000".to_string()
}

fn encode_uri_component(input: &str) -> String {
    input
        .replace("%", "%25")
        .replace(" ", "%20")
        .replace(":", "%3A")
        .replace("/", "%2F")
        .replace("?", "%3F")
        .replace("#", "%23")
        .replace("[", "%5B")
        .replace("]", "%5D")
        .replace("@", "%40")
        .replace("!", "%21")
        .replace("$", "%24")
        .replace("&", "%26")
        .replace("'", "%27")
        .replace("(", "%28")
        .replace(")", "%29")
        .replace("*", "%2A")
        .replace("+", "%2B")
        .replace(",", "%2C")
        .replace(";", "%3B")
        .replace("=", "%3D")
}