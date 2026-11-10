package cd.digistore.app;

import android.content.res.AssetManager;
import android.webkit.WebResourceResponse;

import androidx.webkit.WebViewAssetLoader;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Sert le site exporté depuis assets/www, comme un hébergement statique :
 * « /fr/explorer/ » → www/fr/explorer/index.html, fichiers servis avec le bon type MIME,
 * page 404 si le fichier n'existe pas.
 */
final class SiteHandler implements WebViewAssetLoader.PathHandler {

    private static final Map<String, String> MIME = new HashMap<>();

    static {
        MIME.put("html", "text/html");
        MIME.put("js", "application/javascript");
        MIME.put("css", "text/css");
        MIME.put("txt", "text/x-component"); // charges utiles React Server Components
        MIME.put("json", "application/json");
        MIME.put("webmanifest", "application/manifest+json");
        MIME.put("svg", "image/svg+xml");
        MIME.put("png", "image/png");
        MIME.put("jpg", "image/jpeg");
        MIME.put("ico", "image/x-icon");
        MIME.put("woff2", "font/woff2");
    }

    private final AssetManager assets;

    SiteHandler(AssetManager assets) {
        this.assets = assets;
    }

    @Override
    public WebResourceResponse handle(String path) {
        String file = resolve(path);
        try {
            InputStream in = assets.open("www/" + file);
            return new WebResourceResponse(mimeOf(file), "utf-8", in);
        } catch (IOException missing) {
            try {
                InputStream notFound = assets.open("www/404.html");
                WebResourceResponse res = new WebResourceResponse("text/html", "utf-8", notFound);
                res.setStatusCodeAndReasonPhrase(404, "Not Found");
                return res;
            } catch (IOException e) {
                return null;
            }
        }
    }

    static String resolve(String path) {
        String p = path == null ? "" : path;
        while (p.startsWith("/")) p = p.substring(1);
        if (p.isEmpty()) return "fr/index.html";
        if (p.endsWith("/")) return p + "index.html";
        String last = p.substring(p.lastIndexOf('/') + 1);
        if (!last.contains(".")) return p + "/index.html";
        return p;
    }

    private static String mimeOf(String file) {
        String ext = file.substring(file.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT);
        String mime = MIME.get(ext);
        return mime != null ? mime : "application/octet-stream";
    }
}
