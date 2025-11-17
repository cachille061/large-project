import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:flutter_app/main.dart';

class CheckoutPage extends StatefulWidget {
  final String url;

  const CheckoutPage({super.key, required this.url});

  @override
  _CheckoutPageState createState() => _CheckoutPageState();
}

class _CheckoutPageState extends State<CheckoutPage> {
  final WebViewController _controller = WebViewController();
  bool loaded = false;

  @override
  void initState() {
    super.initState();
    loaded = false;
    loadSite();
  }

  void loadSite() async {
    await _controller.loadRequest(Uri.parse(widget.url));
    await _controller.setJavaScriptMode(JavaScriptMode.unrestricted);
    setState(() {
      loaded = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    Widget webWidget;
    final colors = Theme.of(context).colorScheme;
    if (loaded) {
      webWidget = WebViewWidget(controller: _controller);
    } else {
      webWidget = Center(child: CircularProgressIndicator());
    }
    return Scaffold(
      resizeToAvoidBottomInset: false,
      appBar: AppBar(
        title: const Text("Stripe Payment"),
        backgroundColor: colors.primaryContainer,
      ),
      body: webWidget,
      bottomNavigationBar: NavBar(),
    );
  }
}
