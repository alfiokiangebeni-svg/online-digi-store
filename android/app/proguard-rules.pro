# Pont « window.DisiNative » : méthodes appelées depuis la page, à ne pas renommer ni retirer.
-keepclassmembers class cd.digistore.app.NativeBridge {
    @android.webkit.JavascriptInterface <methods>;
}
-keepattributes JavascriptInterface
