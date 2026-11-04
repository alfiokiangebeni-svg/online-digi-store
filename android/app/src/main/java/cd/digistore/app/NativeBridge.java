package cd.digistore.app;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.speech.RecognizerIntent;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import com.google.mlkit.vision.barcode.common.Barcode;
import com.google.mlkit.vision.codescanner.GmsBarcodeScanner;
import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions;
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning;

import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Pont « window.DisiNative » entre la boutique (WebView) et le téléphone :
 * recherche vocale (reconnaissance vocale d'Android), scan de QR codes / codes-barres
 * (lecteur de codes Google : aucune permission caméra, l'interface est fournie par
 * les services Google Play) et vibration légère des actions d'achat.
 * Les résultats reviennent dans la page par window.__disiVoice / __disiScan / __disiNativeError.
 */
final class NativeBridge {

    static final int VOICE_REQUEST = 41;

    private final Activity activity;
    private final WebView web;

    NativeBridge(Activity activity, WebView web) {
        this.activity = activity;
        this.web = web;
    }

    @JavascriptInterface
    public void voice(String lang) {
        activity.runOnUiThread(() -> {
            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, lang);
            intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
            try {
                activity.startActivityForResult(intent, VOICE_REQUEST);
            } catch (ActivityNotFoundException e) {
                error("voice", "unsupported");
            }
        });
    }

    /** Résultat de la reconnaissance vocale (appelé par MainActivity.onActivityResult). */
    void onVoiceResult(int resultCode, Intent data) {
        if (resultCode != Activity.RESULT_OK || data == null) {
            error("voice", "cancelled");
            return;
        }
        ArrayList<String> results = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
        if (results == null || results.isEmpty()) {
            error("voice", "no-speech");
            return;
        }
        call("__disiVoice", results.get(0));
    }

    @JavascriptInterface
    public void scan() {
        activity.runOnUiThread(() -> {
            GmsBarcodeScannerOptions options = new GmsBarcodeScannerOptions.Builder()
                    .setBarcodeFormats(Barcode.FORMAT_QR_CODE, Barcode.FORMAT_EAN_13, Barcode.FORMAT_CODE_128)
                    .enableAutoZoom()
                    .build();
            GmsBarcodeScanner scanner = GmsBarcodeScanning.getClient(activity, options);
            scanner.startScan()
                    .addOnSuccessListener(code -> {
                        String value = code.getRawValue();
                        if (value == null || value.isEmpty()) error("scan", "empty");
                        else call("__disiScan", value);
                    })
                    .addOnCanceledListener(() -> error("scan", "cancelled"))
                    .addOnFailureListener(e -> error("scan", "failed"));
        });
    }

    @JavascriptInterface
    public void vibrate(int ms) {
        Vibrator vibrator = (Vibrator) activity.getSystemService(Context.VIBRATOR_SERVICE);
        if (vibrator == null || !vibrator.hasVibrator()) return;
        int duration = Math.max(5, Math.min(ms, 200));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(duration, VibrationEffect.DEFAULT_AMPLITUDE));
        } else {
            vibrator.vibrate(duration);
        }
    }

    private void error(String kind, String reason) {
        evaluate("window.__disiNativeError && window.__disiNativeError(" + JSONObject.quote(kind) + ","
                + JSONObject.quote(reason) + ")");
    }

    private void call(String fn, String text) {
        evaluate("window." + fn + " && window." + fn + "(" + JSONObject.quote(text) + ")");
    }

    private void evaluate(String js) {
        activity.runOnUiThread(() -> web.evaluateJavascript(js, null));
    }
}
