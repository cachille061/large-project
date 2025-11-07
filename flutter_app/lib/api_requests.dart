import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_app/main.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

bool apiRequestsHasToken = false;

Future<List<dynamic>> getAllProducts() async {
	final apiUrl = BACKEND_URL;
  final url = Uri.parse('${apiUrl ?? ''}/api/products');
  final response = await http.get(url);

  if (response.statusCode == 200) {
    final data = jsonDecode(response.body);
    print('Success: $data');
  } else {
    print('Error: ${response.statusCode}');
  }
  return [];
}

Future<List<dynamic>> searchProducts() async {
	final apiUrl = BACKEND_URL;
  final url = Uri.parse('${apiUrl ?? ''}/api//products');
  final response = await http.get(url);

  if (response.statusCode == 200) {
    final data = jsonDecode(response.body);
    print('Success: $data');
  } else {
    print('Error: ${response.statusCode}');
  }
  return [];
}

Future<String> signUpWithEmail(String email, String password) async {
	final apiUrl = BACKEND_URL;
  final url = Uri.parse('${apiUrl ?? ''}/api/auth/sign-up/email');
  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({'email': email, 'password': password}),
  );
  if (response.statusCode == 200) {
  // Single instance of secure storage
    final storage = FlutterSecureStorage();
    final token = jsonDecode(response.body)['token'];
    await storage.write(key: "session_token", value: token);
    apiRequestsHasToken = true;
    return "success";
  }
  else if (jsonDecode(response.body)['message'] != null) {
    return jsonDecode(response.body)['message'];
  }
  else if (response.statusCode == 404) {
    return "API not found!";
  }
  else {
    return "Error!";
  }
}

Future<String> signInWithEmail(String email, String password) async {
	final apiUrl = BACKEND_URL;
  final url = Uri.parse('${apiUrl ?? ''}/api/auth/sign-in/email');
  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({'email': email, 'password': password}),
  );
  if (response.statusCode == 200) {
  // Single instance of secure storage
    final storage = FlutterSecureStorage();
    final token = jsonDecode(response.body)['token'];
    await storage.write(key: "session_token", value: token);
    apiRequestsHasToken = true;
    return "success";
  }
  else if (jsonDecode(response.body)['message'] != null) {
    return jsonDecode(response.body)['message'];
  }
  else if (response.statusCode == 404) {
    return "API not found!";
  }
  else {
    return "Error!";
  }
}

Future<void> signOut() async {
  final storage = FlutterSecureStorage();
  await storage.delete(key: "session_token"); // Handle response as needed
  apiRequestsHasToken = false;
}

// Might not be necessary...
Future<void> getSession() async {
	final apiUrl = BACKEND_URL;
  final url = Uri.parse('${apiUrl ?? ''}/api/auth/session');
  final response = await http.get(url);
  // Handle response as needed
}

Future<void> initiateGoogleOAuth() async {
	final apiUrl = BACKEND_URL;
  final url = Uri.parse('${apiUrl ?? ''}/api/auth/google');
  final response = await http.get(url);
  // Handle response as needed
}

Future<void> googleOAuthCallback(String code) async {
	final apiUrl = BACKEND_URL;
  final url = Uri.parse('${apiUrl ?? ''}/api/auth/google/callback?code=$code');
  final response = await http.get(url);
  // Handle response as needed
}

Future<void> initiateGitHubOAuth() async {
	final apiUrl = BACKEND_URL;
  final url = Uri.parse('${apiUrl ?? ''}/api/auth/github');
  final response = await http.get(url);
  // Handle response as needed
}

Future<void> githubOAuthCallback(String code) async {
	final apiUrl = BACKEND_URL;
  final url = Uri.parse('${apiUrl ?? ''}/api/auth/github/callback?code=$code');
  final response = await http.get(url);
  // Handle response as needed
}

Future<String> addProduct({
  required String title,
  required double price,
  required String description,
  required String category,
  required String condition,
  String? imageUrl,
}) async {
  final apiUrl = BACKEND_URL;
  final url = Uri.parse('$apiUrl/api/products');
  final storage = FlutterSecureStorage();
  final token = await storage.read(key: "session_token");

  final body = {
    'title': title,
    'price': price,
    'description': description,
    'category': category,
    'condition': condition,
    if (imageUrl != null) 'imageUrl': imageUrl,
  };

  final response = await http.post(
    url,
    headers: {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    },
    body: jsonEncode(body),
  );

  if (response.statusCode == 201) {
    return "Product added successfully";
  } else {
    return "Failed to add product: ${response.body}";
  }
}

