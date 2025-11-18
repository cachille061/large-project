import 'dart:convert';
import 'package:flutter_app/main.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiRequests {
  static FlutterSecureStorage storage = FlutterSecureStorage();
  static const tokenKey = "session_token";
  static const cookieName = "__Secure-better-auth.session_token";
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
      debugPrint("getting products");
      url = Uri.parse('$apiUrl/api/products');
    } else {
      debugPrint("editing $id");
      url = Uri.parse('$apiUrl/api/products/$id');
    }
    final response = await http.get(url);

    if (response.statusCode == 200 || response.statusCode == 201) {
      debugPrint('Success: ${response.body}');
      final data = jsonDecode(response.body);
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
    String? status,
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
    if (status != null) queryParams['status'] = status.toString();

    final uri = Uri.parse(baseUrl).replace(queryParameters: queryParams);

    final sessionToken = await storage.read(key: tokenKey);

    final response = await http.get(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': '$cookieName=$sessionToken',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      debugPrint('Success: $data');
      return data["products"];
    } else {
      debugPrint('Error: ${response.statusCode}');
      return [];
    }
  }

  Future<List<dynamic>> getSellerProducts(String id) async {
    String sellerId = id;
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
        'Cookie': '$cookieName=$sessionToken',
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
    debugPrint("signupresponse: ${response.body.toString()}");
    if (response.statusCode == 200 || response.statusCode == 201) {
      // Single instance of secure storage
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
    debugPrint(response.body);
    if (response.statusCode == 200 || response.statusCode == 201) {
      // Single instance of secure storage
      final storage = FlutterSecureStorage();
      final setCookie = response.headers['set-cookie'];
      debugPrint("sign in response: ${response.body.toString()}\n");
      if (setCookie == null || !setCookie.contains(cookieName)) {
        return "error... cookie not set";
      }
      final token = setCookie.split('=')[1].split(';')[0];
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
        'Cookie': '$cookieName=$sessionToken',
      },
    );
    debugPrint("session info: ${response.body}");
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
    String? status,
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
    if (imageUrl != null) body['imageUrl'] = imageUrl;
    if (status != null) body['status'] = status;

    final sessionToken = await storage.read(key: tokenKey);

    http.Response response;
    if (!edit) {
      response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Cookie': '$cookieName=$sessionToken',
        },
        body: jsonEncode(body),
      );
    } else {
      response = await http.put(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Cookie': '$cookieName=$sessionToken',
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
    final sessionToken = await storage.read(key: tokenKey);

    final url = Uri.parse("$BACKEND_URL/api/orders/current");
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': '$cookieName=$sessionToken',
      },
      body: jsonEncode({'productId': id}),
    );
    if (response.statusCode == 201 || response.statusCode == 200) {
      debugPrint("Buy Button Success! ${response.body}");
      return true;
    } else {
      debugPrint(response.body);
      return false;
    }
  }

  // returns both
  Future<(List<dynamic>, List<dynamic>, String)> getOrders() async {
    final sessionToken = await storage.read(key: tokenKey);
    List current = [];
    List prev = [];
    String id = "";

    {
      final url = Uri.parse("$BACKEND_URL/api/orders/current");
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Cookie': '$cookieName=$sessionToken',
        },
      );
      if (response.statusCode == 201 || response.statusCode == 200) {
        debugPrint("got current ${response.body}");
        final List data = jsonDecode(response.body)["orders"];
        if (data.isNotEmpty) {
          current = data;
          id = data[0]["_id"];
        }
      } else {
        debugPrint(response.body);
      }
    }
    {
      final url = Uri.parse("$BACKEND_URL/api/orders/previous");
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Cookie': '$cookieName=$sessionToken',
        },
      );
      if (response.statusCode == 201 || response.statusCode == 200) {
        debugPrint("got prev ${response.body}");
        final List data = jsonDecode(response.body)["orders"];
        if (data.isNotEmpty) prev = data;
      } else {
        debugPrint(response.body);
      }
    }

    return (current, prev, id);
  }

  Future<bool> cancelOrder(String id) async {
    final sessionToken = await storage.read(key: tokenKey);

    final url = Uri.parse("$BACKEND_URL/api/orders/$id/cancel");
    debugPrint(url.toString());
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': '$cookieName=$sessionToken',
      },
      body: jsonEncode({"orderId": id}),
    );
    if (response.statusCode == 201 || response.statusCode == 200) {
      debugPrint("cancel Success ${response.body}");
      return true;
    } else {
      debugPrint(response.body);
    }

    return false;
  }

  Future<String> getStripeURL(String id) async {
    final sessionToken = await storage.read(key: tokenKey);

    final url = Uri.parse("$BACKEND_URL/api/payments/stripe/checkout-session");
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': '$cookieName=$sessionToken',
      },
      body: jsonEncode({"orderId": id}),
    );
    if (response.statusCode == 201 || response.statusCode == 200) {
      debugPrint("checking out... ${response.body}");
      final data = jsonDecode(response.body);
      return data["url"];
    } else {
      debugPrint(response.body);
    }

    return "";
  }

  Future<bool> resetPassword(String email) async {
    final sessionToken = await storage.read(key: tokenKey);

    final url = Uri.parse("$BACKEND_URL/api/auth/forget-password");
    final body = {"email": email, "redirectTo": "$FRONTEND_URL/reset-password"};
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Origin': FRONTEND_URL,
        'Cookie': '$cookieName=$sessionToken',
      },
      body: jsonEncode(body),
    );
    debugPrint("reset email sent!... ${response.body}");
    debugPrint(response.request.toString());
    if (response.statusCode == 201 || response.statusCode == 200) {
      return true;
    } else {
      debugPrint(body.toString());
    }

    return false;
  }
}
