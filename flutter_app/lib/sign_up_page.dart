import 'package:flutter/material.dart';
import 'package:flutter_app/main.dart';
import 'package:flutter_app/api_requests.dart';
import 'package:flutter_app/login_page.dart';

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});

  @override
  State<SignUpPage> createState() => SignUpPageState();
}

class SignUpPageState extends State<SignUpPage> {
  final emailControl = TextEditingController();
  final passwordControl = TextEditingController();
  bool doVerification = false;
  final emailTest = "test";
  final passwordTest = "1234";
  var errorText = "";

  @override
  void initState() {
    super.initState();
    emailControl.addListener(() {
      setState(() {});
    });
    passwordControl.addListener(() {
      setState(() {});
    });
  }

  _login() async {
    final result = await ApiRequests().signUpWithEmail(
      emailControl.text,
      passwordControl.text,
    );
    if (result == "success") {
      setState(() {
        doVerification = true;
      });
      /*
      Navigator.push(
        context,
        MaterialPageRoute<void>(builder: (BuildContext context) => HomePage()),
      );
      */
    } else {
      setState(() {
        errorText = result;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    Widget body;
    if (doVerification) {
      body = Center(
        child: SizedBox.square(
          dimension: 250,
          child: Card(
            color: colors.primary,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Padding(
                  padding: EdgeInsets.all(25),
                  child: Column(
                    children: [
                      Text(
                        "Please check the email sent to (${emailControl.text}) to verify your email!",
                        style: TextStyle(color: colors.onPrimary),
                        textAlign: TextAlign.center,
                      ),
                      Text(
                        "Then, Sign in here:",
                        style: TextStyle(color: colors.onPrimary),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
                FloatingActionButton(
                  child: Text(
                    "Sign In",

                    style: TextStyle(color: colors.onPrimaryContainer),
                  ),
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute<void>(
                      builder: (BuildContext context) => LoginPage(),
                    ),
                  ),
                  backgroundColor: colors.primaryContainer,
                ),
              ],
            ),
          ),
        ),
      );
    } else {
      body = Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
            child: TextFormField(
              decoration: const InputDecoration(
                border: UnderlineInputBorder(),
                labelText: 'Enter your email',
              ),
              controller: emailControl,
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
            child: TextFormField(
              obscureText: true,
              decoration: const InputDecoration(
                border: UnderlineInputBorder(),
                labelText: 'Enter your password',
              ),
              controller: passwordControl,
            ),
          ),
          SizedBox(
            width: 250,
            child: Padding(
              padding: EdgeInsetsGeometry.all(20),
              child: FloatingActionButton(
                onPressed: () => _login(),
                child: const Text("Sign Up", style: TextStyle(fontSize: 24)),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
            child: Text(errorText),
          ),
        ],
      );
    }
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sign Up'),
        backgroundColor: Theme.of(context).colorScheme.primaryContainer,
      ),
      body: body,
      bottomNavigationBar: NavBar(),
    );
  }

  @override
  void dispose() {
    // Clean up the controller when the widget is disposed.
    emailControl.dispose();
    passwordControl.dispose();
    super.dispose();
  }
}
