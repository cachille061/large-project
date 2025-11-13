import 'dart:convert';
import 'package:flutter_app/main.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiRequests {
  static FlutterSecureStorage storage = FlutterSecureStorage();
  static const tokenKey = "session_token";
  static bool loggedIn = false;
  Future<void> setup() async {
    if (await storage.containsKey(key: tokenKey)) {
      loggedIn = true;
    }
  }

  Future<List<dynamic>> getAllProducts() async {
    final apiUrl = BACKEND_URL;
    final url = Uri.parse('$apiUrl/api/products');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      debugPrint('Success: $data');
      return data["products"];
    } else {
      debugPrint('Error: ${response.statusCode}');
    }
    return [];
  }

  Future<(bool, String)> searchProducts({
    String? query,
    String? category,
    double? minPrice,
    double? maxPrice,
    String? sortBy,
    int? page,
    int? limit,
  }) async {
    final apiUrl = BACKEND_URL;
    final baseUrl = '$apiUrl/api/search';

    // Build query parameters dynamically (skip nulls)
    final queryParams = <String, String>{};

    if (query != null && query.isNotEmpty) queryParams['q'] = query;
    if (category != null && category.isNotEmpty)
      queryParams['category'] = category;
    if (minPrice != null) queryParams['minPrice'] = minPrice.toString();
    if (maxPrice != null) queryParams['maxPrice'] = maxPrice.toString();
    if (sortBy != null && sortBy.isNotEmpty) queryParams['sortBy'] = sortBy;
    if (page != null) queryParams['page'] = page.toString();
    if (limit != null) queryParams['limit'] = limit.toString();

    final uri = Uri.parse(baseUrl).replace(queryParameters: queryParams);

    final sessionToken = await storage.read(key: tokenKey);

    try {
      final response = await http.get(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'better-auth.session_token=$sessionToken',
        },
      );

      if (response.statusCode == 200) {
        return (true, "Products fetched successfully: ${response.body}");
      } else {
        return (
          false,
          "Failed to fetch products: ${response.body}\nheaders: ${response.request?.headers}\nrequest URL: $uri",
        );
      }
    } catch (error) {
      return (false, "Error fetching products: $error");
    }
  }

  Future<String> signUpWithEmail(String email, String password) async {
    final apiUrl = BACKEND_URL;
    final url = Uri.parse('${apiUrl ?? ''}/api/auth/sign-up/email');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    if (response.statusCode == 200 || response.statusCode == 201) {
      // Single instance of secure storage
      final storage = FlutterSecureStorage();
      final setCookie = response.headers['set-cookie'];
      final token = setCookie?.split('=')[1].split(';')[0];
      await storage.write(key: tokenKey, value: token);
      loggedIn = true;
      return "success";
    } else if (jsonDecode(response.body)['message'] != null) {
      return jsonDecode(response.body)['message'];
    } else if (response.statusCode == 404) {
      return "API not found!";
    } else {
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
    if (response.statusCode == 200 || response.statusCode == 201) {
      // Single instance of secure storage
      final storage = FlutterSecureStorage();
      final setCookie = response.headers['set-cookie'];
      final token = setCookie?.split('=')[1].split(';')[0];
      await storage.write(key: tokenKey, value: token);
      loggedIn = true;
      return "success";
    } else if (jsonDecode(response.body)['message'] != null) {
      return jsonDecode(response.body)['message'];
    } else if (response.statusCode == 404) {
      return "API not found!";
    } else {
      return response.body;
    }
  }

  Future<void> signOut() async {
    await storage.delete(key: tokenKey);
    loggedIn = false;
  }

  Future<void> initiateGoogleOAuth() async {
    final apiUrl = BACKEND_URL;
    final url = Uri.parse('${apiUrl ?? ''}/api/auth/google');
    final response = await http.get(url);
    // Handle response as needed
  }

  Future<void> googleOAuthCallback(String code) async {
    final apiUrl = BACKEND_URL;
    final url = Uri.parse(
      '${apiUrl ?? ''}/api/auth/google/callback?code=$code',
    );
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
    final url = Uri.parse(
      '${apiUrl ?? ''}/api/auth/github/callback?code=$code',
    );
    final response = await http.get(url);
    // Handle response as needed
  }

  Future<(bool, String)> addProduct({
    required String title,
    required double price,
    required String description,
    required String category,
    required String condition,
    required String location,
    String? imageUrl,
  }) async {
    final apiUrl = BACKEND_URL;
    final url = Uri.parse('$apiUrl/api/products');
    final body = {
      'title': title,
      'description': description,
      'price': price,
      'condition': condition,
      'category': category,
      'location': location,
    };

    final sessionToken = await storage.read(key: tokenKey);

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'better-auth.session_token=$sessionToken',
      },
      body: jsonEncode(body),
    );
    if (response.statusCode == 201) {
      return (true, "Product added successfully: ${response.body}");
    } else {
      return (
        false,
        "Failed to add product: ${response.body}\nheaders: ${response.request?.headers}\nrequest body $body\n",
      );
    }
  }
}
