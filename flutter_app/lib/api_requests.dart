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

  Future<List<dynamic>> getProducts({String? id}) async {
    final apiUrl = BACKEND_URL;
    Uri url;
    if (id == null) {
      debugPrint("Adding a product");
      url = Uri.parse('$apiUrl/api/products');
    } else {
      debugPrint("editing $id");
      url = Uri.parse('$apiUrl/api/products/$id');
    }
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      debugPrint('Success: $data');
      if (id == null) {
        return data["products"];
      } else {
        return [data["product"]];
      }
    } else {
      debugPrint('Error: ${response.statusCode}');
    }
    return [];
  }

  Future<List> searchProducts({
    String? query,
    String? category,
    String? condition,
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

    final response = await http.get(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'better-auth.session_token=$sessionToken',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      debugPrint('Success: $data');
      return data["results"];
    } else {
      debugPrint('Error: ${response.statusCode}');
      return [];
    }
  }

  Future<List<dynamic>> getMyProducts() async {
    String sellerId = await getMyId();
    final apiUrl = BACKEND_URL;
    final url = Uri.parse('$apiUrl/api/products/seller/$sellerId');
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

  Future<(bool, String)> deleteProduct(String id) async {
    final apiUrl = BACKEND_URL;
    final url = Uri.parse('$apiUrl/api/products/$id');
    final sessionToken = await storage.read(key: tokenKey);
    final response = await http.delete(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'better-auth.session_token=$sessionToken',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      debugPrint('Success: $data');
      return (true, 'Success: $data');
    } else {
      debugPrint('Error: ${response.statusCode}, ${response.body}');
    }
    return (false, 'Error: ${response.statusCode}');
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

  Future<(bool, dynamic)> getSession() async {
    final apiUrl = BACKEND_URL;
    final url = Uri.parse('$apiUrl/api/auth/get-session');
    final sessionToken = await storage.read(key: tokenKey);

    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'better-auth.session_token=$sessionToken',
      },
    );
    if (response.statusCode == 200) {
      return (true, jsonDecode(response.body));
    } else {
      return (false, jsonDecode(response.body));
    }
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

  Future<(bool, String)> addEditProduct({
    required String title,
    required double price,
    required String description,
    required String category,
    required String condition,
    required String location,
    String? imageUrl,
    bool edit = false,
    String? id,
  }) async {
    final apiUrl = BACKEND_URL;
    Uri url;
    if (!edit)
      url = Uri.parse('$apiUrl/api/products');
    else {
      if (id == null) {
        debugPrint("id was null in addEditProduct");
        return (false, "id was null");
      }
      url = Uri.parse('$apiUrl/api/products/$id');
    }

    final body = {
      'title': title,
      'description': description,
      'price': price,
      'condition': condition,
      'category': category,
      'location': location,
    };

    final sessionToken = await storage.read(key: tokenKey);

    http.Response response;
    if (!edit) {
      response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'better-auth.session_token=$sessionToken',
        },
        body: jsonEncode(body),
      );
    } else {
      response = await http.put(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'better-auth.session_token=$sessionToken',
        },
        body: jsonEncode(body),
      );
    }
    if (response.statusCode == 201 || response.statusCode == 200) {
      return (true, "Product added successfully: ${response.body}");
    } else {
      return (
        false,
        "Failed to add product: ${response.body}\nheaders: ${response.request?.headers}\nrequest body $body\n",
      );
    }
  }

  Future<String> getMyId() async {
    final sessionData = await getSession();
    if (sessionData.$1 == false) {
      debugPrint("Error: ${sessionData.toString()}");
      return "";
    }
    return sessionData.$2["user"]["id"];
  }

  Future<bool> isSeller(String id) async {
    String myId = await getMyId();
    var product = (await getProducts(id: id))[0];
    return myId == product["sellerId"];
  }

  Future<bool> buyProduct(String id) async {
    return false;
  }
}
