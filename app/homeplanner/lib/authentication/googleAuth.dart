import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;

final GoogleSignIn _googleSignIn = GoogleSignIn(
  signInOption: SignInOption.standard,
  clientId:
      '916788948689-gkjv0k9nb4h6ogpv939s6bqnkebdo6o5.apps.googleusercontent.com',
  scopes: ['email', 'openid', 'profile'],
);
final storage = new FlutterSecureStorage();

Future<void> handleGoogleSignIn() async {
  try {
    final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
    if (googleUser == null) {
      // User canceled the login process
      return;
    }

    final GoogleSignInAuthentication googleAuth =
        await googleUser.authentication;
    final String idToken = googleAuth.idToken!;

    // Store the idToken for future API requests
    await storage.write(key: 'idToken', value: idToken);
  } catch (error) {
    print('Error during Google Sign-In: $error');
  }
}

Future<void> makeAuthenticatedRequest() async {
  String? idToken = await storage.read(key: 'idToken');
  final response = await http.get(
    Uri.parse('http://10.0.2.2:3000/api/protected'),
    headers: {
      'Authorization': 'Bearer $idToken',
    },
  );

  if (response.statusCode == 200) {
    print('Access granted');
  } else {
    print('Access denied');
  }
}
