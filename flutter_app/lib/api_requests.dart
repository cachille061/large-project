import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_app/main.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_better_auth/flutter_better_auth.dart';

class ApiRequests {
  static bool loggedIn = false;
  Future<void> setup() async {
    await FlutterBetterAuth.initialize(url: BACKEND_URL);
  }

  Future<List<dynamic>> getAllProducts() async {
    final apiUrl = BACKEND_URL;
    final url = Uri.parse('$apiUrl/api/products');
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

  Future<String> signUpWithEmail(String email, String password) async {
    final client = FlutterBetterAuth.client;
    final result = await client.signUp.email(name: email, email: email, password: password);
    if (result.error != null) {
      return "success";
    }
    return (result.error?.stack ?? '');
  }

  Future<String> signInWithEmail(String email, String password) async {
    final client = FlutterBetterAuth.client;
    final result = await client.signIn.email(email: email, password: password);
    if (result.error != null) {
      return "success";
    }
    return (result.error?.stack ?? '');
  }

  Future<void> signOut() async {
    final storage = FlutterSecureStorage();
    await storage.delete(key: "session_token"); // Handle response as needed
    loggedIn = false;
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
    if (token == null) {
      throw ErrorDescription("You shouldn't be adding product if your key is null!");
    }

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
        'Authorization': 'Bearer $token',
        'Cookie': 'session=$token',

      },
      body: jsonEncode(body),
    );

    if (response.statusCode == 201) {
      return "Product added successfully";
    } else {
      return "Failed to add product: ${response.body}";
    }
  }
}
